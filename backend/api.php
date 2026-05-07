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

// 1. Paramètres de connexion
$host = 'mysql'; 
$db   = 'smart_hotel_bdd'; 
$user = 'root';
$pass = 'rootpassword'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // ==========================================
    // CAS 1 : ENREGISTRER UNE COMMANDE (POST)
    // ==========================================
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_GET['action'])) {
        $raw_input = file_get_contents("php://input");
        $data = json_decode($raw_input, true);

        if ($data) {
            $sql = "INSERT INTO commande (
                        ID_CLIENT, 
                        ID_EMPLOYE, 
                        id_tables_transat, 
                        DATE_COMMANDE, 
                        STATUT_COMMANDE, 
                        DETAIL_COMMANDE, 
                        MONTANT_TOTAL
                    ) VALUES (?, ?, ?, NOW(), ?, ?, ?)";
            
            $stmt = $pdo->prepare($sql);
            $res = $stmt->execute([
                $data['ID_CLIENT'] ?? 1,
                $data['ID_EMPLOYE'] ?? 1,
                $data['id_tables_transat'] ?? 0,
                'en attente',
                $data['DETAIL_COMMANDE'],
                $data['MONTANT_TOTAL']
            ]);

            if ($res) {
                echo json_encode(["status" => "success", "message" => "Commande enregistrée"]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Erreur lors de l'insertion"]);
            }
            exit;
        }
    }

    // ==========================================
    // CAS 2 : CONNEXION (LOGIN) - via ?action=login
    // ==========================================
    $action = $_GET['action'] ?? '';
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
    // CAS 3 : RÉCUPÉRATION DES TABLES (GET)
    // ==========================================
    $requestedTable = $_GET['table'] ?? 'produit';
    $allowedTables = [
        'capteur', 'chambre', 'client', 'commande', 'employe', 
        'espace', 'gerer', 'gerer_stock', 'ligne_commande', 
        'produit', 'tables_transat', 'type_capteur', 
        'type_employe', 'type_espace'
    ];

    if (!in_array(strtolower($requestedTable), $allowedTables)) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Table inexistante ou accès refusé"]);
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM " . strtolower($requestedTable));
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