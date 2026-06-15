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

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 && data.message !== "Credenciais inválidas") {
      localStorage.removeItem("token");
      window.location.href = "/login";
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
  }).then(handleResponse);

export const register = (name, email, password) =>
  fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then(handleResponse);

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
