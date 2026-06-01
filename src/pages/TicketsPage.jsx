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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tickets</h1>
          <p className="text-slate-600">
            Listado de tickets registrados en el sistema.
          </p>
        </div>

        <Link
          to="/tickets/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          <Plus size={18} />
          Nuevo ticket
        </Link>
      </div>

      <div className="mb-5 rounded-2xl bg-white p-5 shadow">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Buscar ticket
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                placeholder="Buscar por código, título o categoría..."
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Estado
            </label>

            <select
              value={estadoFiltro}
              onChange={(event) => setEstadoFiltro(event.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
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

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">
            Mostrando{" "}
            <span className="font-semibold text-slate-900">
              {ticketsFiltrados.length}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-slate-900">
              {tickets.length}
            </span>{" "}
            tickets.
          </p>

          <button
            type="button"
            onClick={limpiarFiltros}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {cargando && (
        <div className="rounded-xl bg-white p-4 shadow">
          Cargando tickets...
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700 shadow">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <table className="w-full border-collapse">
            <thead className="bg-slate-900 text-white">
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
                  <td colSpan="6" className="p-4 text-center text-slate-500">
                    No existen tickets con los filtros aplicados.
                  </td>
                </tr>
              )}

              {ticketsFiltrados.map((ticket) => (
                <tr key={ticket.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-900">
                    {ticket.codigo}
                  </td>

                  <td className="p-3 text-slate-700">
                    <div className="font-medium">{ticket.titulo}</div>
                    <div className="text-xs text-slate-500">
                      {ticket.categoria?.nombre || "Sin categoría"}
                    </div>
                  </td>

                  <td className="p-3">
                    <TicketStatusBadge estado={ticket.estado} />
                  </td>

                  <td className="p-3">
                    <TicketPriorityBadge prioridad={ticket.prioridad} />
                  </td>

                  <td className="p-3 text-sm text-slate-700">
                    {formatearFecha(ticket.fechaCreacion)}
                  </td>

                  <td className="p-3 text-right">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
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