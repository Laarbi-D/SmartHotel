<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Barcelo – Employees</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css"/>
  <link rel="stylesheet" href="employees.css"/>
  <script>
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
    }
  </script>
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
        <a href="product.php" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          Products
        </a>
        <a href="employees.php" class="nav-item active">
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
      <a href="login.php" class="nav-item nav-item--logout" onclick="return confirm('Se déconnecter ?')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Log out
      </a>
    </aside>

    <!-- MAIN -->
    <div class="main-wrapper">

      <!-- HEADER -->
      <header class="header">
        <div class="header__search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="employee-search" placeholder="Search employee..."/>
        </div>
        <div class="header__actions">
          <button class="header__icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </button>
          <button class="header__icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notif-dot"></span>
          </button>
          <div class="header__profile">
            <img src="https://i.pravatar.cc/32" alt="Admin"/>
            <div>
              <span class="profile__name">Administrator</span>
              <span class="profile__email">administrator@gmail.com</span>
            </div>
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="main">
        <div class="employees-topbar">
          <h1 class="dashboard-title">Employees</h1>
          <button class="btn-add" id="btn-add-employee">+ Add Employee</button>
        </div>

        <!-- FILTRES PAR DÉPARTEMENT -->
        <div class="category-tabs">
          <button class="tab-btn active" data-dept="all">All</button>
          <button class="tab-btn" data-dept="bar">Bar</button>
          <button class="tab-btn" data-dept="kitchen">Kitchen</button>
          <button class="tab-btn" data-dept="reception">Reception</button>
          <button class="tab-btn" data-dept="housekeeping">Housekeeping</button>
        </div>

        <!-- GRILLE EMPLOYÉS -->
        <div class="employees-grid" id="employees-grid"></div>

      </main>
    </div>
  </div>

  <!-- MODAL AJOUT / ÉDITION -->
  <div id="employee-modal" class="modal-overlay hidden">
    <div class="modal">
      <div class="modal__header">
        <h3 id="modal-title">Add Employee</h3>
        <button class="modal__close" id="modal-close">&times;</button>
      </div>
      <div class="modal__body">
        <input type="hidden" id="edit-id"/>
        <div class="form-group">
          <label>First & Last Name</label>
          <input type="text" id="input-name" placeholder="e.g. Jean Dupont"/>
        </div>
        <div class="form-group">
          <label>Role</label>
          <input type="text" id="input-role" placeholder="e.g. Bartender"/>
        </div>
        <div class="form-group">
          <label>Department</label>
          <select id="input-dept">
            <option value="bar">Bar</option>
            <option value="kitchen">Kitchen</option>
            <option value="reception">Reception</option>
            <option value="housekeeping">Housekeeping</option>
          </select>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="input-email" placeholder="email@barcelo.com"/>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select id="input-status">
            <option value="active">Active</option>
            <option value="off">Day off</option>
            <option value="leave">On leave</option>
          </select>
        </div>
      </div>
      <div class="modal__footer">
        <button class="btn-cancel" id="modal-cancel">Cancel</button>
        <button class="btn-save" id="modal-save">Save</button>
      </div>
    </div>
  </div>

  <script src="employees.js"></script>
</body>
</html>
