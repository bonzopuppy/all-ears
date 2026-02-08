import { storage } from '../utils/storage';

export class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

export async function authedFetchJson(path, { method = 'GET', body, headers } = {}) {
  const token = storage.getAccessToken();
  if (!token) throw new APIError('No access token available', 401, null);

  const res = await fetch(path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new APIError(data?.error || `Request failed (${res.status})`, res.status, data);
  }
  return data;
}
