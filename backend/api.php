<?php
// En-têtes pour autoriser les requêtes depuis ton Frontend React/Next.js
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Gestion du Preflight (requêtes OPTIONS de Next.js)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Paramètres de connexion (Utilise le nom du service Docker 'mysql')
$host = 'mysql'; 
$db   = 'smart_hotel_bdd'; 
$user = 'root';
$pass = 'rootpassword'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // On récupère l'action ou la table demandée
    $action = $_GET['action'] ?? '';
    $requestedTable = $_GET['table'] ?? '';

    // ==========================================
    // CAS 1 : CONNEXION (LOGIN)
    // ==========================================
    if ($action === 'login') {
        $raw_input = file_get_contents("php://input");
        $data = json_decode($raw_input, true);

        if (!$data || !isset($data['nom']) || !isset($data['chambre'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Données manquantes"]);
            exit;
        }

        $input = trim($data['nom']);
        $chambre = trim($data['chambre']);

        // Requête sur tes colonnes exactes : NOM_CLIENT, PRENOM_CLIENT, ID_CHAMBRE
        $sql = "SELECT * FROM client 
                WHERE (
                    LOWER(NOM_CLIENT) = LOWER(:val) 
                    OR LOWER(PRENOM_CLIENT) = LOWER(:val)
                    OR LOWER(CONCAT(PRENOM_CLIENT, ' ', NOM_CLIENT)) = LOWER(:val)
                    OR LOWER(CONCAT(NOM_CLIENT, ' ', PRENOM_CLIENT)) = LOWER(:val)
                )
                AND ID_CHAMBRE = :room";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['val' => $input, 'room' => $chambre]);
        $clientFound = $stmt->fetch();

        if ($clientFound) {
            echo json_encode(["status" => "success", "user" => $clientFound]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Client introuvable"]);
        }
        exit;
    } 

    // ==========================================
    // CAS 2 : RÉCUPÉRATION DES TABLES (14 tables autorisées)
    // ==========================================
    
    // Si on demande une table spécifique (ex: ?table=produit) ou par défaut 'produit'
    $tableName = !empty($requestedTable) ? $requestedTable : 'produit';

    // Liste exhaustive de tes 14 tables
    $allowedTables = [
        'capteur', 'chambre', 'client', 'commande', 'employe', 
        'espace', 'gerer', 'gerer_stock', 'ligne_commande', 
        'produit', 'tables_transat', 'type_capteur', 
        'type_employe', 'type_espace'
    ];

    if (!in_array(strtolower($tableName), $allowedTables)) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Table inexistante ou accès refusé"]);
        exit;
    }

    // Exécution de la requête pour la table demandée
    $stmt = $pdo->query("SELECT * FROM " . strtolower($tableName));
    $results = $stmt->fetchAll();
    
    echo json_encode($results);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Erreur Serveur/BDD",
        "debug" => $e->getMessage()
    ]);
}
?>