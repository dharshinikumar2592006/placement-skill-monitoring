import axios from 'axios';

// Create a reusable Axios instance configured with backend base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Response interceptor to format errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract informative error message from backend response if available
    const customMessage =
      error.response?.data?.message ||
      (error.message === 'Network Error'
        ? 'Cannot connect to backend server. Please verify backend is running on port 5000.'
        : error.message);
    return Promise.reject(new Error(customMessage));
  }
);

/**
 * Fetch all students with optional search and filters
 * @param {Object} params - { search, department, readiness }
 */
export const getStudents = async (params = {}) => {
  const response = await api.get('/students', { params });
  return response.data;
};

/**
 * Fetch a single student by MongoDB ID
 * @param {string} id - Student document ID
 */
export const getStudentById = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

/**
 * Create a new student skill record
 * @param {Object} studentData
 */
export const createStudent = async (studentData) => {
  const response = await api.post('/students', studentData);
  return response.data;
};

/**
 * Update an existing student record
 * @param {string} id
 * @param {Object} studentData
 */
export const updateStudent = async (id, studentData) => {
  const response = await api.put(`/students/${id}`, studentData);
  return response.data;
};

/**
 * Delete a student record
 * @param {string} id
 */
export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};

/**
 * Health check endpoint
 */
export const checkBackendHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
