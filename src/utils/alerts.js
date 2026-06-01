import Swal from "sweetalert2";

const obtenerConfigTema = () => {
  const modoOscuro = document.documentElement.classList.contains("dark");

  if (modoOscuro) {
    return {
      background: "#0f172a",
      color: "#f8fafc",
      confirmButtonColor: "#f8fafc",
      cancelButtonColor: "#475569",
      confirmButtonTextColor: "#0f172a",
    };
  }

  return {
    background: "#ffffff",
    color: "#0f172a",
    confirmButtonColor: "#0f172a",
    cancelButtonColor: "#64748b",
    confirmButtonTextColor: "#ffffff",
  };
};

const crearConfigBase = () => {
  const tema = obtenerConfigTema();

  return {
    background: tema.background,
    color: tema.color,
    confirmButtonColor: tema.confirmButtonColor,
    cancelButtonColor: tema.cancelButtonColor,
    customClass: {
      confirmButton: "swal-confirm-button",
      cancelButton: "swal-cancel-button",
      popup: "swal-popup",
      title: "swal-title",
      htmlContainer: "swal-text",
    },
  };
};

export const mostrarExito = (mensaje, titulo = "Operación exitosa") => {
  return Swal.fire({
    ...crearConfigBase(),
    icon: "success",
    title: titulo,
    text: mensaje,
    confirmButtonText: "Aceptar",
  });
};

export const mostrarError = (mensaje, titulo = "Ocurrió un error") => {
  return Swal.fire({
    ...crearConfigBase(),
    icon: "error",
    title: titulo,
    text: mensaje,
    confirmButtonText: "Aceptar",
  });
};

export const mostrarAdvertencia = (mensaje, titulo = "Atención") => {
  return Swal.fire({
    ...crearConfigBase(),
    icon: "warning",
    title: titulo,
    text: mensaje,
    confirmButtonText: "Aceptar",
  });
};

export const confirmarAccion = async (
  mensaje,
  titulo = "¿Estás seguro?"
) => {
  const resultado = await Swal.fire({
    ...crearConfigBase(),
    icon: "warning",
    title: titulo,
    text: mensaje,
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  });

  return resultado.isConfirmed;
};