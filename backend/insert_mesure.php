<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = "mysql";
$username = "root";
$password = "rootpassword"; 
$dbname = "smarthotelbdd";

$temp = floatval($_GET['temp'] ?? null);
$hum = floatval($_GET['hum'] ?? null);

if (!$temp || !$hum) {
    http_response_code(400);
    echo json_encode(["error" => "temp et hum requis"]);
    exit;
}

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connexion échouée"]);
    exit;
}

// 🔥 NOUVEAU : INSERT AUTO TYPE_CAPTEUR (si pas déjà existant)
$types = [
    ['T', 'Température', 'AHT20'],
    ['H', 'Humidité', 'AHT20']
];

foreach ($types as $type) {
    $stmt = $conn->prepare("INSERT IGNORE INTO TYPE_CAPTEUR (TYPE_CAPTEUR, LIBELLE_TYPE_CAPTEUR, MODELE_CAPTEUR) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $type[0], $type[1], $type[2]);
    $stmt->execute();
    $stmt->close();
}

// INSERT T° MESURE_CAPTEUR
$stmt = $conn->prepare("INSERT INTO MESURE_CAPTEUR (TYPE_CAPTEUR, MESURE) VALUES ('T', ?)");
$stmt->bind_param("d", $temp);
$stmt->execute();
$stmt->close();

// INSERT H% MESURE_CAPTEUR
$stmt = $conn->prepare("INSERT INTO MESURE_CAPTEUR (TYPE_CAPTEUR, MESURE) VALUES ('H', ?)");
$stmt->bind_param("d", $hum);
$stmt->execute();
$stmt->close();

echo json_encode(["status" => "OK", "temp" => $temp, "hum" => $hum]);
$conn->close();
?>
