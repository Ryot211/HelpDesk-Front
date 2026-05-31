import { useEffect, useState } from "react";
import {
  agregarComentarioTicket,
  listarComentariosTicket,
} from "../../api/ticketApi";
import { formatearFecha } from "../../utils/formatters";
import { TIPO_COMENTARIO, USUARIO_PRUEBA_ID } from "../../utils/constantes";

function TicketCommentsSection({ ticketId }) {
  const [comentarios, setComentarios] = useState([]);
  const [comentarioTexto, setComentarioTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

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
      setError("No se pudieron cargar los comentarios.");
    } finally {
      setCargando(false);
    }
  };

  const enviarComentario = async (event) => {
    event.preventDefault();

    if (!comentarioTexto.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const data = {
        ticketId: Number(ticketId),
        usuarioId: USUARIO_PRUEBA_ID,
        comentario: comentarioTexto.trim(),
        tipo: TIPO_COMENTARIO.PUBLICO,
      };

      await agregarComentarioTicket(data);

      setComentarioTexto("");
      await cargarComentarios();
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar el comentario.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Comentarios
        </h2>
        <p className="text-sm text-slate-500">
          Registro de observaciones realizadas sobre el ticket.
        </p>
      </div>

      <form onSubmit={enviarComentario} className="mb-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Nuevo comentario
        </label>

        <textarea
          value={comentarioTexto}
          onChange={(event) => setComentarioTexto(event.target.value)}
          rows="3"
          className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          placeholder="Escribe un comentario sobre el ticket..."
        />

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Agregar comentario"}
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
          Cargando comentarios...
        </p>
      )}

      {!cargando && comentarios.length === 0 && (
        <p className="text-sm text-slate-500">
          Este ticket todavía no tiene comentarios.
        </p>
      )}

      {!cargando && comentarios.length > 0 && (
        <div className="space-y-4">
          {comentarios.map((comentario) => (
            <article
              key={comentario.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    {obtenerNombreUsuario(comentario.usuario)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatearFecha(comentario.fechaCreacion)}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {comentario.tipo}
                </span>
              </div>

              <p className="whitespace-pre-line text-sm text-slate-700">
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