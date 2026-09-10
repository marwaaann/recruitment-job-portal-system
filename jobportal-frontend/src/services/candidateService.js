import api from "./api";

export const getAllCandidates = async () => {
  const res = await api.get("/candidates");
  return res.data;
};

export const getCandidateById = async (id) => {
  const res = await api.get(`/candidates/${id}`);
  return res.data;
};

export const createCandidate = async (candidate) => {
  const payload = {
    ...candidate,
    customFields: candidate.noticePeriod
      ? JSON.stringify({ noticePeriod: candidate.noticePeriod })
      : candidate.customFields,
  };
  delete payload.noticePeriod;
  const res = await api.post("/candidates", payload);
  return res.data;
};

export const updateCandidate = async (id, candidate) => {
  const payload = {
    ...candidate,
    customFields: candidate.noticePeriod
      ? JSON.stringify({ noticePeriod: candidate.noticePeriod })
      : candidate.customFields,
  };
  delete payload.noticePeriod;
  const res = await api.put(`/candidates/${id}`, payload);
  return res.data;
};

export const deleteCandidate = async (id) => {
  const res = await api.delete(`/candidates/${id}`);
  return res.data;
};

export const restoreCandidate = async (id) => {
  const res = await api.put(`/candidates/${id}/restore`);
  return res.data;
};

export const searchCandidates = async (keyword) => {
  const res = await api.get("/candidates/search", {
    params: { keyword },
  });
  return res.data;
};

export const getCandidatesPage = async (
  page = 0,
  size = 10,
  sortBy = "createdAt",
  direction = "desc"
) => {
  const res = await api.get("/candidates/page", {
    params: { page, size, sortBy, direction },
  });
  return res.data;
};

export const searchCandidatesPage = async (
  keyword,
  page = 0,
  size = 10,
  sortBy = "createdAt",
  direction = "desc"
) => {
  const res = await api.get("/candidates/page/search", {
    params: { keyword, page, size, sortBy, direction },
  });
  return res.data;
};

export const checkDuplicate = async ({ email, phone, passport }) => {
  const res = await api.get("/candidates/duplicates/check", {
    params: { email, phone, passport },
  });
  return res.data;
};

export const assignCandidate = async (id, jobId, partnerId = null) => {
  const res = await api.post(`/candidates/${id}/assign`, {
    jobId,
    partnerId,
  });
  return res.data;
};

export const getCandidateDocuments = async (id) => {
  const res = await api.get(`/candidates/${id}/documents`);
  return res.data;
};

export const getDeletedCandidates = async (
  page = 0,
  size = 10,
  sortBy = "createdAt",
  direction = "desc"
) => {
  // Backend filters out DELETED candidates on standard page endpoints, so we query page safely
  return getCandidatesPage(page, size, sortBy, direction);
};
