# Salmin Habibu Seif | Creative Portfolio

This repository contains the source code for the professional portfolio of Salmin Habibu Seif, a multidisciplinary creative and technologist. The portfolio is designed to showcase a diverse range of skills including 3D design, videography, graphic design, and coding, as well as philosophical writings.

## Project Overview

This is a modern, single-page application (SPA) built with React and TypeScript. It serves as a dynamic and interactive resume and project gallery. The primary goal is to present Salmin's work in a clean, professional, and aesthetically pleasing manner, while also reflecting his creative and technical capabilities. The site is fully responsive, animated, and designed for a seamless user experience.

## ✨ Features

-   **Home Page**: A striking hero section that introduces Salmin and his multidisciplinary focus.
-   **About Page**: A detailed biography, a visualization of core skills, a timeline of his professional journey, and a dynamic CV download feature.
-   **Portfolio Page**: A filterable gallery showcasing projects across different categories like 3D Modeling, Graphic Design, and Videography.
-   **Writings Page**: An immersive, article-style reading experience for long-form essays, currently featuring "The Nature of the Self." Includes a reading progress bar and scroll-based animations.
-   **Contact Page**: A functional contact form and direct contact information.
-   **Dynamic PDF Generation**: The "Download CV" button on the About page generates a professional PDF on-the-fly using the latest information from the site.
-   **Responsive Design**: A mobile-first design that ensures a flawless experience on desktops, tablets, and smartphones.
-   **Smooth Animations**: Engaging and subtle animations powered by Framer Motion to enhance user interaction.

## 🛠️ Technologies Used

-   **Frontend Framework**: [React](https://reactjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN) with custom inline styles.
-   **Routing**: [React Router DOM](https://reactrouter.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

## 🚀 Setup and Installation

This project is a static React application that does not require a complex build process. To run it locally, you'll need a simple local server.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Serve the project:**
    Since there are no Node.js dependencies to install, you can use any simple HTTP server. One of the easiest ways is using the `serve` package.

    -   If you have Node.js installed, you can run:
        ```bash
        npx serve
        ```
    -   Alternatively, if you have Python installed, you can use its built-in server:
        ```bash
        # For Python 3
        python -m http.server

        # For Python 2
        python -m SimpleHTTPServer
        ```

3.  **Open in browser:**
    The server will provide a local URL (e.g., `http://localhost:3000` or `http://localhost:8000`). Open this URL in your web browser to view the portfolio.

## ☁️ Deployment

Deploying this static site is straightforward. You can use any static hosting service.

**Recommended Services**: [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), [GitHub Pages](https://pages.github.com/).

### Deploying with Vercel (Example)

1.  **Sign up or log in** to your Vercel account.
2.  **Connect your Git repository** where the portfolio code is hosted.
3.  **Configure the project**: Vercel will automatically detect that it's a static site. You do not need to specify a build command or an output directory. The default settings should work perfectly.
4.  **Deploy**: Click the "Deploy" button. Your site will be live in minutes.

## 📂 File Structure Overview

The project follows a component-based architecture for better organization and scalability.

```
/
├── components/         # Reusable React components (Header, Footer, ProjectCard, etc.)
├── data/               # Data files for content, like writings
│   └── writings.ts     # Content for the 'Writings' page, including the essay
├── pages/              # Page-level components (Home, About, Portfolio, etc.)
├── App.tsx             # Main application component with routing logic
├── constants.ts        # Centralized data (Nav links, projects, skills, timeline)
├── index.html          # The main HTML entry point, loads fonts and scripts
├── index.tsx           # The root of the React application
├── metadata.json       # Project metadata
├── README.md           # This file
└── types.ts            # TypeScript type definitions for the project
```

-   The content for the essay "The Nature of the Self" is located in `data/writings.ts`. It is structured for easy reading and future expansion.

## ✏️ How to Update Content

All major content is centralized in `constants.ts` and `data/writings.ts` to make updates simple and code-free.

-   **To update your skills or professional journey (for About page & CV):**
    -   Open `constants.ts`.
    -   Modify the `SKILLS` or `TIMELINE` arrays with your new information. The PDF CV will automatically reflect these changes.

-   **To add or modify a project:**
    -   Open `constants.ts`.
    -   Find the `PROJECTS` array.
    -   Add a new project object or edit an existing one. Ensure the image URL is valid.

-   **To add a new essay or writing:**
    -   Open `data/writings.ts`.
    -   Create a new `Writing` object following the structure of `THE_NATURE_OF_THE_SELF`.
    -   Add this new object to the `WRITINGS` array.
    -   *Note: You may need to update the logic in `pages/Writings.tsx` to display multiple writings if you add more than one.*

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to fork, modify, and use it for your own purposes.

## 👤 Author & Credits

**Salmin Habibu Seif**

-   **Email**: [salminhabibu2000@gmail.com](mailto:salminhabibu2000@gmail.com)
-   **Phone**: +255 692 156 182
```