import { useEffect, useState } from "react";
import { Ticket, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { listarTickets } from "../api/ticketApi";
import { TICKET_ESTADOS } from "../utils/constantes";

function DashboardPage() {
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
      setError("No se pudo cargar la información del dashboard.");
    } finally {
      setCargando(false);
    }
  };

  const totalTickets = tickets.length;

  const registrados = contarPorEstado(TICKET_ESTADOS.REGISTRADO);
  const asignados = contarPorEstado(TICKET_ESTADOS.ASIGNADO);
  const enProceso = contarPorEstado(TICKET_ESTADOS.EN_PROCESO);
  const resueltos = contarPorEstado(TICKET_ESTADOS.RESUELTO);
  const cerrados = contarPorEstado(TICKET_ESTADOS.CERRADO);
  const anulados = contarPorEstado(TICKET_ESTADOS.ANULADO);

  function contarPorEstado(estado) {
    return tickets.filter((ticket) => ticket.estado === estado).length;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>

        <p className="text-slate-600 dark:text-slate-400">
          Resumen general del sistema HelpDesk.
        </p>
      </div>

      {cargando && (
        <div className="rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400">
            Cargando dashboard...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              title="Total tickets"
              value={totalTickets}
              description="Tickets registrados en el sistema"
              icon={Ticket}
            />

            <DashboardCard
              title="Registrados"
              value={registrados}
              description="Pendientes de asignación"
              icon={AlertCircle}
            />

            <DashboardCard
              title="Asignados"
              value={asignados}
              description="Asignados a soporte"
              icon={Ticket}
            />

            <DashboardCard
              title="En proceso"
              value={enProceso}
              description="Tickets en atención"
              icon={Clock}
            />

            <DashboardCard
              title="Resueltos"
              value={resueltos}
              description="Tickets con resolución"
              icon={CheckCircle}
            />

            <DashboardCard
              title="Cerrados"
              value={cerrados}
              description="Tickets finalizados"
              icon={CheckCircle}
            />

            <DashboardCard
              title="Anulados"
              value={anulados}
              description="Tickets anulados"
              icon={AlertCircle}
            />
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Resumen rápido
            </h2>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Actualmente existen {totalTickets} tickets registrados.
              De ellos, {enProceso} están en proceso y {cerrados} se encuentran cerrados.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function DashboardCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default DashboardPage;