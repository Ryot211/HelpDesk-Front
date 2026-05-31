import { useEffect, useState } from "react";
import { listarTickets } from "../api/ticketApi";

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
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Tickets
          </h1>
          <p className="text-slate-600">
            Listado de tickets consumido desde el backend.
          </p>
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
                  <th className="p-3 text-left">Código</th>
                  <th className="p-3 text-left">Título</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Prioridad</th>
                  <th className="p-3 text-left">Fecha creación</th>
                </tr>
              </thead>

              <tbody>
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-slate-500">
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
                      {ticket.titulo}
                    </td>
                    <td className="p-3 text-slate-700">
                      {ticket.estado}
                    </td>
                    <td className="p-3 text-slate-700">
                      {ticket.prioridad}
                    </td>
                    <td className="p-3 text-slate-700">
                      {ticket.fechaCreacion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketsPage;