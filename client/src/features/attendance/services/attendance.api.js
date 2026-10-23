import api from "../../shared/services/axiosInstance";

export const getTeam = async () => (await api.get("/attendance/team")).data;

export const postAttendance = async (body) =>
  (await api.post("/attendance/mark", body)).data;

export const getMyRecords = async () => (await api.get("/attendance/my")).data;

export const getEmployeeRecords = async (id, month) =>
  (await api.get(`/attendance/employee/${id}`, { params: { month } })).data;