import { useEffect, useState } from "react";
import { CheckCircle, UserPlus, RefreshCcw } from "lucide-react";
import {
  asignarTicket,
  cambiarEstadoTicket,
  cerrarTicket,
} from "../../api/ticketApi";
import { listarUsuarios } from "../../api/usuarioApi";
import { TICKET_ESTADOS } from "../../utils/constantes";
import { useAuth } from "../../context/AuthContext";
import { mostrarAdvertencia, mostrarError, mostrarExito } from "../../utils/alerts";

import { ROLES, tieneRol } from "../../utils/roles";

function TicketActionsSection({ ticket, onTicketUpdated }) {
  const { usuario } = useAuth();
  const [asignadoId, setAsignadoId] = useState("");
  const [estado, setEstado] = useState(ticket?.estado || "");
  const [solucion, setSolucion] = useState("");

  const [usuarios, setUsuarios] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);

  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [errorAsignado, setErrorAsignado] = useState("");
  const [errorEstado, setErrorEstado] = useState("");
  const [errorSolucion, setErrorSolucion] = useState("");
  const puedeGestionarTicket = tieneRol(usuario, [
  ROLES.ADMIN,
  ROLES.SOPORTE,
]);

useEffect(() => {
  if (puedeGestionarTicket) {
    cargarUsuarios();
  } else {
    setCargandoUsuarios(false);
  }
}, [puedeGestionarTicket]);

  useEffect(() => {
    setEstado(ticket?.estado || "");
  }, [ticket]);

  const cargarUsuarios = async () => {
    try {
      setCargandoUsuarios(true);
      setError("");

      const response = await listarUsuarios();

      setUsuarios(response.data);
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudieron cargar los usuarios.");
    } finally {
      setCargandoUsuarios(false);
    }
  };

  const asignar = async (event) => {
    event.preventDefault();

    if (!asignadoId) {
      setErrorAsignado("Debes seleccionar el usuario asignado.");
      await mostrarAdvertencia("Debes seleccionar el usuario asignado.");
      return;
    }

    setErrorAsignado("");

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const data = {
        ticketId: ticket.id,
        asignadoId: Number(asignadoId),
      };

      await asignarTicket(data);

      await mostrarExito("Ticket asignado correctamente.");
      setAsignadoId("");

      await onTicketUpdated();
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo asignar el ticket.");
    } finally {
      setProcesando(false);
    }
  };

  const cambiarEstado = async (event) => {
    event.preventDefault();

    if (!estado) {
      setErrorEstado("Debes seleccionar un estado.");
      await mostrarAdvertencia("Debes seleccionar un estado.");
      return;
    }

    setErrorEstado("");

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const data = {
        ticketId: ticket.id,
        estado,
      };

      await cambiarEstadoTicket(data);

      await mostrarExito("Estado actualizado correctamente.");

      await onTicketUpdated();
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo cambiar el estado del ticket.");
    } finally {
      setProcesando(false);
    }
  };

  const cerrarConSolucion = async (event) => {
    event.preventDefault();

    if (!solucion.trim()) {
      setErrorSolucion("Debes ingresar una solución para cerrar el ticket.");
      await mostrarAdvertencia("Debes ingresar una solución para cerrar el ticket.");
      return;
    }

    setErrorSolucion("");

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const data = {
        ticketId: ticket.id,
        cerradoPorId: usuario.id,
        solucion: solucion.trim(),
      };

      await cerrarTicket(data);

      await mostrarExito("Ticket cerrado correctamente.");
      setSolucion("");

      await onTicketUpdated();
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo cerrar el ticket.");
    } finally {
      setProcesando(false);
    }
  };

  const formCardClass =
    "rounded-lg border border-border p-4 dark:border-border-dark dark:bg-canvas-dark/40";

  const labelClass =
    "mb-2 block text-sm font-medium text-text-secondary dark:text-text-secondary-dark";

  const inputClass =
    "flex-1 rounded-lg border border-border bg-surface p-3 text-sm text-text-primary outline-none focus:border-signal focus:ring-1 focus:ring-signal disabled:cursor-not-allowed disabled:bg-border/20 dark:border-border-dark dark:bg-surface-dark dark:text-text-primary-dark dark:focus:border-signal-dark dark:focus:ring-signal-dark dark:disabled:bg-border-dark/30";

  const buttonClass =
    "rounded-lg bg-signal px-4 py-2 text-sm font-medium text-surface hover:bg-signal-hover disabled:cursor-not-allowed disabled:opacity-60 dark:bg-signal-dark dark:text-surface-dark dark:hover:bg-signal";

    if (!puedeGestionarTicket) {
  return (
    <section className="rounded-2xl bg-surface p-6 shadow dark:bg-surface-dark">
      <div className="mb-2">
        <h2 className="font-display text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Acciones del ticket
        </h2>

        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          No tienes permisos para asignar, cambiar estado o cerrar este ticket.
        </p>
      </div>
    </section>
  );
}
  return (
    <section className="rounded-2xl bg-surface p-6 shadow dark:bg-surface-dark">
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Acciones del ticket
        </h2>
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          Asigna, cambia estado o cierra el ticket.
        </p>
      </div>

      {mensaje && (
        <div className="mb-4 rounded-lg bg-state-resuelto/10 p-3 text-sm text-state-resuelto dark:bg-state-resuelto/15">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-state-anulado/10 p-3 text-sm text-state-anulado dark:bg-state-anulado/15">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <form onSubmit={asignar} className={formCardClass}>
          <div className="mb-3 flex items-center gap-2">
            <UserPlus size={18} className="text-text-secondary dark:text-text-secondary-dark" />
            <h3 className="font-display font-semibold text-text-primary dark:text-text-primary-dark">
              Asignar responsable
            </h3>
          </div>

          <label htmlFor="asignado-usuario" className={labelClass}>
            Usuario soporte
          </label>

          <div className="flex gap-3">
            <select
              id="asignado-usuario"
              value={asignadoId}
              onChange={(event) => {
                setAsignadoId(event.target.value);

                if (errorAsignado) {
                  setErrorAsignado("");
                }
              }}
              disabled={cargandoUsuarios}
              className={inputClass}
              aria-invalid={Boolean(errorAsignado)}
              aria-describedby={errorAsignado ? "asignado-usuario-error" : undefined}
            >
              <option value="">
                {cargandoUsuarios ? "Cargando usuarios..." : "Selecciona un usuario"}
              </option>

              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {obtenerNombreUsuario(usuario)}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={procesando}
              className={buttonClass}
            >
              Asignar
            </button>
          </div>

          {errorAsignado && (
            <p id="asignado-usuario-error" className="mt-2 text-xs text-state-anulado">
              {errorAsignado}
            </p>
          )}
        </form>

        <form onSubmit={cambiarEstado} className={formCardClass}>
          <div className="mb-3 flex items-center gap-2">
            <RefreshCcw size={18} className="text-text-secondary dark:text-text-secondary-dark" />
            <h3 className="font-display font-semibold text-text-primary dark:text-text-primary-dark">
              Cambiar estado
            </h3>
          </div>

          <label htmlFor="estado-ticket" className={labelClass}>
            Estado
          </label>

          <div className="flex gap-3">
            <select
              id="estado-ticket"
              value={estado}
              onChange={(event) => {
                setEstado(event.target.value);

                if (errorEstado) {
                  setErrorEstado("");
                }
              }}
              className={inputClass}
              aria-invalid={Boolean(errorEstado)}
              aria-describedby={errorEstado ? "estado-ticket-error" : undefined}
            >
              <option value="">Selecciona un estado</option>
              <option value={TICKET_ESTADOS.REGISTRADO}>REGISTRADO</option>
              <option value={TICKET_ESTADOS.ASIGNADO}>ASIGNADO</option>
              <option value={TICKET_ESTADOS.EN_PROCESO}>EN_PROCESO</option>
              <option value={TICKET_ESTADOS.RESUELTO}>RESUELTO</option>
              <option value={TICKET_ESTADOS.CERRADO}>CERRADO</option>
              <option value={TICKET_ESTADOS.ANULADO}>ANULADO</option>
              <option value={TICKET_ESTADOS.REABIERTO}>REABIERTO</option>
            </select>

            <button
              type="submit"
              disabled={procesando}
              className={buttonClass}
            >
              Cambiar
            </button>
          </div>

          {errorEstado && (
            <p id="estado-ticket-error" className="mt-2 text-xs text-state-anulado">
              {errorEstado}
            </p>
          )}
        </form>

        <form onSubmit={cerrarConSolucion} className={formCardClass}>
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle size={18} className="text-text-secondary dark:text-text-secondary-dark" />
            <h3 className="font-display font-semibold text-text-primary dark:text-text-primary-dark">
              Cerrar con solución
            </h3>
          </div>

          <label htmlFor="solucion-cierre" className={labelClass}>
            Solución
          </label>

          <textarea
            id="solucion-cierre"
            value={solucion}
            onChange={(event) => {
              setSolucion(event.target.value);

              if (errorSolucion) {
                setErrorSolucion("");
              }
            }}
            rows="3"
            className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-signal focus:ring-1 focus:ring-signal dark:border-border-dark dark:bg-surface-dark dark:text-text-primary-dark dark:placeholder:text-text-secondary-dark dark:focus:border-signal-dark dark:focus:ring-signal-dark"
            placeholder="Describe la solución aplicada..."
            aria-invalid={Boolean(errorSolucion)}
            aria-describedby={errorSolucion ? "solucion-cierre-error" : undefined}
          />

          {errorSolucion && (
            <p id="solucion-cierre-error" className="mt-1 text-xs text-state-anulado">
              {errorSolucion}
            </p>
          )}

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={procesando}
              className={buttonClass}
            >
              Cerrar ticket
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function obtenerNombreUsuario(usuario) {
  if (!usuario) {
    return "Usuario no definido";
  }

  const nombres = usuario.nombres || "";
  const apellidos = usuario.apellidos || "";
  const nombreCompleto = `${nombres} ${apellidos}`.trim();

  if (nombreCompleto) {
    return `${nombreCompleto} - ${usuario.email || "Sin email"}`;
  }

  return usuario.email || `Usuario #${usuario.id}`;
}

export default TicketActionsSection;