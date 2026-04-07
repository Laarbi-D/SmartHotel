<?php
// --- HEADERS DE SÉCURITÉ ET CORS ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Préflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'mysql';
$db   = 'smarthotelbdd';
$user = 'root';
$pass = 'rootpassword';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $temp = isset($_POST['temp']) ? floatval($_POST['temp']) : null;
    $hum  = isset($_POST['hum'])  ? floatval($_POST['hum'])  : null;

    if ($temp === null || $hum === null) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "temp et hum requis"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // INSERT IGNORE type capteur
    $stmtType = $pdo->prepare("
        INSERT IGNORE INTO TYPE_CAPTEUR (TYPE_CAPTEUR, LIBELLE_TYPE_CAPTEUR, MODELE_CAPTEUR)
        VALUES (?, ?, ?)
    ");

    $types = [
        ['T', 'Température', 'AHT20'],
        ['H', 'Humidité', 'AHT20']
    ];

    foreach ($types as $type) {
        $stmtType->execute([$type[0], $type[1], $type[2]]);
    }

    // Insertion mesures
    $stmtMesure = $pdo->prepare("
        INSERT INTO MESURE_CAPTEUR (TYPE_CAPTEUR, MESURE)
        VALUES (?, ?)
    ");

    $stmtMesure->execute(['T', $temp]);
    $stmtMesure->execute(['H', $hum]);

    // Dernières valeurs
    $stmtTemp = $pdo->query("
        SELECT MESURE
        FROM MESURE_CAPTEUR
        WHERE TYPE_CAPTEUR = 'T'
        ORDER BY ID_MESURE DESC
        LIMIT 1
    ");
    $temp_actuel = $stmtTemp->fetchColumn();
    $temp_actuel = ($temp_actuel !== false) ? floatval($temp_actuel) : $temp;

    $stmtHum = $pdo->query("
        SELECT MESURE
        FROM MESURE_CAPTEUR
        WHERE TYPE_CAPTEUR = 'H'
        ORDER BY ID_MESURE DESC
        LIMIT 1
    ");
    $hum_actuel = $stmtHum->fetchColumn();
    $hum_actuel = ($hum_actuel !== false) ? floatval($hum_actuel) : $hum;

    // Seuils
    $MAX_TEMP = 21.0;
    $MIN_HUM  = 30.0;
    $MAX_HUM  = 70.0;

    $alert_temp = $temp_actuel > $MAX_TEMP;
    $alert_hum  = ($hum_actuel < $MIN_HUM || $hum_actuel > $MAX_HUM);

    $telegram_ok = null;
    $telegram_response = null;

    // Telegram si alerte
    if ($alert_temp || $alert_hum) {
        $telegram_token = "8525409568:AAG3saVaLLltmxPLyPKxKeeTUDefK6eldss";
        $chat_id = "1601238568";

        $message = "🚨 IoT SmartHotel:\n";
        if ($alert_temp) {
            $message .= "🔥 T°=" . round($temp_actuel, 1) . "°C >21°C\n";
        }
        if ($alert_hum) {
            $message .= "💧 HR=" . round($hum_actuel, 1) . "% " . ($hum_actuel < $MIN_HUM ? "<30%" : ">70%") . "\n";
        }
        $message .= "🕐 " . date('H:i:s');

        $url = "https://api.telegram.org/bot" . $telegram_token . "/sendMessage";

        $payload = http_build_query([
            'chat_id' => $chat_id,
            'text' => $message
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded'
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        $telegram_response = json_decode($response, true);
        $telegram_ok = is_array($telegram_response) && isset($telegram_response['ok']) && $telegram_response['ok'] === true;
    }

    echo json_encode([
        "status" => "success",
        "temp" => $temp,
        "hum" => $hum,
        "temp_actuelle" => round($temp_actuel, 1),
        "hum_actuelle" => round($hum_actuel, 1),
        "alert_temp" => $alert_temp,
        "alert_hum" => $alert_hum,
        "telegram" => ($alert_temp || $alert_hum)
            ? ($telegram_ok ? "✅ Telegram OK" : "❌ Telegram KO")
            : "ℹ️ Pas d'alerte"
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Erreur BDD/API : " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>