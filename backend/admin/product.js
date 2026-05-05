// ============================================================
//  DONNÉES PRODUITS (Synchronisées avec la BDD via PHP)
// ============================================================
// On récupère dbProducts injecté dans le HTML, sinon tableau vide
let products = typeof dbProducts !== 'undefined' ? dbProducts : [];

let currentCategory = 'all';
let searchQuery = '';

// ============================================================
//  RENDU DES CARTES (Style Site Client & Taille Fixe)
// ============================================================
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  // Filtrage par catégorie et recherche
  let filtered = products.filter((p) => {
    const matchCat = currentCategory === 'all' || p.CATEGORIE === currentCategory;
    const matchSearch = p.LIBELLE_PRODUIT.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:#aaa; font-size:0.9rem; padding: 20px; text-align:center; grid-column: 1/-1;">Aucun produit trouvé.</p>';
    return;
  }

  grid.innerHTML = '';
  filtered.forEach((p) => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    
    // Utilisation des classes CSS pour le redimensionnement d'image (product-image-container + product-img-fixed)
    card.innerHTML = `
      <div class="product-image-container">
          <img src="${p.IMAGE_PRODUIT}" alt="${p.LIBELLE_PRODUIT}" class="product-img-fixed">
      </div>
      <div class="product-info">
        <div class="product-header">
          <div class="product-card__name">${p.LIBELLE_PRODUIT}</div>
          <span class="product-card__price">${parseFloat(p.PRIX_PRODUIT).toFixed(2)} €</span>
        </div>
        <div class="product-card__desc">${p.BIO}</div>
        
        <div class="product-card__footer">
          <span class="product-card__category category--${p.CATEGORIE.replace(/\s+/g, '-')}">
            ${p.CATEGORIE}
          </span>
          <span class="product-card__stock">Stock : <strong>${p.STOCK}</strong></span>
        </div>
        
        <div class="product-card__actions">
          <button class="btn-edit" data-id="${p.ID_PRODUIT}">Edit</button>
          <button class="btn-delete" data-id="${p.ID_PRODUIT}">Delete</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ============================================================
//  TABS CATÉGORIES
// ============================================================
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category; // 'soft drinks', 'cocktails', etc.
    renderProducts();
  });
});

// ============================================================
//  BARRE DE RECHERCHE
// ============================================================
const productSearch = document.getElementById('product-search');
if (productSearch) {
  productSearch.addEventListener('input', () => {
    searchQuery = productSearch.value;
    renderProducts();
  });
}

// ============================================================
//  MODAL (AJOUT / ÉDITION)
// ============================================================
const modal        = document.getElementById('product-modal');
const modalTitle   = document.getElementById('modal-title');
const inputName    = document.getElementById('input-name');
const inputCat     = document.getElementById('input-category');
const inputPrice   = document.getElementById('input-price');
const inputStock   = document.getElementById('input-stock');
const inputDesc    = document.getElementById('input-desc');
const editId       = document.getElementById('edit-id');

function openModal(product = null) {
  if (!modal) return;
  modal.classList.remove('hidden');
  
  if (product) {
    modalTitle.textContent = 'Edit Product';
    editId.value       = product.ID_PRODUIT;
    inputName.value    = product.LIBELLE_PRODUIT;
    inputCat.value     = product.CATEGORIE;
    inputPrice.value   = product.PRIX_PRODUIT;
    inputStock.value   = product.STOCK;
    inputDesc.value    = product.BIO;
  } else {
    modalTitle.textContent = 'Add Product';
    editId.value = '';
    inputName.value = '';
    inputCat.value  = 'soft drinks';
    inputPrice.value = '';
    inputStock.value = '';
    inputDesc.value  = '';
  }
}

function closeModal() {
  if (modal) modal.classList.add('hidden');
}

// Listeners pour l'interface de la Modal
const btnAdd = document.getElementById('btn-add-product');
if(btnAdd) btnAdd.addEventListener('click', () => openModal());

const btnClose = document.getElementById('modal-close');
if(btnClose) btnClose.addEventListener('click', closeModal);

const btnCancel = document.getElementById('modal-cancel');
if(btnCancel) btnCancel.addEventListener('click', closeModal);

// ============================================================
//  ACTIONS SUR LES CARTES (DÉLÉGATION D'ÉVÉNEMENTS)
// ============================================================
const productGrid = document.getElementById('products-grid');
if (productGrid) {
    productGrid.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      if (!id) return;

      // Suppression (Visuelle pour l'instant)
      if (e.target.classList.contains('btn-delete')) {
        if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
          products = products.filter((p) => p.ID_PRODUIT !== id);
          renderProducts();
        }
      }

      // Édition
      if (e.target.classList.contains('btn-edit')) {
        const product = products.find((p) => p.ID_PRODUIT === id);
        if (product) openModal(product);
      }
    });
}

// Initialisation au chargement de la page
renderProducts();