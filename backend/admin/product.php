<?php
session_start();

// 1. PROTECTION SESSION
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: login.php");
    exit;
}

// 2. CONNEXION BDD
$host = 'mysql'; 
$db   = 'smart_hotel_bdd'; 
$user = 'root';
$pass = 'rootpassword'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // On récupère les colonnes exactes de ta table produit
    $stmt = $pdo->query("SELECT ID_PRODUIT, LIBELLE_PRODUIT, PRIX_PRODUIT, IMAGE_PRODUIT, STOCK, BIO, CATEGORIE FROM produit");
    $produits_bdd = $stmt->fetchAll();

} catch (PDOException $e) {
    die("Erreur BDD : " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Barcelo – Products Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css"/>
  <link rel="stylesheet" href="product.css"/>
</head>
<body>

  <div class="layout">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar__logo">
        <img src="logo.png" alt="Barcelo" class="logo-img"/>
      </div>
      <nav class="sidebar__nav">
        <a href="accueil.php" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Dashboard
        </a>
        <a href="orders.php" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Orders
        </a>
        <a href="analytics.php" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Analytics
        </a>
        <a href="product.php" class="nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          Products
        </a>
        <a href="employees.php" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Employees
        </a>
        <a href="settings.php" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
          Settings
        </a>
        <a href="help.php" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Help
        </a>
      </nav>
      <a href="login.php?action=logout" class="nav-item nav-item--logout" onclick="return confirm('Se déconnecter ?')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Log out
      </a>
    </aside>

    <div class="main-wrapper">
      <header class="header">
        <div class="header__search">
          <input type="text" id="product-search" placeholder="Search product..."/>
        </div>
        <div class="header__profile">
          <span class="profile__name"><?php echo htmlspecialchars($_SESSION['username']); ?></span>
        </div>
      </header>

      <main class="main">
        <div class="products-topbar">
          <h1 class="dashboard-title">Products Management</h1>
          <button class="btn-add" id="btn-add-product">+ Add Product</button>
        </div>

        <div class="category-tabs">
          <button class="tab-btn active" data-category="all">All</button>
          <button class="tab-btn" data-category="soft drinks">Soft Drinks</button>
          <button class="tab-btn" data-category="cocktails">Cocktails</button>
          <button class="tab-btn" data-category="wines">Wines</button>
          <button class="tab-btn" data-category="beers">Beers</button>
        </div>

        <div class="products-grid" id="products-grid">
            <!-- Injection via JS -->
        </div>
      </main>
    </div>
  </div>

  <script>
    const dbProducts = <?php echo json_encode($produits_bdd); ?>;
    const grid = document.getElementById('products-grid');

    function renderProducts(filter = 'all') {
        grid.innerHTML = '';
        
        dbProducts.forEach(p => {
            if (filter !== 'all' && p.CATEGORIE !== filter) return;

            const card = `
                <div class="product-card">
                    <div class="product-image-container">
                        <img src="${p.IMAGE_PRODUIT}" alt="${p.LIBELLE_PRODUIT}" class="product-img-fixed">
                    </div>
                    <div class="product-info">
                        <div class="product-header">
                            <h3>${p.LIBELLE_PRODUIT}</h3>
                            <span class="product-price">${parseFloat(p.PRIX_PRODUIT).toFixed(2)}€</span>
                        </div>
                        <p class="product-desc">${p.BIO}</p>
                        <div class="product-footer">
                            <span class="product-stock">Stock: <strong>${p.STOCK}</strong></span>
                            <div class="product-actions">
                                <button class="btn-edit" onclick="alert('ID: ' + ${p.ID_PRODUIT})">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            grid.innerHTML += card;
        });
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts(e.target.dataset.category);
        });
    });

    renderProducts();
  </script>
</body>
</html>