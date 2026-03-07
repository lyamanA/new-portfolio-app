// lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api';

export const projectsApi = {
  getAll: async () => {
    const res = await fetch(`${BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  create: async (data: object) => {
    const res = await fetch(`${BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  update: async (id: string, data: object) => {
    const res = await fetch(`${BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${BASE}/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },
};