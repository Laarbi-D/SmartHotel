// ============================================================
//  DONNÉES PRODUITS
// ============================================================
let products = [
  { id: 1, name: "Mojito",          category: "alcoholic",     price: 9.50,  stock: 40, desc: "Rhum, menthe, citron vert", emoji: "🍹" },
  { id: 2, name: "Piña Colada",     category: "alcoholic",     price: 10.00, stock: 30, desc: "Rhum, noix de coco, ananas", emoji: "🥥" },
  { id: 3, name: "Sangria",         category: "alcoholic",     price: 7.50,  stock: 25, desc: "Vin rouge, fruits, épices",  emoji: "🍷" },
  { id: 4, name: "Bière locale",    category: "alcoholic",     price: 5.00,  stock: 80, desc: "Bière artisanale locale",   emoji: "🍺" },
  { id: 5, name: "Limonade",        category: "non-alcoholic", price: 3.50,  stock: 60, desc: "Citron frais, sucre, eau",  emoji: "🍋" },
  { id: 6, name: "Jus d'orange",    category: "non-alcoholic", price: 4.00,  stock: 55, desc: "100% pur jus pressé",       emoji: "🍊" },
  { id: 7, name: "Smoothie fruits", category: "non-alcoholic", price: 5.50,  stock: 35, desc: "Mangue, fraise, banane",    emoji: "🥤" },
  { id: 8, name: "Eau minérale",    category: "non-alcoholic", price: 2.00,  stock: 120, desc: "50cl, eau plate ou gazeuse", emoji: "💧" }
];

let nextId = 9;
let currentCategory = 'all';
let searchQuery = '';

// ============================================================
//  RENDU DES CARTES
// ============================================================
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let filtered = products.filter((p) => {
    const matchCat = currentCategory === 'all' || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:#aaa; font-size:0.9rem;">Aucun produit trouvé.</p>';
    return;
  }

  grid.innerHTML = '';
  filtered.forEach((p) => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <div class="product-card__emoji">${p.emoji}</div>
      <div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__desc">${p.desc}</div>
      </div>
      <span class="product-card__category category--${p.category}">
        ${p.category === 'alcoholic' ? 'Alcoholic' : 'Non-Alcoholic'}
      </span>
      <div class="product-card__footer">
        <span class="product-card__price">${p.price.toFixed(2)} €</span>
        <span class="product-card__stock">Stock : ${p.stock}</span>
      </div>
      <div class="product-card__actions">
        <button class="btn-edit" data-id="${p.id}">Edit</button>
        <button class="btn-delete" data-id="${p.id}">Delete</button>
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
    currentCategory = btn.dataset.category;
    renderProducts();
  });
});

// ============================================================
//  RECHERCHE
// ============================================================
const productSearch = document.getElementById('product-search');
if (productSearch) {
  productSearch.addEventListener('input', () => {
    searchQuery = productSearch.value;
    renderProducts();
  });
}

// ============================================================
//  MODAL
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
  modal.classList.remove('hidden');
  if (product) {
    modalTitle.textContent = 'Edit Product';
    editId.value       = product.id;
    inputName.value    = product.name;
    inputCat.value     = product.category;
    inputPrice.value   = product.price;
    inputStock.value   = product.stock;
    inputDesc.value    = product.desc;
  } else {
    modalTitle.textContent = 'Add Product';
    editId.value = '';
    inputName.value = '';
    inputCat.value  = 'alcoholic';
    inputPrice.value = '';
    inputStock.value = '';
    inputDesc.value  = '';
  }
}

function closeModal() {
  modal.classList.add('hidden');
}

document.getElementById('btn-add-product').addEventListener('click', () => openModal());
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);

// Sauvegarde (ajout ou édition)
document.getElementById('modal-save').addEventListener('click', () => {
  const name  = inputName.value.trim();
  const price = parseFloat(inputPrice.value);
  const stock = parseInt(inputStock.value);

  if (!name || isNaN(price) || isNaN(stock)) {
    alert('Remplis tous les champs correctement.');
    return;
  }

  const emojiMap = { alcoholic: '🍹', 'non-alcoholic': '🥤' };

  if (editId.value) {
    const idx = products.findIndex((p) => p.id === parseInt(editId.value));
    if (idx !== -1) {
      products[idx] = {
        ...products[idx],
        name, price, stock,
        category: inputCat.value,
        desc: inputDesc.value
      };
    }
  } else {
    products.push({
      id: nextId++,
      name, price, stock,
      category: inputCat.value,
      desc: inputDesc.value,
      emoji: emojiMap[inputCat.value] || '🍶'
    });
  }

  closeModal();
  renderProducts();
});

// ============================================================
//  EDIT / DELETE sur les cartes
// ============================================================
document.getElementById('products-grid').addEventListener('click', (e) => {
  const id = parseInt(e.target.dataset.id);
  if (!id) return;

  if (e.target.classList.contains('btn-delete')) {
    if (confirm('Supprimer ce produit ?')) {
      products = products.filter((p) => p.id !== id);
      renderProducts();
    }
  }

  if (e.target.classList.contains('btn-edit')) {
    const product = products.find((p) => p.id === id);
    if (product) openModal(product);
  }
});

// ============================================================
//  INIT
// ============================================================
renderProducts();
