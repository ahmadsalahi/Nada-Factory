'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import styles from './QuoteModal.module.css';
import { useLocale } from 'next-intl';

export default function QuoteModal({ 
  isOpen, 
  onClose,
  dbSettings 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  dbSettings: any;
}) {
  const locale = useLocale();
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Fetch projects for the dropdown
    fetch('/api/admin/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({ name: '', phone: '', service: '', message: '' });
        }, 3000);
      } else {
        alert('Failed to send request. Please try again.');
      }
    } catch (err) {
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  let whatsappUrl = dbSettings?.whatsapp || '';
  if (!whatsappUrl && dbSettings?.social_links) {
    try {
      const links = JSON.parse(dbSettings.social_links);
      const waLink = links.find((l: any) => l.icon === 'FaWhatsapp');
      if (waLink && waLink.url) whatsappUrl = waLink.url;
    } catch(e) {}
  }

  if (whatsappUrl && !whatsappUrl.startsWith('http')) {
    const cleanPhone = whatsappUrl.replace(/[^0-9]/g, '');
    whatsappUrl = `https://wa.me/${cleanPhone}`;
  } else if (!whatsappUrl && dbSettings?.phone) {
    const cleanPhone = dbSettings.phone.replace(/[^0-9]/g, '');
    whatsappUrl = `https://wa.me/${cleanPhone}`;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className={styles.modalContainer}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
            >
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={24} />
              </button>

              <h2 className={styles.title}>
                {locale === 'ar' ? 'طلب عرض سعر' : 'Request a Quote'}
              </h2>
              
              {/* Direct Contact Buttons (Replaced old small icons with big buttons) */}
              <div className={styles.directContactButtons}>
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className={`${styles.bigContactBtn} ${styles.btnWhatsapp}`}>
                    <FaWhatsapp size={20} />
                    <span>{locale === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                  </a>
                )}
                {dbSettings.phone && (
                  <a href={`tel:${dbSettings.phone}`} className={`${styles.bigContactBtn} ${styles.btnPhone}`}>
                    <Phone size={20} />
                    <span>{locale === 'ar' ? 'اتصال' : 'Call'}</span>
                  </a>
                )}
              </div>
              
              <div className={styles.divider}>
                <span>{locale === 'ar' ? 'أو عبر النموذج' : 'Or via form'}</span>
              </div>

              {success ? (
                <div className={styles.successMessage}>
                  <h3>{locale === 'ar' ? 'تم الاستلام بنجاح! ✅' : 'Received Successfully! ✅'}</h3>
                  <p>{locale === 'ar' ? 'سيقوم فريقنا الهندسي بالتواصل معك في أقرب وقت.' : 'Our engineering team will contact you shortly.'}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{locale === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{locale === 'ar' ? 'رقم الجوال / واتساب *' : 'Phone / WhatsApp *'}</label>
                    <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} dir="ltr" />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{locale === 'ar' ? 'الخدمة المطلوبة' : 'Service Needed'}</label>
                    <select name="service" value={formData.service} onChange={handleChange} className={styles.input}>
                      <option value="">{locale === 'ar' ? '-- اختر الخدمة --' : '-- Select a Service --'}</option>
                      {projects.map(p => (
                        <option key={p.id} value={locale === 'ar' ? p.title_ar : p.title_en}>
                          {locale === 'ar' ? p.title_ar : p.title_en}
                        </option>
                      ))}
                      <option value="Other">{locale === 'ar' ? 'أخرى' : 'Other'}</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{locale === 'ar' ? 'تفاصيل إضافية (اختياري)' : 'Additional Details (Optional)'}</label>
                    <textarea 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      className={styles.textarea} 
                      rows={4}
                    ></textarea>
                  </div>

                  <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (locale === 'ar' ? 'إرسال الطلب' : 'Submit Request')}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
