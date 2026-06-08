const API_URL = "http://localhost:3000/api";
const IOT_URL = "http://localhost/api-iot"; // Pour le PHP

const api = {
    async fetchWithAuth(endpoint, options = {}) {
        const token = sessionStorage.getItem('jwt_token');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (response.status === 401) {
                // Token expiré ou invalide
                sessionStorage.removeItem('jwt_token');
                window.location.href = 'login.html';
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
};