import api from "./api";

export const getAllClients = async () => {
  const res = await api.get("/clients");
  return res.data;
};

export const getClientById = async (id) => {
  const res = await api.get(`/clients/${id}`);
  return res.data;
};

export const createClient = async (client) => {
  const res = await api.post("/clients", client);
  return res.data;
};

export const updateClient = async (id, client) => {
  const res = await api.put(`/clients/${id}`, client);
  return res.data;
};

export const deleteClient = async (id) => {
  const res = await api.delete(`/clients/${id}`);
  return res.data;
};

export const blockClient = async (id) => {
  const res = await api.post(`/clients/${id}/block`);
  return res.data;
};