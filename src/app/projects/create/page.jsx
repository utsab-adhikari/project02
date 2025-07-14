'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateProject() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    github: '',
    discord: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      setError('Project name is required');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/v1/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          links: {
            website: form.website,
            github: form.github,
            discord: form.discord
          }
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const project = await res.json();
      // router.push(`/projects/${project._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      router.push("/projects")
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <span className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 lg:px-16 bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl p-8 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 border-b border-slate-600 pb-2">🚀 Create a New Project</h1>

        {error && (
          <div className="bg-red-500/20 text-red-400 px-4 py-2 mb-4 rounded border border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Project Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-700 text-white rounded px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full bg-slate-700 text-white rounded px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief project summary..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white rounded px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://projectsite.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">GitHub</label>
              <input
                type="url"
                name="github"
                value={form.github}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white rounded px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/your-repo"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Discord</label>
              <input
                type="url"
                name="discord"
                value={form.discord}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white rounded px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://discord.gg/example"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold px-6 py-2 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
