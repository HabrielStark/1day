'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImagePlaceholder from './ImagePlaceholder';
import { useTranslation } from '../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="py-10 px-4 bg-black text-white">
      <div suppressHydrationWarning className="max-w-4xl mx-auto text-center">
        <p className="text-base md:text-lg mb-6">
          <span dangerouslySetInnerHTML={{ __html: t('builtWith') }} />
        </p>
        
        <p className="text-sm mb-8 opacity-80">
          {t('hashtags')}
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 border border-[var(--pink-main)] text-[var(--pink-main)] rounded-md hover:bg-[var(--pink-main)] hover:text-white transition-colors"
        >
          {t('seeDesign')}
        </button>
      </div>

      {/* Design screenshot modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[var(--charcoal)] p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--pink-main)] text-white"
              >
                ×
              </button>
              
              <h3 className="text-xl font-medium mb-4 text-center">{t('day1Design')}</h3>
              
              <div suppressHydrationWarning className="rounded-lg overflow-hidden">
                <ImagePlaceholder
                  src="/images/day1-screenshot.webp"
                  alt="Day 1 Website Design"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
} 