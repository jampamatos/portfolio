declare const emailjs: any;

/** Constants for layout, sizing, and UI behavior */
const MIN_WINDOW_WIDTH = 230;
const MIN_WINDOW_HEIGHT = 200;
const WINDOW_OFFSET_INCREMENT = 20;
const MAXIMIZE_OFFSET = 4; // Offset to avoid scrollbars when maximized
const INITIAL_WINDOW_OFFSET_X = 20;
const INITIAL_WINDOW_OFFSET_Y = 20;

/** Global state tracking */
let windowOffsetX = INITIAL_WINDOW_OFFSET_X;
let windowOffsetY = INITIAL_WINDOW_OFFSET_Y;
const openWindows: string[] = [];

/** Project Interface representing each project's data */
interface Project {
    title: string;
    summary: string;
    details: string;
    image: string;
    github: string;
}

/**
 * Starts the window resizing process.
 * Dynamically updates window dimensions and position as the mouse moves.
 */
function startResizing(
    event: MouseEvent,
    windowElement: HTMLElement,
    handleClass: DOMTokenList,
    initialWidth: number,
    initialHeight: number,
    initialX: number,
    initialY: number,
    initialLeft: number,
    initialTop: number
) {
    const resize = (e: MouseEvent) => {
        const deltaX = e.clientX - initialX;
        const deltaY = e.clientY - initialY;

        let newWidth = initialWidth;
        let newHeight = initialHeight;
        let newLeft = initialLeft;
        let newTop = initialTop;

        // Horizontal resizing logic
        if (handleClass.contains('right') || handleClass.contains('top-right') || handleClass.contains('bottom-right')) {
            newWidth = Math.max(initialWidth + deltaX, MIN_WINDOW_WIDTH);
        }

        if (handleClass.contains('left') || handleClass.contains('top-left') || handleClass.contains('bottom-left')) {
            const potentialWidth = initialWidth - deltaX;
            if (potentialWidth >= MIN_WINDOW_WIDTH) {
                newWidth = potentialWidth;
                newLeft = initialLeft + deltaX;
            } else {
                newWidth = MIN_WINDOW_WIDTH;
                newLeft = initialLeft + (initialWidth - MIN_WINDOW_WIDTH);
            }
        }

        // Vertical resizing logic
        if (handleClass.contains('bottom') || handleClass.contains('bottom-left') || handleClass.contains('bottom-right')) {
            newHeight = Math.max(initialHeight + deltaY, MIN_WINDOW_HEIGHT);
        }

        if (handleClass.contains('top') || handleClass.contains('top-left') || handleClass.contains('top-right')) {
            const potentialHeight = initialHeight - deltaY;
            if (potentialHeight >= MIN_WINDOW_HEIGHT) {
                newHeight = potentialHeight;
                newTop = initialTop + deltaY;
            } else {
                newHeight = MIN_WINDOW_HEIGHT;
                newTop = initialTop + (initialHeight - MIN_WINDOW_HEIGHT);
            }
        }

        // Apply new dimensions and position
        windowElement.style.width = `${newWidth}px`;
        windowElement.style.height = `${newHeight}px`;
        windowElement.style.left = `${newLeft}px`;
        windowElement.style.top = `${newTop}px`;
    };

    const stopResize = () => {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    };

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);

    event.preventDefault();
}

/**
 * Starts the window dragging process.
 * Updates the window position as the mouse moves, keeping it within viewport bounds.
 */
function startDragging(
    event: MouseEvent,
    windowElement: HTMLElement,
    initialX: number,
    initialY: number,
    initialLeft: number,
    initialTop: number
) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = windowElement.offsetWidth;
    const windowHeight = windowElement.offsetHeight;

    const moveWindow = (e: MouseEvent) => {
        const deltaX = e.clientX - initialX;
        const deltaY = e.clientY - initialY;

        const newLeft = Math.min(Math.max(0, initialLeft + deltaX), viewportWidth - windowWidth);
        const newTop = Math.min(Math.max(0, initialTop + deltaY), viewportHeight - windowHeight);

        windowElement.style.left = `${newLeft}px`;
        windowElement.style.top = `${newTop}px`;
    };

    const stopMoving = () => {
        document.removeEventListener('mousemove', moveWindow);
        document.removeEventListener('mouseup', stopMoving);
    };

    document.addEventListener('mousemove', moveWindow);
    document.addEventListener('mouseup', stopMoving);

    event.preventDefault();
}

