'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Settings, Inbox, Folders, Image, ImageIcon, List, LogOut, ShieldAlert, Home } from 'lucide-react';
import styles from '../admin.module.css';

export default function AdminSidebar({ locale }: { locale: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  useEffect(() => {
    // 15 minutes of inactivity logout
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
      }, 15 * 60 * 1000); // 15 mins
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>NADA CMS</div>
      <nav className={styles.nav}>
        <Link href="/admin" className={styles.navLink}>
          <Settings size={20} /> General Info
        </Link>
        <Link href="/admin/inbox" className={styles.navLink}>
          <Inbox size={20} /> Inbox (Quotes)
        </Link>
        <Link href="/admin/projects" className={styles.navLink}>
          <Folders size={20} /> Projects
        </Link>
        <Link href="/admin/gallery" className={styles.navLink}>
          <Image size={20} /> Project Gallery
        </Link>
        <Link href="/admin/about" className={styles.navLink}>
          <ImageIcon size={20} /> About Slider
        </Link>
        
        {/* NEW MANAGE ADMIN LINK */}
        <Link href="/admin/manage" className={styles.navLink} style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <ShieldAlert size={20} /> Manage Admin
        </Link>
      </nav>
      <div className={styles.logoutWrapper}>
        <a href="/" className={styles.logoutBtn} style={{ marginBottom: '0.5rem' }}>
          <Home size={20} /> Back to Website
        </a>
        <button onClick={handleLogout} className={styles.logoutBtn} style={{ background: 'transparent', color: '#ff4757', border: '1px solid #ff4757' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
