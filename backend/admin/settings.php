<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Barcelo – Settings</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css"/>
  <link rel="stylesheet" href="settings.css"/>
  <script>
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
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
        <a href="employees.php" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Employees
        </a>
        <a href="settings.php" class="nav-item active">
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
          <input type="text" placeholder="Search"/>
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
        <h1 class="dashboard-title">Settings</h1>

        <div class="settings-layout">

          <!-- NAVIGATION SETTINGS -->
          <aside class="settings-nav">
            <button class="settings-nav__item active" data-section="profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </button>
            <button class="settings-nav__item" data-section="security">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Security
            </button>
            <button class="settings-nav__item" data-section="notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              Notifications
            </button>
            <button class="settings-nav__item" data-section="hotel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Hotel Info
            </button>
            <button class="settings-nav__item" data-section="appearance">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/></svg>
              Appearance
            </button>
          </aside>

          <!-- CONTENU SECTIONS -->
          <div class="settings-content">

            <!-- PROFILE -->
            <section class="settings-section active" id="section-profile">
              <h2 class="settings-section__title">Profile</h2>
              <p class="settings-section__desc">Gérez les informations de votre compte administrateur.</p>

              <div class="settings-avatar-row">
                <img src="https://i.pravatar.cc/80" alt="Avatar" class="settings-avatar"/>
                <div>
                  <button class="btn-settings-secondary">Change photo</button>
                  <p class="settings-hint">JPG, PNG. Max 2MB.</p>
                </div>
              </div>

              <div class="settings-form">
                <div class="settings-row">
                  <div class="form-group">
                    <label>First Name</label>
                    <input type="text" value="Administrator"/>
                  </div>
                  <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" value="Barcelo"/>
                  </div>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" value="administrator@gmail.com"/>
                </div>
                <div class="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="+34 000 000 000"/>
                </div>
                <div class="form-group">
                  <label>Role</label>
                  <input type="text" value="Administrator" disabled/>
                </div>
                <button class="btn-settings-save" id="save-profile">Save changes</button>
              </div>
            </section>

            <!-- SECURITY -->
            <section class="settings-section" id="section-security">
              <h2 class="settings-section__title">Security</h2>
              <p class="settings-section__desc">Modifiez votre mot de passe et gérez la sécurité du compte.</p>

              <div class="settings-form">
                <div class="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••"/>
                </div>
                <div class="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••"/>
                </div>
                <div class="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="••••••••"/>
                </div>
                <button class="btn-settings-save" id="save-password">Update password</button>
              </div>

              <div class="settings-divider"></div>

              <h3 class="settings-subsection__title">Two-Factor Authentication</h3>
              <div class="settings-toggle-row">
                <div>
                  <p class="toggle-label">Enable 2FA</p>
                  <p class="toggle-desc">Sécurisez votre compte avec une double authentification.</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" id="toggle-2fa"/>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </section>

            <!-- NOTIFICATIONS -->
            <section class="settings-section" id="section-notifications">
              <h2 class="settings-section__title">Notifications</h2>
              <p class="settings-section__desc">Choisissez quand et comment vous souhaitez être notifié.</p>

              <div class="settings-form">
                <div class="settings-toggle-row">
                  <div>
                    <p class="toggle-label">New Orders</p>
                    <p class="toggle-desc">Recevoir une notification à chaque nouvelle commande.</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" checked/>
                    <span class="toggle-slider"></span>
                  </label>
                </div>

                <div class="settings-toggle-row">
                  <div>
                    <p class="toggle-label">Temperature Alerts</p>
                    <p class="toggle-desc">Alerte si la température dépasse les seuils définis.</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" checked/>
                    <span class="toggle-slider"></span>
                  </label>
                </div>

                <div class="settings-toggle-row">
                  <div>
                    <p class="toggle-label">Humidity Alerts</p>
                    <p class="toggle-desc">Alerte si l'humidité sort de la plage normale.</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox"/>
                    <span class="toggle-slider"></span>
                  </label>
                </div>

                <div class="settings-toggle-row">
                  <div>
                    <p class="toggle-label">Employee Updates</p>
                    <p class="toggle-desc">Notification lors d'un changement de statut employé.</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" checked/>
                    <span class="toggle-slider"></span>
                  </label>
                </div>

                <button class="btn-settings-save">Save preferences</button>
              </div>
            </section>

            <!-- HOTEL INFO -->
            <section class="settings-section" id="section-hotel">
              <h2 class="settings-section__title">Hotel Info</h2>
              <p class="settings-section__desc">Informations générales sur l'établissement.</p>

              <div class="settings-form">
                <div class="form-group">
                  <label>Hotel Name</label>
                  <input type="text" value="Barcelo Hotel Sevilla Renacimiento"/>
                </div>
                <div class="settings-row">
                  <div class="form-group">
                    <label>City</label>
                    <input type="text" value="Sevilla"/>
                  </div>
                  <div class="form-group">
                    <label>Country</label>
                    <input type="text" value="Spain"/>
                  </div>
                </div>
                <div class="form-group">
                  <label>Address</label>
                  <input type="text" value="Av. Álvaro Alonso Barba, s/n"/>
                </div>
                <div class="settings-row">
                  <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" value="+34 954 462 222"/>
                  </div>
                  <div class="form-group">
                    <label>Stars</label>
                    <select>
                      <option>3 ⭐</option>
                      <option>4 ⭐</option>
                      <option selected>5 ⭐</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label>Website</label>
                  <input type="url" value="https://www.barcelo.com"/>
                </div>
                <button class="btn-settings-save">Save changes</button>
              </div>
            </section>

            <!-- APPEARANCE -->
            <section class="settings-section" id="section-appearance">
              <h2 class="settings-section__title">Appearance</h2>
              <p class="settings-section__desc">Personnalisez l'interface de votre dashboard.</p>

              <div class="settings-form">
                <div class="form-group">
                  <label>Language</label>
                  <select id="select-lang">
                    <option value="fr">Français</option>
                    <option value="en" selected>English</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Theme</label>
                  <div class="theme-options">
                    <label class="theme-option active" id="theme-light">
                      <input type="radio" name="theme" value="light" checked/>
                      <span>☀️ Light</span>
                    </label>
                    <label class="theme-option" id="theme-dark">
                      <input type="radio" name="theme" value="dark"/>
                      <span>🌙 Dark</span>
                    </label>
                  </div>
                </div>

                <div class="settings-toggle-row">
                  <div>
                    <p class="toggle-label">Compact Mode</p>
                    <p class="toggle-desc">Réduire l'espacement pour afficher plus de contenu.</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" id="toggle-compact"/>
                    <span class="toggle-slider"></span>
                  </label>
                </div>

                <button class="btn-settings-save">Apply</button>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  </div>



 

  <script src="settings.js"></script>
</body>
</html>
