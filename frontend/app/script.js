document.addEventListener("DOMContentLoaded", function() {
    // Vérification de sécurité : s'assurer que les données PHP ont bien été transmises
    if (typeof chartLabels === 'undefined' || typeof tempValues === 'undefined' || typeof humValues === 'undefined') {
        console.error("Les données du graphique n'ont pas été trouvées.");
        return;
    }

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
                    borderWidth: 1.5,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#3B82F6',
                    pointBorderWidth: 1.5,
                    pointRadius: 3,
                    yAxisID: 'y1',
                    tension: 0.3
                },
                {
                    label: 'Temperature (°C)',
                    data: tempValues,
                    borderColor: '#F59E0B', // Orange
                    backgroundColor: '#ffffff',
                    borderWidth: 1.5,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#F59E0B',
                    pointBorderWidth: 1.5,
                    pointRadius: 3,
                    yAxisID: 'y',
                    tension: 0.3
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
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        // Personnalise la couleur du texte de la légende pour correspondre à la ligne
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
                        tickLength: 5
                    },
                    ticks: { color: '#6b7280', font: { size: 11 } }
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
                        font: { size: 12 }
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
                        font: { size: 12 },
                        rotation: 90
                    },
                    grid: {
                        display: false // Masque la grille pour ne pas superposer avec celle de gauche
                    },
                    ticks: { stepSize: 20, color: '#6b7280' }
                }
            }
        }
    });
});