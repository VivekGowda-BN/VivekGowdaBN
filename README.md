<div align="center">
  <img src="public/favicon.svg" alt="Vivek Gowda BN logo" width="72" />

  # Vivek Gowda BN

  ### Creative developer · Interactive experiences · Bengaluru, India

  <p>A motion-led personal portfolio where editorial design, thoughtful engineering, and playful interaction come together.</p>

  <p>
    <a href="https://github.com/VivekGowda-BN/VivekGowdaBN"><strong>View the repository</strong></a>
    ·
    <a href="https://www.linkedin.com/in/vivek-gowda-bn">Connect on LinkedIn</a>
    ·
    <a href="mailto:vivekgowdabn444@gmail.com">Start a conversation</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
    <img src="https://img.shields.io/badge/Three.js-3D-black?logo=three.js&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/GSAP-motion-88CE02?logo=greensock&logoColor=white" alt="GSAP" />
    <img src="https://img.shields.io/badge/Framer%20Motion-interaction-0055FF?logo=framer&logoColor=white" alt="Framer Motion" />
  </p>
</div>

<p align="center">
  <a href="public/assets/portfolio-preview.mp4">
    <img src="public/assets/portfolio-preview.gif" alt="Preview of the Vivek Gowda BN portfolio" width="100%" />
  </a>
</p>

<p align="center"><sub>Open the preview above to watch the full portfolio walkthrough.</sub></p>

---

## The idea

This portfolio is designed as a guided visual experience rather than a conventional résumé page. It combines a restrained editorial palette with expressive motion: smooth scrolling, scroll-driven typography, 3D interactions, image trails, project reveals, and a cinematic contact section.

The implementation is intentionally componentized so that each major experience can be refined independently without turning the page into one large component.

## What is inside

- **Hero** — a responsive introduction with an interactive 3D globe, portrait composition, and animated navigation.
- **About** — scroll-reactive copy, hover-based portrait treatment, and a momentum-driven image trail.
- **Details bridge** — a full-width visual transition built with SVG masks and scroll progress.
- **Selected work** — expandable project rows linking to Quantum, Git-Music, Shaadi.Math, and this portfolio.
- **Experience** — interactive 3D cards with tilt, glare, and flip interactions.
- **Achievements** — an accordion gallery for milestones and recognition.
- **Contact** — a glassmorphism inquiry card layered over an ambient sky-video background.
- **Footer** — social links, resume access, and a live local-time display.

## Built with

| Layer | Tools |
| --- | --- |
| UI | [React 19](https://react.dev/) and React DOM |
| Build tooling | [Vite](https://vite.dev/) |
| 3D | [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), and [Drei](https://drei.docs.pmnd.rs/) |
| Motion | [GSAP](https://gsap.com/) with ScrollTrigger and [Framer Motion](https://motion.dev/) |
| Scrolling | [Lenis](https://lenis.darkroom.engineering/) |
| Quality | [Oxlint](https://oxc.rs/docs/guide/usage/linter) |
| Typography | Funnel Display, Inter, Montserrat, Plus Jakarta Sans, and Syne |

## Run it locally

### Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- npm 9 or newer (the repository includes `package-lock.json`)

### Setup

```bash
git clone https://github.com/VivekGowda-BN/VivekGowdaBN.git
cd VivekGowdaBN
npm install
npm run dev
```

Vite will print the local URL, normally [`http://localhost:5173`](http://localhost:5173).

### Available scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build locally
npm run lint      # Run Oxlint
```

The project currently works without required environment variables. If configuration is added later, copy the safe template first:

```bash
cp .env.example .env.local
```

Never commit `.env`, `.env.local`, API keys, or other credentials.

## Project structure

```text
VivekGowdaBN/
├── public/
│   ├── assets/                 # Portfolio imagery, video, preview, and resume
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/             # One component per portfolio experience
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── DetailsBridge.jsx
│   │   ├── Projects.jsx
│   │   ├── Experience.jsx
│   │   ├── AccordionGallery.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── App.jsx                 # Page composition and Lenis/GSAP setup
│   ├── index.css               # Global styles and design tokens
│   └── main.jsx                # React entry point
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Deployment

This is a standard Vite single-page application, so it can be deployed to any static hosting provider that supports Node-based builds.

1. Install dependencies with `npm install`.
2. Build with `npm run build`.
3. Publish the generated `dist/` directory.

For Vercel or Netlify, the usual settings are:

```text
Build command: npm run build
Output directory: dist
```

If you deploy to GitHub Pages under a project subpath rather than a custom domain, configure Vite's `base` option to match the repository path before building.

## Design and implementation notes

- Motion is progressive: Lenis and GSAP initialize on the client, with native scrolling remaining the fallback if smooth-scroll setup is unavailable.
- Large media is kept in `public/assets` so the portfolio can reference it directly from the browser.
- Interactive elements include semantic labels and keyboard-friendly links where applicable.
- Private working notes and environment files are excluded through `.gitignore`.

## Selected work

- [Quantum](https://github.com/VivekGowda-BN/Quantum)
- [Git-Music](https://github.com/VivekGowda-BN/Git-Music)
- [Shaadi.Math](https://github.com/VivekGowda-BN/Shaadi.Math)
- [Portfolio repository](https://github.com/VivekGowda-BN/VivekGowdaBN)

## Contact

For collaborations, product ideas, or interesting engineering challenges:

- Email: [vivekgowdabn444@gmail.com](mailto:vivekgowdabn444@gmail.com)
- LinkedIn: [vivek-gowda-bn](https://www.linkedin.com/in/vivek-gowda-bn)
- GitHub: [VivekGowda-BN](https://github.com/VivekGowda-BN)

## Repository status

This repository is the source for Vivek Gowda BN's personal portfolio. It does not currently include a license file; add the license that matches your intended sharing terms before accepting reuse or external contributions.

<div align="center">
  <br />
  <sub>Designed and developed by <strong>Vivek Gowda BN</strong>.</sub>
</div>
