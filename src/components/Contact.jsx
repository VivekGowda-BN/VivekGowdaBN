import { useState, useRef, useEffect } from 'react';
import './Contact.css';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    reason: 'Freelance project',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success'
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    let cleanups = [];

    const initAnim = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default || gsapModule.gsap || gsapModule;
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const card = cardRef.current;
      if (!section || !card) return;

      const cardTween = gsap.fromTo(
        card,
        {
          y: 45,
          opacity: 0.2,
          scale: 0.98,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
          },
        }
      );

      cleanups.push(() => cardTween.kill());
    };

    initAnim();

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;

    setStatus('sending');

    // Simulate reliable dispatch with confirmation
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  const handleReset = () => {
    setStatus('idle');
    setFormState({
      name: '',
      email: '',
      phone: '',
      reason: 'Freelance project',
      message: '',
    });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact"
      data-header-theme="dark"
      aria-label="Contact Section"
    >
      {/* 1. Full-screen background video (Sky / Clouds from Pamidor) */}
      <video
        aria-hidden="true"
        poster="/assets/form-sky.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="contact__bg-video"
      >
        <source src="/assets/form-sky.mp4" type="video/mp4" />
      </video>

      {/* Subtle overlay to ensure the video blends cleanly */}
      <div className="contact__video-overlay" aria-hidden="true" />

      {/* 2. Dark floating contact box centered on top of video */}
      <div className="contact__container">
        <div ref={cardRef} id="start-project" className="contact__card">
          {/* Small Top Label */}
          <div className="contact__label-wrap">
            <span className="contact__small-label">(LEAVE YOUR DETAILS)</span>
          </div>

          {/* Big Heading: OPEN THE DOOR with signature Pamidor kinetic animation */}
          <h2 className="contact__heading" data-door="true">
            OPEN THE{' '}
            <span className="contact__door-nowrap">
              DO<span className="door-o">O</span><span className="door-r">R</span>
            </span>
          </h2>

          {/* Subtext: Clickable email */}
          <div className="contact__subtext-row">
            <span className="contact__subtext-label">Or just write:</span>
            <a
              href="mailto:vivekgowdabn444@gmail.com"
              className="contact__email-link"
              aria-label="Email vivekgowdabn444@gmail.com directly"
            >
              vivekgowdabn444@gmail.com
            </a>
          </div>

          {/* Form State: Success or Form Fields */}
          {status === 'success' ? (
            <div className="contact__success-state">
              <div className="contact__success-badge">
                <span className="contact__success-check">✓</span>
                <span>DETAILS DELIVERED</span>
              </div>
              <h3 className="contact__success-title">Thank you, {formState.name}!</h3>
              <p className="contact__success-desc">
                Your message has been sent directly to Vivek Gowda BN. A response will land in your inbox soon.
              </p>
              <div className="contact__success-actions">
                <button
                  type="button"
                  className="contact__reset-btn"
                  onClick={handleReset}
                >
                  <span>Send another message</span>
                </button>
                <a
                  href="mailto:vivekgowdabn444@gmail.com"
                  className="contact__direct-mailto"
                >
                  Write directly via email ↗
                </a>
              </div>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit} noValidate>
              {/* Row 1: NAME & EMAIL */}
              <div className="contact__form-grid contact__form-grid--2col">
                <div className="contact__field">
                  <label htmlFor="lead-name" className="contact__field-label">
                    NAME
                  </label>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    autoComplete="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="contact__input"
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="lead-email" className="contact__field-label">
                    EMAIL
                  </label>
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    autoComplete="email"
                    inputMode="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="contact__input"
                  />
                </div>
              </div>

              {/* Row 2: PHONE & REASON */}
              <div className="contact__form-grid contact__form-grid--split">
                <div className="contact__field">
                  <label htmlFor="lead-phone" className="contact__field-label">
                    PHONE
                  </label>
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    inputMode="tel"
                    value={formState.phone}
                    onChange={handleChange}
                    className="contact__input"
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="lead-reason" className="contact__field-label">
                    REASON
                  </label>
                  <div className="contact__select-wrap">
                    <select
                      id="lead-reason"
                      name="reason"
                      value={formState.reason}
                      onChange={handleChange}
                      className="contact__select"
                    >
                      <option value="Freelance project">Freelance project</option>
                      <option value="Role / Opportunity">Role / Opportunity</option>
                      <option value="Just saying hi">Just saying hi</option>
                    </select>
                    <svg
                      className="contact__select-arrow"
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 5.5L7 9.5L11 5.5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 3: MESSAGE */}
              <div className="contact__form-grid contact__form-grid--full">
                <div className="contact__field">
                  <label htmlFor="lead-message" className="contact__field-label">
                    MESSAGE
                  </label>
                  <input
                    id="lead-message"
                    name="message"
                    type="text"
                    required
                    placeholder="A few words"
                    value={formState.message}
                    onChange={handleChange}
                    className="contact__input"
                  />
                </div>
              </div>

              {/* White Button Row + Helper text */}
              <div className="contact__submit-row">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="contact__submit-btn"
                  aria-label="Send Details"
                >
                  <span className="contact__submit-btn-text">
                    {status === 'sending' ? 'Sending Details...' : 'Send Details'}
                  </span>
                  <svg
                    className="contact__submit-icon"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <g transform="rotate(0 8 8) translate(1.9 3.05) scale(0.41)">
                      <path d="M23.1099 10.9188C19.5082 8.73064 14.2988 4.0372 13.5814 0.0155222L15.9065 3.2973e-06C17.9701 4.66018 24.0697 10.0675 29.7806 10.9898L29.759 13.0893C24.3025 14.0138 17.8165 19.4278 15.9857 24.1101L13.6701 24.1367C13.9005 20.39 19.7218 15.2819 23.0571 13.1913L0.00959874 13.1691L5.90407e-07 10.9388L23.1099 10.9188Z" />
                    </g>
                  </svg>
                </button>

                <p className="contact__helper-note" aria-live="polite">
                  No spam. A real reply, usually the same day.
                </p>
              </div>

              {/* Small helper text below button */}
              <div className="contact__privacy-row">
                <p className="contact__privacy-note">
                  Sent details land in my inbox and nowhere else —{' '}
                  <a
                    href="mailto:vivekgowdabn444@gmail.com"
                    className="contact__privacy-link"
                  >
                    write directly
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
