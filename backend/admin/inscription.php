<?php
session_start();
require_once 'config.php'; // On récupère la connexion $pdo

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $prenom = trim($_POST['prenom']);
    $nom    = trim($_POST['nom']);
    $chambre = trim($_POST['chambre']);
    $password = $_POST['password'];

    // 1. ANSSI : Hachage du mot de passe
    // PASSWORD_DEFAULT utilise actuellement BCrypt
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        // 2. Requête préparée (Protection contre Injection SQL)
        $sql = "INSERT INTO UTILISATEUR (PRENOM, NOM, NUMERO_CHAMBRE, MOT_DE_PASSE) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$prenom, $nom, $chambre, $password_hash]);

        $message = "Utilisateur créé avec succès et mot de passe sécurisé !";
    } catch (PDOException $e) {
        $message = "Erreur lors de l'inscription : " . $e->getMessage();
    }
}
?>

<form method="POST">
    <input type="text" name="prenom" placeholder="Prénom" required><br>
    <input type="text" name="nom" placeholder="Nom" required><br>
    <input type="text" name="chambre" placeholder="N° Chambre" required><br>
    <input type="password" name="password" placeholder="Mot de passe" required><br>
    <button type="submit">Créer l'utilisateur</button>
</form>

<p><?php echo $message; ?></p>