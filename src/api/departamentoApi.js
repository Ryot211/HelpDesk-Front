import api from "./axiosConfig";

export const listarDepartamentos = () => {
  return api.post("/api/departamentos/Listar");
};