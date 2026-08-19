'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../../admin.module.css';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminAboutPage() {
  const [images, setImages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    about_badge_en: '', about_badge_ar: '',
    about_title_en: '', about_title_ar: '',
    about_desc_en: '', about_desc_ar: '',
    about_exp_years: '25',
    about_stats: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newImage, setNewImage] = useState('');

  const fetchImages = () => {
    fetch('/api/admin/about')
      .then(res => res.json())
      .then(data => setImages(data));
  };

  const fetchSettings = () => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        let parsedStats = [];
        try { if(data.about_stats) parsedStats = JSON.parse(data.about_stats); } catch(e){}
        setSettings({...data, about_stats: parsedStats});
        setLoading(false);
      });
  };

  useEffect(() => { 
    fetchImages(); 
    fetchSettings();
  }, []);

  const handleSettingsChange = (e: any) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...settings,
      about_stats: JSON.stringify(settings.about_stats || [])
    };
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      alert('Texts and Stats saved successfully! ✅');
    } catch (err) {
      alert('Error saving settings');
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      const data = await res.json();
      if (!res.ok) {
        alert("Upload failed: " + (data.error || 'Unknown error'));
        return;
      }
      setNewImage(data.url || '');
    } catch (err: any) { alert("Error uploading image: " + err.message); } finally { setUploading(false); }
  };

  const handleCreateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;
    await fetch('/api/admin/about', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image_url: newImage }) });
    setNewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchImages();
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/about/${id}`, { method: 'DELETE' });
    fetchImages();
  };

  const handleMoveImage = async (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    if (direction === 'up' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    } else {
      return;
    }
    setImages(newImages);
    
    // Save new order to backend
    const orderedIds = newImages.map(img => img.id);
    await fetch('/api/admin/about/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds })
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>About Us Content</h1>
        <p className={styles.pageDescription}>Manage all texts, slider images, and statistics for the About Us section.</p>
      </div>

      <form onSubmit={handleSaveSettings}>
        {/* TEXT CONTENT */}
        <div className={styles.card}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Text Content</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Main Title (EN)</label>
              <input name="about_title_en" value={settings.about_title_en || ''} onChange={handleSettingsChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Main Title (AR)</label>
              <input name="about_title_ar" value={settings.about_title_ar || ''} onChange={handleSettingsChange} className={styles.input} dir="rtl" />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Description (EN)</label>
              <textarea name="about_desc_en" value={settings.about_desc_en || ''} onChange={handleSettingsChange} className={styles.input} style={{ minHeight: '100px' }} />
            </div>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Description (AR)</label>
              <textarea name="about_desc_ar" value={settings.about_desc_ar || ''} onChange={handleSettingsChange} className={styles.input} style={{ minHeight: '100px' }} dir="rtl" />
            </div>
          </div>
          
          <button type="submit" disabled={saving} className={styles.btnPrimary} style={{ marginTop: '1rem' }}>
            {saving ? 'Saving Texts...' : 'Save Texts'}
          </button>
        </div>
      </form>

      {/* IMAGES SLIDER SECTION */}
      <div className={styles.card}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>Slider Images</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Manage the background images that slide in the About Us section.</p>
        
        <div className={styles.formGroup} style={{ marginBottom: '2rem', maxWidth: '300px' }}>
          <label className={styles.label}>Slider Interval Time (Milliseconds)</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              name="about_slider_interval" 
              type="number"
              placeholder="6000"
              value={settings.about_slider_interval || ''} 
              onChange={handleSettingsChange} 
              className={styles.input} 
            />
            <button onClick={handleSaveSettings} disabled={saving} className={styles.btnSecondary}>Save</button>
          </div>
          <small style={{ color: 'var(--text-secondary)' }}>e.g. 6000 = 6 seconds</small>
        </div>

        <form onSubmit={handleCreateImage} className={styles.formGroup} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <label className={styles.label} style={{ marginBottom: '1rem' }}>Add New Image</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
            <label className={styles.btnSecondary} style={{ cursor: 'pointer', margin: 0 }}>
              {uploading ? 'Uploading...' : '📁 Choose Image File'}
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>OR</span>
            <input type="text" placeholder="Paste Image URL here (https://...)" className={styles.input} value={newImage || ''} onChange={e => setNewImage(e.target.value)} style={{ flex: 1, minWidth: '250px', margin: 0 }} />
            <button type="submit" disabled={uploading || !newImage} className={styles.btnPrimary} style={{ margin: 0 }}>
              + Add to Slider
            </button>
          </div>
          {newImage && <img src={newImage} alt="Preview" style={{ height: '100px', borderRadius: '4px', border: '2px solid var(--accent-gold)' }} />}
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {images.map((img, index) => (
            <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={img.image_url} alt="Slider" style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem', borderRadius: '4px' }}>
                {index > 0 && (
                  <button onClick={() => handleMoveImage(index, 'up')} className={styles.btnSecondary} style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }} title="Move Left">
                    <ArrowUp size={14} style={{ transform: 'rotate(-90deg)' }} />
                  </button>
                )}
                {index < images.length - 1 && (
                  <button onClick={() => handleMoveImage(index, 'down')} className={styles.btnSecondary} style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }} title="Move Right">
                    <ArrowDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                  </button>
                )}
                <button onClick={() => handleDeleteImage(img.id)} className={styles.btnDanger} style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }} title="Delete Image">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {images.length === 0 && <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>No images found.</p>}
        </div>
      </div>

      {/* STATISTICS SECTION */}
      <form onSubmit={handleSaveSettings}>
        <div className={styles.card}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Statistics</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Add, edit, or delete the animated numbers (e.g., 1500+ Projects).</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {settings.about_stats && settings.about_stats.map((stat: any, index: number) => (
              <div key={index} style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 2fr 2fr auto', 
                gap: '1rem', 
                alignItems: 'end',
                background: 'rgba(255,255,255,0.03)', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.1)' 
              }}>
                <div>
                  <label className={styles.label} style={{ fontSize: '0.85rem' }}>Number/Value</label>
                  <input type="text" placeholder="1500+" value={stat.value || ''} onChange={(e) => {
                    const newStats = [...settings.about_stats]; newStats[index].value = e.target.value; setSettings({...settings, about_stats: newStats});
                  }} className={styles.input} />
                </div>
                <div>
                  <label className={styles.label} style={{ fontSize: '0.85rem' }}>Label (EN)</label>
                  <input type="text" placeholder="Completed Projects" value={stat.label_en || ''} onChange={(e) => {
                    const newStats = [...settings.about_stats]; newStats[index].label_en = e.target.value; setSettings({...settings, about_stats: newStats});
                  }} className={styles.input} />
                </div>
                <div>
                  <label className={styles.label} style={{ fontSize: '0.85rem' }}>Label (AR)</label>
                  <input type="text" placeholder="مشروع منجز" value={stat.label_ar || ''} onChange={(e) => {
                    const newStats = [...settings.about_stats]; newStats[index].label_ar = e.target.value; setSettings({...settings, about_stats: newStats});
                  }} className={styles.input} dir="rtl" />
                </div>
                <button type="button" onClick={() => {
                  const newStats = settings.about_stats.filter((_:any, i:number) => i !== index);
                  setSettings({...settings, about_stats: newStats});
                }} className={styles.btnDanger} style={{ height: '42px', padding: '0 1rem' }} title="Remove Statistic">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            
            {(!settings.about_stats || settings.about_stats.length === 0) && (
              <p style={{ color: 'var(--text-secondary)' }}>No statistics added yet.</p>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={() => {
              const currentStats = settings.about_stats || [];
              setSettings({...settings, about_stats: [...currentStats, { value: '', label_en: '', label_ar: '' }]});
            }} className={styles.btnSecondary} style={{ flex: 1, borderStyle: 'dashed' }}>
              + Add New Statistic
            </button>
            
            <button type="submit" disabled={saving} className={styles.btnPrimary} style={{ flex: 1 }}>
              {saving ? 'Saving...' : 'Save Statistics'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
