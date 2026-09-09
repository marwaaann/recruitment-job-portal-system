import api from "./api";

export const getAllAdmins = async () => {
  const res = await api.get("/admins");
  return res.data;
};

export const getAdminById = async (id) => {
  const res = await api.get(`/admins/${id}`);
  return res.data;
};

export const createAdmin = async (data) => {
  const res = await api.post("/admins", data);
  return res.data;
};

export const updateAdmin = async (id, data) => {
  const res = await api.put(`/admins/${id}`, data);
  return res.data;
};

export const deleteAdmin = async (id) => {
  const res = await api.delete(`/admins/${id}`);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/admins/profile");
  return res.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const res = await api.put("/admins/change-password", {
    oldPassword,
    newPassword,
  });
  return res.data;
};