'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

export default function Wish() {
  const { t } = useTranslation();
  
  const contactOptions = [
    { name: 'Gmail', icon: '✉️', href: 'mailto:gabbikdu@gmail.com?subject=About%20Your%20Petbrick%20Wish', color: 'bg-red-600' },
    { name: 'X', icon: '𝕏', href: 'https://x.com/habrielstark?s=21', color: 'bg-black' },
    { name: 'WhatsApp', icon: '📱', href: 'https://wa.me/34617325904', color: 'bg-green-600' },
    { name: 'Telegram', icon: '📬', href: 'https://t.me/HabriellYT', color: 'bg-blue-500' },
  ];
  
  return (
    <section className="py-20 px-4 bg-[var(--deep-purple)] text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--pink-main)] glow"
        style={{
          textShadow: '0 0 10px var(--pink-light)'
        }}
      >
        {t('wishTitle')}
      </motion.h2>

      <div suppressHydrationWarning className="max-w-xl mx-auto">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.4
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center space-y-5"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            className="text-xl"
          >
            {t('noDiscount')}
          </motion.p>
          
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            className="text-xl"
          >
            {t('noAttention')}
          </motion.p>
          
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            className="text-xl highlight-pink"
          >
            {t('justWant')}
          </motion.p>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1 }
            }}
            className="pt-8"
            suppressHydrationWarning
          >
            <p className="text-xl font-medium">
              {t('ifPossible')}
            </p>
            <p className="text-xl font-semibold highlight-pink mt-2">
              {t('giftMe')}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
          suppressHydrationWarning
        >
          <p className="w-full text-center mb-2 text-lg">{t('messageButton')}:</p>
          
          {contactOptions.map((option, index) => (
            <motion.a
              key={option.name}
              href={option.href}
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center px-4 py-2 ${option.color} text-white font-medium rounded-full transition-all`}
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,255,255,0.4)' }} 
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + (index * 0.1) }}
              suppressHydrationWarning
            >
              <span className="mr-2">{option.icon}</span>
              {option.name}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 