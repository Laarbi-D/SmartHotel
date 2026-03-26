<?php
// --- HEADERS DE SÉCURITÉ ET CORS ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Réponse rapide pour la pré-vérification du navigateur (Preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'mysql'; 
$db   = 'smarthotelbdd'; 
$user = 'root';
$pass = 'rootpassword'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $table = isset($_GET['table']) ? $_GET['table'] : 'PRODUIT';
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', $table);

    $query = "SELECT * FROM `$table` LIMIT 100";
    $stmt = $pdo->query($query);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Si vide, on renvoie un tableau vide [] au lieu de false
    echo json_encode($results ? $results : []);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erreur BDD : " . $e->getMessage()]);
}