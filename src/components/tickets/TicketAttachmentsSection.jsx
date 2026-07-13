import { useEffect, useRef, useState } from "react";
import { FileText, Trash2, Upload, Download } from "lucide-react";
import {
  inactivarAdjuntoTicket,
  listarAdjuntosTicket,
  subirAdjuntoTicket,
  descargarAdjuntoTicket,
} from "../../api/ticketApi";
import { formatearFecha } from "../../utils/formatters";
import {
  confirmarAccion,
  mostrarAdvertencia,
  mostrarError,
  mostrarExito,
} from "../../utils/alerts";

function TicketAttachmentsSection({ ticketId }) {
  const [adjuntos, setAdjuntos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const inputArchivoRef = useRef(null);

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

  const manejarArchivoSeleccionado = (event) => {
    const archivo = event.target.files?.[0] || null;
    setArchivoSeleccionado(archivo);
  };

  const subirArchivo = async (event) => {
    event.preventDefault();

    if (!archivoSeleccionado) {
      await mostrarAdvertencia("Debes seleccionar un archivo.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      await subirAdjuntoTicket(ticketId, archivoSeleccionado);

      await mostrarExito("Archivo subido correctamente.");

      setArchivoSeleccionado(null);

      if (inputArchivoRef.current) {
        inputArchivoRef.current.value = "";
      }

      await cargarAdjuntos();
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo subir el archivo.");
    } finally {
      setGuardando(false);
    }
  };

  const descargarAdjunto = async (adjunto) => {
    try {
      const response = await descargarAdjuntoTicket(adjunto.id);

      const blob = new Blob([response.data], {
        type: adjunto.tipoContenido || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = adjunto.nombreOriginal || "archivo";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo descargar el adjunto.");
    }
  };

  const inactivarAdjunto = async (id) => {
    const confirmar = await confirmarAccion(
      "Esta acción eliminará el adjunto seleccionado.",
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
      await mostrarError("No se pudo eliminar el adjunto.");
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Adjuntos
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Registro de archivos asociados al ticket.
        </p>
      </div>

      <form
        onSubmit={subirArchivo}
        className="mb-6 rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-950/40"
      >
        <div className="mb-3 flex items-center gap-2">
          <Upload size={18} className="text-slate-700 dark:text-slate-300" />

          <h3 className="font-semibold text-slate-900 dark:text-white">
            Subir archivo
          </h3>
        </div>

        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Archivo adjunto
        </label>

        <input
          ref={inputArchivoRef}
          type="file"
          onChange={manejarArchivoSeleccionado}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:file:bg-white dark:file:text-slate-900"
        />

        {archivoSeleccionado && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Archivo seleccionado: {archivoSeleccionado.name}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {guardando ? "Subiendo..." : "Subir archivo"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {cargando && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cargando adjuntos...
        </p>
      )}

      {!cargando && adjuntos.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Este ticket todavía no tiene adjuntos registrados.
        </p>
      )}

      {!cargando && adjuntos.length > 0 && (
        <div className="space-y-3">
          {adjuntos.map((adjunto) => (
            <article
              key={adjunto.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-950/40 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <FileText size={18} />
                </div>

                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {adjunto.nombreOriginal}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {adjunto.tipoContenido || "Sin tipo"} ·{" "}
                    {formatearTamanio(adjunto.tamanioBytes)}
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Registrado: {formatearFecha(adjunto.fechaCreacion)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => descargarAdjunto(adjunto)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Download size={16} />
                  Descargar
                </button>

                <button
                  type="button"
                  onClick={() => inactivarAdjunto(adjunto.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/40"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
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