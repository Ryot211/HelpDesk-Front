import { useEffect, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import {
  inactivarAdjuntoTicket,
  listarAdjuntosTicket,
  registrarAdjuntoTicket,
  subirAdjuntoTicket,
} from "../../api/ticketApi";
import { formatearFecha } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";
import {
  confirmarAccion,
  mostrarError,
  mostrarExito,
} from "../../utils/alerts";

function TicketAttachmentsSection({ ticketId }) {
  const { usuario } = useAuth();
  const [adjuntos, setAdjuntos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);


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
        subidoPorId: usuario.id,
        nombreOriginal: formulario.nombreOriginal.trim(),
        nombreArchivo: formulario.nombreArchivo.trim(),
        rutaArchivo: formulario.rutaArchivo.trim(),
        tipoContenido:
          formulario.tipoContenido.trim() || "application/octet-stream",
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

    await cargarAdjuntos();
  } catch (err) {
    console.error(err);
  } finally {
    setGuardando(false);
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
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-950/40"
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

              <button
                type="button"
                onClick={() => inactivarAdjunto(adjunto.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/40"
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
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-400"
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