/** Restore a minimized window to its original dimensions and position */
function restoreFromMinimized(windowElement: HTMLElement) {
    windowElement.style.width = windowElement.dataset.originalWidth || '';
    windowElement.style.height = windowElement.dataset.originalHeight || '';
    windowElement.style.left = windowElement.dataset.originalLeft || '';
    windowElement.style.top = windowElement.dataset.originalTop || '';
    windowElement.classList.remove('minimized');
}

/** Restore a maximized window to its original dimensions and position */
function restoreFromMaximized(windowElement: HTMLElement) {
    windowElement.style.width = windowElement.dataset.originalWidth || '';
    windowElement.style.height = windowElement.dataset.originalHeight || '';
    windowElement.style.left = windowElement.dataset.originalLeft || '';
    windowElement.style.top = windowElement.dataset.originalTop || '';
}

/**
 * Minimize or restore a window.
 * If the window is normal, minimize it.
 * If minimized, restore it.
 * If maximized, first restore to normal, then minimize.
 */
function minimizeWindow(windowElement: HTMLElement, isMinimized: boolean, isMaximized: boolean): { isMinimized: boolean; isMaximized: boolean } {
    if (!isMinimized && !isMaximized) {
        // Normal => Minimized
        windowElement.dataset.originalWidth = windowElement.style.width;
        windowElement.dataset.originalHeight = windowElement.style.height;
        windowElement.dataset.originalLeft = windowElement.style.left;
        windowElement.dataset.originalTop = windowElement.style.top;

        windowElement.style.width = '';
        windowElement.style.height = '';
        windowElement.classList.add('minimized');
        return { isMinimized: true, isMaximized: false };
    } else if (isMinimized) {
        // Minimized => Normal
        restoreFromMinimized(windowElement);
        return { isMinimized: false, isMaximized };
    } else {
        // Maximized => Minimized
        restoreFromMaximized(windowElement);
        windowElement.dataset.originalWidth = windowElement.style.width;
        windowElement.dataset.originalHeight = windowElement.style.height;
        windowElement.dataset.originalLeft = windowElement.style.left;
        windowElement.dataset.originalTop = windowElement.style.top;

        windowElement.style.width = '';
        windowElement.style.height = '';
        windowElement.classList.add('minimized');
        return { isMinimized: true, isMaximized: false };
    }
}

/**
 * Maximize or restore a window.
 * If normal, maximize it.
 * If maximized, restore to normal.
 * If minimized, restore to normal first, then maximize.
 */
function maximizeWindow(windowElement: HTMLElement, isMinimized: boolean, isMaximized: boolean): { isMinimized: boolean; isMaximized: boolean } {
    if (!isMaximized && !isMinimized) {
        // Normal => Maximized
        windowElement.dataset.originalWidth = windowElement.style.width;
        windowElement.dataset.originalHeight = windowElement.style.height;
        windowElement.dataset.originalLeft = windowElement.style.left;
        windowElement.dataset.originalTop = windowElement.style.top;

        windowElement.style.left = '0px';
        windowElement.style.top = '0px';
        windowElement.style.width = `${window.innerWidth - MAXIMIZE_OFFSET}px`;
        windowElement.style.height = `${window.innerHeight - MAXIMIZE_OFFSET}px`;

        return { isMinimized, isMaximized: true };
    } else if (isMaximized) {
        // Maximized => Normal
        restoreFromMaximized(windowElement);
        return { isMinimized, isMaximized: false };
    } else {
        // Minimized => Maximized
        restoreFromMinimized(windowElement);
        windowElement.dataset.originalWidth = windowElement.style.width;
        windowElement.dataset.originalHeight = windowElement.style.height;
        windowElement.dataset.originalLeft = windowElement.style.left;
        windowElement.dataset.originalTop = windowElement.style.top;

        windowElement.style.left = '0px';
        windowElement.style.top = '0px';
        windowElement.style.width = `${window.innerWidth - MAXIMIZE_OFFSET}px`;
        windowElement.style.height = `${window.innerHeight - MAXIMIZE_OFFSET}px`;

        return { isMinimized: false, isMaximized: true };
    }
}

