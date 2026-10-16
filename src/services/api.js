const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

function getToken() { return sessionStorage.getItem("og_access_token"); }

async function request(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const finalHeaders = { Accept: "application/json", ...headers };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth && getToken()) finalHeaders.Authorization = `Bearer ${getToken()}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method, headers: finalHeaders, body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new Error(`Cannot reach OmniGuard API at ${API_BASE}. Check that FastAPI is running and CORS is configured.`);
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json().catch(() => null) : await response.text().catch(() => "");
  if (!response.ok) {
    if (response.status === 401 && auth) window.dispatchEvent(new CustomEvent("og:unauthorized"));
    const detail = typeof data === "object" && data ? data.detail || data.message : data;
    throw new Error(detail || `Request failed (${response.status})`);
  }
  return data;
}

export const api = {
  health: () => request("/", { auth: false }),
  register: (payload) => request("/api/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload, auth: false }),
  devices: () => request("/api/devices"),
  registerDevice: (payload) => request("/api/devices/register", { method: "POST", body: payload }),
  updateDevice: (id, payload) => request(`/api/devices/${id}`, { method: "PUT", body: payload }),
  unlinkDevice: (id) => request(`/api/devices/${id}`, { method: "DELETE" }),
  deviceStatus: (id) => request(`/api/devices/${id}/status`),
  latestLocation: (id) => request(`/api/devices/${id}/location/latest`),
  locationHistory: (id, limit = 50, offset = 0) => request(`/api/devices/${id}/location/history?limit=${limit}&offset=${offset}`),
  securityEvents: (id, limit = 50, offset = 0) => request(`/api/devices/${id}/security-events?limit=${limit}&offset=${offset}`),
  acknowledgeEvent: (eventId) => request(`/api/devices/security-events/${eventId}/acknowledge`, { method: "POST" }),
  createCommand: (payload) => request("/api/commands", { method: "POST", body: payload }),
  deviceCommands: (deviceId, limit = 50, offset = 0) => request(`/api/commands/device/${deviceId}?limit=${limit}&offset=${offset}`),
  command: (id) => request(`/api/commands/${id}`),
  cancelCommand: (id) => request(`/api/commands/${id}`, { method: "DELETE" })
};
export const apiBaseUrl = API_BASE;
