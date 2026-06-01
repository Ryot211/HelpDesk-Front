import { useEffect, useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import {
  inactivarAdjuntoTicket,
  listarAdjuntosTicket,
  registrarAdjuntoTicket,
} from "../../api/ticketApi";
import { formatearFecha } from "../../utils/formatters";
import { USUARIO_PRUEBA_ID } from "../../utils/constantes";
import {
  confirmarAccion,
  mostrarError,
  mostrarExito,
} from "../../utils/alerts";

function TicketAttachmentsSection({ ticketId }) {
  const [adjuntos, setAdjuntos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [formulario, setFormulario] = useState({
    nombreOriginal: "",
    nombreArchivo: "",
    rutaArchivo: "",
    tipoContenido: "",
    tamanioBytes: "",
  });

  useEffect(() => {
    if (ticketId) {
      cargarAdjuntos();
    }
  }, [ticketId]);

  const cargarAdjuntos = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await listarAdjuntosTicket(ticketId);

      setAdjuntos(response.data);
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudieron cargar los adjuntos.");
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const registrarAdjunto = async (event) => {
    event.preventDefault();

    if (!formulario.nombreOriginal.trim()) {
      await mostrarError("El nombre original es obligatorio.");
      return;
    }

    if (!formulario.nombreArchivo.trim()) {
      await mostrarError("El nombre interno del archivo es obligatorio.");
      return;
    }

    if (!formulario.rutaArchivo.trim()) {
      await mostrarError("La ruta del archivo es obligatoria.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const data = {
        ticketId: Number(ticketId),
        subidoPorId: USUARIO_PRUEBA_ID,
        nombreOriginal: formulario.nombreOriginal.trim(),
        nombreArchivo: formulario.nombreArchivo.trim(),
        rutaArchivo: formulario.rutaArchivo.trim(),
        tipoContenido: formulario.tipoContenido.trim() || "application/octet-stream",
        tamanioBytes: formulario.tamanioBytes
          ? Number(formulario.tamanioBytes)
          : null,
      };

      await registrarAdjuntoTicket(data);

      setFormulario({
        nombreOriginal: "",
        nombreArchivo: "",
        rutaArchivo: "",
        tipoContenido: "",
        tamanioBytes: "",
      });

      await cargarAdjuntos();
       await mostrarExito("Adjunto agregado correctamente.");
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo agregar el adjunto.");
    } finally {
      setGuardando(false);
    }
  };

  const inactivarAdjunto = async (id) => {
    const confirmar = await confirmarAccion(
  "Esta acción eliminara el adjunto seleccionado.",
  "¿Deseas continuar?"
  );

    if (!confirmar) {
      return;
    }

    try {
      setError("");

      await inactivarAdjuntoTicket(id);

      await cargarAdjuntos();
       await mostrarExito("Adjunto eliminado correctamente.");
    } catch (err) {
      console.error(err);
      await mostrarError("No se puedo eliminar adjunto.");
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Adjuntos
        </h2>
        <p className="text-sm text-slate-500">
          Registro de archivos asociados al ticket.
        </p>
      </div>

      <form onSubmit={registrarAdjunto} className="mb-6 grid gap-4 md:grid-cols-2">
        <InputAdjunto
          label="Nombre original"
          name="nombreOriginal"
          value={formulario.nombreOriginal}
          onChange={manejarCambio}
          placeholder="captura-error.png"
        />

        <InputAdjunto
          label="Nombre interno"
          name="nombreArchivo"
          value={formulario.nombreArchivo}
          onChange={manejarCambio}
          placeholder="ticket-1-captura-error.png"
        />

        <InputAdjunto
          label="Ruta del archivo"
          name="rutaArchivo"
          value={formulario.rutaArchivo}
          onChange={manejarCambio}
          placeholder="/uploads/helpdesk/tickets/1/captura.png"
        />

        <InputAdjunto
          label="Tipo de contenido"
          name="tipoContenido"
          value={formulario.tipoContenido}
          onChange={manejarCambio}
          placeholder="image/png"
        />

        <InputAdjunto
          label="Tamaño en bytes"
          name="tamanioBytes"
          type="number"
          value={formulario.tamanioBytes}
          onChange={manejarCambio}
          placeholder="245678"
        />

        <div className="flex items-end">
          <button
            type="submit"
            disabled={guardando}
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Registrar adjunto"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {cargando && (
        <p className="text-sm text-slate-500">
          Cargando adjuntos...
        </p>
      )}

      {!cargando && adjuntos.length === 0 && (
        <p className="text-sm text-slate-500">
          Este ticket todavía no tiene adjuntos registrados.
        </p>
      )}

      {!cargando && adjuntos.length > 0 && (
        <div className="space-y-3">
          {adjuntos.map((adjunto) => (
            <article
              key={adjunto.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <FileText size={18} />
                </div>

                <div>
                  <p className="font-medium text-slate-900">
                    {adjunto.nombreOriginal}
                  </p>

                  <p className="text-xs text-slate-500">
                    {adjunto.tipoContenido || "Sin tipo"} ·{" "}
                    {formatearTamanio(adjunto.tamanioBytes)}
                  </p>

                  <p className="text-xs text-slate-400">
                    Registrado: {formatearFecha(adjunto.fechaCreacion)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => inactivarAdjunto(adjunto.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function InputAdjunto({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
      />
    </div>
  );
}

function formatearTamanio(bytes) {
  if (!bytes) {
    return "Sin tamaño";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default TicketAttachmentsSection;