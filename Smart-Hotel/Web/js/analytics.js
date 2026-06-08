async function loadRealTimeData() {
    try {
        // Appel vers l'API PHP conservée
        const response = await fetch(`${IOT_URL}/getData.php`);
        const data = await response.json();
        
        if(data) {
            document.getElementById('kpi-temp').textContent = `${data.temperature} °C`;
            document.getElementById('kpi-hum').textContent = `${data.humidite} %`;
            
            // Logique de conformité visuelle
            const statusEl = document.getElementById('kpi-status');
            if(data.temperature > 25 || data.humidite > 60) {
                statusEl.textContent = "Alerte";
                statusEl.style.color = "#E74C3C";
            } else {
                statusEl.textContent = "Conforme";
                statusEl.style.color = "#27AE60";
            }
        }
    } catch (error) {
        console.error("Erreur lecture capteurs:", error);
    }
}

// Actualisation toutes les 30 secondes
setInterval(loadRealTimeData, 30000);
document.addEventListener('DOMContentLoaded', loadRealTimeData);