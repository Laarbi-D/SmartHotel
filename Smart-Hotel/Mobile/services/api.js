import * as SecureStore from 'expo-secure-store';

// Utilisation de la variable d'environnement
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Fonction utilitaire pour gérer les erreurs du backend proprement
const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Erreur serveur : ${res.status}`);
  }
  return res.json();
};

// Fonction utilitaire pour récupérer le token
const getAuthHeader = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const login = async (chambre, motdepasse) => {
  const res = await fetch(`${BASE_URL}/clients/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chambre, password: motdepasse }),
  });
  return handleResponse(res);
};

export const getMenu = async () => {
  const authHeader = await getAuthHeader(); // On récupère le token
  const res = await fetch(`${BASE_URL}/clients/menu`, {
    headers: { ...authHeader } // On l'ajoute à la requête
  });
  return handleResponse(res);
};

export const sendOrder = async (id_client, articles, id_tables_transat) => {
  const authHeader = await getAuthHeader(); // On récupère le token
  const res = await fetch(`${BASE_URL}/clients/order`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...authHeader // On l'ajoute à la requête
    },
    body: JSON.stringify({ id_client, articles, id_tables_transat }),
  });
  return handleResponse(res);
};