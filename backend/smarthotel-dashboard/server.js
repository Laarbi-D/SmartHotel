// ============================================================
// server.js — Serveur Node.js pour le dashboard SmartHotel
// Rôles : serveur web + MySQL + WebSocket + MODBUS/TCP
// ============================================================

const express    = require('express');   // Serveur HTTP
const mysql      = require('mysql2/promise'); // Connexion MySQL
const { WebSocketServer } = require('ws'); // WebSocket temps réel
const net        = require('net');       // Socket TCP pour MODBUS
const http       = require('http');      // Serveur HTTP natif Node.js

// ── Configuration ────────────────────────────────────────────

const CONFIG = {
  // Serveur web
  PORT: 3010,

  // Base de données MySQL (XAMPP)
  DB: {
    host     : 'localhost',
    user     : 'root',
    password : 'rootpassword',
    database : 'smarthotelbdd'
  },

  // Afficheur MODBUS/TCP
  AFFICHEUR: {
    ip  : '192.168.112.210',
    port: 502
  },

  // Seuils d'alerte
  SEUILS: {
    TEMP_MAX : 28,   // °C  — au-delà : alerte
    HUMI_MAX : 60    // %   — au-delà : alerte
  },

  // Intervalle de rafraîchissement (en millisecondes)
  INTERVALLE: 10000  // 10 secondes
};

// ── Initialisation Express + HTTP ────────────────────────────

const app    = express();
const server = http.createServer(app);

// Servir les fichiers statiques du dossier "public"
app.use(express.static('public'));

// ── Route API : historique 24h ────────────────────────────────
// Le navigateur appelle cette route au chargement pour remplir le graphique

app.get('/api/history', async (req, res) => {
  try {
    const db = await mysql.createConnection(CONFIG.DB);

    // Récupère toutes les mesures des dernières 24 heures
    const [rows] = await db.execute(`
      SELECT TYPE_CAPTEUR, MESURE, DATE_MESURE
      FROM MESURE_CAPTEUR
      WHERE DATE_MESURE >= NOW() - INTERVAL 24 HOUR
      ORDER BY DATE_MESURE ASC
    `);

    await db.end();

    // Sépare températures et humidités en deux tableaux
    const temperatures = rows
      .filter(r => r.TYPE_CAPTEUR === 'T')
      .map(r => ({ x: r.DATE_MESURE, y: r.MESURE }));

    const humidites = rows
      .filter(r => r.TYPE_CAPTEUR === 'H')
      .map(r => ({ x: r.DATE_MESURE, y: r.MESURE }));

    res.json({ temperatures, humidites });

  } catch (err) {
    console.error('Erreur API history :', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Serveur WebSocket ─────────────────────────────────────────
// Les clients (navigateurs) se connectent ici pour recevoir
// les données en temps réel sans recharger la page

const wss = new WebSocketServer({ server });

// Diffuse un message à tous les clients WebSocket connectés
function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(message);
    }
  });
}

// ── Envoi MODBUS/TCP vers l'afficheur ────────────────────────

