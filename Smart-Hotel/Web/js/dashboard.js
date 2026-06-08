document.addEventListener('DOMContentLoaded', async () => {
    // 1. Vérification rapide du token avant même de charger les données
    if (!sessionStorage.getItem('jwt_token')) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Gestion de la déconnexion
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('jwt_token');
        window.location.href = 'login.html';
    });

    // 3. Chargement des données via l'API Next.js existante
    await loadDashboardStats();
});

async function loadDashboardStats() {
    try {
        // Remplacer '/commandes/stats' par la route exacte de votre API Next.js
        const stats = await api.fetchWithAuth('/commandes/stats'); 
        
        if (stats) {
            // Mise à jour dynamique du DOM HTML
            document.getElementById('kpi-attente').textContent = stats.enAttente || 0;
            document.getElementById('kpi-preparation').textContent = stats.enPreparation || 0;
            document.getElementById('kpi-livree').textContent = stats.livreesJour || 0;
            
            // Formatage sécurisé du prix (évite les erreurs undefined.toFixed)
            const chiffreAffaire = stats.chiffreJour ? Number(stats.chiffreJour) : 0;
            document.getElementById('kpi-ca').textContent = `${chiffreAffaire.toFixed(2)} €`;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        // Optionnel : Afficher un message d'erreur visuel dans une div toast/alert
    }
}