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

function Sidebar() {
  const { usuario } = useAuth();

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
    <aside className="min-h-screen w-64 bg-slate-950 text-white dark:bg-black">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-xl font-bold">HelpDesk</h1>
        <p className="mt-1 text-sm text-slate-400">
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
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-slate-950"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
  );
}

export default Sidebar;