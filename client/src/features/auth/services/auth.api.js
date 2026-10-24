import api from "../../shared/services/axiosInstance";

export const registerUser = async (formData) => {
  const response = await api.post("/auth/register", formData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const googleLoginUser = async (credential) => {
  const response = await api.post("/auth/google", { credential });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};