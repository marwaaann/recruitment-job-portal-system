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
        customFields: JSON.stringify({
            noticePeriod: candidate.noticePeriod,
        }),
    };

    delete payload.noticePeriod;

    const res = await api.post("/candidates", payload);

    return res.data;
};

export const updateCandidate = async (id, candidate) => {
    const res = await api.put(`/candidates/${id}`, candidate);
    return res.data;
};

export const deleteCandidate = async (id) => {
    const res = await api.delete(`/candidates/${id}`);
    return res.data;
};

//search 
export const searchCandidates = async (keyword) => {

    const res = await api.get("/candidates/search", {
        params: {
            keyword,
        },
    });

    return res.data;
};

// Pagination
export const getCandidatesPage = async (

    page = 0,

    size = 10,

    sortBy = "createdAt",

    direction = "desc"

) => {

    const res = await api.get("/candidates/page", {

        params: {

            page,

            size,

            sortBy,

            direction

        }

    });

    return res.data;

};

// Search + Pagination
export const searchCandidatesPage = async (

    keyword,

    page = 0,

    size = 10,

    sortBy = "createdAt",

    direction = "desc"

) => {

    const res = await api.get(

        "/candidates/page/search",

        {

            params: {

                keyword,

                page,

                size,

                sortBy,

                direction

            }

        }

    );

    return res.data;

};





export const getDeletedCandidates = async (
    page = 0,
    size = 10,
    sortBy = "createdAt",
    direction = "desc"
) => {

    const res = await api.get("/candidates/deleted", {
        params: {
            page,
            size,
            sortBy,
            direction
        }
    });

    return res.data;
};

export const restoreCandidate = async (id) => {

    const res = await api.put(
        `/candidates/${id}/restore`
    );

    return res.data;
};