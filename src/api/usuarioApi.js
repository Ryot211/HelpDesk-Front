import api from "./axiosConfig";

export const listarUsuarios = () => {
  return api.post("/api/usuarios/listar");
};


export const crearUsuario = (data) => {
  return api.post("/api/usuarios/crear", data);
};