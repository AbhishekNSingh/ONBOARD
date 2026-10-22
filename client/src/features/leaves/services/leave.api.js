import api from "../../shared/services/axiosInstance";

export const getMyLeaves = async () => {
  const response = await api.get("/leaves/my");
  return response.data;
};

export const createLeave = async (leaveData) => {
  const response = await api.post("/leaves", leaveData);
  return response.data;
};