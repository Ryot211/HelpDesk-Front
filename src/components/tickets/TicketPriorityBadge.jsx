function TicketPriorityBadge({ prioridad }) {
  // Priority isn't pinned to specific hues in DESIGN.md, so these reuse the
  // same six lifecycle tokens rather than introducing new accents:
  // BAJA -> muted graphite (cerrado), MEDIA -> neutral gray-blue (registrado),
  // ALTA -> amber "needs attention" (en-proceso), CRITICA -> desaturated red (anulado).
  const estilos = {
    BAJA: "bg-state-cerrado/15 text-state-cerrado dark:bg-state-cerrado/30 dark:text-text-secondary-dark",
    MEDIA: "bg-state-registrado/15 text-state-registrado dark:bg-state-registrado/25",
    ALTA: "bg-state-en-proceso/20 text-state-en-proceso dark:bg-state-en-proceso/30",
    CRITICA: "bg-state-anulado/15 text-state-anulado dark:bg-state-anulado/25",
  };

  const clase =
    estilos[prioridad] ||
    "bg-state-cerrado/15 text-state-cerrado dark:bg-state-cerrado/30 dark:text-text-secondary-dark";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${clase}`}>
      {prioridad || "SIN_PRIORIDAD"}
    </span>
  );
}

export default TicketPriorityBadge;
