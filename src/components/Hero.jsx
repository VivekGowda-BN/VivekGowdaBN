import { useEffect, useRef } from 'react';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef(null);
  const subjectRef = useRef(null);
  const bottomBarRef = useRef(null);

  useEffect(() => {
    let triggers = [];

    const initHeroMotion = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
      gsap.registerPlugin(ScrollTrigger);

      const hero = heroRef.current;
      const subject = subjectRef.current;
      const bottomBar = bottomBarRef.current;

      if (!hero) return;

      // Subtle parallax & fade for the enlarged subject cutout on scroll
      if (subject) {
        const t1 = gsap.fromTo(
          subject,
          { y: -16, scale: 1.14, opacity: 1 },
          {
            y: -48,
            scale: 1.04,
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.4,
            },
          }
        );
        triggers.push(t1.scrollTrigger);
      }

      // Smooth early fade-out for bottom badges as user begins scrolling
      if (bottomBar) {
        const t2 = gsap.to(bottomBar, {
          y: 18,
          opacity: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=30%',
            scrub: true,
          },
        });
        triggers.push(t2.scrollTrigger);
      }
    };

    initHeroMotion();

    return () => {
      triggers.forEach((t) => t && t.kill());
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" className="hero" data-header-theme="light">
      {/* Background-less Portrait sitting cleanly on the off-white page background */}
      <div className="hero__subject-container">
        <img
          ref={subjectRef}
          src="/assets/hero-main2-withoutbackground.jpg"
          alt="Vivek Gowda BN"
          className="hero__subject-img"
        />
      </div>

      {/* Bottom Labels Bar */}
      <div ref={bottomBarRef} className="hero__bottom-bar">
        {/* Bottom Left Pill */}
        <div className="hero__pill-tag">
          <span className="hero__pill-dot" />
          <span className="hero__pill-text">ENGINEERING STUDENT • AI ENTHUSIAST</span>
        </div>

        {/* Bottom Right Bangalore + Rotating 3D Globe */}
        <div className="hero__location-tag">
          <span className="hero__location-text">BANGALORE</span>
          <div
            className="rotating-globe"
            aria-hidden="true"
            title="Working Globally from Bangalore"
          >
            <div className="globe">
              <div className="globe-circle is--1" />
              <div className="globe-circle is--2" />
              <div className="globe-circle is--3" />
              <div className="globe-circle is--hor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
