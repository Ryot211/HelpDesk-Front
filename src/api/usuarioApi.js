import api from "./axiosConfig";

export const listarUsuarios = () => {
  return api.post("/api/usuarios/listar");
};