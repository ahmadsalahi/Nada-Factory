'use client';

import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import styles from './FloatingContact.module.css';
import { useLocale } from 'next-intl';

export default function FloatingContact({ dbSettings }: { dbSettings: any }) {
  const locale = useLocale();

  let whatsappUrl = dbSettings?.whatsapp || '';
  if (!whatsappUrl && dbSettings?.social_links) {
    try {
      const links = JSON.parse(dbSettings.social_links);
      const waLink = links.find((l: any) => l.icon === 'FaWhatsapp');
      if (waLink && waLink.url) whatsappUrl = waLink.url;
    } catch(e) {}
  }
  
  // Fallback: If no WhatsApp URL is provided but we have a phone number, generate one
  if (!whatsappUrl && dbSettings?.phone) {
    const cleanPhone = dbSettings.phone.replace(/[^0-9]/g, '');
    whatsappUrl = `https://wa.me/${cleanPhone}`;
  }

  if (!dbSettings?.phone && !whatsappUrl) return null;

  return (
    <div className={styles.floatingContainer}>
      {/* WhatsApp Button */}
      {whatsappUrl && (
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noreferrer" 
          className={`${styles.floatingBtn} ${styles.whatsappBtn} ${styles.rightBtn}`}
          title="WhatsApp"
        >
          <FaWhatsapp size={28} />
        </a>
      )}

      {/* Phone Button */}
      {dbSettings.phone && (
        <a 
          href={`tel:${dbSettings.phone}`} 
          className={`${styles.floatingBtn} ${styles.phoneBtn} ${styles.leftBtn}`}
          title="Call Us"
        >
          <Phone size={28} />
        </a>
      )}
    </div>
  );
}
