export const BASE_URL = 'http://192.168.112.158:3000/api';
console.log('BASE_URL:', BASE_URL);

export const login = async (chambre, motdepasse) => {
  const res = await fetch(`${BASE_URL}/clients/login`, { // ← /clients/login
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chambre, password: motdepasse }), // ← motdepasse → password
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const getMenu = async () => {
  const res = await fetch(`${BASE_URL}/clients/menu`); // ← /clients/menu
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

export const sendOrder = async (id_client, articles, id_tables_transat) => {
  const res = await fetch(`${BASE_URL}/clients/order`, { // ← /clients/order
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_client, articles, id_tables_transat }),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};

//api js de l'app mobile//
