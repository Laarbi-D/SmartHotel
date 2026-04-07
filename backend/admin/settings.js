// ============================================================
//  NAVIGATION ENTRE SECTIONS
// ============================================================
const navItems = document.querySelectorAll('.settings-nav__item');
const sections = document.querySelectorAll('.settings-section');

navItems.forEach((btn) => {
  btn.addEventListener('click', () => {
    navItems.forEach((b) => b.classList.remove('active'));
    sections.forEach((s) => s.classList.remove('active'));

    btn.classList.add('active');
    const target = document.getElementById('section-' + btn.dataset.section);
    if (target) target.classList.add('active');
  });
});

// ============================================================
//  SAUVEGARDE PROFILE
// ============================================================
const saveProfile = document.getElementById('save-profile');
if (saveProfile) {
  saveProfile.addEventListener('click', () => {
    showToast('Profile saved successfully !', 'success');
  });
}

// ============================================================
//  SAUVEGARDE MOT DE PASSE
// ============================================================
const savePassword = document.getElementById('save-password');
if (savePassword) {
  savePassword.addEventListener('click', () => {
    const inputs = document.querySelectorAll('#section-security input[type="password"]');
    const vals = [...inputs].map((i) => i.value);

    if (vals.some((v) => v === '')) {
      showToast('Please fill all password fields.', 'error');
      return;
    }
    if (vals[1] !== vals[2]) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    showToast('Password updated successfully !', 'success');
    inputs.forEach((i) => (i.value = ''));
  });
}

// ============================================================
//  THEME TOGGLE
// ============================================================
const themeOptions = document.querySelectorAll('.theme-option');

// Appliquer le thème sauvegardé au chargement
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// Cocher le bon radio au chargement
themeOptions.forEach((opt) => {
  const input = opt.querySelector('input');
  if (input.value === savedTheme) {
    opt.classList.add('active');
    input.checked = true;
  } else {
    opt.classList.remove('active');
    input.checked = false;
  }
});

themeOptions.forEach((opt) => {
  opt.addEventListener('click', () => {
    themeOptions.forEach((o) => o.classList.remove('active'));
    opt.classList.add('active');
    const val = opt.querySelector('input').value;
    applyTheme(val);
    localStorage.setItem('theme', val);
  });
});

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark'); // html
    document.body.classList.add('dark');           // body
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
}

// ============================================================
//  TOAST NOTIFICATION
// ============================================================
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.classList.add('toast', 'toast--' + type);
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('toast--visible'), 10);
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
