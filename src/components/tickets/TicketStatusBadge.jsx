function TicketStatusBadge({ estado }) {
  // One hue per lifecycle meaning (DESIGN.md). REABIERTO isn't one of the
  // six defined states — it reuses state-asignado (back-in-queue violet)
  // rather than inventing a new hue.
  const estilos = {
    REGISTRADO: "bg-state-registrado/15 text-state-registrado dark:bg-state-registrado/25",
    ASIGNADO: "bg-state-asignado/15 text-state-asignado dark:bg-state-asignado/25",
    EN_PROCESO: "bg-state-en-proceso/20 text-state-en-proceso dark:bg-state-en-proceso/30",
    RESUELTO: "bg-state-resuelto/15 text-state-resuelto dark:bg-state-resuelto/25",
    CERRADO: "bg-state-cerrado/15 text-state-cerrado dark:bg-state-cerrado/30 dark:text-text-secondary-dark",
    ANULADO: "bg-state-anulado/15 text-state-anulado dark:bg-state-anulado/25",
    REABIERTO: "bg-state-asignado/15 text-state-asignado dark:bg-state-asignado/25",
  };

  const clase =
    estilos[estado] ||
    "bg-state-cerrado/15 text-state-cerrado dark:bg-state-cerrado/30 dark:text-text-secondary-dark";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${clase}`}>
      {estado || "SIN_ESTADO"}
    </span>
  );
}

export default TicketStatusBadge;
