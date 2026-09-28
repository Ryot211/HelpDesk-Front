import Swal from "sweetalert2";

// El color (fondo, texto, botones) lo definen las clases swal-* en index.css,
// con los mismos tokens de DESIGN.md que usa el resto de la app — así el
// diálogo respeta el modo oscuro automáticamente en vez de pelear con los
// estilos inline por defecto de SweetAlert2.
const crearConfigBase = () => ({
  customClass: {
    confirmButton: "swal-confirm-button",
    cancelButton: "swal-cancel-button",
    popup: "swal-popup",
    title: "swal-title",
    htmlContainer: "swal-text",
  },
  buttonsStyling: false,
});

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