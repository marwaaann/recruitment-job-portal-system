import api from "./api";

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

export const assignPartnerToJob = async (jobId, partnerId) => {
    const res = await api.post(`/jobs/${jobId}/assign-partner`, { partnerId: Number(partnerId) });
    return res.data;
};

export const getApplicationsByJob = async (jobId) => {
    const res = await api.get(`/jobs/${jobId}/applications`);
    return res.data;
};