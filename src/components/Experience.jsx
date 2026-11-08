import { useRef, useEffect } from 'react';
import TiltedCard from './TiltedCard';
import './Experience.css';

const EXPERIENCES = [
  {
    id: 'exp-1',
    number: '1',
    imageSrc: '/assets/Exp1.jpg',
    company: 'Goodwinsun',
    role: 'SDE Intern',
    period: 'June 2026 – Sep 2026',
    location: 'Hybrid / Remote',
    link: 'https://goodwinsun.com/',
    description:
      'Core team for end-to-end development of Sangithub — a GitHub-like platform built for musicians. Contributed across the full stack, integrating AI-powered analysis tools and refining the product through multiple feedback cycles.',
    contributions: [
      'Built and shipped core features: version-controlled music repos, AI analysis, artist portfolios.',
      'Iterated from MVP to competition-ready product, presenting at FKCCI Inno Manthan Grand Finale.',
    ],
    highlight: 'FKCCI Inno Manthan 2026 Grand Finalist & ₹70,000 Grant Winner',
  },
  {
    id: 'exp-2',
    number: '2',
    imageSrc: '/assets/Exp2.jpg',
    company: 'Independent Freelancer',
    role: 'Developer & AI Solutions',
    period: '2025 – Present',
    location: 'Bengaluru / Remote',
    link: 'https://github.com/VivekGowda-BN',
    description:
      'Freelance developer specialising in modern websites and AI-powered features. From high-fidelity motion UIs to embedded ML models and AI agents — I handle the full build independently, end to end.',
    contributions: [
      'Architected interactive digital products and portfolio experiences with high-fidelity motion systems.',
      'Embedded ML models, audio pipelines, and AI agent capabilities into client web platforms.',
    ],
    highlight: 'Full-stack engineering & custom AI client integrations',
  },
];

export default function Experience() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let cleanups = [];

    const initAnimation = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      // Header slide-up
      const header = section.querySelector('.experience__header');
      if (header) {
        const t1 = gsap.fromTo(
          header,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 78%', once: true },
          }
        );
        cleanups.push(() => t1.kill());
      }

      // Entrance animation for cards
      const cards = section.querySelectorAll('.experience__card-wrapper');
      cards.forEach((card, i) => {
        const t2 = gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            delay: i * 0.16,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 74%', once: true },
          }
        );
        cleanups.push(() => t2.kill());
      });
    };

    initAnimation();
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="experience"
      data-header-theme="light"
      aria-label="Experience"
    >
      <div className="experience__container">
        {/* Section Label: [ EXPERIENCE ] */}
        <div className="experience__label-row">
          <div className="experience__tag">
            <span className="experience__tag-bullet" />
            <span>[ EXPERIENCE ]</span>
          </div>
          <div className="experience__label-line" aria-hidden="true" />
        </div>

        {/* Section Header: Blue Heading */}
        <div className="experience__header">
          <h2 className="experience__title">
            My professional footprint.
          </h2>
        </div>

        {/* Side-by-Side 3D TiltedCard Grid */}
        <div className="experience__cards-grid" role="list">
          {EXPERIENCES.map((item) => (
            <div key={item.id} className="experience__card-wrapper" role="listitem">
              <TiltedCard
                imageSrc={item.imageSrc}
                altText={`${item.role} at ${item.company}`}
                number={item.number}
                role={item.role}
                company={item.company}
                period={item.period}
                location={item.location}
                link={item.link}
                description={item.description}
                contributions={item.contributions}
                highlight={item.highlight}
                rotateAmplitude={12}
                scaleOnHover={1.025}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
