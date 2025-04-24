'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import { useTranslation } from '../hooks/useTranslation';

export default function EasterEgg() {
  const { t } = useTranslation();
  const [secretMode, setSecretMode] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [furTextureExists, setFurTextureExists] = useState(true);
  const [purrSound] = useSound('/sounds/purr.mp3', { volume: 0.3 });
  
  useEffect(() => {
    // Check if fur texture exists
    fetch('/images/fur-texture.webp', { method: 'HEAD' })
      .then(response => setFurTextureExists(response.ok))
      .catch(() => setFurTextureExists(false));
      
    // Track key presses for the secret combination: Ctrl + P + 6
    const keys = {
      ctrl: false,
      p: false,
      six: false
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') keys.ctrl = true;
      if (e.key === 'p' || e.key === 'P') keys.p = true;
      if (e.key === '6') keys.six = true;
      
      // Check if all keys are pressed
      if (keys.ctrl && keys.p && keys.six) {
        purrSound();
        setSecretMode(true);
        
        // Auto hide the message after 5 seconds
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setSecretMode(false);
            setFadeOut(false);
          }, 1000);
        }, 5000);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') keys.ctrl = false;
      if (e.key === 'p' || e.key === 'P') keys.p = false;
      if (e.key === '6') keys.six = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [purrSound]);

  return (
    <>
      {/* Fur overlay */}
      <AnimatePresence>
        {secretMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeOut ? 0 : 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: furTextureExists ? "url('/images/fur-texture.webp')" : "linear-gradient(45deg, #ffe0e0, #ffccd5)",
              backgroundSize: "cover",
              mixBlendMode: "overlay"
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Secret message */}
      <AnimatePresence>
        {secretMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: fadeOut ? 0 : 1, y: fadeOut ? -20 : 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-6 py-3 rounded-full text-lg pointer-events-none z-50"
          >
            {t('secretCat')}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 