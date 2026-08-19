'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import styles from './ServicesSection.module.css';

const servicesData = [
  {
    id: 'doors',
    titleKey: 'doorsTitle',
    descKey: 'doorsDesc',
    image: '/images/modern_metal_door_1786955577738.jpg'
  },
  {
    id: 'facades',
    titleKey: 'facadesTitle',
    descKey: 'facadesDesc',
    image: '/images/modern_glass_facade_1786955587529.jpg'
  },
  {
    id: 'pergolas',
    titleKey: 'pergolasTitle',
    descKey: 'pergolasDesc',
    image: '/images/modern_metal_pergola_1786955594944.jpg'
  }
];

export default function ServicesSection() {
  const t = useTranslations('Services');
  const locale = useLocale();
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0); // First card expanded by default on desktop

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>{t('sectionTitle')}</h2>
          <p className={styles.subtitle}>{t('sectionSubtitle')}</p>
        </motion.div>

        <div className={styles.accordionGrid}>
          {servicesData.map((service, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div 
                key={service.id} 
                className={styles.cardWrapper}
                animate={{ 
                  flex: isHovered ? 3 : 1 
                }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link href={`/services/${service.id}`} className={styles.cardLink}>
                  <div className={styles.imageWrapper}>
                    <motion.img 
                      src={service.image} 
                      alt={t(service.titleKey)} 
                      className={styles.image} 
                      animate={{ scale: isHovered ? 1.05 : 1.15 }}
                      transition={{ duration: 0.8 }}
                    />
                    <div className={`${styles.overlay} ${isHovered ? styles.overlayHovered : ''}`}></div>
                  </div>
                  
                  <div className={`${styles.content} ${isHovered ? styles.contentExpanded : ''}`}>
                    <div className={styles.contentInner}>
                      <h3 className={styles.cardTitle}>{t(service.titleKey)}</h3>
                      
                      <motion.div 
                        className={styles.hiddenContent}
                        initial={false}
                        animate={{ 
                          height: isHovered ? 'auto' : 0, 
                          opacity: isHovered ? 1 : 0,
                          marginTop: isHovered ? '1rem' : '0'
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className={styles.cardDesc}>{t(service.descKey)}</p>
                        <div className={styles.exploreBtn}>
                          {t('explore')}
                          <ArrowIcon size={16} className={styles.arrow} />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
