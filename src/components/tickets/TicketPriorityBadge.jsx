function TicketPriorityBadge({ prioridad }) {
  const estilos = {
    BAJA: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    MEDIA: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    ALTA: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    CRITICA: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  };

  const clase =
    estilos[prioridad] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${clase}`}>
      {prioridad || "SIN_PRIORIDAD"}
    </span>
  );
}

export default TicketPriorityBadge;