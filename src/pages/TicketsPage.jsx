import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Plus } from "lucide-react";
import { listarTickets } from "../api/ticketApi";
import TicketStatusBadge from "../components/tickets/TicketStatusBadge";
import TicketPriorityBadge from "../components/tickets/TicketPriorityBadge";
import { formatearFecha } from "../utils/formatters";

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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
              {tickets.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-slate-500">
                    No existen tickets registrados.
                  </td>
                </tr>
              )}

              {tickets.map((ticket) => (
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