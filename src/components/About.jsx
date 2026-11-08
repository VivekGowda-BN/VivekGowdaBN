import { useEffect, useRef } from 'react';
import './About.css';

/* ─────────────────────────────────────────────────────────
   button-007 paint path (identical to Header.jsx)
───────────────────────────────────────────────────────── */
const BUTTON_PATH_D =
  'M16.332 39.1765C25.6381 35.2853 34.9441 31.3941 40.6554 29.173C50.662 25.2814 21.2379 53.1954 17.526 58.4408C14.8321 62.2478 16.2337 62.0854 17.6851 61.7242C19.1364 61.363 20.5951 60.8079 30.413 55.6381C40.231 50.4684 58.3639 40.7009 68.2847 35.2711C78.2055 29.8412 79.3646 29.0451 79.7292 28.7446C80.0938 28.4441 79.6289 28.6635 73.9175 35.9463C68.2062 43.2292 57.2628 57.5688 51.5744 65.2375C45.886 72.9063 45.7844 73.4697 46.1047 73.6339C46.6385 73.9077 67.9122 61.8313 68.2066 61.6541C82.3093 53.1624 107.339 37.7974 121.861 29.1143C136.382 20.4312 139.637 18.8959 142.043 17.8274C142.799 17.4917 148.024 14.9173 147.361 16.5225C147.121 17.1044 146.542 18.1091 138.743 26.8865C130.945 35.6639 93.8491 65.9527 86.0769 74.6334C78.305 83.3141 78.216 83.6554 78.3741 83.9179C78.5321 84.1803 78.94 84.3537 93.1516 75.4023C107.363 66.451 157.462 34.6003 162.031 35.1974C166.6 35.7944 144.497 73.6977 144.599 78.2813C144.701 82.8649 173.88 53.6113 184.999 47.6105';

/* ─────────────────────────────────────────────────────────
   Content paragraphs (exact wording requested)
───────────────────────────────────────────────────────── */
const P1_WORDS =
  "I'm Vivek, an engineering student majoring in AI & Data Science with a minor in Financial Economics. As an AI enthusiast who loves solving problems, I enjoy DSA, clean frontend design, and building meaningful systems. Photography keeps me curious beyond code."
    .split(/\s+/);

const P2_WORDS =
  "Outside tech, I'm an athlete at heart — playing volleyball competitively and cricket for fun. Music fuels me, I'm a big F1 fan, and photography helps me slow down and capture the world."
    .split(/\s+/);

