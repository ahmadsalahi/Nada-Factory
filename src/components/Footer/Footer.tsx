'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaXTwitter, FaFacebookF, FaYoutube, FaSnapchat, FaTiktok, FaMapLocationDot, FaPhone, FaEnvelope, FaGlobe } from 'react-icons/fa6';
import styles from './Footer.module.css';

const IconMap: any = {
  FaWhatsapp, FaInstagram, FaLinkedinIn, FaXTwitter, FaFacebookF, FaYoutube, FaSnapchat, FaTiktok, FaMapLocationDot, FaPhone, FaEnvelope, FaGlobe
};

export default function Footer({ dbSettings = {} }: { dbSettings?: any }) {
  const tNav = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');
  const pathname = usePathname();
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  if (pathname.includes('/admin')) return null;

  let socialLinks = [];
  try {
    if (dbSettings.social_links) {
      socialLinks = JSON.parse(dbSettings.social_links);
    } else {
      if (dbSettings.whatsapp) socialLinks.push({ icon: 'FaWhatsapp', url: dbSettings.whatsapp });
      if (dbSettings.instagram) socialLinks.push({ icon: 'FaInstagram', url: dbSettings.instagram });
      if (dbSettings.linkedin) socialLinks.push({ icon: 'FaLinkedinIn', url: dbSettings.linkedin });
    }
  } catch(e) {}

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
             <img src="/logo.jpeg" alt="Nada Industries Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }} />
          </div>
          <p className={styles.description}>
            {locale === 'ar' ? (dbSettings.hero_subtitle_ar || tFooter('description')) : (dbSettings.hero_subtitle_en || tFooter('description'))}
          </p>
        </div>

        <div className={styles.links}>
          <h4 className={styles.title}>{tFooter('quickLinks')}</h4>
          <nav className={styles.nav}>
            <Link href="/" className={styles.link}>{tNav('home')}</Link>
            <Link href="/#projects" className={styles.link}>{tNav('projects')}</Link>
            <Link href="/#about" className={styles.link}>{tNav('about')}</Link>
            <Link href="/#contact" className={styles.link}>{tNav('contact')}</Link>
          </nav>
        </div>

        <div className={styles.contact}>
          <h4 className={styles.title}>{tFooter('contactUs')}</h4>
          {dbSettings.email && (
            <p className={styles.info} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
              <span dir="ltr">{dbSettings.email}</span>
            </p>
          )}
          {dbSettings.phone && (
            <p className={styles.info} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
              <span dir="ltr">{dbSettings.phone}</span>
            </p>
          )}
          {dbSettings.phone2 && (
            <p className={styles.info} style={{ textAlign: locale === 'ar' ? 'right' : 'left' }}>
              <span dir="ltr">{dbSettings.phone2}</span>
            </p>
          )}
          
          <div className={styles.socials} style={{ justifyContent: locale === 'ar' ? 'flex-start' : 'flex-start' }}>
            {socialLinks.map((link: any, idx: number) => {
              const IconComponent = IconMap[link.icon];
              if (!IconComponent) return null;
              return (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <p>&copy; {currentYear} Nada Industries. All rights reserved.</p>
      </div>
    </footer>
  );
}

