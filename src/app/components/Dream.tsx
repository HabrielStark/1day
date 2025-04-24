'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from './ThemeProvider';

export default function Dream() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const textControls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          textControls.start("show");
        }
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [textControls]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create paw particles
    class PawParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      oscillationSpeed: number;
      oscillationDistance: number;
      originalX: number;
      t: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.originalX = this.x;
        this.y = Math.random() * -500;
        this.size = Math.random() * 15 + 5;
        this.speed = Math.random() * 3 + 1;
        
        // More vibrant colors in dark mode
        if (isDarkMode) {
          this.color = `rgba(255, ${Math.random() * 100 + 150}, ${Math.random() * 100 + 150}, ${Math.random() * 0.6 + 0.3})`;
        } else {
          this.color = `rgba(255, ${Math.random() * 50 + 100}, ${Math.random() * 50 + 100}, ${Math.random() * 0.4 + 0.2})`;
        }
        
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.oscillationSpeed = Math.random() * 0.04 + 0.02;
        this.oscillationDistance = Math.random() * 40 + 20;
        this.t = Math.random() * 100;
      }

      update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        
        // Oscillate horizontally using sin wave
        this.t += this.oscillationSpeed;
        this.x = this.originalX + Math.sin(this.t) * this.oscillationDistance;
        
        if (this.y > canvas.height) {
          this.reset();
        }
      }
      
      reset() {
        this.y = Math.random() * -200;
        this.originalX = Math.random() * canvas.width;
        this.x = this.originalX;
        this.size = Math.random() * 15 + 5;
        this.speed = Math.random() * 3 + 1;
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Add glowing effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = isDarkMode ? 15 : 10;
        
        // Draw paw
        ctx.fillStyle = this.color;
        
        // Main pad
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Four toe beans
        const toeSize = this.size / 3;
        
        // Top left toe
        ctx.beginPath();
        ctx.ellipse(-this.size/2, -this.size*0.8, toeSize, toeSize, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Top right toe
        ctx.beginPath();
        ctx.ellipse(this.size/2, -this.size*0.8, toeSize, toeSize, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Bottom left toe
        ctx.beginPath();
        ctx.ellipse(-this.size*0.9, -this.size*0.3, toeSize, toeSize, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Bottom right toe
        ctx.beginPath();
        ctx.ellipse(this.size*0.9, -this.size*0.3, toeSize, toeSize, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    // Create keyboard key particles
    class KeyParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      char: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -500;
        this.size = Math.random() * 20 + 10;
        this.speed = Math.random() * 2 + 0.5;
        this.color = isDarkMode ? 
          `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 0.4 + 0.2})` :
          `rgba(${Math.random() * 50 + 100}, ${Math.random() * 50 + 100}, ${Math.random() * 50 + 100}, ${Math.random() * 0.3 + 0.1})`;
        this.rotation = Math.random() * Math.PI * 0.5 - Math.PI * 0.25;
        this.rotationSpeed = Math.random() * 0.01 - 0.005;
        
        // Random keyboard character
        const chars = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
        this.char = chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height) {
          this.y = Math.random() * -200;
          this.x = Math.random() * canvas.width;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Key cap
        ctx.fillStyle = this.color;
        ctx.strokeStyle = isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1;
        ctx.shadowColor = isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 5;
        
        // Draw rounded key cap
        ctx.beginPath();
        ctx.roundRect(-this.size/2, -this.size/2, this.size, this.size, 3);
        ctx.fill();
        ctx.stroke();
        
        // Draw character
        ctx.fillStyle = isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)";
        ctx.font = `${this.size * 0.6}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.char, 0, 0);
        
        ctx.restore();
      }
    }

    const pawParticles: PawParticle[] = [];
    const keyParticles: KeyParticle[] = [];
    const numberOfPaws = Math.min(Math.floor(canvas.width / 50), 30);
    const numberOfKeys = Math.min(Math.floor(canvas.width / 100), 15);

    for (let i = 0; i < numberOfPaws; i++) {
      pawParticles.push(new PawParticle());
    }
    
    for (let i = 0; i < numberOfKeys; i++) {
      keyParticles.push(new KeyParticle());
    }

    let mouseX = 0;
    let mouseY = 0;
    let isMouseActive = false;

    canvas.addEventListener('mousemove', (e) => {
      mouseX = e.x;
      mouseY = e.y;
      isMouseActive = true;
      
      // Reset mouse inactive after 2 seconds of no movement
      setTimeout(() => {
        isMouseActive = false;
      }, 2000);
    });

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background glow if in view
      if (isInView) {
        const gradient = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 0,
          canvas.width/2, canvas.height/2, canvas.width * 0.7
        );
        
        gradient.addColorStop(0, isDarkMode ? "rgba(255, 100, 150, 0.2)" : "rgba(255, 200, 220, 0.15)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw all particles with mouse interaction
      [...pawParticles, ...keyParticles].forEach(particle => {
        // Add attraction to mouse position if active
        if (isMouseActive) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200 && distance > 0) {
            const force = 0.5 / distance;
            particle.x += dx * force;
            if ('originalX' in particle) {
              particle.originalX += dx * force * 0.1; // Gradually move original position too
            }
          }
        }
        
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [isDarkMode, isInView]);

  // Text animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section 
      id="dream-section" 
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative section-dark text-white overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Decorative background elements */}
      <div suppressHydrationWarning className="absolute w-96 h-96 rounded-full bg-pink-500/10 blur-3xl top-1/4 -left-48 rotate-slow"></div>
      <div suppressHydrationWarning className="absolute w-64 h-64 rounded-full bg-purple-500/10 blur-3xl bottom-1/4 -right-32 pulsate"></div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate={textControls}
        className="text-center relative z-10 max-w-xl glass p-8 rounded-2xl"
        suppressHydrationWarning
      >
        <motion.p 
          variants={item} 
          className="text-2xl md:text-3xl mb-6 font-bold"
          whileHover={{ 
            scale: 1.05, 
            color: "var(--pink-main)", 
            transition: { duration: 0.2 } 
          }}
        >
          {t('introHi')}
        </motion.p>
        
        <motion.p 
          variants={item} 
          className="text-xl md:text-2xl mb-4"
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          {t('introAge')}
        </motion.p>
        
        <motion.p 
          variants={item} 
          className="text-xl md:text-2xl mb-4"
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          {t('introBuild')}
        </motion.p>
        
        <motion.p 
          variants={item} 
          className="text-xl md:text-2xl mb-4"
          whileHover={{ 
            scale: 1.03, 
            color: "var(--pink-light)", 
            transition: { duration: 0.2 } 
          }}
        >
          {t('introDream')}
        </motion.p>
        
        <motion.p 
          variants={item} 
          className="text-xl md:text-2xl highlight-pink shimmer"
          whileHover={{ 
            scale: 1.05,
            textShadow: "0 0 8px var(--pink-light)",
            transition: { duration: 0.2 } 
          }}
        >
          {t('introHappiness')}
        </motion.p>
      </motion.div>
    </section>
  );
} 