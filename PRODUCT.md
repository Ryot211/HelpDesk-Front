# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences share this HelpDesk system:
- **External/end clients** who submit and track support tickets.
- **Support agents and admins** (internal staff) who triage, assign, work, and resolve tickets, and manage catalog data (users, departments, ticket categories).

## Product Purpose

A support ticket tracking system: clients report issues, agents pick them up and move them through a resolution lifecycle, and admins manage the underlying users/departments/categories that structure the workflow.

## Positioning

Internal/customer-support tool, not a marketed product — success means agents can scan ticket load and status at a glance, and clients can trust their ticket is progressing.

## Operating Context

Ticket lifecycle states (from `TICKET_ESTADOS`): Registrado → Asignado → En proceso → Resuelto → Cerrado, with Anulado as a terminal cancel state. Priority levels shown via `TicketPriorityBadge`. `ProtectedRoute` currently only checks that the user is authenticated (has a valid session) — it does not check the user's role. Separating ticket-workflow routes from admin catalog pages (Usuarios, Departamentos, Categorías) by role is a pending item, not yet implemented.

## Capabilities and Constraints

- Stack: React 19 + Vite + Tailwind CSS v4, `react-router-dom` v7, `axios` for API calls, `sweetalert2` for alerts/confirmations, `lucide-react` for icons.
- Auth/session handled via `AuthContext` (token + user in localStorage), role-protected routing.
- Dark mode supported via `ThemeContext` (dark: variants already present throughout).
- Current UI is the default Tailwind "slate + white card + rounded-2xl + shadow" look with no distinct visual identity yet — this is the generic feel the user wants improved.

## Brand Commitments

None. No existing company name, logo, or locked palette — the user is free to define a new visual identity.

## Evidence on Hand

No testimonials, case studies, or external proof assets. Ticket status/priority vocabulary is defined in `src/utils/constantes.js` and must be preserved as-is (Spanish terminology: Registrado, Asignado, En proceso, Resuelto, Cerrado, Anulado).

## Product Principles

- Scanability first: agents triage by status/priority at a glance across a list of tickets.
- Trust through clarity: clients should always be able to tell where their ticket stands.
- Role clarity: ticket workflow screens and admin catalog screens (Usuarios/Departamentos/Categorías) are functionally distinct areas.
- Consistency across light/dark themes is already a baseline expectation, not optional.

## Accessibility & Inclusion

No explicit standard confirmed yet; treat as an open item for a future `/impeccable audit`.
