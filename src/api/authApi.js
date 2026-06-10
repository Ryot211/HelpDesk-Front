import api from "./axiosConfig";

export const login = (data) => {
  return api.post("/api/auth/login", data);
};