function envoyerModbusTCP(temperature, humidite) {
  return new Promise((resolve, reject) => {

    // Formatage sur 2 lignes de 12 caractères
    // Ligne 1 : température,  Ligne 2 : humidité
    const ligne1 = `Temp:${temperature.toFixed(1)}C`.padEnd(12).slice(0, 12);
    const ligne2 = `Humi:${humidite.toFixed(1)}%`.padEnd(12).slice(0, 12);
    const texte  = ligne1 + ligne2; // 24 caractères au total

    const octets   = Buffer.from(texte, 'ascii');
    const nb_mots  = octets.length / 2;   // 12 mots
    const nb_octets = octets.length;       // 24 octets

    // Construction du corps MODBUS (voir documentation page 15)
    const corps = Buffer.alloc(7 + nb_octets);
    corps[0] = 0x01;                        // Unit ID (esclave 1)
    corps[1] = 0x10;                        // Fonction 16 (0x10h)
    corps.writeUInt16BE(0x0001, 2);         // Adresse premier registre
    corps.writeUInt16BE(nb_mots, 4);        // Nombre de mots
    corps[6] = nb_octets;                   // Nombre d'octets
    octets.copy(corps, 7);                  // Données ASCII

    // Construction de l'en-tête MODBUS/TCP (6 octets)
    const entete = Buffer.alloc(6);
    entete.writeUInt16BE(0x0001, 0);        // Transaction ID
    entete.writeUInt16BE(0x0000, 2);        // Protocol ID (toujours 0)
    entete.writeUInt16BE(corps.length, 4);  // Longueur du corps

    const trame = Buffer.concat([entete, corps]);

    // Envoi via socket TCP
    const socket = new net.Socket();
    socket.setTimeout(5000); // Timeout 5 secondes

    socket.connect(CONFIG.AFFICHEUR.port, CONFIG.AFFICHEUR.ip, () => {
      socket.write(trame);
    });

    socket.on('data', (data) => {
      console.log(`[MODBUS] Réponse afficheur : ${data.toString('hex')}`);
      socket.destroy();
      resolve();
    });

    socket.on('error', (err) => {
      console.error(`[MODBUS] Erreur : ${err.message}`);
      socket.destroy();
      reject(err);
    });

    socket.on('timeout', () => {
      console.error('[MODBUS] Timeout — afficheur non joignable');
      socket.destroy();
      reject(new Error('Timeout MODBUS'));
    });
  });
}

// ── Fonction principale : lecture BDD + diffusion + afficheur ─

async function rafraichir() {
  try {
    const db = await mysql.createConnection(CONFIG.DB);

    // Dernière température
    const [rowsT] = await db.execute(`
      SELECT MESURE, DATE_MESURE FROM MESURE_CAPTEUR
      WHERE TYPE_CAPTEUR = 'T'
      ORDER BY DATE_MESURE DESC LIMIT 1
    `);

    // Dernière humidité
    const [rowsH] = await db.execute(`
      SELECT MESURE, DATE_MESURE FROM MESURE_CAPTEUR
      WHERE TYPE_CAPTEUR = 'H'
      ORDER BY DATE_MESURE DESC LIMIT 1
    `);

    await db.end();

    if (!rowsT.length || !rowsH.length) return;

    const temperature = parseFloat(rowsT[0].MESURE);
    const humidite    = parseFloat(rowsH[0].MESURE);
    const horodatage  = rowsT[0].DATE_MESURE;

    // Calcul des alertes selon les seuils définis
    const alerteTemp = temperature > CONFIG.SEUILS.TEMP_MAX;
    const alerteHumi = humidite    > CONFIG.SEUILS.HUMI_MAX;

    console.log(`[BDD] T=${temperature.toFixed(1)}°C (${alerteTemp ? 'ALERTE' : 'OK'}) | H=${humidite.toFixed(1)}% (${alerteHumi ? 'ALERTE' : 'OK'})`);

    // 1. Diffusion WebSocket vers tous les navigateurs connectés
    broadcast({
      type        : 'mesure',
      temperature,
      humidite,
      horodatage,
      alerteTemp,
      alerteHumi
    });

    // 2. Envoi vers l'afficheur MODBUS/TCP
    await envoyerModbusTCP(temperature, humidite);

  } catch (err) {
    console.error('[ERREUR] rafraichir :', err.message);
  }
}

// ── Démarrage ─────────────────────────────────────────────────

server.listen(CONFIG.PORT, () => {
  console.log(`\n====================================`);
  console.log(` SmartHotel Dashboard`);
  console.log(`====================================`);
  console.log(` Serveur web  : http://localhost:${CONFIG.PORT}`);
  console.log(` Afficheur IP : ${CONFIG.AFFICHEUR.ip}:${CONFIG.AFFICHEUR.port}`);
  console.log(` Rafraîchissement : ${CONFIG.INTERVALLE / 1000}s`);
  console.log(`====================================\n`);

  // Premier rafraîchissement immédiat au démarrage
  rafraichir();

  // Puis toutes les X secondes
  setInterval(rafraichir, CONFIG.INTERVALLE);
});
