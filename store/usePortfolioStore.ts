// store/usePortfolioStore.ts
import { create } from 'zustand';

interface Project {
  _id: string;
  title: { az: string; en: string; ru: string };
  description: { az: string; en: string; ru: string };
  image?: string;
  github?: string;
  demo?: string;   
  video?: string;  
  tags: string[];
}

interface PortfolioStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api';

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/projects`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      set({ projects: Array.isArray(data) ? data : [] });
    } catch (err) {
      set({ error: 'Could not load projects' });
    } finally {
      set({ loading: false });
    }
  },
}));