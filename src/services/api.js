const API_URL = 'http://localhost:5000/api';

const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Ошибка запроса');
    }
    
    return data;
};

export const authAPI = {
    register: (userData) => fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    
    login: (credentials) => fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    
    verifyToken: () => fetchWithAuth('/auth/verify')
};

export const transactionsAPI = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return fetchWithAuth(`/transactions${params ? `?${params}` : ''}`);
    },
    create: (data) => fetchWithAuth('/transactions', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchWithAuth(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchWithAuth(`/transactions/${id}`, {
        method: 'DELETE'
    })
};

export const categoriesAPI = {
    getAll: (type) => fetchWithAuth(`/categories?type=${type}`),
    create: (type, data) => fetchWithAuth('/categories', {
        method: 'POST',
        body: JSON.stringify({ type, ...data })
    }),
    update: (id, data) => fetchWithAuth(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchWithAuth(`/categories/${id}`, {
        method: 'DELETE'
    })
};

export const budgetsAPI = {
    getAll: (month, year) => fetchWithAuth(`/budgets?month=${month}&year=${year}`),
    create: (data) => fetchWithAuth('/budgets', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchWithAuth(`/budgets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchWithAuth(`/budgets/${id}`, {
        method: 'DELETE'
    })
};

export const notesAPI = {
    getAll: () => fetchWithAuth('/notes'),
    create: (data) => fetchWithAuth('/notes', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchWithAuth(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchWithAuth(`/notes/${id}`, {
        method: 'DELETE'
    })
};

export const goalsAPI = {
    getAll: () => fetchWithAuth('/goals'),
    create: (data) => fetchWithAuth('/goals', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchWithAuth(`/goals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchWithAuth(`/goals/${id}`, {
        method: 'DELETE'
    })
};

export const settingsAPI = {
    get: () => fetchWithAuth('/settings'),
    update: (data) => fetchWithAuth('/settings', {
        method: 'PUT',
        body: JSON.stringify(data)
    })
};

export const profileAPI = {
    update: (data) => fetchWithAuth('/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    })
};