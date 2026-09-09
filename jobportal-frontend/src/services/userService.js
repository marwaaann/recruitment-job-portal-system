import api from "./api";

export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const activateUser = async (id) => {
  const res = await api.patch(`/users/${id}/activate`);
  return res.data;
};