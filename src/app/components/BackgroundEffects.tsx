'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from 'framer-motion';
import { useTheme } from './ThemeProvider';

// Particle class for the particle system
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'paw' | 'key' | 'spark';

  constructor(width: number, height: number, type: 'paw' | 'key' | 'spark', darkMode: boolean) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.type = type;
    
    // Different properties based on particle type
    if (type === 'paw') {
      this.size = Math.random() * 20 + 10;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.opacity = Math.random() * 0.3 + 0.1;
      this.color = darkMode ? '#ff92b1' : '#ff92b1';
    } else if (type === 'key') {
      this.size = Math.random() * 15 + 8;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.2 + 0.05;
      this.color = darkMode ? '#ffffff' : '#171717';
    } else { // spark
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.color = darkMode ? 
        `hsl(${Math.random() * 60 + 320}, 100%, 70%)` : 
        `hsl(${Math.random() * 60 + 320}, 100%, 60%)`;
    }
    
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 2 - 1;
  }

  update(width: number, height: number) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;

    // Boundary check and reposition if needed
    if (this.x < -50) this.x = width + 50;
    if (this.x > width + 50) this.x = -50;
    if (this.y < -50) this.y = height + 50;
    if (this.y > height + 50) this.y = -50;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    
    if (this.type === 'paw') {
      this.drawPaw(ctx);
    } else if (this.type === 'key') {
      this.drawKey(ctx);
    } else { // spark
      this.drawSpark(ctx);
    }
    
    ctx.restore();
  }

  drawPaw(ctx: CanvasRenderingContext2D) {
    const pad = this.size / 2;
    ctx.fillStyle = this.color;
    
    // Main paw pad
    ctx.beginPath();
    ctx.ellipse(0, 0, pad, pad * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Toe pads
    for (let i = 0; i < 3; i++) {
      const angle = (i - 1) * Math.PI / 4;
      const distance = pad * 1.2;
      const toePad = pad * 0.7;
      
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(angle) * distance, 
        Math.sin(angle) * distance - pad * 0.9, 
        toePad, 
        toePad, 
        0, 0, Math.PI * 2
      );
      ctx.fill();
    }
  }

  drawKey(ctx: CanvasRenderingContext2D) {
    const keySize = this.size;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = keySize / 5;
    
    // Key stem
    ctx.beginPath();
    ctx.moveTo(keySize / 2, 0);
    ctx.lineTo(keySize / 2, keySize);
    ctx.stroke();
    
    // Key head
    ctx.beginPath();
    ctx.arc(keySize / 2, keySize / 4, keySize / 4, 0, Math.PI * 2);
    ctx.stroke();
    
    // Key teeth
    ctx.beginPath();
    ctx.moveTo(keySize / 2, keySize);
    ctx.lineTo(keySize / 2 + keySize / 4, keySize - keySize / 4);
    ctx.stroke();
  }

  drawSpark(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.size * 2;
    ctx.fill();
  }
}

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const { isDarkMode } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number | undefined>(undefined);
  
  // For parallax scroll effects
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 100]);
  
  // For smooth gradient transitions
  const backgroundPositionX = useSpring(0, { stiffness: 30, damping: 20 });
  const backgroundPositionY = useSpring(0, { stiffness: 30, damping: 20 });

  // Setup and resize handler
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };
    
    // Initialize
    updateDimensions();
    
    // Create particles
    const newParticles: Particle[] = [];
    const totalParticles = Math.min(window.innerWidth, 1920) / 20; // Scale with screen size
    
    // Create paws
    for (let i = 0; i < totalParticles * 0.2; i++) {
      newParticles.push(new Particle(window.innerWidth, window.innerHeight, 'paw', isDarkMode));
    }
    
    // Create keys
    for (let i = 0; i < totalParticles * 0.2; i++) {
      newParticles.push(new Particle(window.innerWidth, window.innerHeight, 'key', isDarkMode));
    }
    
    // Create sparks
    for (let i = 0; i < totalParticles * 0.6; i++) {
      newParticles.push(new Particle(window.innerWidth, window.innerHeight, 'spark', isDarkMode));
    }
    
    setParticles(newParticles);
    
    // Add event listeners
    window.addEventListener('resize', updateDimensions);
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Update background gradient position
      backgroundPositionX.set(e.clientX / window.innerWidth * 100);
      backgroundPositionY.set(e.clientY / window.innerHeight * 100);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isDarkMode, backgroundPositionX, backgroundPositionY]);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      if (!canvasRef.current) return;
      
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw and update all particles
      particles.forEach(particle => {
        // Add mouse influence (subtle attraction/repulsion)
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          const force = particle.type === 'spark' ? 0.05 : -0.02;
          particle.speedX += (dx / dist) * force;
          particle.speedY += (dy / dist) * force;
          
          // Add some randomness to prevent perfectly symmetric patterns
          particle.speedX += (Math.random() - 0.5) * 0.01;
          particle.speedY += (Math.random() - 0.5) * 0.01;
          
          // Limit speed
          const maxSpeed = particle.type === 'spark' ? 3 : 1;
          const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
          if (currentSpeed > maxSpeed) {
            particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
            particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
          }
        }
        
        particle.update(dimensions.width, dimensions.height);
        particle.draw(ctx);
      });
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [dimensions, particles, mousePosition]);

  // Gradient background 
  const gradientPosition = useMotionTemplate`${backgroundPositionX}% ${backgroundPositionY}%`;
  const gradientBg = isDarkMode
    ? `radial-gradient(circle at ${gradientPosition}, rgba(40, 15, 50, 0.9) 0%, rgba(10, 10, 10, 0.95) 70%)`
    : `radial-gradient(circle at ${gradientPosition}, rgba(255, 200, 210, 0.5) 0%, rgba(255, 255, 255, 0.9) 70%)`;

  return (
    <>
      {/* Animated background gradient */}
      <motion.div 
        className="fixed inset-0 z-[-2] pointer-events-none"
        style={{ background: gradientBg }}
        suppressHydrationWarning
      />
      
      {/* Parallax floating elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" suppressHydrationWarning>
        {/* Floating cat face silhouette */}
        <motion.div 
          className="absolute pointer-events-none"
          style={{
            top: '20%',
            left: '10%',
            opacity: isDarkMode ? 0.05 : 0.02,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: isDarkMode ? 'var(--pink-main)' : 'var(--foreground)',
            y: y1,
          }}
          suppressHydrationWarning
        >
          {/* Cat ears */}
          <div className="absolute w-0 h-0 left-1/4 -top-8"
            style={{
              borderLeft: '40px solid transparent',
              borderRight: '40px solid transparent',
              borderBottom: `80px solid ${isDarkMode ? 'var(--pink-main)' : 'var(--foreground)'}`,
              transform: 'rotate(-20deg)'
            }}
            suppressHydrationWarning
          />
          <div className="absolute w-0 h-0 right-1/4 -top-8"
            style={{
              borderLeft: '40px solid transparent',
              borderRight: '40px solid transparent',
              borderBottom: `80px solid ${isDarkMode ? 'var(--pink-main)' : 'var(--foreground)'}`,
              transform: 'rotate(20deg)'
            }}
            suppressHydrationWarning
          />
        </motion.div>
        
        {/* Floating keyboard shape */}
        <motion.div 
          className="absolute pointer-events-none"
          style={{
            bottom: '15%',
            right: '10%',
            opacity: isDarkMode ? 0.08 : 0.04,
            width: '400px',
            height: '200px',
            background: isDarkMode ? 'var(--pink-dark)' : 'var(--foreground)',
            borderRadius: '10px',
            y: y2,
          }}
          suppressHydrationWarning
        >
          {/* Key rows */}
          {[1, 2, 3, 4].map(row => (
            <div 
              key={row}
              className="absolute flex flex-row gap-1 justify-center" 
              style={{
                top: `${row * 40}px`,
                left: '20px',
                right: '20px'
              }}
              suppressHydrationWarning
            >
              {Array.from({ length: 10 - row }, (_, i) => (
                <div 
                  key={i}
                  className="w-6 h-6 rounded-sm"
                  style={{ 
                    background: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                  }}
                  suppressHydrationWarning
                />
              ))}
            </div>
          ))}
        </motion.div>
        
        {/* Abstract accent shapes */}
        <motion.div
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{
            top: '60%',
            left: '30%',
            background: `radial-gradient(circle, ${isDarkMode ? 'var(--pink-light)' : 'var(--pink-dark)'} 0%, transparent 70%)`,
            opacity: 0.2,
            y: y3,
            scale: 2
          }}
          suppressHydrationWarning
        />
        
        <motion.div
          className="absolute w-64 h-64 rounded-full pointer-events-none"
          style={{
            top: '30%',
            right: '20%',
            background: `radial-gradient(circle, ${isDarkMode ? 'var(--pink-main)' : 'var(--pink-light)'} 0%, transparent 70%)`,
            opacity: 0.15,
            y: y2,
            scale: 1.5
          }}
          suppressHydrationWarning
        />
        
        {/* Particle system canvas */}
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>
    </>
  );
} 