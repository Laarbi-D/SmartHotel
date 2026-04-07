// ============================================================
// script.js — JavaScript du dashboard SmartHotel
// Rôles : initialisation Chart.js, chargement historique,
//         mise à jour des cartes, connexion WebSocket
// ============================================================

// ── Seuils d'alerte (doivent correspondre à CONFIG.SEUILS dans server.js) ──
const SEUIL_TEMP = 28;
const SEUIL_HUMI = 60;

// ── Initialisation du graphique Chart.js ─────────────────────

const ctx   = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [
      {
        label           : 'Température (°C)',
        data            : [],
        borderColor     : '#f59e0b',
        backgroundColor : 'rgba(245,158,11,0.08)',
        borderWidth     : 2,
        pointRadius     : 2,
        pointHoverRadius: 5,
        tension         : 0.4,
        fill            : true,
        yAxisID         : 'y'
      },
      {
        label           : 'Humidité (%)',
        data            : [],
        borderColor     : '#06b6d4',
        backgroundColor : 'rgba(6,182,212,0.08)',
        borderWidth     : 2,
        pointRadius     : 2,
        pointHoverRadius: 5,
        tension         : 0.4,
        fill            : true,
        yAxisID         : 'y1'
      }
    ]
  },
  options: {
    responsive         : true,
    maintainAspectRatio: false,
    interaction        : { mode: 'index', intersect: false },
    plugins: {
      legend : { display: false },
      tooltip: {
        backgroundColor: '#0f1520',
        borderColor    : '#1e2d45',
        borderWidth    : 1,
        titleColor     : '#94a3b8',
        bodyColor      : '#e2e8f0',
        padding        : 12
      }
    },
    scales: {
      x: {
        type : 'time',
        time : { displayFormats: { hour: 'HH:mm', minute: 'HH:mm' } },
        grid : { color: 'rgba(30,45,69,0.8)' },
        ticks: { color: '#475569', font: { family: 'Azeret Mono', size: 10 } }
      },
      y: {
        position: 'left',
        grid    : { color: 'rgba(30,45,69,0.8)' },
        ticks   : { color: '#f59e0b', font: { family: 'Azeret Mono', size: 10 },
                    callback: v => v + '°C' }
      },
      y1: {
        position: 'right',
        grid    : { drawOnChartArea: false },
        ticks   : { color: '#06b6d4', font: { family: 'Azeret Mono', size: 10 },
                    callback: v => v + '%' }
      }
    }
  }
});

// ── Chargement de l'historique 24h au démarrage ──────────────

async function chargerHistorique() {
  try {
    const res  = await fetch('/api/history');
    const data = await res.json();

    chart.data.datasets[0].data = data.temperatures.map(d => ({
      x: new Date(d.x), y: d.y
    }));
    chart.data.datasets[1].data = data.humidites.map(d => ({
      x: new Date(d.x), y: d.y
    }));
    chart.update();
  } catch (e) {
    console.error('Erreur chargement historique :', e);
  }
}

chargerHistorique();

// ── Mise à jour des cartes capteurs ──────────────────────────

function mettreAJourCarte(id, valeur, seuil, badgeId, barId) {
  const card    = document.getElementById(id);
  const badge   = document.getElementById(badgeId);
  const bar     = document.getElementById(barId);
  const valElem = document.getElementById(id === 'card-temp' ? 'val-temp' : 'val-humi');

  // Mise à jour de la valeur affichée
  valElem.textContent = valeur.toFixed(1);

  // Calcul du pourcentage pour la barre (max = 2× le seuil)
  const pct = Math.min((valeur / (seuil * 2)) * 100, 100);
  bar.style.width = pct + '%';

  // Bascule alerte / normal
  const enAlerte = valeur > seuil;
  card.classList.toggle('alerte', enAlerte);
  badge.classList.toggle('alerte',  enAlerte);
  badge.classList.toggle('normal', !enAlerte);
  badge.querySelector('span:last-child').textContent = enAlerte ? 'Alerte' : 'Normal';
}

// ── WebSocket — réception des données en temps réel ──────────

function connecterWebSocket() {
  const ws    = new WebSocket(`ws://${location.host}`);
  const dot   = document.getElementById('ws-dot');
  const label = document.getElementById('ws-label');

  ws.onopen = () => {
    dot.classList.remove('offline');
    label.textContent = 'Connecté';
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type !== 'mesure') return;

    // Mise à jour des cartes
    mettreAJourCarte('card-temp', data.temperature, SEUIL_TEMP, 'badge-temp', 'bar-temp');
    mettreAJourCarte('card-humi', data.humidite,    SEUIL_HUMI, 'badge-humi', 'bar-humi');

    // Ajout du nouveau point au graphique
    const ts = new Date(data.horodatage);
    chart.data.datasets[0].data.push({ x: ts, y: data.temperature });
    chart.data.datasets[1].data.push({ x: ts, y: data.humidite    });

    // Suppression des points de plus de 24h
    const limite = Date.now() - 24 * 3600 * 1000;
    chart.data.datasets.forEach(ds => {
      ds.data = ds.data.filter(p => p.x.getTime() > limite);
    });

    chart.update('none'); // sans animation pour fluidité

    // Horodatage
    document.getElementById('last-update').textContent =
      'Dernière mise à jour : ' + ts.toLocaleTimeString('fr-FR');

    // Statut afficheur MODBUS
    document.getElementById('modbus-status').className = 'afficheur-status ok';
    document.getElementById('modbus-label').textContent = 'Envoyé à ' + ts.toLocaleTimeString('fr-FR');
  };

  ws.onclose = () => {
    dot.classList.add('offline');
    label.textContent = 'Déconnecté';
    setTimeout(connecterWebSocket, 3000); // reconnexion automatique après 3s
  };

  ws.onerror = () => {
    dot.classList.add('offline');
    label.textContent = 'Erreur';
  };
}

connecterWebSocket();
