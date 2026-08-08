import api from "./api";

// Get All Partners
export const getAllPartners = async () => {
  const res = await api.get("/partners");
  return res.data;
};

// Get Partner By ID
export const getPartnerById = async (id) => {
  const res = await api.get(`/partners/${id}`);
  return res.data;
};

// Create Partner
export const createPartner = async (partner) => {
  const res = await api.post("/partners", partner);
  return res.data;
};

// Update Partner
export const updatePartner = async (id, partner) => {
  const res = await api.put(`/partners/${id}`, partner);
  return res.data;
};

// Delete Partner
export const deletePartner = async (id) => {
  const res = await api.delete(`/partners/${id}`);
  return res.data;
};

// Block Partner
export const blockPartner = async (id) => {
  const res = await api.post(`/partners/${id}/block`);
  return res.data;
};