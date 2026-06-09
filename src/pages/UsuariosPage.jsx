import { useEffect, useState } from "react";
import { Edit, Plus, X,Trash2,UserPlus } from "lucide-react";
import {
  actualizarUsuario,
  crearUsuario,
  inactivarUsuario,
  listarUsuarios,
} from "../api/usuarioApi";
import { listarRoles } from "../api/rolApi";
import { listarDepartamentos } from "../api/departamentoApi";
import {
  confirmarAccion,
  mostrarError,
  mostrarExito,
  mostrarAdvertencia,
} from "../utils/alerts";


function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [formularioVisible, setFormularioVisible] = useState(false);
const [formulario, setFormulario] = useState({
  id: null,
  rolId: "",
  departamentoId: "",
  nombres: "",
  apellidos: "",
  email: "",
  password: "",
  telefono: "",
});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [usuariosResponse, rolesResponse, departamentosResponse] =
        await Promise.all([
          listarUsuarios(),
          listarRoles(),
          listarDepartamentos(),
        ]);

      setUsuarios(usuariosResponse.data);
      setRoles(rolesResponse.data);
      setDepartamentos(departamentosResponse.data);
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo cargar la información de usuarios.");
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

const limpiarFormulario = () => {
  setFormulario({
    id: null,
    rolId: "",
    departamentoId: "",
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    telefono: "",
  });

    setFormularioVisible(false);
  };

  const nuevoUsuario = () => {
    limpiarFormulario();
    setFormularioVisible(true);
  };
  const editarUsuario = (usuario) => {
  setFormulario({
    id: usuario.id,
    rolId: usuario.rol?.id || "",
    departamentoId: usuario.departamento?.id || "",
    nombres: usuario.nombres || "",
    apellidos: usuario.apellidos || "",
    email: usuario.email || "",
    password: "",
    telefono: usuario.telefono || "",
  });

  setFormularioVisible(true);
};

  const guardarUsuario = async (event) => {
    event.preventDefault();

    if (!formulario.rolId) {
      await mostrarAdvertencia("Debes seleccionar un rol.");
      return;
    }

    if (!formulario.departamentoId) {
      await mostrarAdvertencia("Debes seleccionar un departamento.");
      return;
    }

    if (!formulario.nombres.trim()) {
      await mostrarAdvertencia("Los nombres son obligatorios.");
      return;
    }

    if (!formulario.apellidos.trim()) {
      await mostrarAdvertencia("Los apellidos son obligatorios.");
      return;
    }

    if (!formulario.email.trim()) {
      await mostrarAdvertencia("El email es obligatorio.");
      return;
    }

    if (!formulario.id && !formulario.password.trim()) {
    await mostrarAdvertencia("La contraseña es obligatoria.");
    return;
    }

try {
  setGuardando(true);

if (formulario.id) {
  const data = {
    id: formulario.id,
    rol: {
      id: Number(formulario.rolId),
    },
    departamento: {
      id: Number(formulario.departamentoId),
    },
    nombres: formulario.nombres.trim(),
    apellidos: formulario.apellidos.trim(),
    email: formulario.email.trim(),
    telefono: formulario.telefono.trim(),
  };

  await actualizarUsuario(data);

  await mostrarExito("Usuario actualizado correctamente.");
} else {
  const data = {
    rolId: Number(formulario.rolId),
    departamentoId: Number(formulario.departamentoId),
    nombres: formulario.nombres.trim(),
    apellidos: formulario.apellidos.trim(),
    email: formulario.email.trim(),
    password: formulario.password.trim(),
    telefono: formulario.telefono.trim(),
  };

  await crearUsuario(data);

  await mostrarExito("Usuario creado correctamente.");
}

  limpiarFormulario();
  await cargarDatos();
} catch (err) {
  console.error(err);
  await mostrarError("No se pudo guardar el usuario.");
} finally {
  setGuardando(false);
}

};

  const inactivar = async (id) => {
    const confirmar = await confirmarAccion(
      "Esta acción inactivará el usuario seleccionado.",
      "¿Deseas continuar?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await inactivarUsuario(id);

      await mostrarExito("Usuario inactivado correctamente.");

      await cargarDatos();
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo inactivar el usuario.");
    }
  };



  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-400";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Usuarios
          </h1>

          <p className="text-slate-600 dark:text-slate-400">
            Administra usuarios básicos del sistema HelpDesk.
          </p>
        </div>

        <button
          type="button"
          onClick={nuevoUsuario}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      {formularioVisible && (
        <section className="mb-6 rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {formulario.id ? "Editar usuario" : "Nuevo usuario"}
                </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Completa la información para registrar un usuario.
              </p>
            </div>

            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={guardarUsuario} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Rol</label>

              <select
                name="rolId"
                value={formulario.rolId}
                onChange={manejarCambio}
                className={inputClass}
              >
                <option value="">Selecciona un rol</option>

                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre || rol.codigo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Departamento</label>

              <select
                name="departamentoId"
                value={formulario.departamentoId}
                onChange={manejarCambio}
                className={inputClass}
              >
                <option value="">Selecciona un departamento</option>

                {departamentos.map((departamento) => (
                  <option key={departamento.id} value={departamento.id}>
                    {departamento.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Nombres</label>

              <input
                type="text"
                name="nombres"
                value={formulario.nombres}
                onChange={manejarCambio}
                className={inputClass}
                placeholder="Ejemplo: Bryan"
              />
            </div>

            <div>
              <label className={labelClass}>Apellidos</label>

              <input
                type="text"
                name="apellidos"
                value={formulario.apellidos}
                onChange={manejarCambio}
                className={inputClass}
                placeholder="Ejemplo: Gallardo"
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>

              <input
                type="email"
                name="email"
                value={formulario.email}
                onChange={manejarCambio}
                className={inputClass}
                placeholder="usuario@test.com"
              />
            </div>

            <div>
              <label className={labelClass}>Teléfono</label>

              <input
                type="text"
                name="telefono"
                value={formulario.telefono}
                onChange={manejarCambio}
                className={inputClass}
                placeholder="0999999999"
              />
            </div>
            {!formulario.id && (
            <div className="md:col-span-2">
                <label className={labelClass}>Contraseña</label>

                <input
                type="password"
                name="password"
                value={formulario.password}
                onChange={manejarCambio}
                className={inputClass}
                placeholder="Contraseña inicial"
                />
            </div>
            )}
            <div className="flex justify-end gap-3 md:col-span-2">
              <button
                type="button"
                onClick={limpiarFormulario}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <UserPlus size={18} />
                {guardando ? "Guardando..." : "Guardar usuario"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl bg-white shadow dark:bg-slate-900">
        {cargando ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
            Cargando usuarios...
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-slate-900 text-white dark:bg-black">
              <tr>
                <th className="p-3 text-left text-sm">Usuario</th>
                <th className="p-3 text-left text-sm">Email</th>
                <th className="p-3 text-left text-sm">Rol</th>
                <th className="p-3 text-left text-sm">Departamento</th>
                <th className="p-3 text-left text-sm">Estado</th>
                <th className="p-3 text-right text-sm">Acciones</th>
              </tr>
            </thead>

       <tbody>
            {usuarios.length === 0 && (
                <tr>
                <td
                    colSpan="6"
                    className="p-4 text-center text-slate-500 dark:text-slate-400"
                >
                    No existen usuarios registrados.
                </td>
                </tr>
            )}

            {usuarios.map((usuario) => (
                <tr
                key={usuario.id}
                className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                >
                <td className="p-3 font-medium text-slate-900 dark:text-white">
                    {obtenerNombreUsuario(usuario)}
                </td>

                <td className="p-3 text-slate-700 dark:text-slate-300">
                    {usuario.email}
                </td>

                <td className="p-3 text-slate-700 dark:text-slate-300">
                    {usuario.rol?.nombre || usuario.rol?.codigo || "Sin rol"}
                </td>

                <td className="p-3 text-slate-700 dark:text-slate-300">
                    {usuario.departamento?.nombre || "Sin departamento"}
                </td>

                <td className="p-3 text-slate-700 dark:text-slate-300">
                    {usuario.estadoRegistro || "Sin estado"}
                </td>

               <td className="p-3 text-right">
                <div className="inline-flex gap-2">
                    <button
                    type="button"
                    onClick={() => editarUsuario(usuario)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                    <Edit size={16} />
                    Editar
                    </button>

                    <button
                    type="button"
                    onClick={() => inactivar(usuario.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/40"
                    >
                    <Trash2 size={16} />
                    Inactivar
                    </button>
                </div>
                </td>
                </tr>
            ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function obtenerNombreUsuario(usuario) {
  const nombres = usuario.nombres || "";
  const apellidos = usuario.apellidos || "";

  return `${nombres} ${apellidos}`.trim() || "Usuario sin nombre";
}

export default UsuariosPage;