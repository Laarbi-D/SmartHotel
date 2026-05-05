<?php
/**
 * GESTION DE LA CONNEXION - SMARTHOTEL (ADMINISTRATION)
 * Documentation interne : Système d'authentification sécurisé par identifiant composé (Prénom + Nom)
 */

// Initialisation de l'affichage des erreurs pour le développement
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Démarrage du gestionnaire de session PHP
session_start();

// =========================================================================
// INTERCEPTION DE LA DÉCONNEXION (Si l'URL contient ?action=logout)
// =========================================================================
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    // On vide toutes les variables de session
    $_SESSION = array();
    // On détruit la session côté serveur
    session_destroy();
    // On redirige vers la même page (sans le paramètre URL) pour nettoyer l'affichage
    header("Location: login.php");
    exit;
}

// Redirection automatique si le flag de connexion est déjà présent en session
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    header("Location: accueil.php");
    exit;
}

$error_message = "";

// Interception de la requête POST du formulaire
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Nettoyage des entrées : trim() pour supprimer les espaces accidentels
    $identifiant_saisi = isset($_POST['id']) ? trim($_POST['id']) : '';
    $mdp_saisi = isset($_POST['password']) ? $_POST['password'] : '';

    // Paramètres de connexion au container MySQL
    $host = 'mysql'; 
    $db   = 'smart_hotel_bdd'; 
    $user = 'root';
    $pass = 'rootpassword'; 

    try {
        // Instanciation de l'objet PDO pour la connexion BDD
        $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Force le jet d'exceptions en cas d'erreur SQL
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC // Retourne les résultats sous forme de tableaux associatifs
        ]);

        /** 
         * REQUÊTE PRÉPARÉE : Recherche de l'employé
         * Utilisation de CONCAT pour permettre la saisie "Prénom Nom" ou "Nom Prénom"
         */
        $sql = "SELECT * FROM employe 
                WHERE CONCAT(PRENOM_EMPLOYE, ' ', NOM_EMPLOYE) = :identifiant 
                OR CONCAT(NOM_EMPLOYE, ' ', PRENOM_EMPLOYE) = :identifiant";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['identifiant' => $identifiant_saisi]);
        $userFound = $stmt->fetch();

        if ($userFound) {
            /**
             * VÉRIFICATION SÉCURISÉE DU MOT DE PASSE
             * Utilisation de password_verify() pour comparer le mot de passe saisi en clair
             * avec le hash BCrypt stocké dans la base de données.
             */
            if (password_verify($mdp_saisi, $userFound['MOT_DE_PASSE_EMPLOYE'])) {
                
                // Sécurisation de la session : régénération de l'ID pour contrer la fixation de session
                session_regenerate_id(true);
                
                // Hydratation de la superglobale $_SESSION
                $_SESSION['loggedin'] = true;
                $_SESSION['userid']   = $userFound['ID_EMPLOYE'];
                $_SESSION['username'] = $userFound['PRENOM_EMPLOYE'] . " " . $userFound['NOM_EMPLOYE'];
                $_SESSION['type']     = $userFound['ID_TYPE_EMPLOYE'];

                // Redirection vers l'espace membre
                header("Location: accueil.php");
                exit;
            } else {
                $error_message = "Identifiant ou mot de passe incorrect.";
            }
        } else {
             $error_message = "Identifiant ou mot de passe incorrect.";
        }

    } catch (PDOException $e) {
        // Capture des erreurs fatales de connexion
        $error_message = "Erreur système de base de données : " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barcelo - Connexion Sécurisée</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { display: flex; flex-direction: column; min-height: 100vh; background-color: #ffffff; position: relative; }
        .top-background { position: absolute; top: 0; width: 100%; height: 35vh; background-color: #eaf3fa; z-index: 0; }
        .logo-container { position: absolute; top: 30px; left: 40px; z-index: 2; }
        .logo-container img { width: 180px; height: auto; }
        .main-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2; }
        .login-title { color: #224361; font-size: 28px; font-weight: 900; text-transform: uppercase; margin-bottom: 25px; }
        .form-container { width: 100%; max-width: 450px; padding: 0 20px; }
        .input-group { margin-bottom: 15px; }
        .input-group input { width: 100%; padding: 15px; background-color: #f1f1f1; border: 2px solid transparent; outline: none; transition: 0.3s; font-size: 16px; }
        .input-group input:focus { border-color: #224361; background-color: #fff; }
        .btn-login { width: 100%; padding: 16px; background-color: #224361; color: white; border: none; font-weight: bold; text-transform: uppercase; cursor: pointer; transition: 0.3s; margin-top: 10px; }
        .btn-login:hover { background-color: #1a334a; }
        .error-message { color: #721c24; background-color: #f8d7da; padding: 12px; margin-bottom: 20px; border-radius: 4px; text-align: center; border: 1px solid #f5c6cb; font-size: 14px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="top-background"></div>
    <div class="logo-container">
        <!-- Remplacer par le chemin correct de ton image -->
        <img src="logo.png" alt="Barcelo">
    </div>

    <main class="main-content">
        <h1 class="login-title">Connexion Administration</h1>
        <div class="form-container">
            <?php if (!empty($error_message)): ?>
                <div class="error-message"><?php echo htmlspecialchars($error_message); ?></div>
            <?php endif; ?>

            <form action="" method="POST">
                <div class="input-group">
                    <input type="text" name="id" placeholder="Prénom Nom" required autocomplete="name">
                </div>
                <div class="input-group">
                    <input type="password" name="password" placeholder="Mot de passe" required autocomplete="current-password">
                </div>
                <button type="submit" class="btn-login">Se connecter</button>
            </form>
        </div>
    </main>
</body>
</html>