/* ─────────────────────────────────────────────────────────
   Pamidor Hero-Trail Floating Images
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

export default function About() {
  const sectionRef = useRef(null);
  const textBodyRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageInnerRef = useRef(null);   // ← inner clipping container ref
  const trailContainerRef = useRef(null);

  // Contact button refs (for paint hover effect)
  const contactBtnRef = useRef(null);
  const contactMaskPathRef = useRef(null);
  const contactOverlayPathRef = useRef(null);

  /* ── Scroll-to-Contact ─────────────────────────────── */
  const handleContactClick = (e) => {
    e.preventDefault();
    const target = document.getElementById('contact');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let cleanups = [];

    const init = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const textBody = textBodyRef.current;
      if (!section || !textBody) return;

      /* ── 1. CSS-sticky + scrub char-wave (Lenis-compatible) ── */
      /*
       * How the pin works WITHOUT GSAP pin (which breaks with Lenis):
       *   - .about section has min-height: 300vh in CSS
       *   - .about__sticky inside has position:sticky; height:100vh
       *   → CSS freezes the content in the viewport for 200vh of scroll
       *   → ScrollTrigger below reads that scroll range and drives the wave
       */
      const chars = Array.from(textBody.querySelectorAll('[data-char]'));
      const totalChars = chars.length;

      if (totalChars > 0) {
        textBody.setAttribute('data-wave', '');
        let lastLitIndex = 0;

        // All chars start dim
        chars.forEach((c) => c.removeAttribute('data-lit'));

        const updateWave = (progress) => {
          const targetIndex = Math.round(progress * totalChars);
          if (targetIndex !== lastLitIndex) {
            if (targetIndex > lastLitIndex) {
              for (let i = lastLitIndex; i < targetIndex; i++) {
                chars[i].setAttribute('data-lit', '');
              }
            } else {
              for (let i = lastLitIndex - 1; i >= targetIndex; i--) {
                chars[i].removeAttribute('data-lit');
              }
            }
            lastLitIndex = targetIndex;
          }
        };

        const waveST = ScrollTrigger.create({
          trigger: section,
          start: 'top top',       // wave begins when section top meets viewport top
          end: 'bottom bottom',   // wave ends when section bottom leaves viewport bottom
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => updateWave(self.progress),
          onRefresh: (self) => updateWave(self.progress),
        });

        // Initialise based on current scroll position (handles reload mid-page)
        updateWave(waveST.progress);

        cleanups.push(() => waveST.kill());
      }

      /* ── 2. Refresh ScrollTrigger when layout stabilizes ─ */
      const handleRefresh = () => {
        try { ScrollTrigger.refresh(); } catch {}
      };
      window.addEventListener('load', handleRefresh);
      const timer1 = setTimeout(handleRefresh, 200);
      const timer2 = setTimeout(handleRefresh, 700);
      cleanups.push(() => {
        window.removeEventListener('load', handleRefresh);
        clearTimeout(timer1);
        clearTimeout(timer2);
      });

      /* ── 3. Contact CTA button entrance ────────────── */
      const ctaWrap = section.querySelector('.about__cta-wrap');
      if (ctaWrap) {
        const ctaTween = gsap.fromTo(
          ctaWrap,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaWrap,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          }
        );
        cleanups.push(() => {
          if (ctaTween.scrollTrigger) ctaTween.scrollTrigger.kill();
          ctaTween.kill();
        });
      }

      /* ── 4. button-007 paint hover (Contact) ───────── */
      const btn = contactBtnRef.current;
      const maskPath = contactMaskPathRef.current;
      const overlayPath = contactOverlayPathRef.current;

      if (btn && maskPath && overlayPath) {
        const paths = [maskPath, overlayPath];
        const lengths = paths.map((p) => {
          try {
            return p.getTotalLength() || 600;
          } catch {
            return 600;
          }
        });

        paths.forEach((p, idx) => {
          const len = lengths[idx];
          p.style.strokeDasharray = `${len} ${len}`;
          p.style.strokeDashoffset = `${len}`;
          p.style.strokeWidth = '0';
        });

        let enterTween = null;
        let leaveTimeline = null;

        const onEnter = () => {
          if (leaveTimeline) leaveTimeline.kill();
          paths.forEach((p, idx) => {
            const len = lengths[idx];
            gsap.killTweensOf(p);
            gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len, strokeWidth: 0 });
            enterTween = gsap.to(p, {
              strokeWidth: 62,
              strokeDashoffset: 0,
              duration: 0.75,
              ease: 'power2.out',
              overwrite: true,
            });
          });
        };

        const onLeave = () => {
          if (enterTween) enterTween.kill();
          paths.forEach((p, idx) => {
            const len = lengths[idx];
            gsap.killTweensOf(p);
            leaveTimeline = gsap.timeline({ overwrite: true });
            leaveTimeline.to(
              p,
              {
                strokeWidth: 0,
                strokeDashoffset: -len,
                duration: 0.65,
                ease: 'power2.inOut',
                onComplete: () => gsap.set(p, { strokeDashoffset: len, strokeWidth: 0 }),
              },
              0
            );
          });
        };

        btn.addEventListener('mouseenter', onEnter);
        btn.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          btn.removeEventListener('mouseenter', onEnter);
          btn.removeEventListener('mouseleave', onLeave);
          if (enterTween) enterTween.kill();
          if (leaveTimeline) leaveTimeline.kill();
        });
      }

      /* ── 5. Pamidor Floating Trail Hover Effect ──────── */
      const imageWrapper = imageWrapperRef.current;
      const trailContainer = trailContainerRef.current;
      // The inner clipping div — trail coords are relative to this
      const imageInner = imageInnerRef.current;

      if (
        imageWrapper &&
        imageInner &&
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
          // Use a small centered offset — image is small (60px), center on cursor
          slot.el.style.transform = `translate3d(${x - 28}px, ${y - 28}px, 0)`;
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
          // Use imageInner bounds — trail is clipped inside it
          const rect = imageInner.getBoundingClientRect();
          if (
            rect.width > 0 &&
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            // Position relative to imageInner (the clipping container)
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

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

      // Final refresh once DOM is stable
      setTimeout(() => { ScrollTrigger.refresh(); }, 100);
    };

    init();
    return () => cleanups.forEach((fn) => fn && fn());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about"
      data-header-theme="light"
    >
      {/*
        .about__sticky is position:sticky; height:100vh
        The outer section is min-height:300vh
        → CSS pins the content for 200vh of scroll; GSAP scrubs the wave over that range
      */}
      <div className="about__sticky">
        <div className="about__container">
          {/* Two-column grid: Image LEFT, Text RIGHT */}
          <div className="about__grid">

            {/* ── LEFT: Image column ───────────────────── */}
            <div className="about__image-col">
              <div ref={imageWrapperRef} className="about__image-wrapper">
                <div ref={imageInnerRef} className="about__image-inner">
                  {/* Default: COLOR image visible. BW fades in on hover */}
                  {/* BW layer — hidden by default, appears on hover (z-index 2) */}
                  <img
                    src="/assets/AboutBW.webp"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/about-img-bw.jpg';
                    }}
                    alt="Vivek Gowda BN – Black and White portrait"
                    className="about__image about__image--bw"
                  />
                  {/* Color layer — visible by default (z-index 1) */}
                  <img
                    src="/assets/AboutColor.jpeg"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/about-img.jpeg';
                    }}
                    alt="Vivek Gowda BN – Color portrait"
                    className="about__image about__image--color"
                  />

                  {/* Floating Mouse Trail Images — clipped inside image-inner */}
                  <div ref={trailContainerRef} aria-hidden="true" className="about__trail-wrap">
                    {TRAIL_IMAGES.map((src, idx) => (
                      <div key={idx} className="about__trail-item">
                        <img
                          src={src}
                          alt=""
                          width={240}
                          className="about__trail-img"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Text column ───────────────────── */}
            <div className="about__text-col">

              {/* Label tag */}
              <div className="about__label-wrap">
                <span className="text-label about__label">[ ABOUT ME ]</span>
              </div>

              {/* Heading in blue (#2A4093) */}
              <h2 className="about__heading">
                More About Me
              </h2>

              {/* Body paragraphs: char-wave scroll animation */}
              <div ref={textBodyRef} className="about__body" data-wave>
                {/* Paragraph 1 */}
                <p className="about__paragraph">
                  {P1_WORDS.map((word, wIdx) => (
                    <span key={`p1-w-${wIdx}`}>
                      <span className="pamidor-word" data-word>
                        {Array.from(word).map((char, cIdx) => (
                          <span key={`p1-c-${cIdx}`} className="pamidor-char" data-char>
                            {char}
                          </span>
                        ))}
                      </span>
                      {wIdx < P1_WORDS.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </p>

                {/* Paragraph 2 */}
                <p className="about__paragraph">
                  {P2_WORDS.map((word, wIdx) => (
                    <span key={`p2-w-${wIdx}`}>
                      <span className="pamidor-word" data-word>
                        {Array.from(word).map((char, cIdx) => (
                          <span key={`p2-c-${cIdx}`} className="pamidor-char" data-char>
                            {char}
                          </span>
                        ))}
                      </span>
                      {wIdx < P2_WORDS.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </p>
              </div>

              {/* Contact CTA — button-007 (blue, matching navbar buttons) */}
              <div className="about__cta-wrap">
                <button
                  ref={contactBtnRef}
                  className="button-007 button-007--blue about__cta-btn"
                  onClick={handleContactClick}
                  aria-label="Scroll to Contact section"
                >
                  <span className="button-007__inner">
                    {/* Paint-masked hover text */}
                    <span className="button-007__text is--hover">
                      <svg aria-hidden="true" className="button-007__svg">
                        <mask
                          id="about-contact-mask"
                          maskUnits="userSpaceOnUse"
                          style={{ maskType: 'alpha' }}
                        >
                          <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 201 100"
                            preserveAspectRatio="none"
                          >
                            <path
                              ref={contactMaskPathRef}
                              d={BUTTON_PATH_D}
                              stroke="currentColor"
                              strokeWidth="0"
                              strokeLinecap="round"
                            />
                          </svg>
                        </mask>
                        <foreignObject
                          width="100%"
                          height="100%"
                          mask="url(#about-contact-mask)"
                          className="button-007__svg-object"
                        >
                          <div className="button-007__svg-inner">
                            <div className="button-007__svg-text-wrap">
                              <span className="button-007__svg-text">Contact</span>
                            </div>
                          </div>
                        </foreignObject>
                      </svg>
                    </span>

                    {/* Paint stroke overlay */}
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      fill="none"
                      viewBox="0 0 201 100"
                      preserveAspectRatio="none"
                      className="button-007__svg-overlay"
                    >
                      <path
                        ref={contactOverlayPathRef}
                        d={BUTTON_PATH_D}
                        stroke="currentColor"
                        strokeWidth="0"
                        strokeLinecap="round"
                      />
                    </svg>

                    <span className="button-007__text is--default">Contact</span>
                  </span>
                  <span className="button-007__paint-sweep" />
                  <span className="button-007__bg" />
                </button>
              </div>

            </div>{/* end text-col */}
          </div>{/* end grid */}
        </div>{/* end container */}
      </div>{/* end sticky */}
    </section>
  );
}