/** Apply draggable behavior to a window */
function applyDrag(windowElement: HTMLElement) {
    const titleBar = windowElement.querySelector('.title-bar') as HTMLElement;
    titleBar?.addEventListener('mousedown', (event) => {
        const e = event as MouseEvent;
        const initialX = e.clientX;
        const initialY = e.clientY;
        const initialLeft = windowElement.offsetLeft;
        const initialTop = windowElement.offsetTop;
        startDragging(e, windowElement, initialX, initialY, initialLeft, initialTop);
    });
}

/** Apply resizable behavior to a window */
function applyResize(windowElement: HTMLElement) {
    const resizeHandles = windowElement.querySelectorAll('.resize-handle');
    resizeHandles.forEach((handle) => {
        handle.addEventListener('mousedown', (event) => {
            const e = event as MouseEvent;
            const handleClass = (e.target as HTMLElement).classList;

            const initialWidth = windowElement.offsetWidth;
            const initialHeight = windowElement.offsetHeight;
            const initialX = e.clientX;
            const initialY = e.clientY;
            const initialLeft = windowElement.offsetLeft;
            const initialTop = windowElement.offsetTop;

            startResizing(e, windowElement, handleClass, initialWidth, initialHeight, initialX, initialY, initialLeft, initialTop);
        });
    });
}

/**
 * Create a new window using the base window template.
 * - title: The title of the new window.
 * - content: The HTML content to be placed inside the window's .content area.
 * - initialWidth, initialHeight: Dimensions for the window.
 * - options: To show/hide menu bar and min/max buttons.
 */
