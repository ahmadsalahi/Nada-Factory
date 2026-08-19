'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../../admin.module.css';
import { Trash2, Pencil } from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New/Edit Project Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title_en: '', title_ar: '', desc_en: '', desc_ar: '', image_url: ''
  });

  const fetchProjects = () => {
    fetch('/api/admin/projects')
      .then(res => res.json())
      .then(data => { setProjects(data); setLoading(false); });
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Upload failed: " + (data.error || 'Unknown error'));
        return;
      }
      setNewProject(prev => ({ ...prev, image_url: data.url }));
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.image_url) { alert("Please upload an image first!"); return; }
    
    if (editingId) {
      // Update existing project
      await fetch(`/api/admin/projects/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
    } else {
      // Create new project
      await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
    }
    
    cancelEdit();
    fetchProjects();
  };

  const handleEditClick = (proj: any) => {
    setEditingId(proj.id);
    setNewProject({
      title_en: proj.title_en,
      title_ar: proj.title_ar,
      desc_en: proj.desc_en,
      desc_ar: proj.desc_ar,
      image_url: proj.image_url
    });
    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewProject({ title_en: '', title_ar: '', desc_en: '', desc_ar: '', image_url: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Manage Projects</h1>
        <p className={styles.pageDescription}>Add, edit, or remove projects from the homepage gallery.</p>
      </div>

      {/* Add / Edit Project Form */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--accent-gold)' }}>
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h3>
          {editingId && (
            <button onClick={cancelEdit} className={styles.btnDanger} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Title (English)</label>
            <input required className={styles.input} value={newProject.title_en} onChange={e => setNewProject({...newProject, title_en: e.target.value})} />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Title (Arabic)</label>
            <input required dir="rtl" className={styles.input} value={newProject.title_ar} onChange={e => setNewProject({...newProject, title_ar: e.target.value})} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description (English)</label>
            <textarea required className={styles.textarea} value={newProject.desc_en} onChange={e => setNewProject({...newProject, desc_en: e.target.value})} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description (Arabic)</label>
            <textarea required dir="rtl" className={styles.textarea} value={newProject.desc_ar} onChange={e => setNewProject({...newProject, desc_ar: e.target.value})} />
          </div>

          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Project Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label className={styles.btnSecondary} style={{ cursor: 'pointer', margin: 0 }}>
                {uploading ? 'Uploading...' : '📁 Choose Image File'}
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
              <span style={{ color: 'var(--text-secondary)' }}>OR</span>
              <input 
                type="text" 
                placeholder="Paste URL: https://example.com/image.jpg" 
                className={styles.input} 
                value={newProject.image_url} 
                onChange={e => setNewProject({...newProject, image_url: e.target.value})} 
                style={{ flex: 1, minWidth: '300px' }} 
              />
            </div>
            {newProject.image_url && <img src={newProject.image_url} alt="Preview" style={{ height: '80px', marginTop: '1rem', borderRadius: '4px', border: '2px solid var(--accent-gold)' }} />}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={uploading} className={styles.btnPrimary}>
              {editingId ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>

      {/* List of Existing Projects */}
      <div className={styles.card}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Existing Projects</h3>
        {loading ? <p>Loading projects...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {projects.map(proj => (
              <div key={proj.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img src={proj.image_url} alt={proj.title_en} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{proj.title_en} <span style={{ opacity: 0.5 }}>|</span> <span dir="rtl">{proj.title_ar}</span></h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{proj.desc_en}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditClick(proj)} title="Edit Project" style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(proj.id)} className={styles.btnDanger} title="Delete Project" style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No projects found. Add one above!</p>}
          </div>
        )}
      </div>
    </div>
  );
}
