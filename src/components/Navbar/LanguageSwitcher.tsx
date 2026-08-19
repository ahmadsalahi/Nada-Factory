'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import styles from './Navbar.module.css';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button 
      className={styles.langButton} 
      onClick={toggleLanguage}
      disabled={isPending}
      aria-label="Toggle language"
    >
      <Globe size={18} />
      <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
    </button>
  );
}
