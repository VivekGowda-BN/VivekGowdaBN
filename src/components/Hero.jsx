import { useEffect, useRef } from 'react';
import CircularText from './CircularText';
import './Hero.css';

/* ─────────────────────────────────────────────────────────
   Pamidor Floating Trail Images for Hero Background
───────────────────────────────────────────────────────── */
const TRAIL_IMAGES = [
  '/assets/trail-1.webp',
  '/assets/trail-2.webp',
  '/assets/trail-3.webp',
  '/assets/trail-4.webp',
  '/assets/trail-5.webp',
  '/assets/trail-6.webp',
];
const TRAIL_DURATION = 840;
const TRAIL_FADE_OFFSET = 600;

export default function Hero() {
  const heroRef = useRef(null);
  const subjectContainerRef = useRef(null);
  const subjectRef = useRef(null);
  const bottomBarRef = useRef(null);
  const trailContainerRef = useRef(null);

  useEffect(() => {
    let cleanups = [];

    const initHeroMotion = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
      gsap.registerPlugin(ScrollTrigger);

      const hero = heroRef.current;
      const subjectContainer = subjectContainerRef.current;
      const bottomBar = bottomBarRef.current;

      if (!hero) return;

      // Subtle parallax & fade for the subject cutout & stool badge on scroll
      if (subjectContainer) {
        const t1 = gsap.fromTo(
          subjectContainer,
          { y: 0, scale: 1, opacity: 1 },
          {
            y: 35,
            scale: 0.98,
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
        cleanups.push(() => t1.scrollTrigger && t1.scrollTrigger.kill());
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
        cleanups.push(() => t2.scrollTrigger && t2.scrollTrigger.kill());
      }
    };

    initHeroMotion();

    // ── Floating Mouse-Trail Images in Hero Background ──
    const hero = heroRef.current;
    const subject = subjectRef.current;
    const trailContainer = trailContainerRef.current;

    if (
      hero &&
      trailContainer &&
      window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches
    ) {
      const slots = Array.from(trailContainer.children).map((el) => ({
        el,
        img: el.querySelector('img'),
        anim: null,
      }));

      let isActive = false;
      let lastX = 0;
      let lastY = 0;
      let distanceAcc = 0;
      let imgIdx = -1;
      let nextSlot = 0;
      const activeQueue = [];
      const fastForwardQueue = [];

      const spawnTrail = (x, y) => {
        imgIdx = (imgIdx + 1) % TRAIL_IMAGES.length;
        const slot = slots[nextSlot];
        nextSlot = (nextSlot + 1) % slots.length;

        if (activeQueue.length >= 4) {
          const oldest = activeQueue.shift();
          if (oldest.anim && oldest.anim.currentTime !== null) {
            oldest.anim.currentTime = Math.max(Number(oldest.anim.currentTime), TRAIL_FADE_OFFSET);
            oldest.anim.playbackRate = 2.5;
            fastForwardQueue.push(oldest);
            if (fastForwardQueue.length > 1) {
              const finished = fastForwardQueue.shift();
              finished.anim?.finish();
            }
          }
        }

        const inActiveIdx = activeQueue.indexOf(slot);
        if (inActiveIdx !== -1) activeQueue.splice(inActiveIdx, 1);
        const inFFIdx = fastForwardQueue.indexOf(slot);
        if (inFFIdx !== -1) fastForwardQueue.splice(inFFIdx, 1);

        if (slot.img) {
          slot.img.src = TRAIL_IMAGES[imgIdx];
        }
        // Center on cursor (item size is clamp(65px, 6.5vw, 92px), offset by ~40px)
        slot.el.style.transform = `translate3d(${x - 27}px, ${y - 27}px, 0)`;
        slot.anim?.cancel();

        if (slot.img) {
          slot.anim = slot.img.animate(
            [
              {
                opacity: 1,
                transform: 'scale(0.98)',
                maskPosition: '100% 0%',
                WebkitMaskPosition: '100% 0%',
                easing: 'cubic-bezier(0.45, 0, 0.25, 1)',
              },
              {
                opacity: 1,
                transform: 'scale(1)',
                maskPosition: '0% 0%',
                WebkitMaskPosition: '0% 0%',
                offset: 240 / TRAIL_DURATION,
              },
              {
                opacity: 1,
                maskPosition: '0% 0%',
                WebkitMaskPosition: '0% 0%',
                offset: TRAIL_FADE_OFFSET / TRAIL_DURATION,
                easing: 'cubic-bezier(0.55, 0, 0.45, 1)',
              },
              {
                opacity: 0,
                transform: 'scale(0.97)',
                maskPosition: '0% 0%',
                WebkitMaskPosition: '0% 0%',
              },
            ],
            { duration: TRAIL_DURATION, fill: 'both' }
          );
        }

        activeQueue.push(slot);
      };

      const stopTrail = () => {
        isActive = false;
        while (activeQueue.length) {
          const item = activeQueue.shift();
          if (item.anim && item.anim.currentTime !== null) {
            item.anim.currentTime = Math.max(Number(item.anim.currentTime), TRAIL_FADE_OFFSET);
          }
        }
        fastForwardQueue.length = 0;
      };

      const handlePointerMove = (e) => {
        const rect = hero.getBoundingClientRect();
        if (
          rect.width > 0 &&
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          // Exclude the portrait region so images never spawn on the face or body
          let overPortrait = false;
          if (subject) {
            const subRect = subject.getBoundingClientRect();
            if (
              subRect.width > 0 &&
              e.clientX >= subRect.left + subRect.width * 0.12 &&
              e.clientX <= subRect.right - subRect.width * 0.12 &&
              e.clientY >= subRect.top &&
              e.clientY <= subRect.bottom
            ) {
              overPortrait = true;
            }
          }

          if (overPortrait) {
            if (isActive) stopTrail();
            return;
          }

          const relX = e.clientX - rect.left;
          const relY = e.clientY - rect.top;

          // Only block the actual GitHub & Resume button zones in the top-right header strip.
          // Header height = 52px. GitHub button spans approx right 165–280px; Resume right 0–155px.
          const inHeaderStrip = relY < 52;
          const overButtons   = inHeaderStrip && relX > rect.width - 280;
          if (overButtons) {
            if (isActive) stopTrail();
            return;
          }

          if (!isActive) {
            isActive = true;
            lastX = e.clientX;
            lastY = e.clientY;
            distanceAcc = 0;
            spawnTrail(relX, relY);
            return;
          }

          distanceAcc += Math.hypot(e.clientX - lastX, e.clientY - lastY);
          lastX = e.clientX;
          lastY = e.clientY;

          if (distanceAcc >= 55) {
            distanceAcc = 0;
            spawnTrail(relX, relY);
          }
        } else {
          if (isActive) stopTrail();
        }
      };

      const handlePointerLeave = () => stopTrail();

      document.addEventListener('pointermove', handlePointerMove, { passive: true });
      document.addEventListener('pointerleave', handlePointerLeave);
      window.addEventListener('blur', handlePointerLeave);

      cleanups.push(() => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerleave', handlePointerLeave);
        window.removeEventListener('blur', handlePointerLeave);
        slots.forEach((s) => s.anim?.cancel());
      });
    }

    return () => {
      cleanups.forEach((fn) => fn && fn());
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" className="hero" data-header-theme="light">
      {/* Floating Mouse Trail Images — background hover effect (rendered behind the subject) */}
      <div ref={trailContainerRef} aria-hidden="true" className="hero__trail-wrap">
        {TRAIL_IMAGES.map((src, idx) => (
          <div key={idx} className="hero__trail-item">
            <img src={src} alt="" width={240} className="hero__trail-img" />
          </div>
        ))}
      </div>

      {/* Background-less Portrait sitting cleanly on the off-white page background */}
      <div ref={subjectContainerRef} className="hero__subject-container">
        <img
          ref={subjectRef}
          src="/assets/hero-subject-2x.png"
          alt="Vivek Gowda BN"
          className="hero__subject-img"
        />

        {/* Small CircularText nestled in the open space between the stool legs */}
        <div className="hero__stool-badge" aria-hidden="true">
          <CircularText
            text="SCROLL • TO • EXPLORE • "
            spinDuration={20}
            radius={24}
            fontSize="6px"
            centerContent={
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#080912"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 10l5 5 5-5" />
              </svg>
            }
          />
        </div>
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
