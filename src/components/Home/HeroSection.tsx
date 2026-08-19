'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const t = useTranslations('Services'); // Using the translations that have hero stuff
  const tHome = useTranslations('HomePage');
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className={styles.heroSection}>
      {/* Video Background */}
      <div className={styles.videoWrapper}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={styles.videoBackground}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
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
            {tHome('heroTitle')}
          </h1>
        </motion.div>

        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {tHome('heroSubtitle')}
        </motion.p>

        <motion.button 
          className={styles.ctaButton}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {tHome('cta')}
        </motion.button>
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
    </section>
  );
}
