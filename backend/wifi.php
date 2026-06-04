<?php
// Démarrage de la session pour conserver les informations de l'utilisateur après la connexion
session_start();

// ==========================================
// GESTION DU MULTILINGUISME (PHP)
// ==========================================
// Changement de langue via l'URL (?lang=fr)
if (isset($_GET['lang']) && in_array($_GET['lang'], ['fr', 'en', 'es'])) {
    $_SESSION['wifi_lang'] = $_GET['lang'];
}
// Langue par défaut : Français
$lang = $_SESSION['wifi_lang'] ?? 'fr';

// Dictionnaire des traductions
$translations = [
    'fr' => [
        'title' => 'Accès Réseau Wi-Fi',
        'connected' => 'Connecté !',
        'welcome' => 'Bienvenue',
        'access_level' => 'Accès :',
        'browse' => 'Naviguer sur internet',
        'tab_client' => 'Clients',
        'tab_staff' => 'Personnel',
        'room_num' => 'Numéro de chambre',
        'room_ph' => 'Ex: 104',
        'lastname' => 'Nom de famille',
        'lastname_ph' => 'Ex: Dupont',
        'btn_client' => 'Connexion Client',
        'staff_id' => 'Code Personnel (ID)',
        'staff_id_ph' => 'Votre code d\'identification',
        'staff_name' => 'Nom de l\'employé',
        'staff_name_ph' => 'Votre nom',
        'btn_staff' => 'Accès Personnel',
        'err_empty' => 'Veuillez remplir tous les champs.',
        'err_client' => 'Nom ou numéro de chambre incorrect.',
        'err_staff' => 'Nom ou code employé incorrect.',
        'err_server' => 'Erreur de connexion au serveur.'
    ],
    'en' => [
        'title' => 'Wi-Fi Network Access',
        'connected' => 'Connected!',
        'welcome' => 'Welcome',
        'access_level' => 'Access Level:',
        'browse' => 'Browse the Internet',
        'tab_client' => 'Guests',
        'tab_staff' => 'Staff',
        'room_num' => 'Room Number',
        'room_ph' => 'e.g., 104',
        'lastname' => 'Last Name',
        'lastname_ph' => 'e.g., Smith',
        'btn_client' => 'Guest Login',
        'staff_id' => 'Staff Code (ID)',
        'staff_id_ph' => 'Your identification code',
        'staff_name' => 'Employee Name',
        'staff_name_ph' => 'Your name',
        'btn_staff' => 'Staff Login',
        'err_empty' => 'Please fill in all fields.',
        'err_client' => 'Incorrect name or room number.',
        'err_staff' => 'Incorrect employee name or code.',
        'err_server' => 'Server connection error.'
    ],
    'es' => [
        'title' => 'Acceso a la Red Wi-Fi',
        'connected' => '¡Conectado!',
        'welcome' => 'Bienvenido',
        'access_level' => 'Acceso:',
        'browse' => 'Navegar por internet',
        'tab_client' => 'Huéspedes',
        'tab_staff' => 'Personal',
        'room_num' => 'Número de habitación',
        'room_ph' => 'Ej: 104',
        'lastname' => 'Apellido',
        'lastname_ph' => 'Ej: García',
        'btn_client' => 'Acceso Huésped',
        'staff_id' => 'Código de Personal (ID)',
        'staff_id_ph' => 'Su código de identificación',
        'staff_name' => 'Nombre del empleado',
        'staff_name_ph' => 'Su nombre',
        'btn_staff' => 'Acceso Personal',
        'err_empty' => 'Por favor, complete todos los campos.',
        'err_client' => 'Nombre o número de habitación incorrectos.',
        'err_staff' => 'Nombre o código de empleado incorrectos.',
        'err_server' => 'Error de conexión con el servidor.'
    ]
];

// Raccourci pour utiliser le dictionnaire actif
$t = $translations[$lang];

// --- Configuration de la base de données ---
$host = 'mysql'; 
$db   = 'smart_hotel_bdd'; 
$user = 'root';
$pass = 'rootpassword'; 

