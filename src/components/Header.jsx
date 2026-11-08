import { useEffect, useRef, useState } from 'react';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('light'); // light | dark | blue
  const headerRef = useRef(null);
  const nameRef = useRef(null);

  const githubBtnRef = useRef(null);
  const githubMaskPathRef = useRef(null);
  const githubOverlayPathRef = useRef(null);

  const resumeBtnRef = useRef(null);
  const resumeMaskPathRef = useRef(null);
  const resumeOverlayPathRef = useRef(null);

  useEffect(() => {
    // Dynamic theme detector based on active section
    const handleScroll = () => {
      const isPastHero = window.scrollY > window.innerHeight * 0.65;
      setScrolled(isPastHero);

      const sections = document.querySelectorAll('[data-header-theme]');
      let currentTheme = 'light';
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 60 && rect.bottom > 60) {
          currentTheme = section.dataset.headerTheme || 'light';
        }
      });
      setTheme(currentTheme);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let scrollTriggerInstance = null;
    let cleanupButtons = [];

    const initHeaderMotion = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
      gsap.registerPlugin(ScrollTrigger);

      // ── 1. Sticky Name SVG Shrink Animation ──
      const el = nameRef.current;
      if (el) {
        const calcAndAnimate = () => {
          gsap.set(el, { clearProps: 'transform' });

          const rect = el.getBoundingClientRect();
          const winW = window.innerWidth;
          const isMobile = winW < 768;

          // Desired width of the headline over the portrait in the hero
          const desiredHeroWidth = Math.min(winW * (isMobile ? 0.92 : 0.88), 1080);
          const startScale = Math.max(desiredHeroWidth / rect.width, 1.0);

          // Desired coordinates in the hero (positioned just below the navbar area)
          const heroTop = isMobile ? 62 : 72;
          const heroCenterX = winW / 2;

          // Coordinate offsets from fixed docked top-left (rect.left, rect.top)
          const startX = heroCenterX - rect.left - (rect.width * startScale) / 2;
          const startY = heroTop - rect.top;

          if (scrollTriggerInstance) {
            scrollTriggerInstance.kill();
          }

          const tween = gsap.fromTo(
            el,
            {
              x: startX,
              y: startY,
              scale: startScale,
              transformOrigin: 'top left',
            },
            {
              x: 0,
              y: 0,
              scale: 1.0,
              transformOrigin: 'top left',
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: '+=70%',
                scrub: 0.5,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  setScrolled(self.progress > 0.85);
                  // Once fully scrolled to docked state, clear GSAP's inline
                  // transform so the browser pixel-snaps the SVG (prevents blur)
                  if (self.progress >= 1) {
                    gsap.set(el, { clearProps: 'transform' });
                  }
                },
              },
            }
          );

          scrollTriggerInstance = tween.scrollTrigger;
        };

        setTimeout(calcAndAnimate, 60);
        window.addEventListener('resize', calcAndAnimate);
        cleanupButtons.push(() => window.removeEventListener('resize', calcAndAnimate));
      }

      // ── 2. Alejandro HA button-007 Paint Hover Animation ──
      const setupButtonPaintEffect = (btn, maskPath, overlayPath) => {
        if (!btn || !maskPath || !overlayPath) return;

        const paths = [maskPath, overlayPath];
        const lengths = paths.map((p) => {
          try {
            return p.getTotalLength() || 600;
          } catch {
            return 600;
          }
        });

        // Initialize stroke hidden
        paths.forEach((p, idx) => {
          const len = lengths[idx];
          p.style.strokeDasharray = `${len} ${len}`;
          p.style.strokeDashoffset = `${len}`;
          p.style.strokeWidth = '0';
        });

        let enterTween = null;
        let leaveTimeline = null;

        const onPointerEnter = () => {
          if (leaveTimeline) leaveTimeline.kill();
          paths.forEach((p, idx) => {
            const len = lengths[idx];
            gsap.killTweensOf(p);
            gsap.set(p, {
              strokeDasharray: `${len} ${len}`,
              strokeDashoffset: len,
              strokeWidth: 0,
            });
            enterTween = gsap.to(p, {
              strokeWidth: 62,
              strokeDashoffset: 0,
              duration: 0.75,
              ease: 'power2.out',
              overwrite: true,
            });
          });
        };

        const onPointerLeave = () => {
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
                onComplete: () => {
                  gsap.set(p, { strokeDashoffset: len, strokeWidth: 0 });
                },
              },
              0
            );
          });
        };

        btn.addEventListener('mouseenter', onPointerEnter);
        btn.addEventListener('mouseleave', onPointerLeave);

        cleanupButtons.push(() => {
          btn.removeEventListener('mouseenter', onPointerEnter);
          btn.removeEventListener('mouseleave', onPointerLeave);
          if (enterTween) enterTween.kill();
          if (leaveTimeline) leaveTimeline.kill();
        });
      };

      setupButtonPaintEffect(
        githubBtnRef.current,
        githubMaskPathRef.current,
        githubOverlayPathRef.current
      );
      setupButtonPaintEffect(
        resumeBtnRef.current,
        resumeMaskPathRef.current,
        resumeOverlayPathRef.current
      );
    };

    initHeaderMotion();

    return () => {
      cleanupButtons.forEach((fn) => fn && fn());
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buttonPathD =
    'M16.332 39.1765C25.6381 35.2853 34.9441 31.3941 40.6554 29.173C50.662 25.2814 21.2379 53.1954 17.526 58.4408C14.8321 62.2478 16.2337 62.0854 17.6851 61.7242C19.1364 61.363 20.5951 60.8079 30.413 55.6381C40.231 50.4684 58.3639 40.7009 68.2847 35.2711C78.2055 29.8412 79.3646 29.0451 79.7292 28.7446C80.0938 28.4441 79.6289 28.6635 73.9175 35.9463C68.2062 43.2292 57.2628 57.5688 51.5744 65.2375C45.886 72.9063 45.7844 73.4697 46.1047 73.6339C46.6385 73.9077 67.9122 61.8313 68.2066 61.6541C82.3093 53.1624 107.339 37.7974 121.861 29.1143C136.382 20.4312 139.637 18.8959 142.043 17.8274C142.799 17.4917 148.024 14.9173 147.361 16.5225C147.121 17.1044 146.542 18.1091 138.743 26.8865C130.945 35.6639 93.8491 65.9527 86.0769 74.6334C78.305 83.3141 78.216 83.6554 78.3741 83.9179C78.5321 84.1803 78.94 84.3537 93.1516 75.4023C107.363 66.451 157.462 34.6003 162.031 35.1974C166.6 35.7944 144.497 73.6977 144.599 78.2813C144.701 82.8649 173.88 53.6113 184.999 47.6105';

  return (
    <header
      ref={headerRef}
      className={`header ${scrolled ? 'header--scrolled' : ''} header--${theme}`}
      data-theme={theme}
    >
      <div className="header__inner">
        {/* Transforming Sticky Name: Custom SVG from /assets/vivek-name.svg */}
        <div
          ref={nameRef}
          className="header-sticky-name"
          onClick={scrollToTop}
          role="button"
          tabIndex={0}
          aria-label="Vivek Gowda BN — Back to top"
        >
          <svg
            className="hero-name-svg"
            viewBox="0 0 338 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M333.193 22.464V21.048H335.881V1.416H333.193V0H337.585V22.464H333.193Z" fill="currentColor"/>
            <path d="M309.181 17.808V1.008H310.646L322.237 15.6H321.469V1.008H323.221V17.808H321.758L310.189 3.216H310.957V17.808H309.181Z" fill="currentColor"/>
            <path d="M284.368 17.808V1.008H291.616C293.488 1.008 294.936 1.384 295.96 2.136C297 2.888 297.52 3.952 297.52 5.328C297.52 6.24 297.304 7.008 296.872 7.632C296.456 8.256 295.88 8.728 295.144 9.048C294.424 9.368 293.632 9.528 292.768 9.528L293.176 8.952C294.248 8.952 295.168 9.12 295.936 9.456C296.72 9.776 297.328 10.264 297.76 10.92C298.192 11.56 298.408 12.36 298.408 13.32C298.408 14.744 297.88 15.848 296.824 16.632C295.784 17.416 294.208 17.808 292.096 17.808H284.368ZM286.144 16.344H292.072C293.544 16.344 294.672 16.096 295.456 15.6C296.24 15.088 296.632 14.28 296.632 13.176C296.632 12.088 296.24 11.296 295.456 10.8C294.672 10.288 293.544 10.032 292.072 10.032H285.952V8.568H291.496C292.84 8.568 293.88 8.312 294.616 7.8C295.368 7.288 295.744 6.528 295.744 5.52C295.744 4.496 295.368 3.736 294.616 3.24C293.88 2.728 292.84 2.472 291.496 2.472H286.144V16.344Z" fill="currentColor"/>
            <path d="M270.007 22.464V0H274.399V1.416H271.711V21.048H274.399V22.464H270.007Z" fill="currentColor"/>
            <path d="M230.395 17.808L238.075 1.008H239.827L247.507 17.808H245.635L238.579 2.04H239.299L232.243 17.808H230.395ZM233.419 13.32L233.947 11.88H243.715L244.243 13.32H233.419Z" fill="currentColor"/>
            <path d="M206.769 17.808V1.008H213.609C215.401 1.008 216.969 1.368 218.313 2.088C219.673 2.792 220.729 3.776 221.481 5.04C222.233 6.304 222.609 7.76 222.609 9.408C222.609 11.056 222.233 12.512 221.481 13.776C220.729 15.04 219.673 16.032 218.313 16.752C216.969 17.456 215.401 17.808 213.609 17.808H206.769ZM208.545 16.272H213.513C215.001 16.272 216.289 15.984 217.377 15.408C218.481 14.816 219.337 14.008 219.945 12.984C220.553 11.944 220.857 10.752 220.857 9.408C220.857 8.048 220.553 6.856 219.945 5.832C219.337 4.808 218.481 4.008 217.377 3.432C216.289 2.84 215.001 2.544 213.513 2.544H208.545V16.272Z" fill="currentColor"/>
            <path d="M177.545 17.808L171.881 1.008H173.705L179.009 16.824H178.097L183.569 1.008H185.201L190.601 16.824H189.737L195.089 1.008H196.793L191.129 17.808H189.257L184.097 2.808H184.577L179.393 17.808H177.545Z" fill="currentColor"/>
            <path d="M154.712 17.952C153.448 17.952 152.272 17.744 151.184 17.328C150.112 16.896 149.176 16.296 148.376 15.528C147.592 14.744 146.976 13.84 146.528 12.816C146.096 11.776 145.88 10.64 145.88 9.408C145.88 8.176 146.096 7.048 146.528 6.024C146.976 4.984 147.592 4.08 148.376 3.312C149.176 2.528 150.112 1.928 151.184 1.512C152.256 1.08 153.432 0.863998 154.712 0.863998C155.976 0.863998 157.144 1.08 158.216 1.512C159.288 1.928 160.216 2.52 161 3.288C161.8 4.056 162.416 4.96 162.848 6C163.296 7.04 163.52 8.176 163.52 9.408C163.52 10.64 163.296 11.776 162.848 12.816C162.416 13.856 161.8 14.76 161 15.528C160.216 16.296 159.288 16.896 158.216 17.328C157.144 17.744 155.976 17.952 154.712 17.952ZM154.712 16.368C155.72 16.368 156.648 16.2 157.496 15.864C158.36 15.512 159.104 15.024 159.728 14.4C160.368 13.76 160.864 13.024 161.216 12.192C161.568 11.344 161.744 10.416 161.744 9.408C161.744 8.4 161.568 7.48 161.216 6.648C160.864 5.8 160.368 5.064 159.728 4.44C159.104 3.8 158.36 3.312 157.496 2.976C156.648 2.624 155.72 2.448 154.712 2.448C153.704 2.448 152.768 2.624 151.904 2.976C151.04 3.312 150.288 3.8 149.648 4.44C149.024 5.064 148.528 5.8 148.16 6.648C147.808 7.48 147.632 8.4 147.632 9.408C147.632 10.4 147.808 11.32 148.16 12.168C148.528 13.016 149.024 13.76 149.648 14.4C150.288 15.024 151.04 15.512 151.904 15.864C152.768 16.2 153.704 16.368 154.712 16.368Z" fill="currentColor"/>
            <path d="M129.454 17.952C128.174 17.952 126.99 17.744 125.902 17.328C124.83 16.896 123.894 16.296 123.094 15.528C122.31 14.76 121.694 13.856 121.246 12.816C120.814 11.776 120.598 10.64 120.598 9.408C120.598 8.176 120.814 7.04 121.246 6C121.694 4.96 122.318 4.056 123.118 3.288C123.918 2.52 124.854 1.928 125.926 1.512C127.014 1.08 128.198 0.863998 129.478 0.863998C130.758 0.863998 131.926 1.064 132.982 1.464C134.054 1.864 134.966 2.472 135.718 3.288L134.614 4.416C133.91 3.712 133.134 3.208 132.286 2.904C131.438 2.6 130.526 2.448 129.55 2.448C128.51 2.448 127.55 2.624 126.67 2.976C125.806 3.312 125.046 3.8 124.39 4.44C123.75 5.064 123.246 5.8 122.878 6.648C122.526 7.48 122.35 8.4 122.35 9.408C122.35 10.4 122.526 11.32 122.878 12.168C123.246 13.016 123.75 13.76 124.39 14.4C125.046 15.024 125.806 15.512 126.67 15.864C127.55 16.2 128.502 16.368 129.526 16.368C130.486 16.368 131.39 16.224 132.238 15.936C133.102 15.648 133.894 15.16 134.614 14.472L135.622 15.816C134.822 16.52 133.886 17.056 132.814 17.424C131.742 17.776 130.622 17.952 129.454 17.952ZM135.622 15.816L133.918 15.6V9.408H135.622V15.816Z" fill="currentColor"/>
            <path d="M86.8378 13.632L86.7658 11.472L96.9418 1.008H98.9818L91.5658 8.784L90.5578 9.864L86.8378 13.632ZM85.3018 17.808V1.008H87.0778V17.808H85.3018ZM97.3738 17.808L90.1258 9.456L91.3258 8.16L99.4858 17.808H97.3738Z" fill="currentColor"/>
            <path d="M62.5271 17.808V1.008H74.0471V2.544H64.3031V16.272H74.4071V17.808H62.5271ZM64.1111 10.032V8.52H72.9911V10.032H64.1111Z" fill="currentColor"/>
            <path d="M44.1769 17.808L36.7369 1.008H38.6569L45.6169 16.824H44.5609L51.5689 1.008H53.3689L45.9289 17.808H44.1769Z" fill="currentColor"/>
            <path d="M25.7903 17.808V1.008H27.5663V17.808H25.7903Z" fill="currentColor"/>
            <path d="M7.44 17.808L0 1.008H1.92L8.88 16.824H7.824L14.832 1.008H16.632L9.192 17.808H7.44Z" fill="currentColor"/>
          </svg>
        </div>

        {/* Top Right: Alejandro HA button-007 (GitHub dark & Resume blue) */}
        <div className="header__nav-buttons">
          {/* GitHub button (Dark version with paint wipe effect) */}
          <a
            ref={githubBtnRef}
            href="https://github.com/VivekGowda-BN"
            target="_blank"
            rel="noopener noreferrer"
            className="button-007 button-007--dark"
            data-button-007
            aria-label="GitHub Profile"
          >
            <span className="button-007__inner">
              <span className="button-007__text is--hover">
                <svg aria-hidden="true" className="button-007__svg">
                  <mask
                    id="button-007-mask-github"
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
                        ref={githubMaskPathRef}
                        d={buttonPathD}
                        stroke="currentColor"
                        strokeWidth="0"
                        strokeLinecap="round"
                      />
                    </svg>
                  </mask>
                  <foreignObject
                    width="100%"
                    height="100%"
                    mask="url(#button-007-mask-github)"
                    className="button-007__svg-object"
                  >
                    <div className="button-007__svg-inner">
                      <div className="button-007__svg-text-wrap">
                        <span className="button-007__svg-text">GitHub</span>
                      </div>
                    </div>
                  </foreignObject>
                </svg>
              </span>

              {/* Paint Stroke Liquid Sweep */}
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
                  ref={githubOverlayPathRef}
                  d={buttonPathD}
                  stroke="currentColor"
                  strokeWidth="0"
                  strokeLinecap="round"
                />
              </svg>

              <span className="button-007__text is--default">GitHub</span>
            </span>
            <span className="button-007__paint-sweep" />
            <span className="button-007__bg" />
          </a>

          {/* Resume button (Blue version: #2A4093 with paint wipe effect) */}
          <a
            ref={resumeBtnRef}
            href="/assets/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="button-007 button-007--blue"
            data-button-007
            aria-label="Download Resume"
          >
            <span className="button-007__inner">
              <span className="button-007__text is--hover">
                <svg aria-hidden="true" className="button-007__svg">
                  <mask
                    id="button-007-mask-resume"
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
                        ref={resumeMaskPathRef}
                        d={buttonPathD}
                        stroke="currentColor"
                        strokeWidth="0"
                        strokeLinecap="round"
                      />
                    </svg>
                  </mask>
                  <foreignObject
                    width="100%"
                    height="100%"
                    mask="url(#button-007-mask-resume)"
                    className="button-007__svg-object"
                  >
                    <div className="button-007__svg-inner">
                      <div className="button-007__svg-text-wrap">
                        <span className="button-007__svg-text">Resume</span>
                      </div>
                    </div>
                  </foreignObject>
                </svg>
              </span>

              {/* Paint Stroke Liquid Sweep */}
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
                  ref={resumeOverlayPathRef}
                  d={buttonPathD}
                  stroke="currentColor"
                  strokeWidth="0"
                  strokeLinecap="round"
                />
              </svg>

              <span className="button-007__text is--default">Resume</span>
            </span>
            <span className="button-007__paint-sweep" />
            <span className="button-007__bg" />
          </a>
        </div>
      </div>
    </header>
  );
}
