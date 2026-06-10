import { useState } from "react";
import { Moon, Sun, LogOut, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { theme, cambiarTema } = useTheme();
  const { usuario, cerrarSesion } = useAuth();
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const esOscuro = theme === "dark";

const salir = async () => {
  setCerrandoSesion(true);

  await new Promise((resolve) => setTimeout(resolve, 600));

  cerrarSesion();
  navigate("/login", { replace: true });
};

  return (
      <>
    {cerrandoSesion && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-slate-950/90">
        <div className="rounded-2xl bg-white p-6 text-center shadow dark:bg-slate-900">
          <LoaderCircle className="mx-auto mb-3 animate-spin text-slate-900 dark:text-white" size={34} />

          <p className="text-sm font-medium text-slate-900 dark:text-white">
            Cerrando sesión...
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Redirigiendo al login
          </p>
        </div>
      </div>
    )}
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
            <p className="font-medium">
              {obtenerNombreUsuario(usuario)}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {usuario?.rol?.nombre || usuario?.rol?.codigo || "Sin rol"}
            </p>
          </div>

          <button
            type="button"
            onClick={salir}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </div>
    </header>
    </>
  );
}

function obtenerNombreUsuario(usuario) {
  if (!usuario) {
    return "Usuario";
  }

  const nombres = usuario.nombres || "";
  const apellidos = usuario.apellidos || "";

  return `${nombres} ${apellidos}`.trim() || usuario.email || "Usuario";
}

export default Navbar;