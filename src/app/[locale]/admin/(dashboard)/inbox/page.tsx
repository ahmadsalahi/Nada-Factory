'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';
import { Trash2, MessageCircle, CheckCircle, Clock } from 'lucide-react';

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const res = await fetch('/api/admin/inbox');
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/admin/inbox/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await fetch(`/api/admin/inbox/${id}`, { method: 'DELETE' });
    fetchMessages();
  };

  const formatWhatsAppNumber = (phone: string) => {
    // Basic sanitization for whatsapp link (remove +, spaces, etc)
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Inbox & Quote Requests</h1>
        <p className={styles.pageDescription}>Manage customer inquiries. Click the WhatsApp icon to reply instantly.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.length === 0 ? (
          <div className={styles.card}>
            <p style={{ color: 'var(--text-secondary)' }}>No messages yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={styles.card} 
              style={{ 
                borderLeft: msg.status === 'unread' ? '4px solid var(--accent-gold)' : '4px solid #2ecc71',
                opacity: msg.status === 'read' ? 0.8 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {msg.name}
                    {msg.status === 'unread' && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--accent-gold)', color: '#000', borderRadius: '12px', fontWeight: 'bold' }}>New</span>}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <PhoneIcon size={14} /> <span dir="ltr">{msg.phone}</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <strong>Service:</strong> {msg.service || 'N/A'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={14} /> {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'pre-wrap' }}>
                    {msg.message || <span style={{ color: 'var(--text-secondary)' }}>No additional details provided.</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                  <a 
                    href={formatWhatsAppNumber(msg.phone)} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: '#fff', padding: '0.75rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', justifyContent: 'center' }}
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </a>
                  
                  {msg.status === 'unread' ? (
                    <button 
                      onClick={() => handleStatusChange(msg.id, 'read')}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', justifyContent: 'center' }}
                    >
                      <CheckCircle size={18} /> Mark Done
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStatusChange(msg.id, 'unread')}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.1)', color: 'var(--accent-gold)', padding: '0.75rem 1rem', border: '1px solid var(--accent-gold)', borderRadius: '4px', cursor: 'pointer', justifyContent: 'center' }}
                    >
                      Mark Unread
                    </button>
                  )}

                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className={styles.btnDanger}
                    style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PhoneIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
  );
}
