// ============================================================
//  DONNÉES EMPLOYÉS
// ============================================================
let employees = [
  { id: 1, name: "Carlos Mendez",    role: "Head Bartender",   dept: "bar",         email: "carlos@barcelo.com",   status: "active" },
  { id: 2, name: "Sofia Ramos",      role: "Receptionist",     dept: "reception",   email: "sofia@barcelo.com",    status: "active" },
  { id: 3, name: "Ahmed Benali",     role: "Chef de cuisine",  dept: "kitchen",     email: "ahmed@barcelo.com",    status: "active" },
  { id: 4, name: "Laura Petit",      role: "Housekeeping",     dept: "housekeeping",email: "laura@barcelo.com",    status: "off"    },
  { id: 5, name: "Marco Silva",      role: "Bartender",        dept: "bar",         email: "marco@barcelo.com",    status: "active" },
  { id: 6, name: "Fatima Ouali",     role: "Room Service",     dept: "housekeeping",email: "fatima@barcelo.com",   status: "leave"  },
  { id: 7, name: "Pierre Leclerc",   role: "Sous-chef",        dept: "kitchen",     email: "pierre@barcelo.com",   status: "active" },
  { id: 8, name: "Emma Fontaine",    role: "Front Desk",       dept: "reception",   email: "emma@barcelo.com",     status: "active" }
];

let nextId = 9;
let currentDept = 'all';
let searchQuery = '';

// ============================================================
//  UTILITAIRES
// ============================================================
const deptLabels = {
  bar: 'Bar', kitchen: 'Kitchen',
  reception: 'Reception', housekeeping: 'Housekeeping'
};

const statusLabels = {
  active: ['Active', 'status--active'],
  off:    ['Day off', 'status--off'],
  leave:  ['On leave', 'status--leave']
};

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

// ============================================================
//  RENDU DES CARTES
// ============================================================
function renderEmployees() {
  const grid = document.getElementById('employees-grid');
  if (!grid) return;

  let filtered = employees.filter((e) => {
    const matchDept   = currentDept === 'all' || e.dept === currentDept;
    const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        e.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:#aaa; font-size:0.9rem;">Aucun employé trouvé.</p>';
    return;
  }

  grid.innerHTML = '';
  filtered.forEach((emp) => {
    const [statusText, statusClass] = statusLabels[emp.status] || ['Unknown', ''];
    const card = document.createElement('div');
    card.classList.add('employee-card');
    card.innerHTML = `
      <div class="employee-card__initials">${getInitials(emp.name)}</div>
      <div class="employee-card__name">${emp.name}</div>
      <div class="employee-card__role">${emp.role}</div>
      <div class="employee-card__email">${emp.email}</div>
      <div class="employee-card__footer">
        <span class="dept-badge dept--${emp.dept}">${deptLabels[emp.dept]}</span>
        <span class="status-badge-emp ${statusClass}">${statusText}</span>
      </div>
      <div class="employee-card__actions">
        <button class="btn-edit" data-id="${emp.id}">Edit</button>
        <button class="btn-delete" data-id="${emp.id}">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ============================================================
//  TABS DÉPARTEMENT
// ============================================================
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentDept = btn.dataset.dept;
    renderEmployees();
  });
});

// ============================================================
//  RECHERCHE
// ============================================================
const empSearch = document.getElementById('employee-search');
if (empSearch) {
  empSearch.addEventListener('input', () => {
    searchQuery = empSearch.value;
    renderEmployees();
  });
}

// ============================================================
//  MODAL
// ============================================================
const modal      = document.getElementById('employee-modal');
const modalTitle = document.getElementById('modal-title');
const inputName  = document.getElementById('input-name');
const inputRole  = document.getElementById('input-role');
const inputDept  = document.getElementById('input-dept');
const inputEmail = document.getElementById('input-email');
const inputStatus = document.getElementById('input-status');
const editId     = document.getElementById('edit-id');

function openModal(emp = null) {
  modal.classList.remove('hidden');
  if (emp) {
    modalTitle.textContent = 'Edit Employee';
    editId.value       = emp.id;
    inputName.value    = emp.name;
    inputRole.value    = emp.role;
    inputDept.value    = emp.dept;
    inputEmail.value   = emp.email;
    inputStatus.value  = emp.status;
  } else {
    modalTitle.textContent = 'Add Employee';
    editId.value = '';
    inputName.value   = '';
    inputRole.value   = '';
    inputDept.value   = 'bar';
    inputEmail.value  = '';
    inputStatus.value = 'active';
  }
}

function closeModal() {
  modal.classList.add('hidden');
}

document.getElementById('btn-add-employee').addEventListener('click', () => openModal());
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);

document.getElementById('modal-save').addEventListener('click', () => {
  const name  = inputName.value.trim();
  const role  = inputRole.value.trim();
  const email = inputEmail.value.trim();

  if (!name || !role || !email) {
    alert('Remplis tous les champs obligatoires.');
    return;
  }

  if (editId.value) {
    const idx = employees.findIndex((e) => e.id === parseInt(editId.value));
    if (idx !== -1) {
      employees[idx] = {
        ...employees[idx],
        name, role, email,
        dept:   inputDept.value,
        status: inputStatus.value
      };
    }
  } else {
    employees.push({
      id: nextId++,
      name, role, email,
      dept:   inputDept.value,
      status: inputStatus.value
    });
  }

  closeModal();
  renderEmployees();
});

// ============================================================
//  EDIT / DELETE
// ============================================================
document.getElementById('employees-grid').addEventListener('click', (e) => {
  const id = parseInt(e.target.dataset.id);
  if (!id) return;

  if (e.target.classList.contains('btn-delete')) {
    if (confirm('Supprimer cet employé ?')) {
      employees = employees.filter((emp) => emp.id !== id);
      renderEmployees();
    }
  }

  if (e.target.classList.contains('btn-edit')) {
    const emp = employees.find((e2) => e2.id === id);
    if (emp) openModal(emp);
  }
});

// ============================================================
//  INIT
// ============================================================
renderEmployees();
