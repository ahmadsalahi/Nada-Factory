import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaXTwitter, FaFacebookF } from 'react-icons/fa6';
import styles from './Footer.module.css';

export default function Footer() {
  const tNav = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
             <img src="/logo.jpeg" alt="Nada Industries Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }} />
          </div>
          <p className={styles.description}>
            {tFooter('description')}
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
          <p className={styles.info}>info@nadaindustries.com</p>
          <p className={styles.info}>+123 456 7890</p>
          
          <div className={styles.socials}>
            <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X (Twitter)">
              <FaXTwitter />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
              <FaFacebookF />
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <p>&copy; {currentYear} Nada Industries. All rights reserved.</p>
      </div>
    </footer>
  );
}

