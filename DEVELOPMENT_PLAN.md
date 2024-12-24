
# Windows 3.11 Portfolio Development Plan

This file serves as a guide and checklist for the development of the Windows 3.11-inspired portfolio. Follow the steps below to ensure everything is organized and completed systematically.

---

## **Setup and Initial Organization**

- [X] Create the project directory: `win311-portfolio`.
- [X] Initialize a Git repository in the project directory.
- [X] Create an empty GitHub repository and link it to the local project.
- [X] Set up GitHub Projects (Kanban board) for task management.
- [X] Install Docker and Docker Compose on the development machine.
- [X] Set up WSL with all necessary dependencies:
  - [X] Node.js and npm.
  - [X] Docker.
  - [X] Editor integration (e.g., VS Code).
- [X] Add `.gitignore` to exclude unnecessary files (e.g., `node_modules`, Docker files).

---

## **Containerization**

### **Docker**

- [X] Create a `Dockerfile` to containerize the development environment.
- [X] Add a `docker-compose.yml` for easier management.
- [X] Test the containerized environment locally.

---

## **Backlog Creation**

- [X] Create the initial backlog in GitHub Projects.
  - **To Do**:
    - [X] Set up HTML/CSS for the Program Manager layout.
    - [X] Create CSS styles for Windows 3.11 aesthetic.
    - [X] Add logic to open/close/minimize/maximize windows.
    - [X] Design icons and sections for "Main".
  - **In Progress**:
    - [X] Add interactivity to the terminal (MS-DOS simulator).
    - [X] Implement navigation between sections.
  - **Done**:
    - [X] Ensure main layout and navigation is functional.

---

## **Development**

### **Phase 1: Layout**

- [X] Create the `index.html` file and set up the basic HTML structure.
- [X] Add a basic CSS file to define the layout and retro aesthetic.
- [X] Set up the "Program Manager" window and the "Main" section.
- [X] Add placeholders for icons (About Me, Projects, Contact, etc.).

#### **Phase 2: Interactivity**

- [X] Write JavaScript to handle opening and closing windows.
- [X] Implement minimize and maximize functionality.
- [X] Add animations or transitions to mimic Windows 3.11 behavior.

### **Phase 2.1: Content Creation**

- [X] Create content for the "About Me" page
- [X] Create content for the "Contact" page
- [X] Create the "Projects" page

### **Phase 2.2: Starting Windows Splash Screen**

- [ ] Create "splash screen" to simulate starting Windows as the site loads.
- [ ] Add little chimes when "Windows" starts

### **Phase 3: MS-DOS Simulator**

- [ ] Create a terminal simulator with a retro design (black background, green text).
- [ ] Add commands for:
  - [ ] `ABOUT` (information about you).
  - [ ] `PROJECTS` (list of projects with links to GitHub).
  - [ ] `CONTACT` (links to email, LinkedIn, and GitHub).
  - [ ] Easter eggs: `MATRIX`, `RICKROLL`, etc.
  - [ ] `HELP` (list available commands).
  - [ ] `CLEAR` (clear the terminal screen).
  - [ ] `EXIT` (close the terminal).

### **Phase 4: Games**

- [ ] Add PONG
- [ ] Add Fifty Bird

---

## **Responsiveness**

### **Phase 1: Basic Adaptation**

- [X] Use media queries to adjust the layout for tablets and mobile devices.
- [X] Remove maximize/minimize buttons for small screens.

### **Phase 2: Testing and Refinements**

- [X] Test the site on different devices (desktop, tablet, mobile).
- [X] Refine the layout to ensure a consistent experience across screen sizes.

---

## **Localization**

### **Phase 1: Language Selection**

- [ ] Add a language selector (PT, EN, ES) in the Program Manager.
- [ ] Use Local Storage or URL parameters to store the user's language preference.

### **Phase 2: Translations**

- [ ] Create JSON or JS objects with all translations.
- [ ] Implement dynamic content loading based on the selected language.

### **Phase 3: Testing**

- [ ] Test all site sections in Portuguese, English, and Spanish.
- [ ] Ensure the scrapbook and terminal commands also adapt to the selected language.
- [ ] Check layout responsiveness for different languages.

---

## **Deployment**

- [X] Deploy the site to GitHub Pages or Vercel.
- [X] Verify that all functionalities work in production.

---

## **Documentation**

### **README.md**

- [ ] Write a detailed README for the project:
  - [ ] Project description and goals.
  - [ ] Instructions to run locally (with and without Docker).
  - [ ] Features and Easter eggs.
  - [ ] Links to live site and portfolio sections.

### **Final Review**

- [ ] Review all files for consistency.
- [ ] Remove this checklist from the root directory once the project is complete.
- [ ] Celebrate! 🎉
