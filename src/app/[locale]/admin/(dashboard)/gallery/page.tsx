'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../../admin.module.css';
import { Trash2, Pencil } from 'lucide-react';

export default function AdminGalleryPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New Image / Edit State
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    const res = await fetch('/api/admin/projects');
    const data = await res.json();
    setProjects(data);
    if (data.length > 0 && !selectedProjectId) {
      setSelectedProjectId(data[0].id.toString());
    }
  };

  const fetchGallery = async () => {
    const res = await fetch('/api/admin/gallery');
    const data = await res.json();
    setGallery(data);
  };

  const loadData = async () => {
    await Promise.all([fetchProjects(), fetchGallery()]);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

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
      setNewImageUrl(data.url);
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) { alert("Please upload or paste an image URL first!"); return; }
    if (!selectedProjectId) { alert("Please select a project category!"); return; }
    
    if (editingId) {
      // Update existing image category
      await fetch(`/api/admin/gallery/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: parseInt(selectedProjectId) }),
      });
    } else {
      // Create new image
      await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: newImageUrl, project_id: parseInt(selectedProjectId) }),
      });
    }
    
    cancelEdit();
    fetchGallery();
  };

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setNewImageUrl(item.image_url);
    setSelectedProjectId(item.project_id.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewImageUrl('');
    // keep selected project ID as is for convenience
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    fetchGallery();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Project Gallery</h1>
        <p className={styles.pageDescription}>Upload images and link them to specific projects (categories) so they appear when a visitor views that project.</p>
      </div>

      {/* Add/Edit Image Form */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--accent-gold)' }}>
            {editingId ? 'Change Image Category' : 'Add Image to Project'}
          </h3>
          {editingId && (
            <button onClick={cancelEdit} className={styles.btnDanger} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Cancel Edit
            </button>
          )}
        </div>
        <form onSubmit={handleSaveImage} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className={styles.formGroup} style={{ maxWidth: '400px' }}>
            <label className={styles.label}>Select Project (Category)</label>
            <select 
              className={styles.input} 
              value={selectedProjectId} 
              onChange={e => setSelectedProjectId(e.target.value)}
              required
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', cursor: 'pointer' }}
            >
              <option value="" disabled>-- Choose a Project --</option>
              {projects.map(proj => (
                <option key={proj.id} value={proj.id}>{proj.title_en} | {proj.title_ar}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Image File {editingId && '(Cannot be changed during category update)'}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {!editingId && (
                <>
                  <label className={styles.btnSecondary} style={{ cursor: 'pointer', margin: 0 }}>
                    {uploading ? 'Uploading...' : '📁 Choose Image File'}
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                  <span style={{ color: 'var(--text-secondary)' }}>OR</span>
                </>
              )}
              <input 
                type="text" 
                placeholder="Paste URL: https://example.com/image.jpg" 
                className={styles.input} 
                value={newImageUrl} 
                onChange={e => setNewImageUrl(e.target.value)} 
                style={{ flex: 1, minWidth: '300px' }}
                readOnly={!!editingId}
                disabled={!!editingId}
              />
            </div>
            {newImageUrl && <img src={newImageUrl} alt="Preview" style={{ height: '100px', marginTop: '1rem', borderRadius: '4px', border: '2px solid var(--accent-gold)' }} />}
          </div>

          <div>
            <button type="submit" disabled={uploading || !newImageUrl || !selectedProjectId} className={styles.btnPrimary}>
              {editingId ? 'Save New Category' : '+ Add to Gallery'}
            </button>
          </div>
        </form>
      </div>

      {/* List of Existing Gallery Images */}
      <div className={styles.card}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Gallery Images</h3>
        {loading ? <p>Loading gallery...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {gallery.map(item => (
              <div key={item.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={item.image_url} alt="Gallery" style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
                
                {/* Overlay Badge for Project Name */}
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.7)', padding: '0.5rem', fontSize: '0.85rem', color: '#fff', textAlign: 'center', borderTop: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  {item.project_title_en}
                </div>

                {/* Edit and Delete Buttons */}
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditClick(item)} title="Change Category" style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className={styles.btnDanger} style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Image">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {gallery.length === 0 && <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>No images found in the gallery.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
