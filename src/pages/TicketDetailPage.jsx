import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { buscarTicket } from "../api/ticketApi";
import TicketStatusBadge from "../components/tickets/TicketStatusBadge";
import TicketPriorityBadge from "../components/tickets/TicketPriorityBadge";
import { formatearFecha } from "../utils/formatters";
import TicketCommentsSection from "../components/tickets/TicketCommentsSection";
import TicketHistorySection from "../components/tickets/TicketHistorySection";
import TicketAttachmentsSection from "../components/tickets/TicketAttachmentsSection";
import TicketActionsSection from "../components/tickets/TicketActionsSection";

function TicketDetailPage() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarTicket();
  }, [id]);

  const cargarTicket = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await buscarTicket(id);

      setTicket(response.data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el detalle del ticket.");
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-slate-600">Cargando detalle del ticket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow">
        {error}
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-slate-600">No se encontró información del ticket.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/tickets"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Volver al listado
          </Link>

          <h1 className="text-3xl font-bold text-slate-900">
            {ticket.codigo}
          </h1>

          <p className="mt-1 text-slate-600">
            {ticket.titulo}
          </p>
        </div>

        <div className="flex gap-2">
          <TicketStatusBadge estado={ticket.estado} />
          <TicketPriorityBadge prioridad={ticket.prioridad} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">
            Información del ticket
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Título</p>
              <p className="text-slate-900">{ticket.titulo}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Descripción</p>
              <p className="whitespace-pre-line text-slate-900">
                {ticket.descripcion}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Solución</p>
              <p className="whitespace-pre-line text-slate-900">
                {ticket.solucion || "Aún no se ha registrado solución."}
              </p>
            </div>
          </div>
        </section>

        <aside className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">
            Datos generales
          </h2>

          <div className="mt-5 space-y-4">
            <InfoItem
              label="Categoría"
              value={ticket.categoria?.nombre || "Sin categoría"}
            />

            <InfoItem
              label="Departamento"
              value={ticket.departamento?.nombre || "Sin departamento"}
            />

            <InfoItem
              label="Creado por"
              value={obtenerNombreUsuario(ticket.usuarioCreacion)}
            />

            <InfoItem
              label="Asignado a"
              value={obtenerNombreUsuario(ticket.usuarioAsignado)}
            />

            <InfoItem
              label="Cerrado por"
              value={obtenerNombreUsuario(ticket.usuarioFinalizado)}
            />

            <InfoItem
              label="Fecha creación"
              value={formatearFecha(ticket.fechaCreacion)}
            />

            <InfoItem
              label="Fecha asignación"
              value={formatearFecha(ticket.fechaAsignacion)}
            />

            <InfoItem
              label="Fecha resolución"
              value={formatearFecha(ticket.fechaResolucion)}
            />

            <InfoItem
              label="Fecha cierre"
              value={formatearFecha(ticket.fechaCierre)}
            />
          </div>
        </aside>
      </div>
      <div className="mt-6">
        <TicketActionsSection
            ticket={ticket}
            onTicketUpdated={cargarTicket}
        />
        </div>
        <div className="mt-6">
            <TicketCommentsSection ticketId={ticket.id} />
         </div>
         <div className="mt-6">
            <TicketAttachmentsSection ticketId={ticket.id} />
        </div>

        <div className="mt-6">
            <TicketHistorySection ticketId={ticket.id} />
        </div>

    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-slate-900">{value || "No definido"}</p>
    </div>
  );
}

function obtenerNombreUsuario(usuario) {
  if (!usuario) {
    return "No asignado";
  }

  const nombres = usuario.nombres || "";
  const apellidos = usuario.apellidos || "";

  return `${nombres} ${apellidos}`.trim() || usuario.email || "Usuario sin nombre";
}

export default TicketDetailPage;