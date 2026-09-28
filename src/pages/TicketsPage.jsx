import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Plus, Search } from "lucide-react";
import { listarTickets } from "../api/ticketApi";
import TicketStatusBadge from "../components/tickets/TicketStatusBadge";
import TicketPriorityBadge from "../components/tickets/TicketPriorityBadge";
import { formatearFecha } from "../utils/formatters";
import { TICKET_ESTADOS } from "../utils/constantes";

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  useEffect(() => {
    cargarTickets();
  }, []);

  const cargarTickets = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await listarTickets();
      setTickets(response.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los tickets.");
    } finally {
      setCargando(false);
    }
  };

  const ticketsFiltrados = useMemo(() => {
    return tickets.filter((ticket) => {
      const textoBusqueda = busqueda.trim().toLowerCase();

      const coincideBusqueda =
        !textoBusqueda ||
        ticket.codigo?.toLowerCase().includes(textoBusqueda) ||
        ticket.titulo?.toLowerCase().includes(textoBusqueda) ||
        ticket.categoria?.nombre?.toLowerCase().includes(textoBusqueda);

      const coincideEstado =
        !estadoFiltro || ticket.estado === estadoFiltro;

      return coincideBusqueda && coincideEstado;
    });
  }, [tickets, busqueda, estadoFiltro]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstadoFiltro("");
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-signal focus:ring-1 focus:ring-signal dark:border-border-dark dark:bg-surface-dark dark:text-text-primary-dark dark:placeholder:text-text-secondary-dark dark:focus:border-signal-dark dark:focus:ring-signal-dark";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
            Tickets
          </h1>

          <p className="text-text-secondary dark:text-text-secondary-dark">
            Listado de tickets registrados en el sistema.
          </p>
        </div>

        <Link
          to="/tickets/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-surface hover:bg-signal-hover dark:bg-signal-dark dark:text-surface-dark dark:hover:bg-signal"
        >
          <Plus size={18} />
          Nuevo ticket
        </Link>
      </div>

      <div className="mb-5 rounded-2xl bg-surface p-5 shadow dark:bg-surface-dark">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label
              htmlFor="busqueda-ticket"
              className="mb-2 block text-sm font-medium text-text-secondary dark:text-text-secondary-dark"
            >
              Buscar ticket
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark"
              />

              <input
                id="busqueda-ticket"
                type="text"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                className={`${inputClass} py-3 pl-10 pr-3`}
                placeholder="Buscar por código, título o categoría..."
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="estado-filtro"
              className="mb-2 block text-sm font-medium text-text-secondary dark:text-text-secondary-dark"
            >
              Estado
            </label>

            <select
              id="estado-filtro"
              value={estadoFiltro}
              onChange={(event) => setEstadoFiltro(event.target.value)}
              className={`${inputClass} p-3`}
            >
              <option value="">Todos los estados</option>
              <option value={TICKET_ESTADOS.REGISTRADO}>REGISTRADO</option>
              <option value={TICKET_ESTADOS.ASIGNADO}>ASIGNADO</option>
              <option value={TICKET_ESTADOS.EN_PROCESO}>EN_PROCESO</option>
              <option value={TICKET_ESTADOS.RESUELTO}>RESUELTO</option>
              <option value={TICKET_ESTADOS.CERRADO}>CERRADO</option>
              <option value={TICKET_ESTADOS.ANULADO}>ANULADO</option>
              <option value={TICKET_ESTADOS.REABIERTO}>REABIERTO</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 dark:border-border-dark">
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Mostrando{" "}
            <span className="font-semibold text-text-primary dark:text-text-primary-dark">
              {ticketsFiltrados.length}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-text-primary dark:text-text-primary-dark">
              {tickets.length}
            </span>{" "}
            tickets.
          </p>

          <button
            type="button"
            onClick={limpiarFiltros}
            className="text-sm font-medium text-text-secondary hover:text-signal dark:text-text-secondary-dark dark:hover:text-signal-dark"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {cargando && (
        <div className="rounded-lg bg-surface p-4 text-text-secondary shadow dark:bg-surface-dark dark:text-text-secondary-dark">
          Cargando tickets...
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-state-anulado/10 p-4 text-state-anulado shadow dark:bg-state-anulado/15">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <div className="overflow-x-auto rounded-2xl bg-surface shadow dark:bg-surface-dark">
          <table className="w-full border-collapse">
            <thead className="bg-canvas-dark text-text-primary-dark">
              <tr>
                <th className="p-3 text-left text-sm">Código</th>
                <th className="p-3 text-left text-sm">Título</th>
                <th className="p-3 text-left text-sm">Estado</th>
                <th className="p-3 text-left text-sm">Prioridad</th>
                <th className="p-3 text-left text-sm">Fecha creación</th>
                <th className="p-3 text-right text-sm">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ticketsFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-4 text-center text-text-secondary dark:text-text-secondary-dark"
                  >
                    No existen tickets con los filtros aplicados.
                  </td>
                </tr>
              )}

              {ticketsFiltrados.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-border hover:bg-canvas dark:border-border-dark dark:hover:bg-canvas-dark/60"
                >
                  <td className="p-3 font-medium text-text-primary dark:text-text-primary-dark">
                    {ticket.codigo}
                  </td>

                  <td className="p-3 text-text-primary dark:text-text-primary-dark">
                    <div className="font-medium">{ticket.titulo}</div>
                    <div className="text-xs text-text-secondary dark:text-text-secondary-dark">
                      {ticket.categoria?.nombre || "Sin categoría"}
                    </div>
                  </td>

                  <td className="p-3">
                    <TicketStatusBadge estado={ticket.estado} />
                  </td>

                  <td className="p-3">
                    <TicketPriorityBadge prioridad={ticket.prioridad} />
                  </td>

                  <td className="p-3 text-sm text-text-primary dark:text-text-primary-dark">
                    {formatearFecha(ticket.fechaCreacion)}
                  </td>

                  <td className="p-3 text-right">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary hover:bg-signal/8 dark:border-border-dark dark:text-text-primary-dark dark:hover:bg-signal-dark/10"
                    >
                      <Eye size={16} />
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TicketsPage;