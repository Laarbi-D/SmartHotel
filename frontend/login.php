<?php
// Démarrage de la session pour conserver l'état de connexion
session_start();

$error_message = "";

// Vérifier si le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupération des données du formulaire grâce aux attributs "name"
    $id = isset($_POST['id']) ? trim($_POST['id']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $keep_logged = isset($_POST['keep_logged']) ? true : false;

    // --- SIMULATION DE BASE DE DONNÉES ---
    // À remplacer par une vraie connexion à une base de données (ex: PDO)
    $valid_id = "admin";
    $valid_password = "password123"; 

    // Vérification des identifiants
    if ($id === $valid_id && $password === $valid_password) {
        // Connexion réussie : on enregistre l'utilisateur en session
        $_SESSION['loggedin'] = true;
        $_SESSION['userid'] = $id;

        // Gestion de la case "Keep logged in" (création d'un cookie valable 30 jours)
        if ($keep_logged) {
            setcookie("user_login", $id, time() + (86400 * 30), "/");
        }

        // Redirection vers la page d'accueil/tableau de bord
        header("Location: dashboard.php");
        exit;
    } else {
        // Échec de la connexion
        $error_message = "ID or password incorrect.";
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barcelo - Login</title>
    <style>
        /* Réinitialisation des marges et polices par défaut */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: #ffffff;
            position: relative;
        }

        /* Arrière-plan bleu clair supérieur */
        .top-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 35vh;
            background-color: #eaf3fa;
            z-index: 0;
            overflow: hidden;
        }

        /* Logo en haut à gauche */
        .logo-container {
            position: absolute;
            top: 30px;
            left: 40px;
            z-index: 2;
        }

        .logo-container img {
            width: 180px;
            height: auto;
        }

        /* Formes géométriques en haut à droite */
        .shapes-container {
            position: absolute;
            top: -50px;
            right: -60px;
            transform: rotate(45deg);
            display: flex;
            gap: 15px;
            z-index: 1;
        }

        .shape {
            height: 250px;
        }

        .shape-1 { width: 25px; background-color: #ffffff; }
        .shape-2 { width: 35px; background-color: #274b69; }
        .shape-3 { width: 25px; background-color: #92a4b0; margin-top: 50px; }

        /* Conteneur principal centré */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 2;
            margin-top: -5vh;
        }

        .login-title {
            color: #224361;
            font-size: 28px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
        }

        /* Formulaire */
        .form-container {
            width: 100%;
            max-width: 400px;
            background: transparent;
        }

        .input-group {
            margin-bottom: 10px;
        }

        .input-group input[type="text"],
        .input-group input[type="password"] {
            width: 100%;
            padding: 15px;
            background-color: #f1f1f1;
            border: none;
            font-size: 14px;
            color: #333;
            outline: none;
        }

        .input-group input::placeholder {
            color: #666;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            margin-top: 10px;
            margin-bottom: 30px;
            font-size: 13px;
            color: #333;
        }

        .checkbox-group input[type="checkbox"] {
            margin-right: 8px;
            width: 15px;
            height: 15px;
            border: 1px solid #ccc;
        }

        .btn-login {
            width: 100%;
            padding: 15px;
            background-color: #bdbdbd;
            color: #ffffff;
            border: none;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .btn-login:hover {
            background-color: #a8a8a8;
        }

        .or-divider {
            text-align: center;
            margin-top: 15px;
            font-size: 13px;
            color: #333;
        }

        /* Footer noir en bas */
        .footer {
            background-color: #262626;
            color: #ffffff;
            padding: 15px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            z-index: 2;
        }

        /* Style pour le message d'erreur */
        .error-message {
            color: #d9534f;
            background-color: #f2dede;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
            font-size: 14px;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="top-background">
        <div class="shapes-container">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
        </div>
    </div>

    <div class="logo-container">
        <img src="logo.png" alt="Barcelo">
    </div>

    <main class="main-content">
        <h1 class="login-title">Login</h1>
        
        <div class="form-container">
            <?php if (!empty($error_message)): ?>
                <div class="error-message"><?php echo htmlspecialchars($error_message); ?></div>
            <?php endif; ?>

            <form action="login.php" method="POST">
                <div class="input-group">
                    <input type="text" name="id" placeholder="ID" required>
                </div>
                <div class="input-group">
                    <input type="password" name="password" placeholder="Password" required>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="keep-logged" name="keep_logged">
                    <label for="keep-logged">Keep logged in</label>
                </div>
                
                <button type="submit" class="btn-login">Login</button>
                
                <div class="or-divider">Or</div>
            </form>
        </div>
    </main>

    <footer class="footer">
        <div>Help needed?</div>
        <div>EN</div>
    </footer>

</body>
</html>
