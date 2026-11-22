const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.port === '3000'
    ? 'http://localhost:5001/api'
    : '/api');

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

export const api = {
  // Auth
  async register(name, email, password, role = 'student') {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    return handleResponse(res);
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Questions
  async getTestQuestions() {
    const res = await fetch(`${API_BASE}/questions/test`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getAllQuestions() {
    const res = await fetch(`${API_BASE}/questions`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createQuestion(questionData) {
    const res = await fetch(`${API_BASE}/questions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(questionData),
    });
    return handleResponse(res);
  },

  async deleteQuestion(id) {
    const res = await fetch(`${API_BASE}/questions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Test Execution & History
  async submitTest(answers, timeSpentSeconds) {
    const res = await fetch(`${API_BASE}/test/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ answers, timeSpentSeconds }),
    });
    return handleResponse(res);
  },

  async getHistory() {
    const res = await fetch(`${API_BASE}/test/history`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getAttempt(id) {
    const res = await fetch(`${API_BASE}/test/attempt/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

