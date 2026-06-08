let allCommandes = []; // Stockage local pour faciliter le filtrage

document.addEventListener('DOMContentLoaded', async () => {
    if (!sessionStorage.getItem('jwt_token')) {
        window.location.href = 'login.html';
        return;
    }

    // Écouteur pour le filtre
    document.getElementById('filterStatus').addEventListener('change', (e) => {
        renderTable(e.target.value);
    });

    await loadCommandes();
});

// 1. Récupération depuis l'API Next.js
async function loadCommandes() {
    try {
        const response = await api.fetchWithAuth('/commandes');
        if (response) {
            allCommandes = response; // Assurez-vous que l'API renvoie un tableau
            renderTable('Toutes');
        }
    } catch (error) {
        document.getElementById('commandesTableBody').innerHTML = 
            `<tr><td colspan="6" style="text-align: center; color: red;">Erreur lors du chargement.</td></tr>`;
    }
}

// 2. Affichage HTML dynamique
function renderTable(filterStatut) {
    const tbody = document.getElementById('commandesTableBody');
    tbody.innerHTML = '';

    const filteredCommandes = filterStatut === 'Toutes' 
        ? allCommandes 
        : allCommandes.filter(c => c.statut === filterStatut);

    if (filteredCommandes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Aucune commande trouvée.</td></tr>`;
        return;
    }

    filteredCommandes.forEach(commande => {
        const tr = document.createElement('tr');
        
        // Détermination de la classe du badge
        let badgeClass = 'badge-attente';
        if(commande.statut === 'En préparation') badgeClass = 'badge-preparation';
        if(commande.statut === 'Livrée') badgeClass = 'badge-livree';
        if(commande.statut === 'Annulée') badgeClass = 'badge-annulee';

        // Formatage sécurisé du prix
        const prix = commande.total ? Number(commande.total).toFixed(2) : "0.00";

        tr.innerHTML = `
            <td><strong>#${commande.id}</strong></td>
            <td>Chambre ${commande.chambre || 'N/A'}</td>
            <td>${new Date(commande.date).toLocaleString('fr-FR')}</td>
            <td>${prix} €</td>
            <td><span class="badge ${badgeClass}">${commande.statut}</span></td>
            <td>
                <select class="status-select" onchange="updateStatut(${commande.id}, this.value)">
                    <option value="" disabled selected>Changer...</option>
                    <option value="En attente">En attente</option>
                    <option value="En préparation">En préparation</option>
                    <option value="Livrée">Livrée</option>
                    <option value="Annulée">Annuler</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. Mise à jour via l'API Next.js
async function updateStatut(commandeId, nouveauStatut) {
    try {
        const response = await api.fetchWithAuth(`/commandes/${commandeId}/statut`, {
            method: 'PUT', // ou PATCH selon votre route Next.js
            body: JSON.stringify({ statut: nouveauStatut })
        });

        if (response) {
            // Recharger les données pour rafraîchir l'interface
            await loadCommandes();
            // Remettre le filtre dans l'état où il était
            const currentFilter = document.getElementById('filterStatus').value;
            renderTable(currentFilter);
        }
    } catch (error) {
        alert("Erreur lors de la mise à jour du statut.");
    }
}