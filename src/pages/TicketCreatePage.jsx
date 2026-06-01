import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { crearTicket } from "../api/ticketApi";
import { listarCategoriasTicket } from "../api/categoriaTicketApi";
import { listarDepartamentos } from "../api/departamentoApi";
import { TICKET_PRIORIDADES, USUARIO_PRUEBA_ID } from "../utils/constantes";
import { mostrarError, mostrarExito } from "../utils/alerts";

function TicketCreatePage() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [formulario, setFormulario] = useState({
    titulo: "",
    descripcion: "",
    prioridad: TICKET_PRIORIDADES.MEDIA,
    categoriaId: "",
    departamentoSolicitanteId: "",
  });

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      setCargandoCatalogos(true);
      setError("");

      const [categoriasResponse, departamentosResponse] = await Promise.all([
        listarCategoriasTicket(),
        listarDepartamentos(),
      ]);

      setCategorias(categoriasResponse.data);
      setDepartamentos(departamentosResponse.data);
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudieron cargar las categorías o departamentos.");
    } finally {
      setCargandoCatalogos(false);
    }
  };

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const guardarTicket = async (event) => {
    event.preventDefault();

    if (!formulario.titulo.trim()) {
      await mostrarError("El título es obligatorio.");
      return;
    }

    if (!formulario.descripcion.trim()) {
      await mostrarError("La descripción es obligatoria.");
      return;
    }

    if (!formulario.categoriaId) {
      await mostrarError("Debes seleccionar una categoría.");
      return;
    }

    if (!formulario.departamentoSolicitanteId) {
      await mostrarError("Debes seleccionar un departamento.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const data = {
        titulo: formulario.titulo.trim(),
        descripcion: formulario.descripcion.trim(),
        prioridad: formulario.prioridad,
        categoriaId: Number(formulario.categoriaId),
        departamentoSolicitanteId: Number(formulario.departamentoSolicitanteId),
        creadoPorId: USUARIO_PRUEBA_ID,
      };

      const response = await crearTicket(data);

      await mostrarExito("Ticket creado correctamente.");

      navigate(`/tickets/${response.data.id}`);
    } catch (err) {
      console.error(err);
      await mostrarError("No se pudo crear el ticket.");
    } finally {
      setGuardando(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-400";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/tickets"
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Volver al listado
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Nuevo Ticket
        </h1>

        <p className="text-slate-600 dark:text-slate-400">
          Registra una nueva solicitud de soporte técnico.
        </p>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {cargandoCatalogos ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cargando información del formulario...
          </p>
        ) : (
          <form onSubmit={guardarTicket} className="space-y-5">
            <div>
              <label className={labelClass}>Título</label>

              <input
                type="text"
                name="titulo"
                value={formulario.titulo}
                onChange={manejarCambio}
                className={inputClass}
                placeholder="Ejemplo: No puedo ingresar al sistema"
              />
            </div>

            <div>
              <label className={labelClass}>Descripción</label>

              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={manejarCambio}
                rows="5"
                className={inputClass}
                placeholder="Describe el problema con el mayor detalle posible..."
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className={labelClass}>Prioridad</label>

                <select
                  name="prioridad"
                  value={formulario.prioridad}
                  onChange={manejarCambio}
                  className={inputClass}
                >
                  <option value={TICKET_PRIORIDADES.BAJA}>BAJA</option>
                  <option value={TICKET_PRIORIDADES.MEDIA}>MEDIA</option>
                  <option value={TICKET_PRIORIDADES.ALTA}>ALTA</option>
                  <option value={TICKET_PRIORIDADES.CRITICA}>CRITICA</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Categoría</label>

                <select
                  name="categoriaId"
                  value={formulario.categoriaId}
                  onChange={manejarCambio}
                  className={inputClass}
                >
                  <option value="">Selecciona una categoría</option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Departamento</label>

                <select
                  name="departamentoSolicitanteId"
                  value={formulario.departamentoSolicitanteId}
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
            </div>

            <div className="flex justify-end gap-3">
              <Link
                to="/tickets"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={guardando}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <Save size={18} />
                {guardando ? "Guardando..." : "Guardar ticket"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

export default TicketCreatePage;