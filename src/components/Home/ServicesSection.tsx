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

export default function ServicesSection({ dbProjects = [] }: { dbProjects?: any[] }) {
  const t = useTranslations('Services');
  const locale = useLocale();
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0); // First card expanded by default on desktop

  // Use DB projects if available, otherwise fallback to static hardcoded data
  const displayProjects = dbProjects && dbProjects.length > 0 
    ? dbProjects.map(p => ({
        id: p.slug || p.id.toString(),
        title: locale === 'ar' ? p.title_ar : p.title_en,
        desc: locale === 'ar' ? p.desc_ar : p.desc_en,
        image: p.image_url
      }))
    : servicesData.map(p => ({
        id: p.id,
        title: t(p.titleKey as any),
        desc: t(p.descKey as any),
        image: p.image
      }));

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
          {displayProjects.map((service, index) => {
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
                      alt={service.title} 
                      className={styles.image} 
                      animate={{ scale: isHovered ? 1.05 : 1.15 }}
                      transition={{ duration: 0.8 }}
                    />
                    <div className={`${styles.overlay} ${isHovered ? styles.overlayHovered : ''}`}></div>
                  </div>
                  
                  <div className={`${styles.content} ${isHovered ? styles.contentExpanded : ''}`}>
                    <div className={styles.contentInner}>
                      <h3 className={styles.cardTitle}>{service.title}</h3>
                      
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
                        <p className={styles.cardDesc}>{service.desc}</p>
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

        <motion.div 
          style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/gallery" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '1rem 2rem', 
            backgroundColor: 'transparent', 
            color: 'var(--accent-gold)', 
            border: '2px solid var(--accent-gold)', 
            borderRadius: '4px', 
            textDecoration: 'none', 
            fontWeight: '600', 
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-gold)';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--accent-gold)';
          }}
          >
            {locale === 'ar' ? 'تصفح معرض الصور الكامل' : 'Explore All Gallery'}
            <ArrowIcon size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
