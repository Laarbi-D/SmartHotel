const API_URL = "/api"; // Nginx fera le pont automatiquement 
const IOT_URL = "/api-iot"; // api iot

const api = {
    async fetchWithAuth(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
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
                localStorage.removeItem('token');
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