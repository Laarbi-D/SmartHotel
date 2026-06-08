let allProduits = [];
const modal = document.getElementById('productModal');
const form = document.getElementById('productForm');

document.addEventListener('DOMContentLoaded', async () => {
    if (!sessionStorage.getItem('jwt_token')) {
        window.location.href = 'login.html';
        return;
    }

    // Écouteurs pour la modale
    document.getElementById('openAddModalBtn').addEventListener('click', () => openModal());
    document.getElementById('closeModalBtn').addEventListener('click', () => modal.close());
    form.addEventListener('submit', handleFormSubmit);

    await loadProduits();
});

// 1. Récupération et Affichage
async function loadProduits() {
    try {
        allProduits = await api.fetchWithAuth('/produits');
        renderGrid();
    } catch (error) {
        document.getElementById('productGrid').innerHTML = `<p style="color: red;">Erreur de chargement.</p>`;
    }
}

function renderGrid() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if (!allProduits || allProduits.length === 0) {
        grid.innerHTML = `<p>Aucun produit disponible.</p>`;
        return;
    }

    allProduits.forEach(produit => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Gestion de l'image (repli sur une image par défaut si non spécifiée)
        const imgSrc = produit.image ? `assets/images/${produit.image}` : `assets/images/default.jpg`;
        const prixStr = Number(produit.prix).toFixed(2);

        card.innerHTML = `
            <img src="${imgSrc}" alt="${produit.nom}" class="product-image" onerror="this.src='assets/images/placeholder.png'">
            <div class="product-info">
                <h3 class="product-title">${produit.nom}</h3>
                <p class="product-price">${prixStr} €</p>
                <div class="product-actions">
                    <button onclick="editProduit(${produit.id})" style="flex: 1; padding: 0.5rem; background: var(--bg-off-white); border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">Modifier</button>
                    <button onclick="deleteProduit(${produit.id})" style="flex: 1; padding: 0.5rem; background: #FDEDEC; color: #E74C3C; border: 1px solid #F5B7B1; border-radius: 4px; cursor: pointer;">Supprimer</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 2. Gestion de la Modale (Ajout / Modification)
function openModal(produit = null) {
    const title = document.getElementById('modalTitle');
    
    if (produit) {
        // Mode modification
        title.textContent = "Modifier le produit";
        document.getElementById('produitId').value = produit.id;
        document.getElementById('nom').value = produit.nom;
        document.getElementById('prix').value = produit.prix;
        document.getElementById('image').value = produit.image || '';
    } else {
        // Mode ajout
        title.textContent = "Ajouter un produit";
        form.reset();
        document.getElementById('produitId').value = '';
    }
    
    modal.showModal(); // API native HTML5
}

function editProduit(id) {
    const produit = allProduits.find(p => p.id === id);
    if (produit) openModal(produit);
}

// 3. Soumission du formulaire (POST ou PUT)
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('produitId').value;
    const data = {
        nom: document.getElementById('nom').value,
        prix: parseFloat(document.getElementById('prix').value),
        image: document.getElementById('image').value
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const endpoint = id ? `/produits/${id}` : '/produits';

        await api.fetchWithAuth(endpoint, {
            method: method,
            body: JSON.stringify(data)
        });

        modal.close();
        await loadProduits(); // Recharger la grille après mise à jour
    } catch (error) {
        alert("Erreur lors de la sauvegarde.");
    }
}

// 4. Suppression
async function deleteProduit(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        try {
            await api.fetchWithAuth(`/produits/${id}`, { method: 'DELETE' });
            await loadProduits();
        } catch (error) {
            alert("Erreur lors de la suppression.");
        }
    }
}