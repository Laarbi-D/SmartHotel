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

// 🔥 INSERT AUTO TYPE_CAPTEUR
$types = [['T', 'Température', 'AHT20'], ['H', 'Humidité', 'AHT20']];
foreach ($types as $type) {
    $stmt = $conn->prepare("INSERT IGNORE INTO TYPE_CAPTEUR (TYPE_CAPTEUR, LIBELLE_TYPE_CAPTEUR, MODELE_CAPTEUR) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $type[0], $type[1], $type[2]);
    $stmt->execute();
    $stmt->close();
}

// INSERT T°
$stmt = $conn->prepare("INSERT INTO MESURE_CAPTEUR (TYPE_CAPTEUR, MESURE) VALUES ('T', ?)");
$stmt->bind_param("d", $temp);
$stmt->execute();
$stmt->close();

// INSERT H%
$stmt = $conn->prepare("INSERT INTO MESURE_CAPTEUR (TYPE_CAPTEUR, MESURE) VALUES ('H', ?)");
$stmt->bind_param("d", $hum);
$stmt->execute();
$stmt->close();

// 🔥🚨 DERNIÈRES VALEURS (SÉCURISÉ)
$temp_result = $conn->query("SELECT MESURE FROM MESURE_CAPTEUR WHERE TYPE_CAPTEUR='T' ORDER BY ID_MESURE DESC LIMIT 1");
$hum_result = $conn->query("SELECT MESURE FROM MESURE_CAPTEUR WHERE TYPE_CAPTEUR='H' ORDER BY ID_MESURE DESC LIMIT 1");

$temp_actuel = $temp_result && $temp_result->num_rows > 0 ? $temp_result->fetch_row()[0] : $temp;
$hum_actuel = $hum_result && $hum_result->num_rows > 0 ? $hum_result->fetch_row()[0] : $hum;

$MAX_TEMP = 21.0;
$MIN_HUM = 30.0;
$MAX_HUM = 70.0;

$alert_temp = floatval($temp_actuel) > $MAX_TEMP;
$alert_hum = floatval($hum_actuel) < $MIN_HUM || floatval($hum_actuel) > $MAX_HUM;

// 🚨 TELEGRAM ✅ NOUVEAU TOKEN + CORRECTION \n
if($alert_temp || $alert_hum) {
    $telegram_token = "8525409568:AAG3saVaLLltmxPLyPKxKeeTUDefK6eldss";  // ← TON NOUVEAU TOKEN
    $chat_id = "1601238568";                                         // ← TON CHAT_ID
    
    $message = "🚨 IoT SmartHotel:\n";  // ← \n SIMPLE (CORRIGÉ)
    if($alert_temp) $message .= "🔥 T°=" . round($temp_actuel,1) . "°C >21°C\n";
    if($alert_hum) $message .= "💧 HR=" . round($hum_actuel,1) . "% " . ($hum_actuel < $MIN_HUM ? "<30%" : ">70%") . "\n";
    $message .= "🕐 " . date('H:i:s');
    
    $url = "https://api.telegram.org/bot" . $telegram_token . "/sendMessage";
    
    $payload = [
        'chat_id' => $chat_id,
        'text' => $message
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $resp = json_decode($response, true);
    $telegram_ok = isset($resp['ok']) && $resp['ok'] === true;
    
    echo json_encode([
        "status" => "OK", 
        "temp" => $temp, 
        "hum" => $hum,
        "debug" => "T=" . round($temp_actuel,1) . "°C | H=" . round($hum_actuel,1) . "%",
        "telegram" => $telegram_ok ? "✅ SMS Telegram OK" : "❌ KO",
        "response" => substr($response, 0, 200)
    ]);
} else {
    echo json_encode([
        "status" => "OK", 
        "temp" => $temp, 
        "hum" => $hum,
        "debug" => "T=" . round($temp_actuel,1) . "°C | H=" . round($hum_actuel,1) . "% (normal)",
        "statut" => "✅ OK"
    ]);
}

$conn->close();
?>
