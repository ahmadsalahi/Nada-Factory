'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import styles from './Gallery.module.css';

interface GalleryProps {
  title: string;
  description: string;
  images: string[];
}

export default function Gallery({ title, description, images }: GalleryProps) {
  const t = useTranslations('Projects');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
              onClick={() => setSelectedImage(img)}
            >
              <div className={styles.imageWrapper}>
                <img src={img} alt={`${title} - Project ${index + 1}`} className={styles.image} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox / Full Screen Image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>
              <X size={32} />
            </button>
            <motion.div 
              className={styles.lightboxContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            >
              <img src={selectedImage} alt="Fullscreen Project" className={styles.lightboxImage} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
