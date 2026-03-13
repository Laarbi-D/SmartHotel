<?php
header("Access-Control-Allow-Origin: *"); // Autorise React à lire
header("Content-Type: application/json");

$host = 'mysql';
$db   = 'tp_db';
$user = 'root';
$pass = 'rootpassword';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    // REMPLACE 'ma_table' PAR LE VRAI NOM DE TA TABLE
    $stmt = $pdo->query("SELECT * FROM ma_table LIMIT 10");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>