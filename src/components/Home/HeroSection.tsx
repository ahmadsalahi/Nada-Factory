'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import styles from './HeroSection.module.css';

import { useLocale } from 'next-intl';
import QuoteModal from './QuoteModal';

export default function HeroSection({ dbSettings = {} }: { dbSettings?: any }) {
  const t = useTranslations('Services');
  const tHome = useTranslations('HomePage');
  const locale = useLocale();
  const ref = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const bgType = dbSettings.hero_bg_type || 'video';
  const bgUrl = dbSettings.hero_bg_url || '/hero-video.mp4';

  return (
    <section ref={ref} className={styles.heroSection}>
      {/* Dynamic Background */}
      <div className={styles.videoWrapper}>
        {bgType === 'video' ? (
          <video 
            key={bgUrl} // Forces video element to reload when URL changes
            autoPlay 
            loop 
            muted 
            playsInline 
            className={styles.videoBackground}
          >
            <source src={bgUrl} type="video/mp4" />
          </video>
        ) : (
          <img 
            key={bgUrl}
            src={bgUrl} 
            alt="Hero Background" 
            className={styles.videoBackground} // Reusing class for object-fit cover
          />
        )}
        
        {/* Particle Overlay for Video Feel */}
        <div className={styles.particlesContainer}>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
        </div>

        <div className={styles.overlay}></div>
      </div>

      <motion.div 
        className={styles.content}
        style={{ y, opacity }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className={styles.titleWrapper}
        >
          <h1 className={styles.title}>
            {locale === 'ar' 
              ? (dbSettings.hero_title_ar || tHome('heroTitle')) 
              : (dbSettings.hero_title_en || tHome('heroTitle'))}
          </h1>
        </motion.div>

        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {locale === 'ar' ? (dbSettings.hero_subtitle_ar || tHome('heroSubtitle')) : (dbSettings.hero_subtitle_en || tHome('heroSubtitle'))}
        </motion.p>

        <motion.div 
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <motion.button 
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
          >
            {tHome('cta')}
          </motion.button>
          
          {dbSettings.company_profile_pdf && (
            <motion.a 
              href={dbSettings.company_profile_pdf}
              target="_blank"
              rel="noreferrer"
              className={styles.ctaButton}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {locale === 'ar' ? 'بروفايل الشركة' : 'Our Profile'}
            </motion.a>
          )}
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
      </motion.div>

      <QuoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        dbSettings={dbSettings} 
      />
    </section>
  );
}
