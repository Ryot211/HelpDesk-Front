import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { crearTicket } from "../api/ticketApi";
import { listarCategoriasTicket } from "../api/categoriaTicketApi";
import { listarDepartamentos } from "../api/departamentoApi";
import { TICKET_PRIORIDADES } from "../utils/constantes";
import { useAuth } from "../context/AuthContext";
import { mostrarError, mostrarExito } from "../utils/alerts";

function TicketCreatePage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [erroresCampos, setErroresCampos] = useState({});

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

    if (erroresCampos[name]) {
      setErroresCampos((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const guardarTicket = async (event) => {
    event.preventDefault();

    if (!formulario.titulo.trim()) {
      setErroresCampos((prev) => ({ ...prev, titulo: "El título es obligatorio." }));
      await mostrarError("El título es obligatorio.");
      return;
    }
    setErroresCampos((prev) => ({ ...prev, titulo: undefined }));

    if (!formulario.descripcion.trim()) {
      setErroresCampos((prev) => ({ ...prev, descripcion: "La descripción es obligatoria." }));
      await mostrarError("La descripción es obligatoria.");
      return;
    }
    setErroresCampos((prev) => ({ ...prev, descripcion: undefined }));

    if (!formulario.categoriaId) {
      setErroresCampos((prev) => ({ ...prev, categoriaId: "Debes seleccionar una categoría." }));
      await mostrarError("Debes seleccionar una categoría.");
      return;
    }
    setErroresCampos((prev) => ({ ...prev, categoriaId: undefined }));

    if (!formulario.departamentoSolicitanteId) {
      setErroresCampos((prev) => ({
        ...prev,
        departamentoSolicitanteId: "Debes seleccionar un departamento.",
      }));
      await mostrarError("Debes seleccionar un departamento.");
      return;
    }
    setErroresCampos((prev) => ({ ...prev, departamentoSolicitanteId: undefined }));

    try {
      setGuardando(true);
      setError("");

      const data = {
        titulo: formulario.titulo.trim(),
        descripcion: formulario.descripcion.trim(),
        prioridad: formulario.prioridad,
        categoriaId: Number(formulario.categoriaId),
        departamentoSolicitanteId: Number(formulario.departamentoSolicitanteId),
       creadoPorId: usuario.id,
      };

      const response = await crearTicket(data);

      setErroresCampos({});
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
    "w-full rounded-lg border border-border bg-surface p-3 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-signal focus:ring-1 focus:ring-signal dark:border-border-dark dark:bg-surface-dark dark:text-text-primary-dark dark:placeholder:text-text-secondary-dark dark:focus:border-signal-dark dark:focus:ring-signal-dark";

  const labelClass =
    "mb-2 block text-sm font-medium text-text-secondary dark:text-text-secondary-dark";

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/tickets"
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-signal dark:text-text-secondary-dark dark:hover:text-signal-dark"
        >
          <ArrowLeft size={16} />
          Volver al listado
        </Link>

        <h1 className="font-display text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
          Nuevo Ticket
        </h1>

        <p className="text-text-secondary dark:text-text-secondary-dark">
          Registra una nueva solicitud de soporte técnico.
        </p>
      </div>

      <section className="rounded-2xl bg-surface p-6 shadow dark:bg-surface-dark">
        {error && (
          <div className="mb-5 rounded-lg bg-state-anulado/10 p-3 text-sm text-state-anulado dark:bg-state-anulado/15">
            {error}
          </div>
        )}

        {cargandoCatalogos ? (
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Cargando información del formulario...
          </p>
        ) : (
          <form onSubmit={guardarTicket} className="space-y-5">
            <div>
              <label htmlFor="titulo" className={labelClass}>Título</label>

              <input
                id="titulo"
                type="text"
                name="titulo"
                value={formulario.titulo}
                onChange={manejarCambio}
                className={inputClass}
                placeholder="Ejemplo: No puedo ingresar al sistema"
                aria-invalid={Boolean(erroresCampos.titulo)}
                aria-describedby={erroresCampos.titulo ? "titulo-error" : undefined}
              />

              {erroresCampos.titulo && (
                <p id="titulo-error" className="mt-1 text-xs text-state-anulado">
                  {erroresCampos.titulo}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="descripcion" className={labelClass}>Descripción</label>

              <textarea
                id="descripcion"
                name="descripcion"
                value={formulario.descripcion}
                onChange={manejarCambio}
                rows="5"
                className={inputClass}
                placeholder="Describe el problema con el mayor detalle posible..."
                aria-invalid={Boolean(erroresCampos.descripcion)}
                aria-describedby={erroresCampos.descripcion ? "descripcion-error" : undefined}
              />

              {erroresCampos.descripcion && (
                <p id="descripcion-error" className="mt-1 text-xs text-state-anulado">
                  {erroresCampos.descripcion}
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="prioridad" className={labelClass}>Prioridad</label>

                <select
                  id="prioridad"
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
                <label htmlFor="categoriaId" className={labelClass}>Categoría</label>

                <select
                  id="categoriaId"
                  name="categoriaId"
                  value={formulario.categoriaId}
                  onChange={manejarCambio}
                  className={inputClass}
                  aria-invalid={Boolean(erroresCampos.categoriaId)}
                  aria-describedby={erroresCampos.categoriaId ? "categoriaId-error" : undefined}
                >
                  <option value="">Selecciona una categoría</option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>

                {erroresCampos.categoriaId && (
                  <p id="categoriaId-error" className="mt-1 text-xs text-state-anulado">
                    {erroresCampos.categoriaId}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="departamentoSolicitanteId" className={labelClass}>Departamento</label>

                <select
                  id="departamentoSolicitanteId"
                  name="departamentoSolicitanteId"
                  value={formulario.departamentoSolicitanteId}
                  onChange={manejarCambio}
                  className={inputClass}
                  aria-invalid={Boolean(erroresCampos.departamentoSolicitanteId)}
                  aria-describedby={
                    erroresCampos.departamentoSolicitanteId
                      ? "departamentoSolicitanteId-error"
                      : undefined
                  }
                >
                  <option value="">Selecciona un departamento</option>

                  {departamentos.map((departamento) => (
                    <option key={departamento.id} value={departamento.id}>
                      {departamento.nombre}
                    </option>
                  ))}
                </select>

                {erroresCampos.departamentoSolicitanteId && (
                  <p
                    id="departamentoSolicitanteId-error"
                    className="mt-1 text-xs text-state-anulado"
                  >
                    {erroresCampos.departamentoSolicitanteId}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link
                to="/tickets"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-signal/8 dark:border-border-dark dark:text-text-primary-dark dark:hover:bg-signal-dark/10"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={guardando}
                className="inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-surface hover:bg-signal-hover disabled:cursor-not-allowed disabled:opacity-60 dark:bg-signal-dark dark:text-surface-dark dark:hover:bg-signal"
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