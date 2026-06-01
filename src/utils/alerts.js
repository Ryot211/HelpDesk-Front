import Swal from "sweetalert2";

export const mostrarExito = (mensaje, titulo = "Operación exitosa") => {
  return Swal.fire({
    icon: "success",
    title: titulo,
    text: mensaje,
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#0f172a",
  });
};

export const mostrarError = (mensaje, titulo = "Ocurrió un error") => {
  return Swal.fire({
    icon: "error",
    title: titulo,
    text: mensaje,
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#0f172a",
  });
};

export const mostrarAdvertencia = (mensaje, titulo = "Atención") => {
  return Swal.fire({
    icon: "warning",
    title: titulo,
    text: mensaje,
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#0f172a",
  });
};

export const confirmarAccion = async (
  mensaje,
  titulo = "¿Estás seguro?"
) => {
  const resultado = await Swal.fire({
    icon: "warning",
    title: titulo,
    text: mensaje,
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#0f172a",
    cancelButtonColor: "#64748b",
  });

  return resultado.isConfirmed;
};