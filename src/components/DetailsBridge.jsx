import { useEffect, useRef } from 'react';
import './DetailsBridge.css';

/* ─────────────────────────────────────────────────────────────
   EXACT ALEJANDRO HA PAINT TRANSITION
   Extracted directly from https://alejandroha.com/en
   SVG Path: 3222 x 3114 viewBox with sweeping roller brush path.
   Color: #2A4093 (Alejandro dark blue)
   ───────────────────────────────────────────────────────────── */
const ALEJANDRO_PATH =
  'M299.654 453.865C505.574 319.225 711.494 184.585 836.054 109.945C960.614 35.3048 997.574 24.7448 944.014 110.385C890.454 196.025 745.254 378.185 571.454 634.385C397.654 890.585 199.654 1215.3 110.854 1382.58C22.0544 1549.86 48.4544 1549.86 77.8944 1540.62C107.334 1531.38 139.014 1512.9 367.854 1319.9C596.694 1126.9 1021.73 759.945 1255.21 555.065C1488.69 350.185 1517.73 318.505 1527.41 306.145C1537.09 293.785 1526.53 301.705 1346.85 618.625C1167.17 935.545 818.694 1561.22 635.214 1896.74C451.734 2232.26 443.814 2258.66 447.654 2268.3C451.494 2277.94 467.334 2270.02 511.134 2236.9C554.934 2203.78 626.214 2145.7 966.534 1817.46C1306.85 1489.22 1914.05 892.585 2263.81 557.505C2613.57 222.425 2687.49 166.985 2741.41 129.185C2795.33 91.3848 2827.01 72.9048 2843.33 67.3448C2859.65 61.7848 2859.65 69.7048 2849.09 96.2248C2838.53 122.745 2817.41 167.625 2584.77 544.505C2352.13 921.385 1370.37 2165.43 1139.25 2537.83C908.134 2910.23 902.854 2926.07 902.774 2939.51C902.694 2952.95 907.974 2963.51 1255.21 2613.87C1602.45 2264.23 2829.73 1017.54 2903.53 1071.46C2977.33 1125.38 2176.12 2817.04 2128 3037C2079.88 3256.96 2911.24 2018.56 3172 1793';

export default function DetailsBridge() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const solidRef = useRef(null);
  const bracketLeftRef = useRef(null);
  const bracketRightRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    let cleanups = [];

    const initAnimation = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;

      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      const path = pathRef.current;
      const solid = solidRef.current;
      const leftBracket = bracketLeftRef.current;
      const rightBracket = bracketRightRef.current;
      const heading = headingRef.current;

      if (!container || !path) return;

      // Measure total path length accurately
      let totalLength = 18000;
      try {
        totalLength = path.getTotalLength() || 18000;
      } catch {
        totalLength = 18000;
      }

      // Initial stroke configuration: 160px width, fully hidden offset
      path.style.strokeDasharray = `${totalLength} ${totalLength}`;
      path.style.strokeDashoffset = `${totalLength}`;
      path.setAttribute('stroke-width', '160');

      // 1. Bracket Scroll Reveal (sliding in from sides as section approaches)
      if (leftBracket && rightBracket && heading) {
        const bracketTween = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            end: 'top 30%',
            scrub: true,
          },
        });

        bracketTween
          .fromTo(leftBracket, { xPercent: -120 }, { xPercent: 0, ease: 'none' }, 0)
          .fromTo(rightBracket, { xPercent: 120 }, { xPercent: 0, ease: 'none' }, 0);

        cleanups.push(() => {
          if (bracketTween.scrollTrigger) bracketTween.scrollTrigger.kill();
          bracketTween.kill();
        });
      }

      // 2. CSS-Sticky ScrollTrigger Scrub
      // Uses the 220vh track of containerRef with native CSS sticky for 100% Lenis compatibility
      const scrubST = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Paint path progression (sweeps from top-left across the viewport)
          const drawP = Math.min(1.0, p / 0.85);
          const offset = totalLength * (1 - drawP);
          path.style.strokeDashoffset = `${offset}`;

          // Expanding stroke width: from 160px (5%) to 2600px (80%)
          const widthP = p < 0.2 ? 0 : Math.min(1, (p - 0.2) / 0.75);
          const currentWidth = 160 + widthP * (2600 - 160);
          path.setAttribute('stroke-width', currentWidth.toString());

          // Solid blue layer near the end of the scroll scrub for 100% seamless unpin
          if (solid) {
            if (p >= 0.82) {
              const alpha = Math.min(1, (p - 0.82) / 0.14);
              solid.style.opacity = alpha.toString();
            } else {
              solid.style.opacity = '0';
            }
          }

          // Header theme switch when blue covers the upper screen
          if (container) {
            container.dataset.themeSection = p >= 0.35 ? 'dark' : 'light';
          }
        },
      });

      cleanups.push(() => scrubST.kill());

      // Safe refresh after layout settles
      const refreshTimer = setTimeout(() => {
        try {
          ScrollTrigger.refresh();
        } catch {}
      }, 250);

      cleanups.push(() => clearTimeout(refreshTimer));
    };

    initAnimation();

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="transition"
      data-theme-section="light"
      data-scroll-draw-transition=""
      className="scroll-draw-transition"
    >
      {/* ── Native CSS Sticky Viewport Container (100% Lenis-compatible, no DOM pin-spacer) ── */}
      <div className="scroll-draw-transition__sticky">
        {/* Editorial Text: Visible immediately when scrolling down */}
        <section
          data-scroll-draw-section=""
          className="services-header__w"
        >
          <p data-split-rolling="" className="services-big-txt">
            <span className="services-big-txt__line">SMALL DETAILS.</span>
            <span className="services-big-txt__span">BIG IMPACT.</span>
          </p>

          {/* [ Selected Work ] with sliding brackets */}
          <h2
            ref={headingRef}
            data-bracket-heading=""
            className="heading-h2 txt-color-blue"
          >
            <span
              ref={bracketLeftRef}
              data-bracket-left=""
              className="heading-bracket is--left"
            >
              [
            </span>
            <span className="heading-title-text">Selected Work</span>
            <span
              ref={bracketRightRef}
              data-bracket-right=""
              className="heading-bracket is--right"
            >
              ]
            </span>
          </h2>
        </section>

        {/* ── Paint / Brush Stroke SVG Overlay ── */}
        <div
          data-scroll-draw-overlay=""
          className="scroll-draw-transition__overlay"
        >
          <div className="scroll-draw-transition__shape">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              viewBox="0 0 3222 3114"
              fill="none"
              preserveAspectRatio="none"
              className="transition__svg"
              aria-hidden="true"
            >
              {/* Solid blue backing layer for 100% opaque unpin handoff */}
              <rect
                ref={solidRef}
                x="0"
                y="0"
                width="3222"
                height="3114"
                fill="#2A4093"
                style={{ opacity: 0, transition: 'opacity 0.08s linear' }}
              />

              {/* The exact Alejandro HA meandering brush roller path */}
              <path
                ref={pathRef}
                d={ALEJANDRO_PATH}
                fill="none"
                stroke="#2A4093"
                strokeWidth="160"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
