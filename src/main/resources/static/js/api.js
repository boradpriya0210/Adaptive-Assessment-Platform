// API Base URL (use relative path so it works when deployed or on different ports)
const API_BASE_URL = '/api';

// API Helper Functions
const api = {
    // Helper function to get auth token
    getToken() {
        return localStorage.getItem('token');
    },

    // Helper function to get headers
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    },

    // Generic POST request
    async post(endpoint, data, includeAuth = false) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(includeAuth),
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Request failed');
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Generic GET request
    async get(endpoint, includeAuth = false) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders(includeAuth)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Request failed');
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth endpoints
    async register(userData) {
        return this.post('/auth/register', userData);
    },

    async login(credentials) {
        return this.post('/auth/login', credentials);
    },

    // Test endpoints
    async startTest() {
        return this.post('/test/start', {}, true);
    },

    async submitAnswer(answerData) {
        return this.post('/test/submit-answer', answerData, true);
    },

    // Result endpoints
    async getResult(testId) {
        return this.get(`/result/${testId}`, true);
    },

    // Performance endpoints
    async getPerformance() {
        return this.get('/performance', true);
    }
};

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
