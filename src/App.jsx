import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import DetailsBridge from './components/DetailsBridge';
import Projects from './components/Projects';
import Experience from './components/Experience';
import AccordionGallery from './components/AccordionGallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    let lenisInstance = null;

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default || LenisModule;

        const gsapModule = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        const gsap = gsapModule.default || gsapModule.gsap || gsapModule;

        gsap.registerPlugin(ScrollTrigger);

        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.5,
        });

        window.lenis = lenisInstance;
        lenisInstance.on('scroll', ScrollTrigger.update);

        const updateTicker = (time) => {
          lenisInstance.raf(time * 1000);
        };

        gsap.ticker.add(updateTicker);
        gsap.ticker.lagSmoothing(0);
      } catch (err) {
        console.warn('Smooth scroll initialization fallback to native scroll', err);
      }
    };

    initLenis();

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="portfolio-app">
      {/* 1. Header / Navigation */}
      <Header />

      <main id="main-content">
        {/* 2. Hero Section (Alejandro style + sticky text) */}
        <Hero />

        {/* 3. About Section (Mirrored Alejandro layout + Pamidor text reveal) */}
        <About />

        {/* 4. Details Bridge – “Small details. Big impact.” */}
        <DetailsBridge />

        {/* 5. Selected Work / Projects (Pamidor layout + Alejandro blue background) */}
        <Projects />

        {/* 6. Experience Section (Pamidor Skillset visual style + CONTENT.md data) */}
        <Experience />

        {/* 7. Achievements Section (AccordionGallery component) */}
        <AccordionGallery />

        {/* 8. Contact Section – “Open the door” (100% identical to Pamidor) */}
        <Contact />
      </main>

      {/* 9. Footer (100% identical to Pamidor, only links changed) */}
      <Footer />
    </div>
  );
}
