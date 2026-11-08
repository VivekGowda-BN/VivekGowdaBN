# Creative Developer Portfolio — Vivek Gowda BN

A modern, high-performance portfolio featuring interactive 3D motion design, smooth Lenis scrolling, custom SVG paint typography, and responsive micro-interactions.

---

## ⚡ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Animation & Motion**: [GSAP (GreenSock)](https://gsap.com/) + ScrollTrigger, [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **3D Graphics**: [Three.js](https://threejs.org/) / React Three Fiber
- **Styling**: Modern Responsive CSS (CSS Variables, Flexbox, CSS Grid)
- **Code Quality**: [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `pnpm` / `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VivekGowda-BN/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview the production build:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
portfolio/
├── public/
│   └── assets/           # Optimized static assets & project previews
├── src/
│   ├── components/       # Modular section components
│   │   ├── Header.jsx    # Glassmorphism navigation with SVG paint buttons
│   │   ├── Hero.jsx      # Parallax hero & 3D wireframe globe
│   │   ├── About.jsx     # Letter-by-letter char-wave scroll & photo trail
│   │   ├── Transition.jsx# Brush/paint transition
│   │   ├── Projects.jsx  # Interactive accordion showcase
│   │   ├── Experience.jsx# 3D interactive TiltedCard with click-flip
│   │   ├── TiltedCard.jsx# React Bits 3D perspective flip card
│   │   ├── AccordionGallery.jsx # Achievements gallery
│   │   ├── Contact.jsx   # Contact form with background video
│   │   └── Footer.jsx    # Editorial footer & live clock
│   ├── App.jsx           # Main layout container
│   ├── index.css         # Global design system & typography tokens
│   └── main.jsx          # Application entrypoint
├── index.html
└── vite.config.js
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
