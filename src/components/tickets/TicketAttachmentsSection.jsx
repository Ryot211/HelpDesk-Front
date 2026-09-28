import { useEffect, useRef, useState } from "react";
import { FileText, Trash2, Upload, Download, Eye } from "lucide-react";
import {
  inactivarAdjuntoTicket,
  listarAdjuntosTicket,
  subirAdjuntoTicket,
  descargarAdjuntoTicket,
  verAdjuntoTicket,
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
  const verAdjunto = async (adjunto) => {
  const ventana = window.open("", "_blank");

  if (!ventana) {
    await mostrarError(
      "El navegador bloqueó la ventana emergente. Habilita las ventanas emergentes para este sitio e inténtalo de nuevo."
    );
    return;
  }

  try {
    const response = await verAdjuntoTicket(adjunto.id);

    const blob = new Blob([response.data], {
      type: adjunto.tipoContenido || "application/octet-stream",
    });

    const url = window.URL.createObjectURL(blob);

    ventana.location.href = url;

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 60000);
  } catch (err) {
    console.error(err);
    ventana.close();
    await mostrarError("No se pudo abrir la vista previa del adjunto.");
  }
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
    <section className="rounded-2xl bg-surface p-6 shadow dark:bg-surface-dark">
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Adjuntos
        </h2>

        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          Registro de archivos asociados al ticket.
        </p>
      </div>

      <form
        onSubmit={subirArchivo}
        className="mb-6 rounded-lg border border-border p-4 dark:border-border-dark dark:bg-canvas-dark/40"
      >
        <div className="mb-3 flex items-center gap-2">
          <Upload size={18} className="text-text-secondary dark:text-text-secondary-dark" />

          <h3 className="font-display font-semibold text-text-primary dark:text-text-primary-dark">
            Subir archivo
          </h3>
        </div>

        <label className="mb-2 block text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
          Archivo adjunto
        </label>

        <input
          ref={inputArchivoRef}
          type="file"
          onChange={manejarArchivoSeleccionado}
          className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-text-primary outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-signal file:px-4 file:py-2 file:text-sm file:font-medium file:text-surface hover:file:bg-signal-hover dark:border-border-dark dark:bg-surface-dark dark:text-text-primary-dark dark:file:bg-signal-dark dark:file:text-surface-dark"
        />

        {archivoSeleccionado && (
          <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary-dark">
            Archivo seleccionado: {archivoSeleccionado.name}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-surface hover:bg-signal-hover disabled:cursor-not-allowed disabled:opacity-60 dark:bg-signal-dark dark:text-surface-dark dark:hover:bg-signal"
          >
            {guardando ? "Subiendo..." : "Subir archivo"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 rounded-lg bg-state-anulado/10 p-3 text-sm text-state-anulado dark:bg-state-anulado/15">
          {error}
        </div>
      )}

      {cargando && (
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          Cargando adjuntos...
        </p>
      )}

      {!cargando && adjuntos.length === 0 && (
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          Este ticket todavía no tiene adjuntos registrados.
        </p>
      )}

      {!cargando && adjuntos.length > 0 && (
        <div className="space-y-3">
          {adjuntos.map((adjunto) => (
            <article
              key={adjunto.id}
              className="flex flex-col gap-4 rounded-lg border border-border p-4 dark:border-border-dark dark:bg-canvas-dark/40 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border/25 text-text-secondary dark:bg-border-dark/40 dark:text-text-secondary-dark">
                  <FileText size={18} />
                </div>

                <div>
                  <p className="font-medium text-text-primary dark:text-text-primary-dark">
                    {adjunto.nombreOriginal}
                  </p>

                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    {adjunto.tipoContenido || "Sin tipo"} ·{" "}
                    {formatearTamanio(adjunto.tamanioBytes)}
                  </p>

                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Registrado: {formatearFecha(adjunto.fechaCreacion)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
             <button
                type="button"
                onClick={() => verAdjunto(adjunto)}
                className="inline-flex items-center gap-2 rounded-lg border border-signal/30 px-3 py-2 text-sm font-medium text-signal hover:bg-signal/8 dark:border-signal-dark/40 dark:text-signal-dark dark:hover:bg-signal-dark/10"
              >
                <Eye size={16} />
                Ver
              </button>
                <button
                  type="button"
                  onClick={() => descargarAdjunto(adjunto)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary hover:bg-signal/8 dark:border-border-dark dark:text-text-primary-dark dark:hover:bg-signal-dark/10"
                >
                  <Download size={16} />
                  Descargar
                </button>

                <button
                  type="button"
                  onClick={() => inactivarAdjunto(adjunto.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-state-anulado/30 px-3 py-2 text-sm font-medium text-state-anulado hover:bg-state-anulado/10 dark:border-state-anulado/40"
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