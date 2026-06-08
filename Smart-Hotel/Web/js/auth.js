document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', { // Redirection via Nginx
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            // Stocker le token si votre API en renvoie un
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert('Erreur de connexion : identifiants incorrects');
        }
    } catch (error) {
        console.error('Erreur API :', error);
        alert('Impossible de joindre le serveur.');
    }
});