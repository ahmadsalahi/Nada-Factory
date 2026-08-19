'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import styles from './AboutSection.module.css';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

const aboutImages = [
  "/images/about_saudi_office_v2.jpg",
  "/images/about_cnc_machine_v2.jpg",
  "/images/about_factory_workers_v2.jpg",
  "/images/about_door_insulation_v2.jpg"
];

export default function AboutSection() {
  const t = useTranslations('About');
  const ref = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % aboutImages.length);
    }, 6000); // Change image every 6 seconds for a slower, calmer feel
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scaleParallax = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const stats = [
    { value: '25+', label: t('stats1') },
    { value: '1500+', label: t('stats2') },
    { value: '100%', label: t('stats3') }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
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
              <div className={styles.badge}>{t('title')}</div>
              <div className={styles.badgeLine}></div>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className={styles.title}>
              {t('subtitle')}
            </motion.h2>
            
            <motion.div variants={itemVariants} className={styles.divider}></motion.div>
            
            <motion.p variants={itemVariants} className={styles.description}>
              {t('description')}
            </motion.p>
            
            <motion.div variants={containerVariants} className={styles.statsGrid}>
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants} 
                  className={styles.statItem}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={styles.statGlow}></div>
                  <h3 className={styles.statValue}>{stat.value}</h3>
                  <p className={styles.statLabel}>{stat.label}</p>
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
                    src={aboutImages[currentImageIndex]} 
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
              
              {/* Floating Experience Badge */}
              <motion.div 
                className={styles.experienceBox}
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: "easeInOut" 
                }}
              >
                <div className={styles.expInner}>
                  <span className={styles.expNumber}>25</span>
                  <span className={styles.expText}>عاماً من<br/>التميز</span>
                </div>
              </motion.div>
              
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
