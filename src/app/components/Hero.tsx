'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import ImagePlaceholder from './ImagePlaceholder';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from './ThemeProvider';

export default function Hero() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  // We'll need to create this sound file
  const [playClickSound] = useSound('/sounds/switch-click.mp3', { volume: 0.5 });

  // Motion values for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform mouse motion to rotation
  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);
  
  // Sparkle effect state
  const [sparkles, setSparkles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    size: number;
    opacity: number;
  }>>([]);

  const scrollToNextSection = () => {
    playClickSound();
    const dreamSection = document.getElementById('dream-section');
    if (dreamSection) {
      dreamSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Add sparkle effect on click
    generateSparkles(25);
  };

  // Generate random sparkles
  const generateSparkles = (count: number) => {
    const newSparkles: Array<{
      id: string;
      x: number;
      y: number;
      size: number;
      opacity: number;
    }> = [];
    
    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 100;
      const offsetY = (Math.random() - 0.5) * 100;
      const size = Math.random() * 5 + 2;
      
      newSparkles.push({
        id: `sparkle-${Date.now()}-${i}`,
        x: offsetX,
        y: offsetY,
        size,
        opacity: 1,
      });
    }
    
    setSparkles([...sparkles, ...newSparkles]);
    
    // Remove sparkles after animation
    setTimeout(() => {
      setSparkles(currentSparkles => 
        currentSparkles.filter(s => !newSparkles.includes(s))
      );
    }, 1000);
  };

  // Mouse trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update mouse position for parallax effect
      if (imageRef.current) {
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
      }
      
      // Create mouse trail
      const trail = document.createElement('div');
      trail.className = 'trail';
      trail.style.left = e.pageX + 'px';
      trail.style.top = e.pageY + 'px';
      
      // Random color variations
      const hue = isDarkMode ? 320 + Math.random() * 30 : 350 + Math.random() * 30;
      trail.style.backgroundColor = `hsla(${hue}, 100%, 70%, 0.7)`;
      
      document.body.appendChild(trail);

      setTimeout(() => {
        trail.remove();
      }, 1000);
    };

    // Occasionally generate random sparkles
    const sparkleInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        generateSparkles(1);
      }
    }, 500);

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(sparkleInterval);
    };
  }, [x, y, isDarkMode, generateSparkles]);

  // Keyboard hovering event handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    generateSparkles(5);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <style jsx>{`
        .trail {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10;
          opacity: 0.7;
          animation: fadeOut 1s linear forwards;
        }
        
        @keyframes fadeOut {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(0); opacity: 0; }
        }
        
        .sparkle {
          position: absolute;
          border-radius: 50%;
          background: white;
          z-index: 20;
          pointer-events: none;
          animation: sparkleAnim 1.5s linear forwards;
        }
        
        @keyframes sparkleAnim {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        
        .glow-effect {
          filter: drop-shadow(0 0 10px var(--pink-light));
        }
      `}</style>

      {/* Title with shimmer effect */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-8 max-w-xl relative z-10 mt-20 pt-16"
      >
        <div className="relative overflow-hidden mb-4">
          <p className="text-2xl md:text-3xl font-bold glass p-3 rounded-lg shadow-lg" 
             style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
            {t('greeting')}
          </p>
        </div>
        <div className="relative overflow-hidden mb-4">
          <p className="text-2xl md:text-3xl glass p-3 rounded-lg shadow-lg"
             style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
            {t('loveMessage')}
          </p>
        </div>
        <div className="relative overflow-hidden shimmer">
          <p className="text-2xl md:text-3xl highlight-pink glass p-3 rounded-lg shadow-lg"
             style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid var(--pink-main)' }}>
            {t('cantAfford')}
          </p>
        </div>
      </motion.div>

      {/* 3D hovering keyboard */}
      <motion.div
        ref={imageRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          perspective: 1000
        }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative w-full max-w-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
          className={`relative ${isHovered ? 'glow-effect' : ''}`}
        >
          <ImagePlaceholder 
            src="/images/petbrick65.webp" 
            alt="Petbrick 65 Keyboard" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
          
          {/* Sparkle effects */}
          <AnimatePresence>
            {sparkles.map(sparkle => (
              <motion.div
                key={sparkle.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,180,210,0.8) 60%, rgba(255,180,210,0) 100%)`,
                  width: sparkle.size,
                  height: sparkle.size,
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                  boxShadow: '0 0 10px rgba(255, 150, 180, 0.8)',
                  zIndex: 10
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Button with enhanced effects */}
      <motion.button
        ref={buttonRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        onClick={scrollToNextSection}
        whileHover={{ 
          scale: 1.05, 
          boxShadow: '0 0 15px var(--pink-main)', 
          background: 'linear-gradient(45deg, var(--pink-dark), var(--pink-main), var(--pink-light), var(--pink-main), var(--pink-dark))',
          backgroundSize: '200% 200%',
          animation: 'shimmer 2s linear infinite'
        }}
        whileTap={{ scale: 0.95 }}
        className="mt-12 px-8 py-3 bg-[var(--pink-main)] text-white rounded-full font-medium shadow-lg border border-[rgba(255,255,255,0.2)] transition-all relative overflow-hidden"
      >
        <span className="relative z-10">{t('showWhyButton')}</span>
      </motion.button>
    </section>
  );
} 