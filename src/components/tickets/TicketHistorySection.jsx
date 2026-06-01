import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { listarHistorialTicket } from "../../api/ticketApi";
import { formatearFecha } from "../../utils/formatters";

function TicketHistorySection({ ticketId }) {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ticketId) {
      cargarHistorial();
    }
  }, [ticketId]);

  const cargarHistorial = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await listarHistorialTicket(ticketId);

      setHistorial(response.data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el historial del ticket.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Historial
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Registro de acciones realizadas sobre el ticket.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {cargando && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cargando historial...
        </p>
      )}

      {!cargando && historial.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Este ticket todavía no tiene historial registrado.
        </p>
      )}

      {!cargando && historial.length > 0 && (
        <div className="space-y-4">
          {historial.map((item) => (
            <article
              key={item.id}
              className="flex gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-950/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Clock size={18} />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.accion}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatearFecha(item.fechaCreacion)}
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {obtenerNombreUsuario(item.usuario)}
                  </span>
                </div>

                {item.observacion && (
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                    {item.observacion}
                  </p>
                )}

                <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                  {item.estadoAnterior && (
                    <DatoCambio
                      label="Estado anterior"
                      value={item.estadoAnterior}
                    />
                  )}

                  {item.estadoNuevo && (
                    <DatoCambio
                      label="Estado nuevo"
                      value={item.estadoNuevo}
                    />
                  )}

                  {item.prioridadAnterior && (
                    <DatoCambio
                      label="Prioridad anterior"
                      value={item.prioridadAnterior}
                    />
                  )}

                  {item.prioridadNueva && (
                    <DatoCambio
                      label="Prioridad nueva"
                      value={item.prioridadNueva}
                    />
                  )}

                  {item.usuarioAsignado && (
                    <DatoCambio
                      label="Usuario asignado"
                      value={obtenerNombreUsuario(item.usuarioAsignado)}
                    />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function DatoCambio({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/70">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
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

export default TicketHistorySection;