'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import styles from './Gallery.module.css';

interface GalleryProps {
  title: string;
  description: string;
  images: string[];
}

export default function Gallery({ title, description, images }: GalleryProps) {
  const t = useTranslations('Projects');
  const locale = useLocale();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'ArrowRight') {
        locale === 'ar' ? handlePrev() : handleNext();
      }
      if (e.key === 'ArrowLeft') {
        locale === 'ar' ? handleNext() : handlePrev();
      }
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length, locale]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className={styles.gallerySection}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{description}</p>
            <div className={styles.divider}></div>
          </div>
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {images.map((img, index) => (
            <motion.div 
              key={index} 
              className={`${styles.projectItem} ${index % 5 === 0 ? styles.colSpan2 : ''}`}
              variants={itemVariants}
              onClick={() => setSelectedIndex(index)}
            >
              <div className={styles.imageWrapper}>
                <Image src={img} alt={`${title} - Project ${index + 1}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.image} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox / Full Screen Image */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <button className={styles.closeBtn} onClick={() => setSelectedIndex(null)}>
              <X size={32} />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button 
                  className={`${styles.navBtn} ${styles.prevBtn}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    locale === 'ar' ? handleNext() : handlePrev();
                  }}
                >
                  <ChevronLeft size={40} />
                </button>
                <button 
                  className={`${styles.navBtn} ${styles.nextBtn}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    locale === 'ar' ? handlePrev() : handleNext();
                  }}
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}

            <motion.div 
              className={styles.lightboxContent}
              key={selectedIndex} // Force re-animation when image changes
              initial={{ scale: 0.9, opacity: 0, x: locale === 'ar' ? -50 : 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: locale === 'ar' ? 50 : -50 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()} 
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x;
                const swipeThreshold = 50;
                if (swipe < -swipeThreshold) {
                  locale === 'ar' ? handlePrev() : handleNext();
                } else if (swipe > swipeThreshold) {
                  locale === 'ar' ? handleNext() : handlePrev();
                }
              }}
            >
              <img src={images[selectedIndex]} alt="Fullscreen Project" className={styles.lightboxImage} draggable={false} />
              
              <div className={styles.imageCounter}>
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
