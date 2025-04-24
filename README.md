# Petbrick Wish - Day 1

This is a website created for a 15-year-old's wish to own the Petbrick 65 keyboard from Angry Miao.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Required Assets

To complete the website, you need to add the following images and sound files:

### Images
Place these in the `/public/images` directory:

- `petbrick65.webp` - The main image of the Petbrick 65 keyboard
- `cat-paw-keycaps.webp` - Close-up of the cat paw keycaps
- `fluffy-base.webp` - Image showing the fluffy base/case
- `crystal-pink.webp` - Image of the Crystal Pink switches
- `day1-screenshot.webp` - Screenshot of the Day 1 website design
- `fur-texture.webp` - A fur texture for the easter egg

### Sounds
Place these in the `/public/sounds` directory:

- `switch-click.mp3` - A keyboard switch click sound
- `purr.mp3` - A cat purring sound for the easter egg

## Features

- Interactive animations using Framer Motion
- 3D tilt effect on cards
- Dark/Light theme toggle
- Language switching (English/Chinese)
- Easter egg (secret cat mode) - Press Ctrl+P+6 to activate
- Responsive design for all devices

## Technical Details

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- GSAP for advanced animations
- Three.js for 3D effects
- Use-Sound for sound effects

## Deployment

The site is intended to be deployed on Vercel or a similar platform.