$message_erreur = "";
$connexion_reussie = false;
$role_actif = $_GET['type'] ?? 'client'; 

// --- Traitement du formulaire ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $role_actif = $_POST['type_connexion'] ?? 'client';
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        // CAS 1 : CLIENT
        if ($role_actif === 'client') {
            $nom = trim($_POST['nom_client'] ?? '');
            $chambre = trim($_POST['chambre'] ?? '');

            if (empty($nom) || empty($chambre)) {
                $message_erreur = $t['err_empty'];
            } else {
                $sql = "SELECT * FROM client WHERE (LOWER(NOM_CLIENT) = LOWER(:val) OR LOWER(PRENOM_CLIENT) = LOWER(:val)) AND ID_CHAMBRE = :room";
                $stmt = $pdo->prepare($sql);
                $stmt->execute(['val' => $nom, 'room' => $chambre]);
                $client = $stmt->fetch();

                if ($client) {
                    $connexion_reussie = true;
                    $_SESSION['wifi_user'] = $client['PRENOM_CLIENT'] . ' ' . $client['NOM_CLIENT'];
                    $_SESSION['wifi_role'] = 'Client';
                } else {
                    $message_erreur = $t['err_client'];
                }
            }
        } 
        // CAS 2 : EMPLOYÉ
        else if ($role_actif === 'employe') {
            $nom_employe = trim($_POST['nom_employe'] ?? '');
            $code_employe = trim($_POST['code_employe'] ?? '');

            if (empty($nom_employe) || empty($code_employe)) {
                $message_erreur = $t['err_empty'];
            } else {
                $sql = "SELECT * FROM employe WHERE LOWER(NOM_EMPLOYE) = LOWER(:val) AND ID_EMPLOYE = :code";
                $stmt = $pdo->prepare($sql);
                $stmt->execute(['val' => $nom_employe, 'code' => $code_employe]);
                $employe = $stmt->fetch();

                if ($employe) {
                    $connexion_reussie = true;
                    $_SESSION['wifi_user'] = $employe['NOM_EMPLOYE'];
                    $_SESSION['wifi_role'] = 'Employé(e)';
                } else {
                    $message_erreur = $t['err_staff'];
                }
            }
        }
    } catch (PDOException $e) {
        $message_erreur = $t['err_server'];
    }
}
?>

<!DOCTYPE html>
<html lang="<?= htmlspecialchars($lang) ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portail Wi-Fi - Barcelo Hotel</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fadeIn 0.4s ease-out; }
    </style>
