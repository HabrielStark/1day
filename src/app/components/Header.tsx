'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

type HeaderProps = {
  toggleTheme: () => void;
  isDarkMode: boolean;
};

export default function Header({ toggleTheme, isDarkMode }: HeaderProps) {
  const { language, toggleLanguage } = useTranslation();

  // Animation variants for buttons
  const buttonVariants = {
    initial: { scale: 0.6, rotate: 0 },
    animate: { scale: 1, rotate: 360, transition: { duration: 0.5 } },
    tap: { scale: 0.9, transition: { duration: 0.1 } }
  };

  return (
    <header className="fixed w-full top-0 px-4 py-3 flex justify-end items-center z-50 bg-opacity-80 backdrop-blur-sm">
      <div className="flex gap-3">
        <motion.button
          onClick={toggleLanguage}
          whileHover={{ 
            boxShadow: "0 0 8px 2px rgba(255, 100, 100, 0.5)",
            scale: 1.05
          }}
          whileTap="tap"
          className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden font-bold"
          style={{ 
            background: language === 'en' 
              ? "linear-gradient(135deg, #ff4b4b, #b71c1c)" 
              : "linear-gradient(135deg, #4caf50, #1b5e20)"
          }}
        >
          <motion.div
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            key={language === 'en' ? "zh" : "en"}
            className="absolute inset-0 flex items-center justify-center text-white"
          >
            {language === 'en' ? 'ZH' : 'EN'}
          </motion.div>
        </motion.button>

        <motion.button
          onClick={toggleTheme}
          whileHover={{ 
            boxShadow: isDarkMode 
              ? "0 0 8px 2px rgba(255, 255, 0, 0.5)" 
              : "0 0 8px 2px rgba(100, 100, 255, 0.5)",
            scale: 1.05
          }}
          whileTap="tap"
          className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
          style={{ 
            background: isDarkMode 
              ? "linear-gradient(135deg, #ffd200, #ff8b00)" 
              : "linear-gradient(135deg, #3b4bdb, #192271)"
          }}
        >
          <motion.div
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            key={isDarkMode ? "sun" : "moon"}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDarkMode ? (
              <div className="text-lg">☀️</div>
            ) : (
              <div className="text-lg">🌙</div>
            )}
          </motion.div>
        </motion.button>
      </div>
    </header>
  );
} 