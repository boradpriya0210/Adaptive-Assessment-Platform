const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const buildUrl = (endpoint) => {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${BASE_URL}${path}`;
};

export const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            Accept: 'application/json',
            ...(options.headers || {}),
        };

        const config = {
            ...options,
            headers,
        };

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (options.body && !(options.body instanceof FormData)) {
            config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }

        try {
            const response = await fetch(buildUrl(endpoint), config);
            if (response.status === 204) {
                return { success: true, message: 'No content', data: null };
            }

            const contentType = response.headers.get('content-type') || '';
            const text = await response.text();
            const data = contentType.includes('application/json') && text ? JSON.parse(text) : null;

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
                        window.location.href = 'login.html';
                    }
                }
                throw new Error(data?.message || text || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body });
    },

    put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};
