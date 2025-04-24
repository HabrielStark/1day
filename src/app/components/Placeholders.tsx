'use client';

import { useEffect, useState } from 'react';

// This component will check if the required assets exist and show a placeholder if not
export default function AssetChecker() {
  const [missingAssets, setMissingAssets] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const requiredAssets = [
      '/images/petbrick65.webp',
      '/images/cat-paw-keycaps.webp',
      '/images/fluffy-base.webp',
      '/images/crystal-pink.webp',
      '/images/fur-texture.webp',
      '/sounds/switch-click.mp3',
      '/sounds/purr.mp3'
    ];

    // Check if assets exist (this is a simplified check)
    const checkAssets = async () => {
      const missing: string[] = [];
      
      for (const asset of requiredAssets) {
        try {
          const response = await fetch(asset, { method: 'HEAD' });
          if (!response.ok) {
            missing.push(asset);
          }
        } catch {
          // Ignore the specific error, just add to missing assets
          missing.push(asset);
        }
      }
      
      setMissingAssets(missing);
      setShowWarning(missing.length > 0);
    };
    
    checkAssets();
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black p-4 z-[9999]">
      <h3 className="font-bold text-lg mb-2">Missing Assets</h3>
      <p className="mb-2">The following assets are missing:</p>
      <ul className="list-disc ml-5 mb-3">
        {missingAssets.map((asset) => (
          <li key={asset}>{asset}</li>
        ))}
      </ul>
      <p>
        Please add these files to the project as described in the README.md file,
        or replace them with your own assets by updating the corresponding components.
      </p>
      <button
        onClick={() => setShowWarning(false)}
        className="mt-2 px-3 py-1 bg-black text-white rounded"
      >
        Dismiss
      </button>
    </div>
  );
} 