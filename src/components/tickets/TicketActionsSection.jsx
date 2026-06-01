import { useEffect, useState } from "react";
import { CheckCircle, UserPlus, RefreshCcw } from "lucide-react";
import {
  asignarTicket,
  cambiarEstadoTicket,
  cerrarTicket,
} from "../../api/ticketApi";
import { listarUsuarios } from "../../api/usuarioApi";
import { TICKET_ESTADOS, USUARIO_PRUEBA_ID } from "../../utils/constantes";
import { mostrarAdvertencia, mostrarError, mostrarExito } from "../../utils/alerts";

function TicketActionsSection({ ticket, onTicketUpdated }) {
  const [asignadoId, setAsignadoId] = useState("");
  const [estado, setEstado] = useState(ticket?.estado || "");
  const [solucion, setSolucion] = useState("");

  const [usuarios, setUsuarios] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);

  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

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
      await mostrarAdvertencia("Debes seleccionar el usuario asignado.");
      return;
    }

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
      await mostrarAdvertencia("Debes seleccionar un estado.");
      return;
    }

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
      await mostrarAdvertencia("Debes ingresar una solución para cerrar el ticket.");
      return;
    }

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const data = {
        ticketId: ticket.id,
        cerradoPorId: USUARIO_PRUEBA_ID,
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
    "rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-950/40";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

  const inputClass =
    "flex-1 rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400 dark:disabled:bg-slate-800";

  const buttonClass =
    "rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200";

  return (
    <section className="rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Acciones del ticket
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Asigna, cambia estado o cierra el ticket.
        </p>
      </div>

      {mensaje && (
        <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <form onSubmit={asignar} className={formCardClass}>
          <div className="mb-3 flex items-center gap-2">
            <UserPlus size={18} className="text-slate-700 dark:text-slate-300" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Asignar responsable
            </h3>
          </div>

          <label className={labelClass}>
            Usuario soporte
          </label>

          <div className="flex gap-3">
            <select
              value={asignadoId}
              onChange={(event) => setAsignadoId(event.target.value)}
              disabled={cargandoUsuarios}
              className={inputClass}
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
        </form>

        <form onSubmit={cambiarEstado} className={formCardClass}>
          <div className="mb-3 flex items-center gap-2">
            <RefreshCcw size={18} className="text-slate-700 dark:text-slate-300" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Cambiar estado
            </h3>
          </div>

          <label className={labelClass}>
            Estado
          </label>

          <div className="flex gap-3">
            <select
              value={estado}
              onChange={(event) => setEstado(event.target.value)}
              className={inputClass}
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
        </form>

        <form onSubmit={cerrarConSolucion} className={formCardClass}>
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle size={18} className="text-slate-700 dark:text-slate-300" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Cerrar con solución
            </h3>
          </div>

          <label className={labelClass}>
            Solución
          </label>

          <textarea
            value={solucion}
            onChange={(event) => setSolucion(event.target.value)}
            rows="3"
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-400"
            placeholder="Describe la solución aplicada..."
          />

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