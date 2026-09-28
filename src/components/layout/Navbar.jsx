import { useState } from "react";
import { Moon, Sun, LogOut, LoaderCircle, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

function Navbar({ onAbrirMenu = () => {} }) {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/90 backdrop-blur-sm dark:bg-canvas-dark/90">
        <div className="rounded-2xl bg-surface p-6 text-center shadow dark:bg-surface-dark">
          <LoaderCircle className="mx-auto mb-3 animate-spin text-signal dark:text-signal-dark" size={34} />

          <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
            Cerrando sesión...
          </p>

          <p className="mt-1 text-xs text-text-secondary dark:text-text-secondary-dark">
            Redirigiendo al login
          </p>
        </div>
      </div>
    )}
    <header className="border-b border-border bg-surface px-6 py-4 dark:border-border-dark dark:bg-surface-dark">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAbrirMenu}
            className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-text-primary hover:bg-signal/8 dark:border-border-dark dark:text-text-primary-dark dark:hover:bg-signal-dark/10 md:hidden"
            aria-label="Abrir menú de navegación"
          >
            <Menu size={20} />
          </button>

          <div>
            <h2 className="font-display text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              Panel HelpDesk
            </h2>

            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              Gestión de tickets de soporte técnico
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={cambiarTema}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary hover:bg-signal/8 dark:border-border-dark dark:bg-surface-dark dark:text-text-primary-dark dark:hover:bg-signal-dark/10"
          >
            {esOscuro ? <Sun size={18} /> : <Moon size={18} />}
            {esOscuro ? "Modo claro" : "Modo oscuro"}
          </button>

          <div className="rounded-lg bg-canvas px-4 py-2 text-sm text-text-secondary dark:bg-canvas-dark dark:text-text-secondary-dark">
            <p className="font-medium text-text-primary dark:text-text-primary-dark">
              {obtenerNombreUsuario(usuario)}
            </p>

            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              {usuario?.rol?.nombre || usuario?.rol?.codigo || "Sin rol"}
            </p>
          </div>

          <button
            type="button"
            onClick={salir}
            className="inline-flex items-center gap-2 rounded-lg border border-state-anulado/30 px-3 py-2 text-sm font-medium text-state-anulado hover:bg-state-anulado/10 dark:border-state-anulado/40"
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