# Salmin Habibu Seif | Creative Portfolio

This repository contains the source code for the professional portfolio of Salmin Habibu Seif, a multidisciplinary creative and technologist. The portfolio is designed to showcase a diverse range of skills including 3D design, videography, graphic design, and coding, as well as philosophical writings.

## Project Overview

This is a modern, single-page application (SPA) built with React and TypeScript. It serves as a dynamic and interactive resume and project gallery. The primary goal is to present Salmin's work in a clean, professional, and aesthetically pleasing manner, while also reflecting his creative and technical capabilities. The site is fully responsive, animated, and designed for a seamless user experience.

## ✨ Features

-   **Fully Editable Content**: A password-protected Admin Panel allows for live editing of nearly all content across the site.
-   **Dynamic Homepage**: A striking hero section with a customizable background image, tagline, and description.
-   **About Page**: A detailed biography, a visualization of core skills, and a timeline of his professional journey, all manageable from the admin panel.
-   **Portfolio Page**: A filterable gallery showcasing projects across different categories.
-   **Writings Page**: An immersive, article-style reading experience for long-form essays.
-   **Contact Page**: A functional contact form and editable contact information.
-   **Persistent Changes (Locally)**: All content changes made in the Admin Panel are saved to the browser's `localStorage`, making them persist across sessions on the same device.
-   **Dynamic PDF Generation**: The "Download CV" button on the About page generates a professional PDF on-the-fly using the latest information from the site.
-   **Responsive Design**: A mobile-first design that ensures a flawless experience on desktops, tablets, and smartphones.
-   **Smooth Animations**: Engaging and subtle animations powered by Framer Motion to enhance user interaction.

## 🛠️ Technologies Used

-   **Frontend Framework**: [React](https://reactjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **State Management**: React Context API
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

## ✏️ How to Update Content

All site content is managed through the built-in Admin Panel. Manual code changes are no longer necessary for content updates.

1.  **Access the Admin Panel**:
    -   Click the **Settings (cog) icon** in the main navigation header.
    -   Enter the admin password. The default password is `admin`.

2.  **Edit Content**:
    -   Use the navigation tabs within the Admin Panel to select the page or section you wish to edit (e.g., Home, About, Contact).
    -   Modify the text, upload new images, or change settings in the provided forms.
    -   Click the "Save" button for that section. Your changes will be applied immediately and saved for your next visit.

3.  **Change Password**:
    -   Navigate to the "Settings" tab in the Admin Panel.
    -   Enter and confirm your new password to secure your admin access.

The initial, default content for the site is located in `data/defaultContent.ts`. The site will use this content as a fallback if no custom content has been saved yet.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to fork, modify, and use it for your own purposes.

## 👤 Author & Credits

**Salmin Habibu Seif**

-   **Email**: [salminhabibu2000@gmail.com](mailto:salminhabibu2000@gmail.com)
-   **Phone**: +255 692 156 182
