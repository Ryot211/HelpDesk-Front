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
    <section className="rounded-2xl bg-surface p-6 shadow dark:bg-surface-dark">
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Historial
        </h2>

        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          Registro de acciones realizadas sobre el ticket.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-state-anulado/10 p-3 text-sm text-state-anulado dark:bg-state-anulado/15">
          {error}
        </div>
      )}

      {cargando && (
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          Cargando historial...
        </p>
      )}

      {!cargando && historial.length === 0 && (
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          Este ticket todavía no tiene historial registrado.
        </p>
      )}

      {!cargando && historial.length > 0 && (
        <div className="space-y-4">
          {historial.map((item) => (
            <article
              key={item.id}
              className="flex gap-4 rounded-lg border border-border p-4 dark:border-border-dark dark:bg-canvas-dark/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border/25 text-text-secondary dark:bg-border-dark/40 dark:text-text-secondary-dark">
                <Clock size={18} />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-text-primary dark:text-text-primary-dark">
                      {item.accion}
                    </p>

                    <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                      {formatearFecha(item.fechaCreacion)}
                    </p>
                  </div>

                  <span className="rounded-full bg-border/25 px-3 py-1 text-xs font-semibold text-text-secondary dark:bg-border-dark/40 dark:text-text-secondary-dark">
                    {obtenerNombreUsuario(item.usuario)}
                  </span>
                </div>

                {item.observacion && (
                  <p className="mt-3 text-sm text-text-primary dark:text-text-primary-dark">
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
    <div className="rounded-lg bg-canvas p-3 dark:bg-canvas-dark/70">
      <p className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
        {label}
      </p>

      <p className="text-text-primary dark:text-text-primary-dark">
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