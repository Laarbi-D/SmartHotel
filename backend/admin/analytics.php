<?php
declare(strict_types=1);

if (!headers_sent()) {
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header("Permissions-Policy: geolocation=(), microphone=(), camera=()");
    header("Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; frame-src http://192.168.112.158:3400 http://100.89.19.78:3400; script-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'self'; form-action 'self';");
}

function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

function is_allowed_host(string $host): bool
{
    $allowedHosts = [
        '192.168.112.158',
        '100.89.19.78',
    ];
    return in_array($host, $allowedHosts, true);
}

function build_url(string $host, int $port, string $path = '/'): string
{
    if (!is_allowed_host($host)) {
        return '#';
    }
    $path = '/' . ltrim($path, '/');
    return "http://{$host}:{$port}{$path}";
}

function external_link_attrs(string $url): string
{
    if ($url === '#') {
        return 'aria-disabled="true" tabindex="-1"';
    }
    return 'target="_blank" rel="noopener noreferrer"';
}

$serverHost = $_SERVER['HTTP_HOST'] ?? '';
$serverHost = strtolower(trim(explode(':', $serverHost)[0]));

$isTailscale = ($serverHost === '100.89.19.78');
$baseHost = $isTailscale ? '100.89.19.78' : '192.168.112.158';

$grafanaBase  = build_url($baseHost, 3400, '/');
$displayBase  = build_url($baseHost, 3020, '/');
$databaseBase = build_url($baseHost, 8081, '/');

$tempDashboard = build_url(
    $baseHost,
    3400,
    '/public-dashboards/2618067cca9b4f07a05caf5a13b1d7'
);

$humidDashboard = build_url(
    $baseHost,
    3400,
    '/public-dashboards/e69f7f0f6db8406f9b1a51b90e6cdfad'
);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="Analytics.css">
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar__logo">
        <img src="logo.png" alt="Logo Barcelo" class="logo-img">
      </div>

      <nav class="sidebar__nav" aria-label="Navigation principale">
        <a href="accueil.php" class="nav-item">Dashboard</a>
        <a href="orders.php" class="nav-item">Orders</a>
        <a href="analytics.php" class="nav-item active" aria-current="page">Analytics</a>
        <a href="product.php" class="nav-item">Products</a>
        <a href="employees.php" class="nav-item">Employees</a>
        <a href="settings.php" class="nav-item">Settings</a>
      </nav>

      <a href="login.php" class="nav-item nav-item--logout">Log out</a>
    </aside>

    <div class="main-wrapper">
      <header class="header">
        <div class="header__search">
          <input type="text" placeholder="Search" aria-label="Search">
        </div>

        <div class="header__actions">
          <div class="header__profile">
            <img src="https://i.pravatar.cc/40" alt="Photo de profil administrateur">
            <div>
              <span class="profile__name">Administrator</span>
              <span class="profile__email">administrator@gmail.com</span>
            </div>
          </div>
        </div>
      </header>

      <main class="main">
        <h1 class="dashboard-title">Analytics</h1>

        <div class="analytics-kpi-grid">
          <div class="analytics-kpi-card">
            <span class="analytics-kpi-label">Dashboard 1</span>
            <span class="analytics-kpi-value">Température 🌡️</span>
          </div>

          <div class="analytics-kpi-card">
            <span class="analytics-kpi-label">Dashboard 2</span>
            <span class="analytics-kpi-value">Humidité 💧</span>
          </div>

          <div class="analytics-kpi-card">
            <span class="analytics-kpi-label">Source</span>
            <span class="analytics-kpi-value">Grafana</span>
          </div>
        </div>

        <section class="grafana-section">
          <div class="grafana-header">
            <div>
              <h2>Monitoring Grafana</h2>
              <p>Suivi des données température et humidité.</p>
            </div>

            <div class="analytics-actions analytics-actions--manage">
              <button class="action-btn add-btn" type="button">Ajouter</button>
              <button class="action-btn delete-btn" type="button">Supprimer</button>
              <button class="action-btn reset-btn" type="button">Réinitialiser</button>
            </div>
          </div>

          <div class="grafana-grid">
            <div class="grafana-card">
              <h3>Température</h3>
              <iframe
                src="<?= e($tempDashboard) ?>"
                loading="lazy"
                referrerpolicy="no-referrer"
                title="Dashboard température Grafana">
              </iframe>
            </div>

            <div class="grafana-card">
              <h3>Humidité</h3>
              <iframe
                src="<?= e($humidDashboard) ?>"
                loading="lazy"
                referrerpolicy="no-referrer"
                title="Dashboard humidité Grafana">
              </iframe>
            </div>
          </div>
        </section>

        <div class="analytics-actions analytics-actions--external">
          <a class="action-btn grafana-btn" href="<?= e($grafanaBase) ?>" <?= external_link_attrs($grafanaBase) ?>>Grafana</a>
          <a class="action-btn display-btn" href="<?= e($displayBase) ?>" <?= external_link_attrs($displayBase) ?>>Afficheur</a>
          <a class="action-btn database-btn" href="<?= e($databaseBase) ?>" <?= external_link_attrs($databaseBase) ?>>Base de donnée</a>
        </div>
      </main>
    </div>
  </div>
</body>
</html>