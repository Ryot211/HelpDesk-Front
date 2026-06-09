import api from "./axiosConfig";

export const listarUsuarios = () => {
  return api.post("/api/usuarios/listar");
};

export const listarTodosUsuarios = () => {
  return api.post("/api/usuarios/listar-todos");
};

export const buscarUsuario = (id) => {
  return api.post(`/api/usuarios/buscar/${id}`);
};

export const crearUsuario = (data) => {
  return api.post("/api/usuarios/crear", data);
};

export const actualizarUsuario = (data) => {
  return api.post("/api/usuarios/actualizar", data);
};

export const inactivarUsuario = (id) => {
  return api.post("/api/usuarios/inactivar", { id });
};

export const cambiarPasswordUsuario = (data) => {
  return api.post("/api/usuarios/cambiar-password", data);
};