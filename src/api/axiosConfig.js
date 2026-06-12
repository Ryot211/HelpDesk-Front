import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("helpdesk-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const mensajeBackend = obtenerMensajeBackend(error);

    if (!error.response) {
      await mostrarAlertaGlobal(
        "error",
        "Sin conexión",
        "No se pudo conectar con el servidor. Verifica que el backend esté encendido."
      );

      return Promise.reject(error);
    }

    if (status === 400) {
      await mostrarAlertaGlobal(
        "warning",
        "Solicitud inválida",
        mensajeBackend || "Revisa los datos enviados."
      );

      return Promise.reject(error);
    }

    if (status === 401) {
      localStorage.removeItem("helpdesk-user");
      localStorage.removeItem("helpdesk-token");

      await mostrarAlertaGlobal(
        "warning",
        "Sesión vencida",
        "Tu sesión expiró o no es válida. Inicia sesión nuevamente."
      );

      window.location.href = "/login";

      return Promise.reject(error);
    }

    if (status === 403) {
      await mostrarAlertaGlobal(
        "error",
        "Acceso denegado",
        "No tienes permisos para realizar esta acción."
      );

      return Promise.reject(error);
    }

    if (status === 404) {
      await mostrarAlertaGlobal(
        "warning",
        "No encontrado",
        mensajeBackend || "El recurso solicitado no existe."
      );

      return Promise.reject(error);
    }

    if (status >= 500) {
      await mostrarAlertaGlobal(
        "error",
        "Error del servidor",
        mensajeBackend || "Ocurrió un error inesperado en el servidor."
      );

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

function obtenerMensajeBackend(error) {
  const data = error.response?.data;

  if (!data) {
    return "";
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.message) {
    return data.message;
  }

  if (data.mensaje) {
    return data.mensaje;
  }

  if (data.error) {
    return data.error;
  }

  return "";
}

async function mostrarAlertaGlobal(icon, title, text) {
  await Swal.fire({
    icon,
    title,
    text,
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#0f172a",
  });
}

export default api;