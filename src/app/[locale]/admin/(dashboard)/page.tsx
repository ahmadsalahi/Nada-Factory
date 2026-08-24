'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    hero_title_en: '',
    hero_title_ar: '',
    hero_subtitle_en: '',
    hero_subtitle_ar: '',
    hero_bg_type: 'video',
    hero_bg_url: '',
    company_profile_pdf: '',
    email: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    linkedin: '',
    social_links: [],
    smtp_email: '',
    smtp_password: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        let parsedSocialLinks = [];
        if (data.social_links) {
          try {
            parsedSocialLinks = JSON.parse(data.social_links);
          } catch(e) {}
        } else {
          // Fallback migration from old settings
          if (data.whatsapp) parsedSocialLinks.push({ icon: 'FaWhatsapp', url: data.whatsapp });
          if (data.instagram) parsedSocialLinks.push({ icon: 'FaInstagram', url: data.instagram });
          if (data.linkedin) parsedSocialLinks.push({ icon: 'FaLinkedinIn', url: data.linkedin });
        }
        setSettings((prev: any) => ({ ...prev, ...data, social_links: parsedSocialLinks }));
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... exists
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingBg(true);
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      const data = await res.json();
      setSettings({ ...settings, hero_bg_url: data.url });
    } catch (err) {
      alert("Error uploading background");
    } finally {
      setUploadingBg(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingPdf(true);
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      const data = await res.json();
      setSettings({ ...settings, company_profile_pdf: data.url });
    } catch (err) {
      alert("Error uploading PDF");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const payloadToSave = {
      ...settings,
      social_links: JSON.stringify(settings.social_links)
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSave),
      });

      if (res.ok) setMessage('Settings saved successfully! ✅');
      else setMessage('Failed to save settings. ❌');
    } catch (err) {
      setMessage('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>General Settings</h1>
        <p className={styles.pageDescription}>Manage the homepage hero section and global contact information.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Hero Section & Company Profile</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Company Profile (PDF)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <input type="file" accept="application/pdf" onChange={handlePdfUpload} className={styles.input} style={{ flex: 1, minWidth: '200px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>OR</span>
              <input 
                name="company_profile_pdf" 
                placeholder="https://example.com/profile.pdf" 
                value={settings.company_profile_pdf || ''} 
                onChange={handleChange} 
                className={styles.input} 
                style={{ flex: 2, minWidth: '300px' }} 
              />
            </div>
            {uploadingPdf && <span style={{ color: 'var(--accent-gold)', display: 'block', marginTop: '0.5rem' }}>Uploading PDF...</span>}
            
            {settings.company_profile_pdf && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <a href={settings.company_profile_pdf} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>
                  View Current Profile PDF
                </a>
                <button type="button" onClick={() => setSettings({...settings, company_profile_pdf: ''})} className={styles.btnDanger} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                  Remove
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Background Type</label>
            <select name="hero_bg_type" value={settings.hero_bg_type || 'video'} onChange={handleChange} className={styles.input}>
              <option value="video">Video (MP4)</option>
              <option value="image">Static Image</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Background File (Upload OR Paste URL)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <input type="file" accept="image/*,video/mp4" onChange={handleBgUpload} className={styles.input} style={{ flex: 1, minWidth: '200px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>OR</span>
              <input 
                name="hero_bg_url" 
                placeholder="https://example.com/bg.mp4" 
                value={settings.hero_bg_url || ''} 
                onChange={handleChange} 
                className={styles.input} 
                style={{ flex: 2, minWidth: '300px' }} 
              />
            </div>
            {uploadingBg && <span style={{ color: 'var(--accent-gold)', display: 'block', marginTop: '0.5rem' }}>Uploading...</span>}
            
            {settings.hero_bg_url && (
              <div style={{ marginTop: '1rem' }}>
                {settings.hero_bg_type === 'image' ? (
                  <img src={settings.hero_bg_url} alt="Preview" style={{ height: '100px', borderRadius: '4px', border: '1px solid var(--accent-gold)' }} />
                ) : (
                  <video src={settings.hero_bg_url} autoPlay muted loop style={{ height: '100px', borderRadius: '4px', border: '1px solid var(--accent-gold)' }} />
                )}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Hero Title (English)</label>
            <input 
              name="hero_title_en" 
              value={settings.hero_title_en || ''} 
              onChange={handleChange} 
              className={styles.input} 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Hero Title (Arabic)</label>
            <input 
              name="hero_title_ar" 
              value={settings.hero_title_ar || ''} 
              onChange={handleChange} 
              className={styles.input} 
              dir="rtl"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Hero Subtitle (English)</label>
            <textarea 
              name="hero_subtitle_en" 
              value={settings.hero_subtitle_en || ''} 
              onChange={handleChange} 
              className={styles.input} 
              style={{ minHeight: '60px' }}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Hero Subtitle (Arabic)</label>
            <textarea 
              name="hero_subtitle_ar" 
              value={settings.hero_subtitle_ar || ''} 
              onChange={handleChange} 
              className={styles.input} 
              dir="rtl"
              style={{ minHeight: '60px' }}
            />
          </div>
        </div>

        <div className={styles.card}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Contact Info (Text)</h3>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address (Displayed on site)</label>
            <input name="email" type="email" value={settings.email || ''} onChange={handleChange} className={styles.input} placeholder="info@nadaindustries.com" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number 1</label>
            <input name="phone" value={settings.phone || ''} onChange={handleChange} className={styles.input} placeholder="+123 456 7890" dir="ltr" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number 2</label>
            <input name="phone2" value={settings.phone2 || ''} onChange={handleChange} className={styles.input} placeholder="+123 456 7890" dir="ltr" />
          </div>
        </div>

        <div className={styles.card}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Social Media & Action Icons</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Add icons for Map, Social Media, WhatsApp, etc.</p>
          
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
            {settings.social_links && settings.social_links.map((link: any, index: number) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <select 
                  value={link.icon || 'FaWhatsapp'}
                  onChange={(e) => {
                    const newLinks = [...settings.social_links];
                    newLinks[index].icon = e.target.value;
                    setSettings({...settings, social_links: newLinks});
                  }}
                  className={styles.input}
                  style={{ width: '150px' }}
                >
                  <option value="FaWhatsapp">WhatsApp</option>
                  <option value="FaInstagram">Instagram</option>
                  <option value="FaXTwitter">X (Twitter)</option>
                  <option value="FaSnapchat">Snapchat</option>
                  <option value="FaTiktok">TikTok</option>
                  <option value="FaLinkedinIn">LinkedIn</option>
                  <option value="FaFacebookF">Facebook</option>
                  <option value="FaYoutube">YouTube</option>
                  <option value="FaMapLocationDot">Map / Location</option>
                  <option value="FaPhone">Phone Icon</option>
                  <option value="FaEnvelope">Email Icon</option>
                  <option value="FaGlobe">Website</option>
                </select>
                
                <input 
                  type="text" 
                  value={link.url || ''}
                  onChange={(e) => {
                    const newLinks = [...settings.social_links];
                    newLinks[index].url = e.target.value;
                    setSettings({...settings, social_links: newLinks});
                  }}
                  placeholder="https://..."
                  className={styles.input}
                  style={{ flex: 1 }}
                />
                
                <button 
                  type="button"
                  onClick={() => {
                    const newLinks = settings.social_links.filter((_:any, i:number) => i !== index);
                    setSettings({...settings, social_links: newLinks});
                  }}
                  style={{ background: 'var(--accent-danger, #e74c3c)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          
          <button 
            type="button"
            onClick={() => {
              const currentLinks = settings.social_links || [];
              setSettings({...settings, social_links: [...currentLinks, { icon: 'FaWhatsapp', url: '' }]});
            }}
            style={{ background: 'transparent', color: 'var(--accent-gold)', border: '1px dashed var(--accent-gold)', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
          >
            + Add New Icon
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" disabled={saving} className={styles.btnPrimary}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
          {message && <span style={{ color: 'var(--accent-gold)' }}>{message}</span>}
        </div>
      </form>
    </div>
  );
}
