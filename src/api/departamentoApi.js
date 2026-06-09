import api from "./axiosConfig";

export const listarDepartamentos = () => {
  return api.post("/api/departamentos/Listar");
};

export const guardarDepartamento = (data) => {
  return api.post("/api/departamentos/guardar", data);
};

export const inactivarDepartamento = (id) => {
  return api.post(`/api/departamentos/inactivar/${ id }`);
};