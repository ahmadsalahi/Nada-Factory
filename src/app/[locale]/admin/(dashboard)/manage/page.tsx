'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';

export default function ManageAdminPage() {
  const [settings, setSettings] = useState<any>({
    smtp_email: '',
    smtp_password: '',
    admin_email: '',
    new_admin_password: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          smtp_email: data.smtp_email || '',
          smtp_password: data.smtp_password || '',
          admin_email: data.admin_email || '',
          new_admin_password: ''
        });
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const { new_admin_password: newPassword, ...payloadToSave } = settings;

    try {
      // Save general settings (smtp, admin_email)
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSave),
      });

      // Special endpoint to hash new admin password
      if (newPassword) {
        await fetch('/api/admin/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword }),
        });
        setSettings((prev: any) => ({ ...prev, new_admin_password: '' })); // clear field
      }

      if (res.ok) setMessage('Admin settings updated successfully! ✅');
      else setMessage('Failed to update admin settings. ❌');
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
        <h1 className={styles.pageTitle}>Manage Admin & Security</h1>
        <p className={styles.pageDescription}>Configure your login credentials and system email notifications.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Admin Security (Login Info)</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Update the email and password used to log in to this CMS. Changing the email changes where your OTP codes are sent.</p>
          <div className={styles.formGroup}>
            <label className={styles.label}>Admin Login Email</label>
            <input 
              name="admin_email" 
              type="email" 
              value={settings.admin_email} 
              onChange={handleChange} 
              className={styles.input} 
              placeholder="admin@example.com" 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>New Password (leave blank to keep current)</label>
            <input 
              name="new_admin_password" 
              type="password" 
              value={settings.new_admin_password} 
              onChange={handleChange} 
              className={styles.input} 
              placeholder="Enter new password" 
            />
          </div>
        </div>

        <div className={styles.card}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Email Notifications Setup (System SMTP)</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Configure the Gmail account used by the system to send OTP codes and Quote Requests. Use a 16-character Gmail App Password.</p>
          <div className={styles.formGroup}>
            <label className={styles.label}>Sending Email (Gmail)</label>
            <input 
              name="smtp_email" 
              type="email" 
              value={settings.smtp_email} 
              onChange={handleChange} 
              className={styles.input} 
              placeholder="your-email@gmail.com" 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>App Password</label>
            <input 
              name="smtp_password" 
              type="password" 
              value={settings.smtp_password} 
              onChange={handleChange} 
              className={styles.input} 
              placeholder="16-character app password" 
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" disabled={saving} className={styles.btnPrimary}>
            {saving ? 'Saving...' : 'Save Admin Settings'}
          </button>
          {message && <span style={{ color: message.includes('✅') ? '#2ecc71' : '#e74c3c' }}>{message}</span>}
        </div>
      </form>
    </div>
  );
}
