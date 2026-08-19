'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import styles from './AboutSection.module.css';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

const fallbackImages = [
  "/images/about_saudi_office_v2.jpg",
  "/images/about_cnc_machine_v2.jpg",
  "/images/about_factory_workers_v2.jpg",
  "/images/about_door_insulation_v2.jpg"
];

import { useLocale } from 'next-intl';

export default function AboutSection({ dbImages = [], dbSettings = {} }: { dbImages?: any[], dbSettings?: any }) {
  const t = useTranslations('About');
  const locale = useLocale();
  const ref = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imagesToUse = dbImages && dbImages.length > 0 
    ? dbImages.map(img => img.image_url) 
    : fallbackImages;

  const intervalTime = dbSettings.about_slider_interval ? parseInt(dbSettings.about_slider_interval) : 6000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesToUse.length);
    }, intervalTime); 
    return () => clearInterval(interval);
  }, [imagesToUse.length, intervalTime]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scaleParallax = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  let parsedStats = [];
  try {
    if (dbSettings.about_stats) parsedStats = JSON.parse(dbSettings.about_stats);
  } catch(e) {}
  
  if (parsedStats.length === 0) {
    parsedStats = [
      { value: '25+', label_en: 'Years Experience', label_ar: 'عاماً من الخبرة' },
      { value: '1500+', label_en: 'Completed Projects', label_ar: 'مشروع منجز' },
      { value: '100%', label_en: 'Client Satisfaction', label_ar: 'رضا العملاء' }
    ];
  }

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <section id="about" ref={ref} className={styles.aboutSection}>
      <motion.div className={styles.glowBackground} style={{ opacity: opacityFade }} />
      
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Text Content */}
          <motion.div 
            className={styles.textContent}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className={styles.badgeWrapper}>
              <div className={styles.badge}>
                {t('title')}
              </div>
              <div className={styles.badgeLine}></div>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className={styles.title}>
              {locale === 'ar' ? (dbSettings.about_title_ar || t('subtitle')) : (dbSettings.about_title_en || t('subtitle'))}
            </motion.h2>
            
            <motion.div variants={itemVariants} className={styles.divider}></motion.div>
            
            <motion.p variants={itemVariants} className={styles.description}>
              {locale === 'ar' ? (dbSettings.about_desc_ar || t('description')) : (dbSettings.about_desc_en || t('description'))}
            </motion.p>
            
            <motion.div variants={containerVariants} className={styles.statsGrid}>
              {parsedStats.map((stat: any, index: number) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants} 
                  className={styles.statItem}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={styles.statGlow}></div>
                  <h3 className={styles.statValue}>{stat.value}</h3>
                  <p className={styles.statLabel}>{locale === 'ar' ? stat.label_ar : stat.label_en}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            className={styles.imageContent}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className={styles.imageWrapper}>
              <motion.div style={{ y: yParallax, scale: scaleParallax, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                <AnimatePresence>
                  <motion.img 
                    key={currentImageIndex}
                    src={imagesToUse[currentImageIndex]} 
                    alt="Nada Industries Manufacturing" 
                    className={styles.imageFading} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </AnimatePresence>
              </motion.div>
              <div className={styles.imageOverlay}></div>
              
              {/* Floating Experience Badge removed as per user request */}
              
              {/* Decorative Elements */}
              <motion.div 
                className={styles.decorativeSquare}
                style={{ y: useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]) }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
