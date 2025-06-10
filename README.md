# JAMPA MATOS WIN98 PORTFOLIO

Welcome to my portfolio website! This project is a Windows 98-inspired interactive interface designed to showcase my personal and professional projects. It represents not only my technical skills but also my passion for creative challenges and nostalgic design. Explore the site to learn more about me, my work, and my journey into the world of technology.

## Table of Contents

- [JAMPA MATOS WIN98 PORTFOLIO](#jampa-matos-win98-portfolio)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
    - [Upcoming Features](#upcoming-features)
  - [Technologies Used](#technologies-used)
    - [Planned Additions](#planned-additions)
  - [Live Demo](#live-demo)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Local Setup](#local-setup)
    - [Docker Setup (Optional)](#docker-setup-optional)
  - [Future Enhancements](#future-enhancements)
  - [Credits](#credits)
  - [License](#license)

## Introduction

This portfolio website was created to showcase my personal and professional projects as I transition into a career in technology. After realizing the importance of having a dedicated space to present my work, I decided to utilize my existing domain ([jampamatos.jampa.br](https://jampamatos.jampa.br)) to build a portfolio that reflects my skills, creativity, and passion for technology.

The design is inspired by the Windows 98 interface, evoking nostalgia for the era when my interest in technology first began. This theme also presented an exciting technical challenge, as I implemented features such as movable, resizable, and minimizable windows to mimic the classic operating system environment.

Whether you're here to learn more about my background, explore my projects, or simply enjoy the retro aesthetics, I hope this portfolio provides an engaging experience.

## Features

This portfolio website is designed with a Windows 98-inspired interface, offering the following features:

- **Interactive Windows UI**: Movable, resizable, minimizable, and maximizable windows, mimicking the classic Windows 98 experience.
- **Dynamic Splash Screen**: A custom Windows-inspired splash screen with rotating loading messages, creating a nostalgic boot sequence while the site loads.
- **Responsive Design**: The site is optimized for desktop, tablet, and mobile devices, ensuring the layout adapts gracefully to different screen sizes.
- **Dynamic Project Display**: Projects are dynamically loaded and displayed with detailed information, including images, summaries, and links to GitHub repositories.
- **Interactive Desktop Icons**: Desktop icons for key sections: About Me, Projects, and Contact, allowing easy navigation.
- **Email Integration**: A fully functional contact form powered by EmailJS for sending messages directly from the website.
- **Custom Styling and Modularity**: Modular codebase with reusable components for easier maintenance and extensibility.
- **Localization for English, Portuguese, and Spanish Languages**: The site is now completely localized, with translations for Portuguese, English, and Spanish languages, It also checks for the browser's language and localizes based on that (defaults to English).

### Upcoming Features

The portfolio is a work in progress, and future updates will include:

- A dedicated Games section with live demos of my LöVE2D projects.
- A mock MS-DOS prompt as an Easter egg.

## Technologies Used

This portfolio leverages a variety of modern and retro-inspired tools and technologies:

- **Frontend Development**: HTML, CSS, and TypeScript for creating an interactive and visually appealing user interface.
- **Email Integration**: [EmailJS](https://www.emailjs.com/) for sending messages directly through the contact form.
- **Modular Design**: A clean, modular codebase to promote reusability and easier maintenance.
- **Containerization**: Docker for consistent development and testing environments.

### Planned Additions

- **LöVE2D Integration**: Adding live, playable demos of my game projects using `love.js` to bring LöVE2D games to the web.

## Live Demo

The portfolio website is live and accessible at [jampamatos.jampa.br](https://www.jampamatos.jampa.br). It is hosted on **GitHub Pages**, ensuring high availability and seamless performance.

Feel free to explore the site to learn more about me, view my projects, and get in touch through the interactive contact form!

## Setup Instructions

While the portfolio is live and can be accessed directly at [jampamatos.jampa.br](https://www.jampamatos.jampa.br), you can also set it up locally for development or testing purposes. Follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (for managing dependencies)
- [Docker](https://www.docker.com/) (optional, for containerized setup)
- A modern web browser

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/jampamatos/portfolio.git
   cd portfolio
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript files (if needed):
   ```bash
   npm run build
   ```

4. Start a local development server:
   ```bash
   npm run start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

### Docker Setup (Optional)

1. Ensure Docker is installed and running on your system.
2. Build and start the Docker container:
   ```bash
   docker-compose up --build
   ```
3. Open your browser and navigate to the URL provided by Docker (usually `http://localhost`).

With these steps, you can test or modify the project locally to explore its features or contribute improvements!

## Future Enhancements

This portfolio is an ongoing project, with exciting features and improvements planned for the future:

1. **Games Section**: Include a dedicated section with live demos of my LöVE2D games, playable directly on the website using `love.js`.
2. **Easter Egg**: Create a mock MS-DOS prompt as a fun, hidden feature for users to discover.

These enhancements will continue to build on the nostalgic theme while adding modern functionality and interactivity. Stay tuned for updates!

## Credits

This portfolio wouldn't have been possible without the inspiration and contributions from the following resources:

- **Icons**: Classic Windows 98 icons sourced from [Alex Meub's Win98 Icons](https://win98icons.alexmeub.com/).
- **Badges**: Custom badges created using [Shields.io](https://shields.io/).
- **Email Integration**: Contact form functionality powered by [EmailJS](https://www.emailjs.com/).
- **Splash Screen Design**: Inspired by the boot sequence of Windows 98, with creative input for loading animations.
- **Inspiration**: The nostalgia of the Windows 98 interface and the fun challenge of recreating its interactive features.

A huge thank you to the creators of these resources for making this project possible!

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this project in accordance with the terms of the license.

See the [LICENSE](./LICENSE) file for more details.
