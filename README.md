# Personal Portfolio

![Preview Image 1](https://github.com/Mubassim-Khan/Portfolio-Next.js/blob/main/assets/images/preview_1.png)

![Preview Image 2](https://github.com/Mubassim-Khan/Portfolio-Next.js/blob/main/assets/images/preview_2.png)

<div align="center">
    <img src="https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="next" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/Prisma-39827F?style=for-the-badge&logo=prisma&logoColor=white" alt="prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="postgresql" />
    <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white" alt="framer-motion" />
    <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=threedotjs&logoColor=white" alt="threejs" />
    <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="sass" />
</div>

## 📋 <a name="table">Table of Contents</a>

1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [License](#license)
7. [Contributing](#contributing)
8. [Contact](#contact)

## <a name="introduction">Introduction</a>

This repository contains the code for a premium, highly responsive personal portfolio and developer dashboard built with Next.js (App Router), Tailwind CSS, Framer Motion, and Prisma. The application features a split architecture optimized individually for desktop and mobile screen layouts.

## <a name="features">Features</a>

👉 **Responsive & Adaptive Layouts**: Individual `desktop` and `mobile` directory splits allow for layout-specific experiences, avoiding styling bloat and ensuring maximum performance.

👉 **Dynamic Skeleton Loading (Boneyard-js)**: Powered by `boneyard-js`, using custom configurations (`boneyard.config.json` and a registered bone system) for skeleton screens.

👉 **Audio feedback**: Integrated sound engine (`sound-engine.ts`) supplying interactive feedback (e.g. click effects) across UI actions.

👉 **Interactive Command Menu**: A custom mobile command menu allowing quick searches, actions, and toggles.

👉 **Aesthetic UI/UX Elements**: Beautiful features such as particle effects, displacement text, custom maps, charts (uptime, traffic, visitors), dark/light mode toggle, and pixel-perfect hover cards.

👉 **Dashboard & Analytics Suite**: Secure auth layouts (`app/desktop/dashboard`) with real-time stats tracking coding time, visitors, referrers, and project deployments.

👉 **Database Integration**: Prisma ORM with SQLite (or target DB) for tracking and persisting projects, API keys, and deployment logs.

## <a name="tech-stack">Tech Stack 🛠️</a>

- **Core**: [Next.js](https://nextjs.org/) (v16), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), CSS Modules, [Sass](https://sass-lang.com/)
- **Database / ORM**: [Prisma ORM](https://www.prisma.io/)
- **UI Components & Icons**: [Radix UI primitives](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion 12](https://motion.dev/), [GSAP](https://gsap.com/)
- **Interactive Skeletons**: [boneyard-js](https://www.npmjs.com/package/boneyard-js)
- **Charts / Maps**: Chart.js, D3.js, TopoJSON

## <a name="getting-started">Getting Started</a>

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Mubassim-Khan/Portfolio-Next.js.git
   ```

2. **Install project dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the root directory and configure your database and authentication details.

4. **Generate Prisma client:**

   ```bash
   npx prisma generate
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **View the project:**
   
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## <a name="project-structure">Project Structure</a>

The project is structured to differentiate between desktop and mobile devices:

```text
├── app/
│   ├── desktop/         # Desktop layout, dashboard pages, and analytics
│   └── mobile/          # Mobile layouts, contact, resume, and experiences
├── components/
│   ├── desktop/         # Desktop-specific components, charts, and sections
│   └── mobile/          # Mobile-specific UI elements, toggles, navigation
├── data/                # Data files, blogs details, and mobile projects list
├── lib/                 # Core utilities: sound engine, click effects, etc.
├── prisma/              # Prisma schema definition
├── src/bones/           # Registered skeleton layout configuration
└── boneyard.config.json # Boneyard configuration
```

## <a name="license">License</a>

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## <a name="contributing">Contributing</a>

Contributions to this project are welcome. If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## <a name="contact">Contact</a>

If you have any questions, suggestions, or feedback, you can reach out to:

- LinkedIn: [Mubassim Ahmed Khan](https://www.linkedin.com/in/mubassim)
- Email: [mubassimkhan@gmail.com](mailto:mubassimkhan@gmail.com)
