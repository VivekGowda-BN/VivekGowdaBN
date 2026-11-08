import { useState, useRef, useEffect } from 'react';
import './AccordionGallery.css';

const ACHIEVEMENTS = [
  {
    id: 1,
    number: '01',
    image: '/assets/FKCCI.jpeg',
    label: 'FKCCI Winner 2026',
    title: 'FKCCI Inno Manthan Winner',
    year: '2026',
    supportingText: '₹70,000 Special Grant · Grand Finale',
    description:
      'Secured a ₹70,000 Special Grant at the FKCCI Inno Manthan 2026 Grand Finale at Vidhana Soudha for Sangithub.',
    link: 'https://lnkd.in/p/gVJ-VwDg',
    alt: 'FKCCI Inno Manthan Winner – ₹70,000 Special Grant',
  },
  {
    id: 2,
    number: '02',
    image: '/assets/inno.jpeg',
    label: 'INOOVATUS RVU 2026',
    title: 'INOOVATUS, RVU',
    year: '2026',
    supportingText: '2nd in Domain · 3rd Runner-Up Overall',
    description:
      '2nd in domain and 3rd runner-up overall at national-level hackathon, engineering an AI prototype in a 36-hour sprint.',
    link: '#',
    alt: 'National-level Hackathon – 2nd in domain, 3rd runner-up overall',
  },
  {
    id: 3,
    number: '03',
    image: '/assets/rvulogo.png',
    label: 'Top Academic Performer',
    title: 'Top Academic Performer',
    year: '2025 – 2026',
    supportingText: 'GPA ~ 9.00 · School of CS & Eng',
    description:
      'Top academic performer with a 9.00 GPA across advanced CS, Data Science, and algorithms at RV University.',
    link: '#',
    alt: 'GPA ~ 9.00 – Top Academic Performer 2025-2026',
  },
];

export default function AccordionGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    let cleanups = [];

    const initScrollAnim = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
      gsap.registerPlugin(ScrollTrigger);

      if (galleryRef.current) {
        const headerTween = gsap.fromTo(
          '.accordion-gallery__header',
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
        cleanups.push(() => headerTween.kill());

        const itemsTween = gsap.fromTo(
          '.accordion-item',
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
        cleanups.push(() => itemsTween.kill());
      }
    };

    initScrollAnim();
    return () => cleanups.forEach((fn) => fn && fn());
  }, []);

  return (
    <section
      ref={galleryRef}
      id="achievements"
      className="accordion-gallery"
      data-header-theme="dark"
    >
      <div className="accordion-gallery__container">
        {/* Section Header */}
        <div className="accordion-gallery__label-wrap">
          <div className="accordion-gallery__tag">
            <span className="accordion-gallery__tag-bullet" />
            <span>[ ACHIEVEMENTS ]</span>
          </div>
          <div className="accordion-gallery__label-line" />
        </div>

        <div className="accordion-gallery__header">
          <h2 className="accordion-gallery__title text-h2">
            A few Milestones
          </h2>
        </div>

        {/* Interactive React Bits Accordion */}
        <div className="accordion-container">
          {ACHIEVEMENTS.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={item.id}
                className={`accordion-item ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                role="region"
                aria-expanded={isActive}
              >
                {/* Background Image */}
                <div className="accordion-item__bg">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="accordion-item__img"
                    loading="lazy"
                  />
                  <div className="accordion-item__gradient" />
                </div>

                {/* Vertical / Collapsed Label */}
                <div className="accordion-item__collapsed-content">
                  <span className="accordion-item__col-num">{item.number}</span>
                  <span className="accordion-item__col-title">{item.label}</span>
                </div>

                {/* Expanded Content Card with Staggered Smooth Text Reveal */}
                <div className="accordion-item__expanded-content">
                  <div className="accordion-item__meta">
                    <span className="accordion-item__badge">{item.number}</span>
                    <span className="accordion-item__year">{item.year}</span>
                    <span className="accordion-item__tag">{item.supportingText}</span>
                  </div>

                  <h3 className="accordion-item__title">{item.title}</h3>

                  <p className="accordion-item__desc">{item.description}</p>

                  <div className="accordion-item__footer">
                    {item.link && item.link !== '#' ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="accordion-item__btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View Verification</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M1.5 12.5L12.5 1.5M12.5 1.5H4.5M12.5 1.5V9.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    ) : (
                      <span className="accordion-item__status">
                        Verified Milestone ✦
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
