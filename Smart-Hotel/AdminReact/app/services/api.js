const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(sessionStorage.getItem("user")); } catch { return null; }
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur réseau");
  return data;
}

// Auth
export const loginAdmin = (email, password) =>
  request("POST", "/auth/login", { email, password });

// Produits
export const getProduits = () => request("GET", "/produits");
export const createProduit = (data) => request("POST", "/produits", data);
export const updateProduit = (id, data) => request("PATCH", `/produits/${id}`, data);
export const deleteProduit = (id) => request("DELETE", `/produits/${id}`);

// Commandes
export const getCommandes = (statut) =>
  request("GET", statut ? `/commandes?statut=${statut}` : "/commandes");
export const updateStatut = (id, statut) =>
  request("PATCH", `/commandes/${id}/statut`, { statut });

// Employés
export const getEmployes = () => request("GET", "/employes");
export const createEmploye = (data) => request("POST", "/employes", data);
export const deleteEmploye = (id) => request("DELETE", `/employes/${id}`);