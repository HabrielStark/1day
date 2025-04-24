'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ImagePlaceholder from './ImagePlaceholder';
import { useTranslation } from '../hooks/useTranslation';

type CardProps = {
  titleKey: string;
  captionKey: string;
  image: string;
};

function Card({ titleKey, captionKey, image }: CardProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);

  // 3D tilt effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth out the movement
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  
  // Transform the x and y values to rotate the card
  const rotateX = useTransform(springY, [-100, 100], [30, -30]);
  const rotateY = useTransform(springX, [-100, 100], [-30, 30]);
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate cursor position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Update motion values
    x.set(mouseX);
    y.set(mouseY);
  };
  
  const handleMouseLeave = () => {
    // Reset to neutral position
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="w-full sm:w-[300px] h-[350px] relative rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={{ scale: 1.05 }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 z-10"
        style={{
          transformStyle: "preserve-3d",
          transform: "translateZ(0px)",
        }}
      />
      
      <div 
        style={{
          transformStyle: "preserve-3d",
          transform: "translateZ(-20px)",
        }}
        className={`h-full w-full transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}
      >
        <ImagePlaceholder 
          src={image} 
          alt={t(titleKey)}
          className="w-full h-full object-cover"
        />
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-4 text-white z-20"
        style={{
          transformStyle: "preserve-3d",
          transform: "translateZ(20px)",
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-2">{t(titleKey)}</h3>
        <p className="text-sm opacity-90">{t(captionKey)}</p>
      </motion.div>
    </motion.div>
  );
}

export default function Details() {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 px-4 section-deeper text-white">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--pink-main)]"
      >
        {t('detailsTitle')}
      </motion.h2>
      
      <div suppressHydrationWarning className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Card 
            titleKey="keycapsTitle"
            captionKey="keycapsCaption"
            image="/images/cat-paw-keycaps.webp"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card 
            titleKey="fluffyTitle"
            captionKey="fluffyCaption"
            image="/images/fluffy-base.webp"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card 
            titleKey="switchesTitle"
            captionKey="switchesCaption"
            image="/images/crystal-pink.webp"
          />
        </motion.div>
      </div>
    </section>
  );
} 