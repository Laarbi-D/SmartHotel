// Données simulées (En production, vous récupérerez ça via une API PHP/MySQL avec fetch)
const chartLabels = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00'];
const tempValues = [26, 26.5, 26.2, 25, 24, 23, 23, 21, 19, 20.5, 19.5, 18.5, 16.5, 17.5, 20, 19.5, 20.5, 21.5, 21.5, 23.5, 23.5, 25.5, 26, 25.1];
const humValues = [48, 50, 45, 49, 50, 48, 52, 54, 59, 62, 58, 62, 63, 66, 60, 61, 60, 56, 50, 52, 48, 43, 41, 51.1];

// Fonction appelée quand on clique sur le bouton Disconnect
function handleDisconnect() {
    if(confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
        // Redirection vers la page de déconnexion (à créer)
        window.location.href = "logout.php";
    }
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    
    // Mettre à jour les valeurs des cartes dynamiquement
    const latestTemp = tempValues[tempValues.length - 1];
    const latestHum = humValues[humValues.length - 1];
    
    document.getElementById('temp-value').textContent = latestTemp + '°C';
    document.getElementById('hum-value').textContent = latestHum + '%';

    // Création du graphique Chart.js
    const ctx = document.getElementById('envChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Humidity (%)',
                    data: humValues,
                    borderColor: '#3B82F6', // Bleu
                    backgroundColor: '#ffffff',
                    borderWidth: 2,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#3B82F6',
                    pointBorderWidth: 2,
                    pointRadius: 3,
                    yAxisID: 'y1',
                    tension: 0.4 // Rend la courbe un peu plus lisse
                },
                {
                    label: 'Temperature (°C)',
                    data: tempValues,
                    borderColor: '#F59E0B', // Orange
                    backgroundColor: '#ffffff',
                    borderWidth: 2,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#F59E0B',
                    pointBorderWidth: 2,
                    pointRadius: 3,
                    yAxisID: 'y',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: {
                            family: "'DM Sans', sans-serif",
                            size: 13
                        },
                        generateLabels: function(chart) {
                            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            labels.forEach(label => {
                                if(label.text === 'Humidity (%)') label.fontColor = '#3B82F6';
                                if(label.text === 'Temperature (°C)') label.fontColor = '#F59E0B';
                            });
                            return labels;
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#111827',
                    bodyColor: '#4b5563',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    usePointStyle: true
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: '#f3f4f6',
                        drawBorder: false,
                    },
                    ticks: { color: '#6b7280', font: { family: "'DM Mono', monospace", size: 11 } }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    min: 0,
                    max: 28,
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        color: '#9ca3af',
                    },
                    grid: {
                        display: true,
                        color: '#f3f4f6',
                        borderDash: [5, 5]
                    },
                    ticks: { stepSize: 7, color: '#6b7280' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 80,
                    title: {
                        display: true,
                        text: 'Humidity (%)',
                        color: '#9ca3af',
                        rotation: 90
                    },
                    grid: {
                        display: false 
                    },
                    ticks: { stepSize: 20, color: '#6b7280' }
                }
            }
        }
    });
});