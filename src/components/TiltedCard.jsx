import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './TiltedCard.css';

const springConfig = {
  damping: 24,
  stiffness: 160,
  mass: 0.6,
};

export default function TiltedCard({
  imageSrc,
  altText = 'Experience image',
  number = '1',
  role = '',
  company = '',
  period = '',
  location = '',
  link = '',
  description = '',
  contributions = [],
  highlight = '',
  rotateAmplitude = 12,
  scaleOnHover = 1.025,
}) {
  const cardRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Motion values for tilt & glare
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawScale = useMotionValue(1);
  const rawGlareOpacity = useMotionValue(0);
  const rawGlareX = useMotionValue(50);
  const rawGlareY = useMotionValue(50);

  // Springs for smooth physics
  const rotateX = useSpring(rawX, springConfig);
  const rotateY = useSpring(rawY, springConfig);
  const scale = useSpring(rawScale, springConfig);
  const glareOpacity = useSpring(rawGlareOpacity, { damping: 20, stiffness: 200 });
  const glareX = useSpring(rawGlareX, springConfig);
  const glareY = useSpring(rawGlareY, springConfig);

  // Radial glare background
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 70%)`
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = clientX / rect.width;
      const normY = clientY / rect.height;

      const offsetX = normX - 0.5;
      const offsetY = normY - 0.5;

      // Invert Y rotation when card is flipped so tilt feels natural
      const flipSign = isFlipped ? -1 : 1;

      rawX.set(-offsetY * rotateAmplitude * 2);
      rawY.set(offsetX * rotateAmplitude * 2 * flipSign);

      rawGlareX.set(normX * 100);
      rawGlareY.set(normY * 100);
    },
    [isFlipped, rotateAmplitude, rawX, rawY, rawGlareX, rawGlareY]
  );

  const handleMouseEnter = useCallback(() => {
    rawScale.set(scaleOnHover);
    rawGlareOpacity.set(1);
  }, [scaleOnHover, rawScale, rawGlareOpacity]);

  const handleMouseLeave = useCallback(() => {
    rawScale.set(1);
    rawX.set(0);
    rawY.set(0);
    rawGlareOpacity.set(0);
  }, [rawScale, rawX, rawY, rawGlareOpacity]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
    },
    [handleFlip]
  );

  return (
    <div
      className="tilted-card-root"
      tabIndex={0}
      role="button"
      aria-label={`${role} at ${company}. Card ${number}. Click to flip.`}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        ref={cardRef}
        className="tilted-card"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Flipper: Handles 0deg -> 180deg flip */}
        <motion.div
          className="tilted-card__flipper"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* ════════════════════════════════════════════════
              FRONT OF CARD
             ════════════════════════════════════════════════ */}
          <div className="tilted-card__face tilted-card__face--front">
            {/* Background Experience Image */}
            <div className="tilted-card__bg-wrap">
              <img
                src={imageSrc}
                alt={altText}
                className="tilted-card__bg-img"
                loading="lazy"
              />
              <div className="tilted-card__gradient-overlay" />
            </div>

            {/* Front Card Content */}
            <div className="tilted-card__content tilted-card__content--front">
              {/* Top Row: Card Number (1 / 2) + Badges */}
              <div className="tilted-card__top">
                <div className="tilted-card__number-badge" aria-label={`Card ${number}`}>
                  <span className="tilted-card__number-text">{number}</span>
                </div>

                <div className="tilted-card__meta-pills">
                  {period && (
                    <span className="tilted-card__pill tilted-card__pill--period">
                      {period}
                    </span>
                  )}
                  {location && (
                    <span className="tilted-card__pill tilted-card__pill--location">
                      {location}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Identity & Details */}
              <div className="tilted-card__bottom">
                <div className="tilted-card__identity">
                  <h3 className="tilted-card__role">{role}</h3>
                  <div className="tilted-card__company-row">
                    <span className="tilted-card__at">at</span>
                    <span className="tilted-card__company">{company}</span>
                  </div>
                </div>

                {/* Highlight banner if present */}
                {highlight && (
                  <div className="tilted-card__highlight">
                    <span className="tilted-card__highlight-dot" />
                    <span className="tilted-card__highlight-text">{highlight}</span>
                  </div>
                )}

                {/* Flip Prompt Footer */}
                <div className="tilted-card__footer">
                  <div className="tilted-card__flip-btn">
                    <svg
                      className="tilted-card__flip-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 21h5v-5" />
                    </svg>
                    <span>Click to flip</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Glare Overlay */}
            <motion.div
              className="tilted-card__glare"
              style={{
                opacity: glareOpacity,
                background: glareBackground,
              }}
            />
          </div>

          {/* ════════════════════════════════════════════════
              BACK OF CARD
             ════════════════════════════════════════════════ */}
          <div className="tilted-card__face tilted-card__face--back">
            <div className="tilted-card__back-bg" />

            <div className="tilted-card__content tilted-card__content--back">
              {/* Top Row: Number + Company link + Flip icon */}
              <div className="tilted-card__top">
                <div className="tilted-card__number-badge tilted-card__number-badge--back">
                  <span className="tilted-card__number-text">{number}</span>
                </div>

                <div className="tilted-card__top-actions">
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tilted-card__ext-link"
                      onClick={(e) => e.stopPropagation()}
                      title={`Visit ${company}`}
                    >
                      <span>{company}</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12L12 2M12 2H4.5M12 2V9.5" />
                      </svg>
                    </a>
                  )}

                  <div className="tilted-card__flip-back-pill" title="Flip back">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 21h5v-5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Back Header: Role & Period */}
              <div className="tilted-card__back-header">
                <span className="tilted-card__back-role">{role}</span>
                <span className="tilted-card__back-period">{period}</span>
              </div>

              {/* Description paragraph */}
              <p className="tilted-card__back-desc">{description}</p>

              {/* Contributions bullet points */}
              {contributions.length > 0 && (
                <ul className="tilted-card__contrib-list">
                  {contributions.map((c, i) => (
                    <li key={i} className="tilted-card__contrib-item">
                      <span className="tilted-card__contrib-star">✦</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Highlight callout on back */}
              {highlight && (
                <div className="tilted-card__highlight tilted-card__highlight--back">
                  <span className="tilted-card__highlight-dot" />
                  <span className="tilted-card__highlight-text">{highlight}</span>
                </div>
              )}

              {/* Back Footer button */}
              <div className="tilted-card__footer tilted-card__footer--back">
                <span className="tilted-card__flip-back-prompt">
                  ↺ Click anywhere to flip back
                </span>
              </div>
            </div>

            {/* Glare on back face */}
            <motion.div
              className="tilted-card__glare"
              style={{
                opacity: glareOpacity,
                background: glareBackground,
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
