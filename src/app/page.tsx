'use client';

import { useTheme } from './components/ThemeProvider';
import Header from './components/Header';
import Hero from './components/Hero';
import Dream from './components/Dream';
import Details from './components/Details';
import Wish from './components/Wish';
import Footer from './components/Footer';
import EasterEgg from './components/EasterEgg';
import AssetChecker from './components/Placeholders';
import BackgroundEffects from './components/BackgroundEffects';

export default function Home() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen">
      <BackgroundEffects />
      <AssetChecker />
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <Hero />
      <Dream />
      <Details />
      <Wish />
      <Footer />
      <EasterEgg />
    </main>
  );
}
