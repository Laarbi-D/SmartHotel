// ============================================================
// server.js — Serveur Node.js pour le dashboard SmartHotel
// Rôles : serveur web + MySQL + WebSocket + MODBUS/TCP
// ============================================================

const express    = require('express');   
const mysql      = require('mysql2/promise'); 
const { WebSocketServer } = require('ws'); 
const net        = require('net');       
const http       = require('http');      

// ── Configuration ────────────────────────────────────────────

const CONFIG = {
  PORT: 3020,
  DB: {
    host     : 'localhost',
    user     : 'root',
    password : 'rootpassword',
    database : 'smarthotelbdd'
  },
  AFFICHEUR: {
    ip  : '192.168.112.210',
    port: 502
  },
  SEUILS: {
    TEMP_MAX : 21,   
    HUMI_MAX : 70    
  },
  INTERVALLE: 10000  
};

// ── Initialisation Express + HTTP ────────────────────────────

const app    = express();
const server = http.createServer(app);
app.use(express.static('public'));

// ── Route API : historique 24h ────────────────────────────────

app.get('/api/history', async (req, res) => {
  try {
    const db = await mysql.createConnection(CONFIG.DB);
    const [rows] = await db.execute(`
      SELECT TYPE_CAPTEUR, MESURE, DATE_MESURE
      FROM MESURE_CAPTEUR
      WHERE DATE_MESURE >= NOW() - INTERVAL 24 HOUR
      ORDER BY DATE_MESURE ASC
    `);
    await db.end();

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

const wss = new WebSocketServer({ server });

function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

// ── Envoi MODBUS/TCP vers l'afficheur (SILENCIEUX) ────────────

function envoyerModbusTCP(temperature, humidite) {
  return new Promise((resolve, reject) => {
    const ligne1 = `Temp:${temperature.toFixed(1)}C`.padEnd(12).slice(0, 12);
    const ligne2 = `Humi:${humidite.toFixed(1)}%`.padEnd(12).slice(0, 12);
    const texte  = ligne1 + ligne2;

    const octets   = Buffer.from(texte, 'ascii');
    const nb_mots  = octets.length / 2;
    const nb_octets = octets.length;

    const corps = Buffer.alloc(7 + nb_octets);
    corps[0] = 0x01;
    corps[1] = 0x10;
    corps.writeUInt16BE(0x0001, 2);
    corps.writeUInt16BE(nb_mots, 4);
    corps[6] = nb_octets;
    octets.copy(corps, 7);

    const entete = Buffer.alloc(6);
    entete.writeUInt16BE(0x0001, 0);
    entete.writeUInt16BE(0x0000, 2);
    entete.writeUInt16BE(corps.length, 4);

    const trame = Buffer.concat([entete, corps]);

    const socket = new net.Socket();
    socket.setTimeout(2000);

    socket.connect(CONFIG.AFFICHEUR.port, CONFIG.AFFICHEUR.ip, () => {
      socket.write(trame);
    });

    socket.on('data', () => {
      socket.destroy();
      resolve();
    });

    socket.on('error', (err) => {
      socket.destroy();
      reject(err);
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// ── Fonction principale (SILENCIEUSE) ───────────────────────

async function rafraichir() {
  try {
    const db = await mysql.createConnection(CONFIG.DB);

    const [rowsT] = await db.execute(`
      SELECT MESURE, DATE_MESURE FROM MESURE_CAPTEUR
      WHERE TYPE_CAPTEUR = 'T'
      ORDER BY DATE_MESURE DESC LIMIT 1
    `);

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

    const alerteTemp = temperature > CONFIG.SEUILS.TEMP_MAX;
    const alerteHumi = humidite    > CONFIG.SEUILS.HUMI_MAX;

    broadcast({
      type        : 'mesure',
      temperature,
      humidite,
      horodatage,
      alerteTemp,
      alerteHumi
    });

    await envoyerModbusTCP(temperature, humidite);

  } catch (err) {
    // Silencieux
  }
}

// ── Démarrage (UN SEUL ÉTAT AFFICHEUR) ───────────────────────

let afficheurTeste = false;

async function testerAfficheur() {
  if (afficheurTeste) return 'Active'; // Déjà testé
  
  console.log('🔍 Test afficheur...');
  
  try {
    await envoyerModbusTCP(20.0, 50.0);
    afficheurTeste = true;
    return 'Active';
  } catch (err) {
    afficheurTeste = true;
    return 'Erreur';
  }
}

server.listen(CONFIG.PORT, async () => {
  console.log(`\n====================================`);
  console.log(` SmartHotel Dashboard`);
  console.log(`====================================`);
  console.log(` Serveur web  : http://localhost:${CONFIG.PORT}`);
  console.log(` Afficheur IP : ${CONFIG.AFFICHEUR.ip}:${CONFIG.AFFICHEUR.port}`);
  
  // UN SEUL TEST AFFICHEUR
  const etatAfficheur = await testerAfficheur();
  console.log(` État afficheur : ${etatAfficheur}`);
  console.log(` Rafraîchissement : ${CONFIG.INTERVALLE / 1000}s`);
  console.log(`====================================\n`);

  rafraichir();
  setInterval(rafraichir, CONFIG.INTERVALLE);
});