import { useEffect, useState } from "react";
import { Edit, Plus, Trash2, X } from "lucide-react";
import {
  guardarDepartamento,
  inactivarDepartamento,
  listarDepartamentos,
} from "../api/departamentoApi";
import {
  confirmarAccion,
  mostrarError,
  mostrarExito,
  mostrarAdvertencia,
} from "../utils/alerts";

function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [formularioVisible, setFormularioVisible] = useState(false);

  const [formulario, setFormulario] = useState({
    id: null,
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const cargarDepartamentos = async () => {
    try {
      setCargando(true);

      const response = await listarDepartamentos();

      setDepartamentos(response.data);
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudieron cargar los departamentos.");
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
      nombre: "",
      descripcion: "",
    });

    setFormularioVisible(false);
  };

  const nuevoDepartamento = () => {
    setFormulario({
      id: null,
      nombre: "",
      descripcion: "",
    });

    setFormularioVisible(true);
  };

  const editarDepartamento = (departamento) => {
    setFormulario({
      id: departamento.id,
      nombre: departamento.nombre || "",
      descripcion: departamento.descripcion || "",
    });

    setFormularioVisible(true);
  };

  const guardar = async (event) => {
    event.preventDefault();

    if (!formulario.nombre.trim()) {
      await mostrarAdvertencia("El nombre del departamento es obligatorio.");
      return;
    }

    try {
      setGuardando(true);

      const data = {
        id: formulario.id,
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
      };

      await guardarDepartamento(data);

      await mostrarExito(
        formulario.id
          ? "Departamento actualizado correctamente."
          : "Departamento creado correctamente."
      );

      limpiarFormulario();
      await cargarDepartamentos();
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo guardar el departamento.");
    } finally {
      setGuardando(false);
    }
  };

  const inactivar = async (id) => {
    const confirmar = await confirmarAccion(
      "Esta acción inactivará el departamento seleccionado.",
      "¿Deseas continuar?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await inactivarDepartamento(id);

      await mostrarExito("Departamento inactivado correctamente.");

      await cargarDepartamentos();
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo inactivar el departamento.");
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
            Departamentos
          </h1>

          <p className="text-slate-600 dark:text-slate-400">
            Administra las áreas o departamentos que pueden generar tickets.
          </p>
        </div>

        <button
          type="button"
          onClick={nuevoDepartamento}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <Plus size={18} />
          Nuevo departamento
        </button>
      </div>

      {formularioVisible && (
        <section className="mb-6 rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {formulario.id ? "Editar departamento" : "Nuevo departamento"}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Completa la información del departamento.
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

          <form onSubmit={guardar} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Nombre</label>

              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                className={inputClass}
                placeholder="Ejemplo: Sistemas"
              />
            </div>

            <div>
              <label className={labelClass}>Descripción</label>

              <input
                type="text"
                name="descripcion"
                value={formulario.descripcion}
                onChange={manejarCambio}
                className={inputClass}
                placeholder="Descripción del departamento"
              />
            </div>

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
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl bg-white shadow dark:bg-slate-900">
        {cargando ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
            Cargando departamentos...
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-slate-900 text-white dark:bg-black">
              <tr>
                <th className="p-3 text-left text-sm">Nombre</th>
                <th className="p-3 text-left text-sm">Descripción</th>
                <th className="p-3 text-left text-sm">Estado</th>
                <th className="p-3 text-right text-sm">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {departamentos.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No existen departamentos registrados.
                  </td>
                </tr>
              )}

              {departamentos.map((departamento) => (
                <tr
                  key={departamento.id}
                  className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                >
                  <td className="p-3 font-medium text-slate-900 dark:text-white">
                    {departamento.nombre}
                  </td>

                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {departamento.descripcion || "Sin descripción"}
                  </td>

                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    {departamento.estadoRegistro || "Sin estado"}
                  </td>

                  <td className="p-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => editarDepartamento(departamento)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Edit size={16} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => inactivar(departamento.id)}
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

export default DepartamentosPage;