function createWindow(
    title: string, 
    content: string, 
    initialWidth = 600, 
    initialHeight = 400, 
    options: { showMenuBar?: boolean; showMinMax?: boolean } = {}
) {
    const { showMenuBar = true, showMinMax = true } = options;

    if (openWindows.includes(title)) {
        console.log(`A window with the title "${title}" is already open.`);
        return;
    }

    openWindows.push(title);

    const template = document.getElementById('window-template') as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as HTMLElement;

    const windowElement = clone.querySelector('.window') as HTMLElement;
    const titleElement = windowElement.querySelector('.title') as HTMLElement;
    const contentElement = windowElement.querySelector('.content') as HTMLElement;
    const menuBar = windowElement.querySelector('.menu-bar') as HTMLElement;
    const minimizeButton = windowElement.querySelector('.controls .minimize') as HTMLElement;
    const maximizeButton = windowElement.querySelector('.controls .maximize') as HTMLElement;
    const closeButton = windowElement.querySelector('.controls .close') as HTMLElement;

    if (titleElement) titleElement.textContent = title;
    if (contentElement) contentElement.innerHTML = content;

    if (!showMenuBar && menuBar) {
        menuBar.remove();
    }

    if (!showMinMax) {
        minimizeButton?.remove();
        maximizeButton?.remove();
    }

    windowElement.style.width = `${initialWidth}px`;
    windowElement.style.height = `${initialHeight}px`;

    let isMinimized = false;
    let isMaximized = false;

    minimizeButton?.addEventListener('click', () => {
        ({ isMinimized, isMaximized } = minimizeWindow(windowElement, isMinimized, isMaximized));
    });

    maximizeButton?.addEventListener('click', () => {
        ({ isMinimized, isMaximized } = maximizeWindow(windowElement, isMinimized, isMaximized));
    });

    closeButton.addEventListener('click', () => {
        windowElement.remove();
        const index = openWindows.indexOf(title);
        if (index !== -1) {
            openWindows.splice(index, 1);
        }
    });

    // Set up menu actions if menu bar is present
    if (menuBar) {
        const menuAbout = menuBar.querySelector('#menu-about') as HTMLElement;
        const menuProjects = menuBar.querySelector('#menu-projects') as HTMLElement;
        const menuContact = menuBar.querySelector('#menu-contact') as HTMLElement;

        menuAbout?.addEventListener('click', () => {
            const aboutTemplate = document.getElementById('about-me-template') as HTMLTemplateElement;
            if (!aboutTemplate) {
                console.error('Template not found: about-me-template');
                return;
            }

            const aboutContent = aboutTemplate.content.querySelector('.content') as HTMLElement;
            if (!aboutContent) {
                console.error('Content not found in template: about-me-template');
                return;
            }

            createWindow('About Me', aboutContent.outerHTML, 1100, 600);
        });

        menuProjects?.addEventListener('click', loadProjects);

        menuContact?.addEventListener('click', () => {
            const contactTemplate = document.getElementById('contact-template') as HTMLTemplateElement;
            const contactContent = contactTemplate?.content.querySelector('.content') as HTMLElement;

            if (!contactContent) {
                console.error('Content not found in template: contact-template');
                return;
            }

            createWindow('Contact', contactContent.outerHTML, 560, 515);

            const form = document.getElementById('contact-form') as HTMLFormElement;
            const status = document.getElementById('form-status') as HTMLElement;

            // Initialize EmailJS for the contact form
            emailjs.init('X6AgiUWnj6pe7fYLf'); 

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (status) status.textContent = 'Sending...';

                try {
                    await emailjs.sendForm('portfolio_contact', 'template_ebyt5cb', form);
                    if (status) status.textContent = 'Message sent successfully!';
                    form.reset();
                } catch (error) {
                    if (status) status.textContent = 'Failed to send message. Try again later.';
                    console.error('EmailJS error:', error);
                }
            });
        });
    }

    windowElement.style.left = `${windowOffsetX}px`;
    windowElement.style.top = `${windowOffsetY}px`;

    // Update offsets for subsequent windows
    windowOffsetX += WINDOW_OFFSET_INCREMENT;
    windowOffsetY += WINDOW_OFFSET_INCREMENT;

    // Ensure new windows remain on-screen
    if (windowOffsetX > window.innerWidth - MIN_WINDOW_WIDTH) windowOffsetX = INITIAL_WINDOW_OFFSET_X;
    if (windowOffsetY > window.innerHeight - MIN_WINDOW_HEIGHT) windowOffsetY = INITIAL_WINDOW_OFFSET_Y;

    document.getElementById('program-manager')?.appendChild(windowElement);

    applyDrag(windowElement);
    applyResize(windowElement);
}

/** Sets up controls (minimize, maximize, close) for the main window and exit popup */
function setupProgramManagerControls() {
    const programManager = document.getElementById('program-manager') as HTMLElement;
    const mainWindow = programManager.querySelector('.window') as HTMLElement;
    const minimizeButton = mainWindow.querySelector('.controls .minimize') as HTMLElement;
    const maximizeButton = mainWindow.querySelector('.controls .maximize') as HTMLElement;
    const closeButton = mainWindow.querySelector('.controls .close') as HTMLElement;

    const exitPopup = document.getElementById('exit-popup') as HTMLElement;
    const exitYes = document.getElementById('exit-yes') as HTMLElement;
    const exitNo = document.getElementById('exit-no') as HTMLElement;

    let isMinimized = false;
    let isMaximized = false;

    minimizeButton.addEventListener('click', () => {
        ({ isMinimized, isMaximized } = minimizeWindow(mainWindow, isMinimized, isMaximized));
    });

    maximizeButton.addEventListener('click', () => {
        ({ isMinimized, isMaximized } = maximizeWindow(mainWindow, isMinimized, isMaximized));
    });

    closeButton.addEventListener('click', () => {
        exitPopup.classList.remove('hidden');
    });

    exitNo.addEventListener('click', () => {
        exitPopup.classList.add('hidden');
    });

    exitYes.addEventListener('click', () => {
        // Redirect user (simulating exiting the site)
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    });
}

