function TicketStatusBadge({ estado }) {
  const estilos = {
    REGISTRADO: "bg-slate-100 text-slate-700",
    ASIGNADO: "bg-blue-100 text-blue-700",
    EN_PROCESO: "bg-yellow-100 text-yellow-700",
    RESUELTO: "bg-green-100 text-green-700",
    CERRADO: "bg-emerald-100 text-emerald-700",
    ANULADO: "bg-red-100 text-red-700",
    REABIERTO: "bg-purple-100 text-purple-700",
  };

  const clase = estilos[estado] || "bg-slate-100 text-slate-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${clase}`}>
      {estado || "SIN_ESTADO"}
    </span>
  );
}

export default TicketStatusBadge;