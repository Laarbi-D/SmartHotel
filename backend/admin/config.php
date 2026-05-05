<?php
// 1. Paramètres de sécurité des sessions (Recommandé ANSSI)
// On force le mode sécurisé avant de démarrer la session
ini_set('session.cookie_httponly', 1); // Interdit l'accès aux cookies via JS (anti-XSS)
ini_set('session.cookie_samesite', 'Lax'); // Protection contre les failles CSRF
ini_set('session.use_only_cookies', 1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 2. Informations de connexion à la base de données
$host = 'mysql'; 
$db   = 'smarthotelbdd'; 
$user = 'root';
$pass = 'rootpassword'; 
$port = "3306"; 

try {
    // Connexion via PDO (plus sécurisé que mysqli)
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Pour voir les erreurs SQL pendant le dev
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false, // Utilise les vraies requêtes préparées (Sécurité ANSSI)
    ]);
} catch (PDOException $e) {
    // En cas d'erreur, on enregistre dans un log et on affiche un message neutre
    error_log($e->getMessage());
    die("Désolé, une erreur de connexion à la base de données est survenue.");
}

// 3. Petite fonction utilitaire pour sécuriser l'affichage (CNIL/XSS)
function h($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}
?>