const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');

  // If the server sends back JSON, parse it.
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'An unknown API error occurred.');
    }
    return data;
  }

  // If the server sends back something else (like an HTML error page), handle it gracefully.
  if (!response.ok) {
    throw new Error(`Server error: ${response.status} ${response.statusText}. Check the server logs and ensure the API endpoint exists.`);
  }

  // Handle successful but non-JSON responses
  return null;
};

const api = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  signup: async (email, password, first_name, last_name) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, first_name, last_name }),
    });
    return handleResponse(response);
  },

  confirmEmail: async (token) => {
    const response = await fetch(`${API_URL}/confirm-email/${token}`, {
      method: 'GET',
    });
    return handleResponse(response);
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  verifyCode: async (email, pin) => {
    const response = await fetch(`${API_URL}/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pin }),
    });
    return handleResponse(response);
  },

  resetPassword: async (pin, new_password) => {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, new_password }),
    });
    return handleResponse(response);
  },

  uploadEssay: async (token, title, file) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('essay', file);
    const response = await fetch(`${API_URL}/essays`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    return handleResponse(response);
  },

  createEssayFromText: async (token, title, content) => {
    const response = await fetch(`${API_URL}/essays/write`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });
    return handleResponse(response);
  },

  getSuggestions: async (token, content) => {
    const response = await fetch(`${API_URL}/essays/suggest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return handleResponse(response);
  },

  getUserEssays: async (token) => {
    const response = await fetch(`${API_URL}/essays`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  getEssayById: async (token, essay_id) => {
    const response = await fetch(`${API_URL}/essays/${essay_id}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  generateFeedback: async (token, essay_id) => {
    const response = await fetch(`${API_URL}/essays/${essay_id}/feedback`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  getEssayFeedback: async (token, essay_id) => {
    const response = await fetch(`${API_URL}/essays/${essay_id}/feedback`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  getUserFeedback: async (token) => {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  deleteEssay: async (token, essay_id) => {
    const response = await fetch(`${API_URL}/essays/${essay_id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  updateEssayTitle: async (token, essay_id, title) => {
    const response = await fetch(`${API_URL}/essays/${essay_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    return handleResponse(response);
  },

  correctGrammar: async (token, text) => {
    const response = await fetch(`${API_URL}/essays/correct-grammar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    return handleResponse(response);
  },

  chatWithEssay: async (token, essay_id, question) => {
    const response = await fetch(`${API_URL}/essays/${essay_id}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });
    return handleResponse(response);
  },
};

export default api;