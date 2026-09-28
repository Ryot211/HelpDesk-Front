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
        <h1 className="font-display text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
          Dashboard
        </h1>

        <p className="text-text-secondary dark:text-text-secondary-dark">
          Resumen general del sistema HelpDesk.
        </p>
      </div>

      {cargando && (
        <div className="rounded-2xl bg-surface p-6 shadow dark:bg-surface-dark">
          <p className="text-text-secondary dark:text-text-secondary-dark">
            Cargando dashboard...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-state-anulado/10 p-6 text-state-anulado shadow dark:bg-state-anulado/15">
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

          <div className="mt-6 rounded-2xl bg-surface p-6 shadow dark:bg-surface-dark">
            <h2 className="font-display text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              Resumen rápido
            </h2>

            <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary-dark">
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
    <div className="rounded-2xl bg-surface p-5 shadow dark:bg-surface-dark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
            {title}
          </p>

          <h2 className="font-display mt-2 text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
            {value}
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-border/25 text-text-secondary dark:bg-border-dark/40 dark:text-text-secondary-dark">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-sm text-text-secondary dark:text-text-secondary-dark">
        {description}
      </p>
    </div>
  );
}

export default DashboardPage;