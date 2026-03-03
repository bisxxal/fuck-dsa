'use server'

export const getCollageName =async ()=>{
    // lib/collegeApi.js
    const BASE_URL = 'https://colleges-api.onrender.com';

      const searchColleges = async (query, page = 1, limit = 10) => {
    const response = await fetch(
        `${BASE_URL}/colleges?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    return await response.json();
    };

      const getCollegesByState = async (state, page = 1, limit = 10) => {
    const response = await fetch(
        `${BASE_URL}/colleges/${encodeURIComponent(state)}?page=${page}&limit=${limit}`
    );
    return await response.json();
    };

      const getAllStates = async () => {
    const response = await fetch(`${BASE_URL}/colleges/states`);
    return await response.json();
    };
}

// lib/collegeApi.js
const BASE_URL = 'https://colleges-api.onrender.com';

export const searchColleges = async (query, page = 1, limit = 10) => {
  const response = await fetch(
    `${BASE_URL}/colleges?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );
  return await response.json();
};

export const getCollegesByState = async (state, page = 1, limit = 10) => {
  const response = await fetch(
    `${BASE_URL}/colleges/${encodeURIComponent(state)}?page=${page}&limit=${limit}`
  );
  return await response.json();
};

export const getAllStates = async () => {
  const response = await fetch(`${BASE_URL}/colleges/states`);
  return await response.json();
};