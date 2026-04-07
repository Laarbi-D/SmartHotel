// ============================================================
//  DONNÉES COMMANDES
// ============================================================
const orders = [
  { id: 1, customer: "Mohamed MAKBOUL", status: "pending" },
  { id: 2, customer: "Lukas VACHET", status: "in-progress" },
  { id: 3, customer: "Victor OLIVEIRA", status: "canceled" },
  { id: 4, customer: "Nicolas PICQUET", status: "canceled" },
  { id: 5, customer: "Théo VIGREUX", status: "done" },
  { id: 6, customer: "Enzo MENSIER", status: "in-progress" },
  { id: 7, customer: "Wassim SID", status: "pending" },
  { id: 8, customer: "Reda OULED TAIB", status: "done" }
];

const statusLabels = {
  pending:       ['Pending',     'status-pending'],
  'in-progress': ['In progress', 'status-in-progress'],
  done:          ['Done',        'status-done'],
  canceled:      ['Canceled',    'status-canceled']
};

// ============================================================
//  PAGE ORDERS.PHP — tableau complet + pagination
// ============================================================
const tbody       = document.getElementById('orders-body');
const prevBtn     = document.getElementById('prev-page');
const nextBtn     = document.getElementById('next-page');
const pageInfo    = document.getElementById('page-info');
const actionMenu  = document.getElementById('action-menu');
const searchInput = document.getElementById('order-search');

if (tbody && prevBtn) {
  const rowsPerPage = 6;
  let currentPage = 1;
  let filteredOrders = [...orders];
  let currentActionOrderId = null;

  function buildRow(order) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.customer}</td>
      <td>#${order.id}</td>
      <td><span class="status-badge ${statusLabels[order.status][1]}">${statusLabels[order.status][0]}</span></td>
      <td><button class="action-btn" data-id="${order.id}">&#x22EE;</button></td>
    `;
    return tr;
  }

  function renderTable() {
    tbody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    filteredOrders.slice(start, start + rowsPerPage).forEach((order) => {
      tbody.appendChild(buildRow(order));
    });
    updatePagination();
  }

  function updatePagination() {
    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;
    pageInfo.textContent = 'Page ' + currentPage + ' / ' + totalPages;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filteredOrders = orders.filter((o) =>
        o.customer.toLowerCase().includes(searchInput.value.toLowerCase())
      );
      currentPage = 1;
      renderTable();
    });
  }

  prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); } });
  nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
    if (currentPage < totalPages) { currentPage++; renderTable(); }
  });

  if (actionMenu) {
    tbody.addEventListener('click', (e) => {
      if (e.target.classList.contains('action-btn')) {
        currentActionOrderId = e.target.dataset.id;
        const rect = e.target.getBoundingClientRect();
        actionMenu.style.top = window.scrollY + rect.bottom + 'px';
        actionMenu.style.left = rect.left + 'px';
        actionMenu.classList.remove('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!actionMenu.contains(e.target) && !e.target.classList.contains('action-btn')) {
        actionMenu.classList.add('hidden');
      }
    });

    actionMenu.addEventListener('click', (e) => {
      if (e.target.dataset.action) {
        console.log('Action', e.target.dataset.action, 'order', currentActionOrderId);
        actionMenu.classList.add('hidden');
      }
    });
  }

  renderTable();
}

// ============================================================
//  PAGE ACCUEIL.PHP — recent orders (3 dernières)
// ============================================================
const recentBody = document.getElementById('recent-orders-body');
if (recentBody) {
  orders.slice(-3).forEach((order) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.customer}</td>
      <td>#${order.id}</td>
      <td><span class="status-badge ${statusLabels[order.status][1]}">${statusLabels[order.status][0]}</span></td>
      <td><button class="action-btn">&#x22EE;</button></td>
    `;
    recentBody.appendChild(tr);
  });
}

// ============================================================
//  PAGE ACCUEIL.PHP — graphique + KPI cards
// ============================================================
const envChart = document.getElementById('envChart');
if (envChart) {
  const temps = [27.8,27.5,27.0,26.5,25.8,25.1,24.5,23.9,23.5,23.2,23.0,22.8,22.5,22.3,22.0,21.8,21.5,21.2,20.9,20.8,20.7,20.5,20.3,20.1];
  const hums  = [78,76,73,70,68,65,62,60,59,58,57,57,56,56,55,55,55,56,57,58,59,61,63,65];

  const tempValue = document.getElementById('temp-value');
  const humValue  = document.getElementById('hum-value');
  if (tempValue) tempValue.textContent = temps[temps.length - 1].toFixed(1) + '°C';
  if (humValue)  humValue.textContent  = hums[hums.length - 1].toFixed(1) + '%';

  const labels = [];
  for (let i = 0; i < 24; i++) {
    labels.push(((11 + i) % 24).toString().padStart(2, '0') + ':00');
  }

  new Chart(envChart.getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Humidity (%)',
          data: hums,
          yAxisID: 'yHum',
          borderColor: '#4a90d9',
          backgroundColor: 'rgba(74,144,217,0.08)',
          pointBackgroundColor: '#fff',
          pointBorderColor: '#4a90d9',
          pointRadius: 4,
          tension: 0.4,
          fill: false,
          borderWidth: 2
        },
        {
          label: 'Temperature (°C)',
          data: temps,
          yAxisID: 'yTemp',
          borderColor: '#e8a020',
          backgroundColor: 'rgba(232,160,32,0.08)',
          pointBackgroundColor: '#fff',
          pointBorderColor: '#e8a020',
          pointRadius: 4,
          tension: 0.4,
          fill: false,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // ✅ ajouté ici
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, font: { family: 'DM Sans', size: 12 }, color: '#555' }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.06)', borderDash: [4,4] },
          ticks: { font: { family: 'DM Sans', size: 11 }, color: '#888', maxRotation: 0 }
        },
        yTemp: {
          type: 'linear', position: 'right',
          title: { display: true, text: 'Temperature (°C)', color: '#e8a020' },
          ticks: { color: '#e8a020' },
          grid: { borderDash: [4,4] },
          min: 0, max: 35
        },
        yHum: {
          type: 'linear', position: 'left',
          title: { display: true, text: 'Humidity (%)', color: '#4a90d9' },
          ticks: { color: '#4a90d9' },
          grid: { display: false },
          min: 0, max: 100
        }
      }
    }
  });
}

// ============================================================
//  DÉCONNEXION
// ============================================================
function handleDisconnect() {
  if (confirm('Voulez-vous vous déconnecter ?')) {
    window.location.href = 'login.php';
  }
}
