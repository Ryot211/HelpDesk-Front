import api from "./axiosConfig";

export const listarCategoriasTicket = () => {
  return api.post("/api/categorias-ticket/listar");
};