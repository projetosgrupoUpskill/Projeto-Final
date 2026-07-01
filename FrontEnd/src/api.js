import toast from "react-hot-toast";
import categoryIcons from "./utils/categoryIcons";

const API_URL = "http://localhost:3000";
export default API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// "sessionExpiredOn401" diz explicitamente a esta chamada se um 401 deve
// ser tratado como sessão expirada (token inválido/expirado) ou como um
// erro normal do próprio endpoint (ex.: password errada).
//
// Antes, isto era decidido a "adivinhar" pelo TEXTO da mensagem
// (data.message !== "Credenciais inválidas" && ...), o que é frágil:
// qualquer endpoint novo que devolva 401 por outro motivo qualquer caía
// sempre no mesmo balde de "sessão expirada" por engano (foi o que
// aconteceu com "Password incorreta" no deleteAccount). Agora quem chama
// handleResponse decide isso de forma explícita, endpoint a endpoint.

async function handleResponse(res, { tokenExpired = true } = {}) {
  const data = await res.json();
 
  if (!res.ok) {
    if (res.status === 401 && tokenExpired) {
      localStorage.removeItem("token");
 
      toast.error("Sessão expirada. Por favor, faça login novamente.");
 
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }
 
    throw new Error(data.message || data.error || "Erro desconhecido");
  }
 
  return data;
}


export const login = (email, password) =>
  fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((res) => handleResponse(res, { tokenExpired: false }));

export const register = (name, email, password) =>
  fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then((res) => handleResponse(res, { tokenExpired: false }));

export const deleteAccount = (password) =>
  fetch(`${API_URL}/api/auth/account`, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ password }),
  }).then((res) => handleResponse(res, { tokenExpired: false }));

export const getTransactions = () =>
  fetch(`${API_URL}/api/transactions`, {
    headers: authHeaders(),
  })
    .then(handleResponse)
    .then((data) => {
      const list = Array.isArray(data) ? data : data.transactions;
      return list.map((t) => ({
        ...t,
        categoryIcon: categoryIcons[t.category_slug] || null,
        categoryColor: t.category_color || "#6B7280",
      }));
    });

export const createTransaction = (data) =>
  fetch(`${API_URL}/api/transactions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateTransaction = (id, data) =>
  fetch(`${API_URL}/api/transactions/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteTransaction = (id) =>
  fetch(`${API_URL}/api/transactions/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then(handleResponse);

export const getCategories = () =>
  fetch(`${API_URL}/api/categories`, {
    headers: authHeaders(),
  })
    .then(handleResponse)
    .then((data) => {
      const list = Array.isArray(data) ? data : data.categories;
      return list.map((category) => ({
        ...category,
        label: category.name,
        icon: categoryIcons[category.slug] || null,
      }));
    });

export const getLimits = () =>
  fetch(`${API_URL}/api/expense-limits`, {
    headers: authHeaders(),
  }).then(handleResponse);

export const getLimit = (id) =>
  fetch(`${API_URL}/api/expense-limits/${id}`, {
    headers: authHeaders(),
  }).then(handleResponse);

export const createLimit = (data) =>
  fetch(`${API_URL}/api/expense-limits`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateLimit = (id, data) =>
  fetch(`${API_URL}/api/expense-limits/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteLimit = (id) =>
  fetch(`${API_URL}/api/expense-limits/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then(handleResponse);

export const sendMessage = (message) =>
  fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ message }),
  }).then(handleResponse);

export const getChatHistory = () =>
  fetch(`${API_URL}/api/chat/history`, {
    headers: authHeaders(),
  }).then(handleResponse);

export const clearChatHistory = () =>
  fetch(`${API_URL}/api/chat/history`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then(handleResponse);
