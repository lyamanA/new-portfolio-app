// app/[locale]/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { projectsApi } from '@/lib/api';

interface ProjectTitle {
  az: string; en: string; ru: string;
}
interface Project {
  image: string;
  _id: string;
  title: ProjectTitle;
  description: ProjectTitle;
  github?: string;
  tags: string[];
}

const emptyForm = {
  title: { az: '', en: '', ru: '' },
  description: { az: '', en: '', ru: '' },
  github: '',
  tags: '',
  image: '',
};


const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState('');  
  const [imageLoading, setImageLoading] = useState(false); 

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/api/auth/signin');
  }, [status]);

  useEffect(() => { fetchProjects(); }, []);

  // const fetchProjects = async () => {
  //   const res = await fetch(`${API}/projects`);
  //   const data = await res.json();
  //   setProjects(data);
  // };

  const fetchProjects = async () => {
  try {
    const data = await projectsApi.getAll();
    setProjects(data);
  } catch (err) {
    console.error(err);
  }
};

  

  const openModal = () => {
    setForm(emptyForm);
    setEditId(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  // Функция загрузки файла:
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  setImageLoading(true);
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const res = await fetch(`${API}/projects/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setForm({ ...form, image: data.url });
    setImagePreview(data.url);
  } catch (err) {
    console.error(err);
  } finally {
    setImageLoading(false);
  }
};

  const handleEdit = (p: Project) => {
  setEditId(p._id);
  setForm({
    title: p.title,
    description: p.description,
    github: p.github ?? '',
    tags: p.tags.join(', '),
    image: p.image ?? '',  
  });
  setImagePreview(p.image ?? '');  
  setIsModalOpen(true);
};

  // const handleSubmit = async () => {
  //   const method = editId ? 'PUT' : 'POST';
  //   const url = editId ? `${API}/projects/${editId}` : `${API}/projects`;

  //   await fetch(url, {
  //     method,
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       ...form,
  //       tags: form.tags.split(',').map(t => t.trim()),
  //     }),
  //   });

  //   setIsModalOpen(false);
  //   setForm(emptyForm);
  //   setEditId(null);
  //   fetchProjects();
  //   router.refresh();
  // };

const handleSubmit = async () => {
  try {
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()),
    };
    if (editId) {
      await projectsApi.update(editId, payload);
    } else {
      await projectsApi.create(payload);
    }
    setIsModalOpen(false);
    setForm(emptyForm);
    setEditId(null);
    fetchProjects();
    router.refresh();
  } catch (err) {
    console.error(err);
  }
};

  // const handleDelete = async (id: string) => {
  //   if (!confirm('Delete this project?')) return;
  //   await fetch(`${API}/projects/${id}`, { method: 'DELETE' });
  //   fetchProjects();
  //   router.refresh();
  // };

  const handleDelete = async (id: string) => {
  if (!confirm('Delete this project?')) return;
  try {
    await projectsApi.delete(id);
    fetchProjects();
    router.refresh();
  } catch (err) {
    console.error(err);
  }
};

  if (status === 'loading') return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0d0a1e] text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 " >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex gap-3">
            <button onClick={openModal}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-all">
              Add Project
            </button>
            <button onClick={() => signOut()}
              className="px-5 py-2 rounded-xl border border-white/20 text-gray-400 hover:text-white transition-all">
              Logout
            </button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-[#13102a] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Title (EN)</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Title (AZ)</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Title (RU)</th>
                <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Tags</th>
                <th className="px-6 py-4 text-gray-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4 text-white text-sm">{p.title.en}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{p.title.az}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{p.title.ru}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {p.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full border border-purple-500/30 text-cyan-400 text-xs">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleEdit(p)}
                        className="px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 text-xs hover:bg-cyan-500/10 transition-all">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)}
                        className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-all">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No projects yet. Click "Add Project" to start.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13102a] border border-white/10 rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-2">{editId ? 'Edit Project' : 'Add Project'}</h2>
            <p className="text-gray-400 text-sm mb-6">Fill in the name and description for each language (AZ, EN, RU).</p>

            <div className="flex flex-col gap-4">
              {/* Title */}
              <div>
                <p className="text-white font-medium mb-3">Title</p>
                {(['az', 'en', 'ru'] as const).map(lang => (
                  <div key={lang} className="mb-2">
                    <label className="text-gray-400 text-xs mb-1 block capitalize">
                      {lang === 'az' ? '🇦🇿 Azərbaycan' : lang === 'en' ? '🇬🇧 English' : '🇷🇺 Русский'}
                    </label>
                    <input
                      value={form.title[lang]}
                      onChange={e => setForm({ ...form, title: { ...form.title, [lang]: e.target.value } })}
                      placeholder={`Title in ${lang}`}
                      className="w-full bg-[#0d0a1e] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <p className="text-white font-medium mb-3">Description</p>
                {(['az', 'en', 'ru'] as const).map(lang => (
                  <div key={lang} className="mb-2">
                    <label className="text-gray-400 text-xs mb-1 block">
                      {lang === 'az' ? '🇦🇿 Azərbaycan' : lang === 'en' ? '🇬🇧 English' : '🇷🇺 Русский'}
                    </label>
                    <textarea
                      value={form.description[lang]}
                      onChange={e => setForm({ ...form, description: { ...form.description, [lang]: e.target.value } })}
                      placeholder={`Description in ${lang}`}
                      rows={3}
                      className="w-full bg-[#0d0a1e] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                  </div>
                ))}
              </div>

              {/* GitHub & Tags */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">GitHub URL</label>
                <input value={form.github}
                  onChange={e => setForm({ ...form, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#0d0a1e] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Tags (через запятую)</label>
                <input value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="React, Next.js, TypeScript"
                  className="w-full bg-[#0d0a1e] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50" />
              </div>
              {/* Image */}
              <div>
                <p className="text-white font-medium mb-3">Project Image</p>
                {/* Превью */}
                {(imagePreview || form.image) && (
                    <div className="mb-3 relative">
                <img src={imagePreview || form.image} alt="preview" className="w-full h-40 object-cover rounded-xl border border-white/10"/>
                <button onClick={() => { setForm({ ...form, image: '' }); setImagePreview(''); }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500 transition-all">✕</button>
             </div>
            )}
            
            {/* Вариант 1 — загрузить файл */}
            <label className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:border-purple-500/50 hover:text-white cursor-pointer transition-all mb-3">
            {imageLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
     )}
    <span className="text-sm">{imageLoading ? 'Uploading...' : 'Upload from gallery'}</span>
    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
  </label>

  {/* Вариант 2 — вставить ссылку */}
  <div className="flex gap-2">
    <input
      value={form.image}
      onChange={e => { setForm({ ...form, image: e.target.value }); setImagePreview(e.target.value); }}
      placeholder="Or paste image URL: https://..."
      className="flex-1 bg-[#0d0a1e] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
    />
  </div>
  <p className="text-gray-600 text-xs mt-1">Upload a file OR paste a URL link</p>
</div>

              {/* Buttons */}
              <div className="flex gap-3 mt-2">
                <button onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-gray-400 hover:text-white transition-all">
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-all">
                  {editId ? 'Update' : 'Add project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}