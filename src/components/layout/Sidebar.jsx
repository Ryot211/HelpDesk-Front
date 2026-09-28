import { useEffect } from "react";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Tags,
  Building2,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES, tieneRol } from "../../utils/roles";

function Sidebar({ abierto = false, onCerrar = () => {} }) {
  const { usuario } = useAuth();

  useEffect(() => {
    if (!abierto) {
      return;
    }

    const manejarTecla = (event) => {
      if (event.key === "Escape") {
        onCerrar();
      }
    };

    document.addEventListener("keydown", manejarTecla);

    return () => document.removeEventListener("keydown", manejarTecla);
  }, [abierto, onCerrar]);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: [ROLES.ADMIN, ROLES.SOPORTE, ROLES.USUARIO_FINAL],
    },
    {
      label: "Tickets",
      path: "/tickets",
      icon: Ticket,
      roles: [ROLES.ADMIN, ROLES.SOPORTE, ROLES.USUARIO_FINAL],
    },
    {
      label: "Nuevo Ticket",
      path: "/tickets/nuevo",
      icon: PlusCircle,
      roles: [ROLES.ADMIN, ROLES.SOPORTE, ROLES.USUARIO_FINAL],
    },
    {
      label: "Categorías",
      path: "/categorias-ticket",
      icon: Tags,
      roles: [ROLES.ADMIN],
    },
    {
      label: "Departamentos",
      path: "/departamentos",
      icon: Building2,
      roles: [ROLES.ADMIN],
    },
    {
      label: "Usuarios",
      path: "/usuarios",
      icon: Users,
      roles: [ROLES.ADMIN],
    },
  ];

  const menuFiltrado = menuItems.filter((item) =>
    tieneRol(usuario, item.roles)
  );

  console.log("Usuario autenticado:", usuario);
  console.log("Rol:", usuario?.rol?.codigo);

  return (
    <>
      {abierto && (
        <div
          className="fixed inset-0 z-30 bg-canvas-dark/50 md:hidden"
          onClick={onCerrar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 min-h-screen w-64 transform bg-canvas-dark text-text-primary-dark transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-border-dark p-6">
          <h1 className="font-display text-xl font-semibold">HelpDesk</h1>
          <p className="mt-1 text-sm text-text-secondary-dark">
            Sistema de soporte
          </p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuFiltrado.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onCerrar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-signal/15 text-signal-dark"
                          : "text-text-secondary-dark hover:bg-border-dark/40 hover:text-text-primary-dark"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;