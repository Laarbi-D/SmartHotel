<?php
// 1. Démarrage de la session
session_start();

// Si l'utilisateur est déjà connecté, redirection vers l'accueil
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    header("Location: accueil.php");
    exit;
}

$error_message = "";

// 2. Traitement du formulaire
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupération des données du formulaire
    $prenom_saisi = isset($_POST['id']) ? trim($_POST['id']) : '';
    $mdp_saisi = isset($_POST['password']) ? $_POST['password'] : '';
    $keep_logged = isset($_POST['keep_logged']);

    // --- CONFIGURATION BDD ---
    $host = 'mysql'; 
    $db   = 'smarthotelbdd'; 
    $user = 'root';
    $pass = 'rootpassword'; 
    $port = "3306"; 

    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        // On cherche l'utilisateur par son PRENOM (ton identifiant)
        $stmt = $pdo->prepare("SELECT * FROM UTILISATEUR WHERE PRENOM = ?");
        $stmt->execute([$prenom_saisi]);
        $userFound = $stmt->fetch();

        // Vérification : on compare le mot de passe saisi avec la colonne MOT_DE_PASSE
        if ($userFound && $mdp_saisi === $userFound['MOT_DE_PASSE']) {
            
            session_regenerate_id();
            
            $_SESSION['loggedin'] = true;
            $_SESSION['userid']   = $userFound['ID_UTILISATEUR'];
            $_SESSION['username'] = $userFound['PRENOM']; // On stocke le prénom en session

            if ($keep_logged) {
                setcookie("user_login", $prenom_saisi, [
                    'expires' => time() + (86400 * 30),
                    'path' => '/',
                    'httponly' => true,
                    'samesite' => 'Lax'
                ]);
            }

            header("Location: accueil.php");
            exit;
        } else {
            $error_message = "Prénom ou mot de passe incorrect.";
        }

    } catch (PDOException $e) {
        error_log($e->getMessage());
        $error_message = "Erreur de connexion : " . $e->getMessage(); // On affiche l'erreur pour t'aider à débugger
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
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { display: flex; flex-direction: column; min-height: 100vh; background-color: #ffffff; position: relative; }
        .top-background { position: absolute; top: 0; width: 100%; height: 35vh; background-color: #eaf3fa; z-index: 0; }
        .logo-container { position: absolute; top: 30px; left: 40px; z-index: 2; }
        .logo-container img { width: 180px; height: auto; }
        .shapes-container { position: absolute; top: -50px; right: -60px; transform: rotate(45deg); display: flex; gap: 15px; z-index: 1; }
        .shape { height: 250px; }
        .shape-1 { width: 25px; background-color: #ffffff; }
        .shape-2 { width: 35px; background-color: #274b69; }
        .shape-3 { width: 25px; background-color: #92a4b0; margin-top: 50px; }
        .main-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2; margin-top: -5vh; }
        .login-title { color: #224361; font-size: 28px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; }
        .form-container { width: 100%; max-width: 400px; }
        .input-group { margin-bottom: 10px; }
        .input-group input { width: 100%; padding: 15px; background-color: #f1f1f1; border: 2px solid transparent; outline: none; }
        .input-group input:focus { border-color: #274b69; }
        .checkbox-group { display: flex; align-items: center; margin: 15px 0 30px 0; font-size: 13px; cursor: pointer; }
        .checkbox-group input { margin-right: 8px; }
        .btn-login { width: 100%; padding: 15px; background-color: #224361; color: white; border: none; font-weight: bold; text-transform: uppercase; cursor: pointer; }
        .footer { background-color: #262626; color: white; padding: 15px 40px; display: flex; justify-content: space-between; font-size: 12px; z-index: 2; }
        .error-message { color: #721c24; background-color: #f8d7da; padding: 12px; margin-bottom: 15px; border-radius: 4px; text-align: center; border: 1px solid #f5c6cb; }
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

            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST">
                <div class="input-group">
                    <input type="text" name="id" placeholder="Prénom (ex: John)" required>
                </div>
                <div class="input-group">
                    <input type="password" name="password" placeholder="Mot de passe (ex: 1234)" required>
                </div>
                <label class="checkbox-group">
                    <input type="checkbox" name="keep_logged">
                    Keep logged in
                </label>
                <button type="submit" class="btn-login">Login</button>
            </form>
        </div>
    </main>

    <footer class="footer">
        <div>Help needed?</div>
        <div>EN / FR / ES</div>
    </footer>

</body>
</html>