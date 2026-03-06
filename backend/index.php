<?php
// Informations de connexion à la base de données
$host = 'mysql';
$user = 'Etudiant';
$pass = 'P@ssword';
$db   = 'tp_db';

// Connexion à MySQL
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connexion échouée : " . $conn->connect_error);
}

echo "Connexion MySQL réussie !<br>";

// Exécution d'une requête simple
$result = $conn->query("SELECT 'Bonjour depuis MySQL !' AS message");
$row = $result->fetch_assoc();
echo $row['message'];
?>
