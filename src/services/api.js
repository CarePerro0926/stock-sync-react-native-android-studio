// src/services/api.js

// Configuración del API
const API_BASE = 'https://stock-sync-api.onrender.com';

// Registro de usuario
export async function registrarUsuario(data) {
  const res = await fetch(`${API_BASE}/api/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

// Login de usuario
export async function loginUsuario(data) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

// Obtener todos los usuarios
export async function obtenerUsuarios(token) {
  const res = await fetch(`${API_BASE}/api/usuarios`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

// Obtener usuario por ID
export async function obtenerUsuarioPorId(id, token) {
  const res = await fetch(`${API_BASE}/api/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

// Actualizar usuario por ID
export async function actualizarUsuario(id, data, token) {
  const res = await fetch(`${API_BASE}/api/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

// Obtener órdenes de un usuario
export async function obtenerOrdenes(usuarioId, token) {
  const res = await fetch(`${API_BASE}/api/ordenes?usuario_id=${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

// Crear orden
export async function crearOrden(data, token) {
  const res = await fetch(`${API_BASE}/api/ordenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

// Procesar pago
export async function procesarPago(data, token) {
  const res = await fetch(`${API_BASE}/api/pagos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw await res.json();
  return res.json();
}