// Initialize main window controls
setupProgramManagerControls();

/** 
 * Open the About Me window via desktop icon or menu item. 
 * Reuses the About Me template content.
 */
document.querySelectorAll('#menu-about, #icon-about').forEach((element) => {
    element.addEventListener('click', () => {
        const aboutTemplate = document.getElementById('about-me-template') as HTMLTemplateElement;
        if (!aboutTemplate) {
            console.error('Template not found: about-me-template');
            return;
        }

        const aboutContent = aboutTemplate.content.querySelector('.content') as HTMLElement;
        if (!aboutContent) {
            console.error('Content not found in template: about-me-template');
            return;
        }

        createWindow('About Me', aboutContent.outerHTML, 1100, 600);
    });
});

/** 
 * Open the Projects window via desktop icon or menu item. 
 * Dynamically loads projects into the project grid.
 */
document.querySelectorAll('#menu-projects, #icon-projects').forEach((element) => {
    element.addEventListener('click', loadProjects);
});

/** 
 * Open the Contact window via desktop icon or menu item. 
 * Sets up the contact form and EmailJS integration.
 */
document.querySelectorAll('#menu-contact, #icon-contact').forEach((element) => {
    element.addEventListener('click', () => {
        const contactTemplate = document.getElementById('contact-template') as HTMLTemplateElement;
        const contactContent = contactTemplate?.content.querySelector('.content') as HTMLElement;
        if (!contactContent) {
            console.error('Content not found in template: contact-template');
            return;
        }

        createWindow('Contact', contactContent.outerHTML, 560, 515);

        const form = document.getElementById('contact-form') as HTMLFormElement;
        const status = document.getElementById('form-status') as HTMLElement;

        emailjs.init('X6AgiUWnj6pe7fYLf');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (status) status.textContent = 'Sending...';

            try {
                await emailjs.sendForm('portfolio_contact', 'template_ebyt5cb', form);
                if (status) status.textContent = 'Message sent successfully!';
                form.reset();
            } catch (error) {
                if (status) status.textContent = 'Failed to send message. Try again later.';
                console.error('EmailJS error:', error);
            }
        });
    });
});

/** Mock Data for Projects */
const projects: Project[] = [
    {
        title: "Wave of the Fist (Incomplete)",
        summary: "A 16-bit style beat 'em up game with multiplayer support for 1-4 players.",
        details: "This project focuses on creating a retro-inspired beat 'em up game in Unity. Features include cooperative and versus modes, progressive difficulty, and stage hazards. The game was developed using modular code and includes mechanics like dodging, running, and combo-based attacks.",
        image: "src/assets/projects/wave-of-the-fist.png",
        github: "https://github.com/jampamatos/wave_of_the_fist",
    },
    {
        title: "Cats vs Dogs Transfer Learning",
        summary: "A deep learning project classifying images of cats and dogs using transfer learning.",
        details: "This project implements transfer learning to classify images of cats and dogs. It showcases skills in TensorFlow and deep learning, leveraging pre-trained models for efficient training and high accuracy.",
        image: "src/assets/projects/cats_vs_dogs_tl.png",
        github: "https://github.com/jampamatos/cats_vs_dogs_tl",
    },
    {
        title: "Flask XML Invoice Parser",
        summary: "A Flask app for calculating costs and selling prices based on XML invoice data.",
        details: "This application parses XML invoices, calculates costs, and determines selling prices. It was deployed on Heroku and uses Python for backend logic.",
        image: "src/assets/projects/flask_invoice_parser.png",
        github: "https://github.com/jampamatos/CauzinPrecos",
    },
    {
        title: "Ruby on Rails Notification System",
        summary: "A notification system developed as part of a coding challenge.",
        details: "This project demonstrates backend skills using Ruby on Rails, implementing an efficient and scalable notification system.",
        image: "src/assets/projects/rails_notification_system.png",
        github: "https://github.com/jampamatos/beezen_alert_system",
    },
    {
        title: "Data Engineering Portfolio",
        summary: "A collection of data engineering projects showcasing Python and PySpark skills.",
        details: "This portfolio includes projects like analyzing bike rental data, Stack Overflow survey insights, automated pipeline processing, and Wikipedia clickstream analysis using PySpark.",
        image: "src/assets/projects/data_engineering_portfolio.png",
        github: "https://github.com/jampamatos/codecademy_stuff/tree/main/Data",
    },
    {
        title: "JamPong!",
        summary: "A fun Pong-inspired game developed in LöVE2D.",
        details: "This project explores procedural game design and animation in LöVE2D, building on the fundamentals of classic Pong with enhancements.",
        image: "src/assets/projects/jampong.png",
        github: "https://github.com/jampamatos/pong",
    },
    {
        title: "Fifty Bird",
        summary: "A Flappy Bird-inspired game focusing on procedural generation.",
        details: "Developed in LöVE2D, this game highlights procedural generation and sprite animation, showcasing classic arcade-style mechanics.",
        image: "src/assets/projects/fifty_bird.png",
        github: "https://github.com/jampamatos/pong",
    },
    // Add more projects as needed
];

