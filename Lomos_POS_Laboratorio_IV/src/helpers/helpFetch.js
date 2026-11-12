/** Helper reutilizable para llamadas HTTP con fetch al servidor ficticio. */
const isCodespaces = window.location.hostname.endsWith('.app.github.dev');
const defaultApiUrl = isCodespaces
  ? `${window.location.protocol}//${window.location.hostname.replace(/-5173\.app\.github\.dev$/, '-3001.app.github.dev')}`
  : `http://${window.location.hostname}:3001`;
export const API_URL = '/api';
export async function helpFetch(endpoint, options = {}) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {'Content-Type': 'application/json', ...(options.headers || {})},
  });
  if (!response.ok) {
    let detail = '';
    try {detail = JSON.stringify(await response.json());} catch {detail = response.statusText;}
    throw new Error(`Error HTTP ${response.status}: ${detail}`);
  }
  if (response.status === 204) return null;
  return response.json();
}
export const api = {
  list: (resource) => helpFetch(resource),
  create: (resource, data) => helpFetch(resource, {method: 'POST', body: JSON.stringify(data)}),
  update: (resource, id, data) => helpFetch(`${resource}/${id}`, {method: 'PUT', body: JSON.stringify(data)}),
  remove: (resource, id) => helpFetch(`${resource}/${id}`, {method: 'DELETE'}),
};