</head>
<body class="bg-slate-900 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    
    <div class="absolute top-6 right-6 z-50 flex gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
        <a href="?lang=fr&type=<?= htmlspecialchars($role_actif) ?>" class="text-xl transition-transform hover:scale-125 <?= $lang === 'fr' ? 'scale-125 opacity-100' : 'opacity-50' ?>">🇫🇷</a>
        <a href="?lang=en&type=<?= htmlspecialchars($role_actif) ?>" class="text-xl transition-transform hover:scale-125 <?= $lang === 'en' ? 'scale-125 opacity-100' : 'opacity-50' ?>">🇬🇧</a>
        <a href="?lang=es&type=<?= htmlspecialchars($role_actif) ?>" class="text-xl transition-transform hover:scale-125 <?= $lang === 'es' ? 'scale-125 opacity-100' : 'opacity-50' ?>">🇪🇸</a>
    </div>

    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

    <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative z-10 fade-in">
        
        <div class="text-center mb-6">
            <img src="/images/logobarcelo.png" alt="Barcelo Logo" class="mx-auto h-20 object-contain mb-4" onerror="this.src='https://placehold.co/200x80?text=Barcelo+Logo'">
            <h1 class="text-2xl font-serif text-slate-800"><?= $t['title'] ?></h1>
        </div>

        <?php if ($connexion_reussie): ?>
            
            <div class="text-center py-6 fade-in">
                <div class="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 class="text-2xl font-bold text-slate-800 mb-2"><?= $t['connected'] ?></h2>
                <p class="text-slate-600 mb-2"><?= $t['welcome'] ?> <b><?= htmlspecialchars($_SESSION['wifi_user']) ?></b>.</p>
                <span class="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full mb-6">
                    <?= $t['access_level'] ?> <?= htmlspecialchars($_SESSION['wifi_role']) ?>
                </span>
                
                <a href="https://google.com" class="block w-full py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors">
                    <?= $t['browse'] ?>
                </a>
            </div>

        <?php else: ?>
            
            <div class="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button onclick="switchTab('client')" id="btn-client" class="<?= $role_actif === 'client' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700' ?> flex-1 py-2 text-sm font-semibold rounded-lg transition-all">
                    <?= $t['tab_client'] ?>
                </button>
                <button onclick="switchTab('employe')" id="btn-employe" class="<?= $role_actif === 'employe' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700' ?> flex-1 py-2 text-sm font-semibold rounded-lg transition-all">
                    <?= $t['tab_staff'] ?>
                </button>
            </div>

            <?php if (!empty($message_erreur)): ?>
                <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 fade-in" role="alert">
                    <p class="font-medium"><?= htmlspecialchars($message_erreur) ?></p>
                </div>
            <?php endif; ?>

            <div id="tab-client" class="tab-content <?= $role_actif === 'client' ? 'active' : '' ?>">
                <form method="POST" action="wifi.php" class="space-y-5">
                    <input type="hidden" name="type_connexion" value="client">
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1"><?= $t['room_num'] ?></label>
                        <input type="text" name="chambre" required placeholder="<?= $t['room_ph'] ?>" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all" value="<?= $role_actif === 'client' && isset($_POST['chambre']) ? htmlspecialchars($_POST['chambre']) : '' ?>">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1"><?= $t['lastname'] ?></label>
                        <input type="text" name="nom_client" required placeholder="<?= $t['lastname_ph'] ?>" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all" value="<?= $role_actif === 'client' && isset($_POST['nom_client']) ? htmlspecialchars($_POST['nom_client']) : '' ?>">
                    </div>

                    <button type="submit" class="w-full py-3 mt-4 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors shadow-lg hover:shadow-teal-500/30">
                        <?= $t['btn_client'] ?>
                    </button>
                </form>
            </div>

            <div id="tab-employe" class="tab-content <?= $role_actif === 'employe' ? 'active' : '' ?>">
                <form method="POST" action="wifi.php" class="space-y-5">
                    <input type="hidden" name="type_connexion" value="employe">
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1"><?= $t['staff_id'] ?></label>
                        <input type="password" name="code_employe" required placeholder="<?= $t['staff_id_ph'] ?>" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value="<?= $role_actif === 'employe' && isset($_POST['code_employe']) ? htmlspecialchars($_POST['code_employe']) : '' ?>">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1"><?= $t['staff_name'] ?></label>
                        <input type="text" name="nom_employe" required placeholder="<?= $t['staff_name_ph'] ?>" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" value="<?= $role_actif === 'employe' && isset($_POST['nom_employe']) ? htmlspecialchars($_POST['nom_employe']) : '' ?>">
                    </div>

                    <button type="submit" class="w-full py-3 mt-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors shadow-lg hover:shadow-slate-500/30">
                        <?= $t['btn_staff'] ?>
                    </button>
                </form>
            </div>

        <?php endif; ?>

    </div>

    <script>
        function switchTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            
            document.getElementById('btn-client').className = 'flex-1 py-2 text-sm font-semibold rounded-lg transition-all text-slate-500 hover:text-slate-700';
            document.getElementById('btn-employe').className = 'flex-1 py-2 text-sm font-semibold rounded-lg transition-all text-slate-500 hover:text-slate-700';
            
            document.getElementById('tab-' + tabName).classList.add('active');
            
            document.getElementById('btn-' + tabName).className = 'flex-1 py-2 text-sm font-semibold rounded-lg transition-all bg-white shadow text-slate-800';
        }
    </script>
</body>
</html>