import { LayoutDashboard, Ticket, PlusCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Tickets",
      path: "/tickets",
      icon: Ticket,
    },
    {
      label: "Nuevo Ticket",
      path: "/tickets/nuevo",
      icon: PlusCircle,
    },
  ];

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
          {menuItems.map((item) => {
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