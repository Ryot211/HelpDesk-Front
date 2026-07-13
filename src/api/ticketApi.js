import { Archive } from "lucide-react";
import api from "./axiosConfig";

export const listarTickets = () => {
  return api.post("/api/tickets/listar");
};

export const buscarTicket = (id) => {
  return api.post(`/api/tickets/buscar/${id}`);
};

export const crearTicket = (data) => {
  return api.post("/api/tickets/crear", data);
};

export const asignarTicket = (data) => {
  return api.post("/api/tickets/asignar", data);
};

export const cambiarEstadoTicket = (data) => {
  return api.post("/api/tickets/cambiar-estado", data);
};

export const cerrarTicket = (data) => {
  return api.post("/api/tickets/cerrar", data);
};

export const listarComentariosTicket = (ticketId) => {
  return api.post("/api/tickets/comentarios/listar", { ticketId });
};

export const agregarComentarioTicket = (data) => {
  return api.post("/api/tickets/comentarios/agregar", data);
};

export const listarAdjuntosTicket = (ticketId) => {
  return api.post(`/api/tickets/adjuntos/listar/${ ticketId }`);
};

export const registrarAdjuntoTicket = (data) => {
  return api.post("/api/tickets/adjuntos/registrar", data);
};

export const inactivarAdjuntoTicket = (ticketId) =>{
  return api.post(`/api/tickets/adjuntos/inactivar/${ticketId}`);
}

export const listarHistorialTicket = (id) => {
  return api.post("/api/tickets/historial/listar", { id });
};

export const subirAdjuntoTicket = (ticketId, archivo) => {
  const formData = new FormData();

  formData.append("ticketId", ticketId);
  formData.append("archivo", archivo);

  return api.post("/api/tickets/adjuntos/subir", formData);
};