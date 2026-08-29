// API Service — connects React frontend to FastAPI backend
// All requests go through Vite proxy (vite.config.js) to avoid CORS issues

const API_BASE = '/api'  // Vite proxies this to http://localhost:8000

// Helper to handle responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

export const api = {
  // Health check
  healthCheck: () => fetch(`${API_BASE}/health`).then(handleResponse),

  // Get all leads with optional filters
  getLeads: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const url = query ? `${API_BASE}/leads?${query}` : `${API_BASE}/leads`
    return fetch(url).then(handleResponse)
  },

  // Get single lead
  getLead: (id) => fetch(`${API_BASE}/leads/${id}`).then(handleResponse),

  // Create new lead
  createLead: (leadData) =>
    fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    }).then(handleResponse),

  // Update lead
  updateLead: (id, leadData) =>
    fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    }).then(handleResponse),

  // Delete lead
  deleteLead: (id) =>
    fetch(`${API_BASE}/leads/${id}`, { method: 'DELETE' }),

  // Get score breakdown (Explainable AI)
  getScoreBreakdown: (id) =>
    fetch(`${API_BASE}/leads/${id}/score-breakdown`).then(handleResponse),

  // Batch create leads
  batchCreateLeads: (leads) =>
    fetch(`${API_BASE}/leads/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leads),
    }).then(handleResponse),
}
