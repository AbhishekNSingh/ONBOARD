import api from "../../shared/services/axiosInstance";

export const getDashboard = async (role) => {
  const response = await api.get(`/dashboard/${role}`);
  return response.data;
};