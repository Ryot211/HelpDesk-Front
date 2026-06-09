import api from "./axiosConfig";

export const listarCategoriasTicket = () => {
  return api.post("/api/categorias-ticket/listar");
};

export const guardarCategoriaTicket = (data) => {
  return api.post("/api/categorias-ticket/guardar", data);
};

export const inactivarCategoriaTicket = (id) => {
  return api.post("/api/categorias-ticket/inactivar", { id });
};