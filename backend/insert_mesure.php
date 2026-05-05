<?php
declare(strict_types=1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function respond(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond([
        'status' => 'error',
        'message' => 'Méthode non autorisée. Utilise POST.'
    ], 405);
}

$host = 'mysql';
$db   = 'smart_hotel_bdd';
$user = 'root';
$pass = 'rootpassword';

$telegramToken = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$telegramChatId = getenv('TELEGRAM_CHAT_ID') ?: '';

$temp = isset($_POST['temp']) ? filter_var($_POST['temp'], FILTER_VALIDATE_FLOAT) : null;
$hum  = isset($_POST['hum'])  ? filter_var($_POST['hum'], FILTER_VALIDATE_FLOAT)  : null;

if ($temp === false || $temp === null || $hum === false || $hum === null) {
    respond([
        'status' => 'error',
        'message' => 'temp et hum requis'
    ], 400);
}

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    $stmt = $pdo->prepare("
        INSERT INTO capteur (TYPE_CAPTEUR, MESURE, DATE_MESURE)
        VALUES (:type, :mesure, NOW())
    ");

    $stmt->execute([
        ':type' => 'T',
        ':mesure' => $temp
    ]);

    $stmt->execute([
        ':type' => 'H',
        ':mesure' => $hum
    ]);

    $MAX_TEMP = 21.0;
    $MIN_HUM  = 30.0;
    $MAX_HUM  = 70.0;

    $alertTemp = $temp > $MAX_TEMP;
    $alertHum  = ($hum < $MIN_HUM || $hum > $MAX_HUM);

    $telegram = 'non déclenché';
    $telegramDetail = null;

    if (($alertTemp || $alertHum) && $telegramToken !== '' && $telegramChatId !== '') {
        $message = "🚨 Alerte SmartHotel\n";
        $message .= "Température : " . round((float)$temp, 1) . " °C\n";
        $message .= "Humidité : " . round((float)$hum, 1) . " %\n";
        $message .= "Heure : " . date('Y-m-d H:i:s');

        $payload = http_build_query([
            'chat_id' => $telegramChatId,
            'text' => $message
        ]);

        $ch = curl_init("https://api.telegram.org/bot{$telegramToken}/sendMessage");
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded'
            ]
        ]);

        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($curlError) {
            $telegram = 'erreur';
            $telegramDetail = $curlError;
        } elseif ($httpCode >= 200 && $httpCode < 300) {
            $telegram = 'ok';
            $telegramDetail = $response;
        } else {
            $telegram = 'erreur';
            $telegramDetail = $response;
        }
    }

    respond([
        'status' => 'success',
        'message' => 'Mesures enregistrées',
        'data' => [
            'temp' => round((float)$temp, 2),
            'hum' => round((float)$hum, 2),
            'alert_temp' => $alertTemp,
            'alert_hum' => $alertHum,
            'telegram' => $telegram
        ]
    ]);

} catch (Throwable $e) {
    respond([
        'status' => 'error',
        'message' => 'Erreur serveur',
        'debug' => $e->getMessage()
    ], 500);
}
?>