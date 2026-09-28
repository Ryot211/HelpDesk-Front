import { useEffect, useState } from "react";
import {
  agregarComentarioTicket,
  listarComentariosTicket,
} from "../../api/ticketApi";
import { formatearFecha } from "../../utils/formatters";
import { TIPO_COMENTARIO } from "../../utils/constantes";
import { useAuth } from "../../context/AuthContext";
import {
  mostrarError,
  mostrarExito,
} from "../../utils/alerts";

function TicketCommentsSection({ ticketId }) {
  const { usuario } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [comentarioTexto, setComentarioTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [errorComentario, setErrorComentario] = useState("");

  useEffect(() => {
    if (ticketId) {
      cargarComentarios();
    }
  }, [ticketId]);

  const cargarComentarios = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await listarComentariosTicket(ticketId);

      setComentarios(response.data);
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudieron cargar los comentarios.");
    } finally {
      setCargando(false);
    }
  };

  const enviarComentario = async (event) => {
    event.preventDefault();

    if (!comentarioTexto.trim()) {
      setErrorComentario("Debes ingresar un comentario para poder agregarlo.");
      await mostrarError("Debes ingresar un comentario para poder agregarlo.");
      return;
    }

    setErrorComentario("");

    try {
      setGuardando(true);
      setError("");

      const data = {
        ticketId: Number(ticketId),
        usuarioId: usuario.id,
        comentario: comentarioTexto.trim(),
        tipo: TIPO_COMENTARIO.PUBLICO,
      };

      await agregarComentarioTicket(data);

      setComentarioTexto("");
      await cargarComentarios();
      await mostrarExito("Comentario agregado correctamente.");
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo registrar el comentario.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="rounded-2xl bg-surface p-6 shadow dark:bg-surface-dark">
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Comentarios
        </h2>

        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          Registro de observaciones realizadas sobre el ticket.
        </p>
      </div>

      <form onSubmit={enviarComentario} className="mb-6">
        <label
          htmlFor="comentario-texto"
          className="mb-2 block text-sm font-medium text-text-secondary dark:text-text-secondary-dark"
        >
          Nuevo comentario
        </label>

        <textarea
          id="comentario-texto"
          value={comentarioTexto}
          onChange={(event) => {
            setComentarioTexto(event.target.value);

            if (errorComentario) {
              setErrorComentario("");
            }
          }}
          rows="3"
          className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-signal focus:ring-1 focus:ring-signal dark:border-border-dark dark:bg-surface-dark dark:text-text-primary-dark dark:placeholder:text-text-secondary-dark dark:focus:border-signal-dark dark:focus:ring-signal-dark"
          placeholder="Escribe un comentario sobre el ticket..."
          aria-invalid={Boolean(errorComentario)}
          aria-describedby={errorComentario ? "comentario-texto-error" : undefined}
        />

        {errorComentario && (
          <p id="comentario-texto-error" className="mt-1 text-xs text-state-anulado">
            {errorComentario}
          </p>
        )}

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-surface hover:bg-signal-hover disabled:cursor-not-allowed disabled:opacity-60 dark:bg-signal-dark dark:text-surface-dark dark:hover:bg-signal"
          >
            {guardando ? "Guardando..." : "Agregar comentario"}
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
          Cargando comentarios...
        </p>
      )}

      {!cargando && comentarios.length === 0 && (
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          Este ticket todavía no tiene comentarios.
        </p>
      )}

      {!cargando && comentarios.length > 0 && (
        <div className="space-y-4">
          {comentarios.map((comentario) => (
            <article
              key={comentario.id}
              className="rounded-lg border border-border p-4 dark:border-border-dark dark:bg-canvas-dark/40"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary dark:text-text-primary-dark">
                    {obtenerNombreUsuario(comentario.usuario)}
                  </p>

                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    {formatearFecha(comentario.fechaCreacion)}
                  </p>
                </div>

                <span className="rounded-full bg-border/25 px-3 py-1 text-xs font-semibold text-text-secondary dark:bg-border-dark/40 dark:text-text-secondary-dark">
                  {comentario.tipo}
                </span>
              </div>

              <p className="whitespace-pre-line text-sm text-text-primary dark:text-text-primary-dark">
                {comentario.comentario}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function obtenerNombreUsuario(usuario) {
  if (!usuario) {
    return "Usuario no definido";
  }

  const nombres = usuario.nombres || "";
  const apellidos = usuario.apellidos || "";

  return `${nombres} ${apellidos}`.trim() || usuario.email || "Usuario sin nombre";
}

export default TicketCommentsSection;