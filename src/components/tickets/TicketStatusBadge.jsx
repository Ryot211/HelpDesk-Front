function TicketStatusBadge({ estado }) {
  const estilos = {
    REGISTRADO:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",

    ASIGNADO:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",

    EN_PROCESO:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300",

    RESUELTO:
      "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",

    CERRADO:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",

    ANULADO:
      "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",

    REABIERTO:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
  };

  const clase =
    estilos[estado] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${clase}`}>
      {estado || "SIN_ESTADO"}
    </span>
  );
}

export default TicketStatusBadge;