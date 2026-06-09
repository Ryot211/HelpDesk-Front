import api from "./axiosConfig";

export const listarRoles = () => {
  return api.post("/api/roles/listar");
};