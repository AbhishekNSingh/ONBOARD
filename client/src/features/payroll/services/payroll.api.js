import api from "../../shared/services/axiosInstance";

const get = async (url, month) => (await api.get(url, { params: { month } })).data;

// employee side
export const getMySummary = (month) => get("/salaries/my", month);
export const getMyBonuses = (month) => get("/bonuses/my", month);
export const getMyAdvances = (month) => get("/advances/my", month);
export const getMyPayments = (month) => get("/payments/my", month);

// manager side
export const getEmployeeSummary = (id, month) => get(`/salaries/employee/${id}`, month);
export const getEmployeePayments = (id, month) => get(`/payments/employee/${id}`, month);

export const postBonus = async (body) => (await api.post("/bonuses", body)).data;
export const postAdvance = async (body) => (await api.post("/advances", body)).data;
export const postPayment = async (body) => (await api.post("/payments", body)).data;