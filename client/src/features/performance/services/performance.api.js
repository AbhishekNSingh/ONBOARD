import api from "../../shared/services/axiosInstance";

export const postRating = async (body) =>
  (await api.post("/performances", body)).data;

export const getMyRatings = async () => (await api.get("/performances/my")).data;