/** Load the Projects window and dynamically append project items */
function loadProjects() {
    if (openWindows.includes('Projects')) {
        console.log("Projects window is already open.");
        return;
    }

    // Create a Projects window with an empty grid placeholder
    createWindow("Projects", '<div class="project-grid"></div>', 800, 600, { showMenuBar: true, showMinMax: true });

    // Find the newly created Projects window
    const windows = document.querySelectorAll('.window');
    const projectWindow = Array.from(windows).find(win => {
        const windowTitle = win.querySelector('.title')?.textContent;
        return windowTitle === "Projects";
    }) as HTMLElement;

    if (!projectWindow) {
        console.error("Projects window not found after creation.");
        return;
    }

    const gridElement = projectWindow.querySelector('.project-grid') as HTMLElement;

    // Append project items to the grid
    projects.forEach((project) => {
        const projectItem = document.createElement("div");
        projectItem.classList.add("grid-item");

        const projectImage = document.createElement("img");
        projectImage.src = project.image;
        projectImage.alt = project.title;
        projectImage.style.width = "100%";

        const projectTitle = document.createElement("h4");
        projectTitle.textContent = project.title;

        const projectSummary = document.createElement("p");
        projectSummary.textContent = project.summary;

        projectItem.appendChild(projectImage);
        projectItem.appendChild(projectTitle);
        projectItem.appendChild(projectSummary);

        // Open project details on click
        projectItem.addEventListener("click", () => openProjectDetails(project));

        gridElement.appendChild(projectItem);
    });
}

/** Open a Project Details window for a specific project */
function openProjectDetails(project: Project) {
    if (openWindows.includes(project.title)) {
        console.log(`Window for project "${project.title}" already open.`);
        return;
    }

    const detailsTemplate = document.getElementById("project-details-template") as HTMLTemplateElement;
    const detailsFragment = detailsTemplate.content.cloneNode(true) as DocumentFragment;
    const windowElement = detailsFragment.querySelector(".project-details-window") as HTMLElement;

    const imageElement = windowElement.querySelector(".project-image") as HTMLImageElement;
    const titleElement = windowElement.querySelector("h3") as HTMLElement;
    const descriptionElement = windowElement.querySelector("p") as HTMLElement;
    const linkElement = windowElement.querySelector(".project-link") as HTMLAnchorElement;

    // Populate the project detail fields
    imageElement.src = project.image;
    imageElement.alt = project.title;
    titleElement.textContent = project.title;
    descriptionElement.textContent = project.details;
    linkElement.href = project.github;

    const detailsContent = windowElement.querySelector('.project-details-content') as HTMLElement;

    // Create the project details window without menu bar or min/max buttons
    createWindow(project.title, detailsContent.outerHTML, 800, 500, { showMenuBar: false, showMinMax: false });
}
