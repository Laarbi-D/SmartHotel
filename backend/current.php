<?php
/**
 * api/current.php
 * Retourne la température et l'humidité actuelles en JSON.
 * Connectez ici votre base de données ou votre capteur IoT.
 */

header('Content-Type: application/json');
header('Cache-Control: no-cache');

// ── Exemple : lecture depuis une BDD MySQL ────────────────────────────────────
/*
$pdo = new PDO('mysql:host=localhost;dbname=barcelo', 'user', 'pass');
$stmt = $pdo->query(
  "SELECT temperature, humidity
   FROM sensor_readings
   ORDER BY recorded_at DESC
   LIMIT 1"
);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode($row);
exit;
*/

// ── Données simulées (à retirer en production) ────────────────────────────────
$data = [
  'temperature' => round(20 + mt_rand(0, 80) / 10, 1),  // 20.0–28.0 °C
  'humidity'    => round(45 + mt_rand(0, 350) / 10, 1), // 45.0–80.0 %
  'recorded_at' => date('Y-m-d H:i:s'),
];

echo json_encode($data);
