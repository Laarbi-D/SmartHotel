let allEmployes = [];
const modal = document.getElementById('employeeModal');
const form = document.getElementById('employeeForm');

document.addEventListener('DOMContentLoaded', async () => {
    if (!sessionStorage.getItem('jwt_token')) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('openAddEmployeeBtn').addEventListener('click', () => openModal());
    document.getElementById('closeEmployeeModalBtn').addEventListener('click', () => modal.close());
    form.addEventListener('submit', handleFormSubmit);

    await loadEmployes();
});

async function loadEmployes() {
    try {
        allEmployes = await api.fetchWithAuth('/employes');
        renderTable();
    } catch (error) {
        document.getElementById('employesTableBody').innerHTML = 
            `<tr><td colspan="5" style="text-align: center; color: red;">Erreur de chargement.</td></tr>`;
    }
}

function renderTable() {
    const tbody = document.getElementById('employesTableBody');
    tbody.innerHTML = '';

    if (!allEmployes || allEmployes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Aucun employé trouvé.</td></tr>`;
        return;
    }

    allEmployes.forEach(employe => {
        const tr = document.createElement('tr');
        
        // Couleur du badge selon le rôle
        let roleBadge = employe.role === 'Admin' ? 'badge-annulee' : 'badge-preparation';
        
        tr.innerHTML = `
            <td><strong>${employe.nom}</strong></td>
            <td>${employe.email}</td>
            <td><span class="badge ${roleBadge}" style="opacity: 0.8;">${employe.role}</span></td>
            <td><span style="color: #27AE60;">● Actif</span></td>
            <td>
                <button onclick="editEmploye(${employe.id})" style="padding: 0.4rem 0.8rem; margin-right: 0.5rem; background: #F8F9FA; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">Éditer</button>
                <button onclick="deleteEmploye(${employe.id})" style="padding: 0.4rem 0.8rem; background: #FDEDEC; color: #E74C3C; border: 1px solid #F5B7B1; border-radius: 4px; cursor: pointer;">Révoquer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModal(employe = null) {
    const title = document.getElementById('modalTitle');
    
    if (employe) {
        title.textContent = "Modifier l'employé";
        document.getElementById('employeId').value = employe.id;
        document.getElementById('nom').value = employe.nom;
        document.getElementById('email').value = employe.email;
        document.getElementById('role').value = employe.role;
        document.getElementById('password').required = false; // Pas obligatoire en modif
    } else {
        title.textContent = "Créer un accès";
        form.reset();
        document.getElementById('employeId').value = '';
        document.getElementById('password').required = true; // Obligatoire à la création
    }
    
    modal.showModal();
}

function editEmploye(id) {
    const employe = allEmployes.find(e => e.id === id);
    if (employe) openModal(employe);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('employeId').value;
    const data = {
        nom: document.getElementById('nom').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value,
    };

    // N'envoyer le mot de passe que s'il a été renseigné
    const pwd = document.getElementById('password').value;
    if (pwd) data.password = pwd;

    try {
        const method = id ? 'PUT' : 'POST';
        const endpoint = id ? `/employes/${id}` : '/employes';

        await api.fetchWithAuth(endpoint, {
            method: method,
            body: JSON.stringify(data)
        });

        modal.close();
        await loadEmployes();
    } catch (error) {
        alert("Erreur lors de la sauvegarde.");
    }
}

async function deleteEmploye(id) {
    if (confirm("Révoquer définitivement l'accès de cet employé ?")) {
        try {
            await api.fetchWithAuth(`/employes/${id}`, { method: 'DELETE' });
            await loadEmployes();
        } catch (error) {
            alert("Erreur lors de la révocation.");
        }
    }
}