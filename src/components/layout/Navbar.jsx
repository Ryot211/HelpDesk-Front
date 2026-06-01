import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
  const { theme, cambiarTema } = useTheme();

  const esOscuro = theme === "dark";

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Panel HelpDesk
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gestión de tickets de soporte técnico
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={cambiarTema}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {esOscuro ? <Sun size={18} /> : <Moon size={18} />}
            {esOscuro ? "Modo claro" : "Modo oscuro"}
          </button>

          <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Usuario de prueba
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;