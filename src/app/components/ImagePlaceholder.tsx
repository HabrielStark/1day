'use client';

import { useState, useEffect } from 'react';

type ImagePlaceholderProps = {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
};

export default function ImagePlaceholder({
  src, 
  alt, 
  width = '100%', 
  height = '100%',
  className = ''
}: ImagePlaceholderProps) {
  const [imageExists, setImageExists] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(src, { method: 'HEAD' });
        setImageExists(response.ok);
      } catch {
        // Ignore the specific error, just mark the image as non-existent
        setImageExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkImage();
  }, [src]);

  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  if (!imageExists) {
    // Placeholder for missing image
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-500 border border-gray-300 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="mt-2 text-sm">{alt || 'Image not found'}</p>
          <p className="text-xs text-gray-400 mt-1">{src}</p>
        </div>
      </div>
    );
  }

  // Real image - using img tag since dimensions might be dynamic or percentage-based
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} style={{ width, height }} />;
} 