function TicketPriorityBadge({ prioridad }) {
  const estilos = {
    BAJA: "bg-slate-100 text-slate-700",
    MEDIA: "bg-blue-100 text-blue-700",
    ALTA: "bg-orange-100 text-orange-700",
    CRITICA: "bg-red-100 text-red-700",
  };

  const clase = estilos[prioridad] || "bg-slate-100 text-slate-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${clase}`}>
      {prioridad || "SIN_PRIORIDAD"}
    </span>
  );
}

export default TicketPriorityBadge;