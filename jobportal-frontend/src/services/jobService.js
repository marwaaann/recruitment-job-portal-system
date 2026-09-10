import api from "./api";

// Jobs
export const getAllJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

export const getJobById = async (id) => {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
};

export const createJob = async (job) => {
  const res = await api.post("/jobs", job);
  return res.data;
};

export const updateJob = async (id, job) => {
  const res = await api.put(`/jobs/${id}`, job);
  return res.data;
};

export const closeJob = async (id) => {
  const res = await api.post(`/jobs/${id}/close`);
  return res.data;
};

export const assignPartner = async (jobId, partnerId) => {
  const res = await api.post(`/jobs/${jobId}/assign-partner`, { partnerId });
  return res.data;
};

export const getJobsForPartner = async (partnerId) => {
  const res = await api.get(`/jobs/partner/${partnerId}`);
  return res.data;
};

// Job Applications & Pipeline
export const applyJob = async (jobId, candidateId, partnerId = null) => {
  const url = partnerId
    ? `/jobs/${jobId}/applications?partnerId=${partnerId}`
    : `/jobs/${jobId}/applications`;
  const res = await api.post(url, { candidateId });
  return res.data;
};

export const getJobApplications = async (jobId) => {
  const res = await api.get(`/jobs/${jobId}/applications`);
  return res.data;
};

export const getApplicationById = async (applicationId) => {
  const res = await api.get(`/jobs/applications/${applicationId}`);
  return res.data;
};

export const getApplicationsByCandidate = async (candidateId) => {
  const res = await api.get(`/jobs/candidate/${candidateId}/applications`);
  return res.data;
};

export const getApplicationsByPartner = async (partnerId) => {
  const res = await api.get(`/jobs/partner/${partnerId}/applications`);
  return res.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const res = await api.put(`/jobs/applications/${applicationId}/status`, {
    status,
  });
  return res.data;
};