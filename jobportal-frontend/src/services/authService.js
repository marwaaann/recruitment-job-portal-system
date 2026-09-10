import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const register = async (fullName, email, password, role = "PARTNER") => {
  const response = await api.post("/auth/register", {
    fullName,
    email,
    password,
    role,
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
};

export const logout = async (refreshToken = "") => {
  const response = await api.post("/auth/logout", { refreshToken });
  return response.data;
};

export const refresh = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};