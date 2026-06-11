import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { mostrarError, mostrarExito, mostrarAdvertencia } from "../utils/alerts";

function LoginPage() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const [formulario, setFormulario] = useState({
    email: "",
    password: "",
  });

  const [cargando, setCargando] = useState(false);

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const iniciar = async (event) => {
    event.preventDefault();

    if (!formulario.email.trim()) {
      await mostrarAdvertencia("El email es obligatorio.");
      return;
    }

    if (!formulario.password.trim()) {
      await mostrarAdvertencia("La contraseña es obligatoria.");
      return;
    }

    try {
      setCargando(true);

      const data = {
        email: formulario.email.trim(),
        password: formulario.password.trim(),
      };

    const response = await login(data);

    iniciarSesion({
      usuario: response.data.usuario,
      token: response.data.token,
    });

    navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      await mostrarError("Email o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow dark:bg-slate-900">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <LogIn size={26} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Iniciar sesión
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Accede al sistema HelpDesk.
          </p>
        </div>

        <form onSubmit={iniciar} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={manejarCambio}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-400"
              placeholder="usuario@test.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Contraseña
            </label>

            <input
              type="password"
              name="password"
              value={formulario.password}
              onChange={manejarCambio}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-400"
              placeholder="Tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <LogIn size={18} />
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;