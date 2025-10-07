"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
let currentTranslations = null;
const openWindows = [];
/** Supported languages */
const SUPPORTED_LANGUAGES = ['en', 'pt', 'es'];
/**
 * Checks if the window width is below a certain breakpoint to determine a mobile layout.
 * @returns {boolean} - Returns true if the viewport width is below 768px; otherwise false.
 */
function isMobileView() {
    return window.innerWidth < 1024;
}
/**
 * Starts the window resizing process.
 * Dynamically updates window dimensions and position as the mouse moves.
 */
function startResizing(event, windowElement, handleClass, initialWidth, initialHeight, initialX, initialY, initialLeft, initialTop) {
    const resize = (e) => {
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
            }
            else {
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
            }
            else {
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
function startDragging(event, windowElement, initialX, initialY, initialLeft, initialTop) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = windowElement.offsetWidth;
    const windowHeight = windowElement.offsetHeight;
    const moveWindow = (e) => {
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
function restoreFromMinimized(windowElement) {
    windowElement.style.width = windowElement.dataset.originalWidth || '';
    windowElement.style.height = windowElement.dataset.originalHeight || '';
    windowElement.style.left = windowElement.dataset.originalLeft || '';
    windowElement.style.top = windowElement.dataset.originalTop || '';
    windowElement.classList.remove('minimized');
}
/** Restore a maximized window to its original dimensions and position */
function restoreFromMaximized(windowElement) {
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
function minimizeWindow(windowElement, isMinimized, isMaximized) {
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
    }
    else if (isMinimized) {
        // Minimized => Normal
        restoreFromMinimized(windowElement);
        return { isMinimized: false, isMaximized };
    }
    else {
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
function maximizeWindow(windowElement, isMinimized, isMaximized) {
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
    }
    else if (isMaximized) {
        // Maximized => Normal
        restoreFromMaximized(windowElement);
        return { isMinimized, isMaximized: false };
    }
    else {
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
function applyDrag(windowElement) {
    const titleBar = windowElement.querySelector('.title-bar');
    titleBar === null || titleBar === void 0 ? void 0 : titleBar.addEventListener('mousedown', (event) => {
        const e = event;
        const initialX = e.clientX;
        const initialY = e.clientY;
        const initialLeft = windowElement.offsetLeft;
        const initialTop = windowElement.offsetTop;
        startDragging(e, windowElement, initialX, initialY, initialLeft, initialTop);
    });
}
/** Apply resizable behavior to a window */
function applyResize(windowElement) {
    const resizeHandles = windowElement.querySelectorAll('.resize-handle');
    resizeHandles.forEach((handle) => {
        handle.addEventListener('mousedown', (event) => {
            const e = event;
            const handleClass = e.target.classList;
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
 * Brings a window element to the front by bumping its z-index and focusing it.
 * @param {el} - The window HTMLElement to focus.
 */
function bringToFront(el) {
    var _a, _b;
    // Calculate biggest z-index and sums 1
    const maxZ = Array.from(document.querySelectorAll('.window'))
        .reduce((acc, w) => Math.max(acc, parseInt(getComputedStyle(w).zIndex || '1', 10) || 1), 1);
    el.style.zIndex = String(maxZ + 1);
    (_b = (_a = el).focus) === null || _b === void 0 ? void 0 : _b.call(_a);
}
/**
 * Create a new window using the base window template.
 * - title: The title of the new window.
 * - content: The HTML content to be placed inside the window's .content area.
 * - initialWidth, initialHeight: Dimensions for the window.
 * - options: To show/hide menu bar and min/max buttons.
 */
function createWindow(title, content, initialWidth = 600, initialHeight = 400, options = {}) {
    var _a;
    // If we are on mobile, remove any existing non-main windows
    if (isMobileView()) {
        const allWindows = document.querySelectorAll('.window');
        allWindows.forEach((window) => {
            // Skip the main window, the exit popup and the localization popup
            if (!window.classList.contains('main-window') && window.id !== 'exit-popup' && window.id !== 'localization-popup') {
                window.remove();
            }
        });
        // Clear the openWindows array except for "Program Manager"
        const indexOfMain = openWindows.indexOf('Program Manager');
        openWindows.splice(0, openWindows.length);
        if (indexOfMain !== -1) {
            // Put "Program Manager" back in the array
            openWindows.push('Program Manager');
        }
    }
    const { showMenuBar = true, showMinMax = true } = options;
    if (openWindows.includes(title)) {
        console.log(`A window with the title "${title}" is already open.`);
        return;
    }
    openWindows.push(title);
    const template = document.getElementById('window-template');
    const clone = template.content.cloneNode(true);
    const windowElement = clone.querySelector('.window');
    if (isMobileView()) {
        windowElement.classList.add('mobile-fullscreen-window');
    }
    const titleElement = windowElement.querySelector('.title');
    const contentElement = windowElement.querySelector('.content');
    const menuBar = windowElement.querySelector('.menu-bar');
    const minimizeButton = windowElement.querySelector('.controls .minimize');
    const maximizeButton = windowElement.querySelector('.controls .maximize');
    // If the user explicitly sets showMinMax = false, remove them
    if (!showMinMax) {
        minimizeButton === null || minimizeButton === void 0 ? void 0 : minimizeButton.remove();
        maximizeButton === null || maximizeButton === void 0 ? void 0 : maximizeButton.remove();
    }
    // Also remove them on mobile
    if (isMobileView()) {
        minimizeButton === null || minimizeButton === void 0 ? void 0 : minimizeButton.remove();
        maximizeButton === null || maximizeButton === void 0 ? void 0 : maximizeButton.remove();
    }
    const closeButton = windowElement.querySelector('.controls .close');
    if (titleElement)
        titleElement.textContent = title;
    if (contentElement)
        contentElement.innerHTML = content;
    if (!showMenuBar && menuBar) {
        menuBar.remove();
    }
    if (!showMinMax) {
        minimizeButton === null || minimizeButton === void 0 ? void 0 : minimizeButton.remove();
        maximizeButton === null || maximizeButton === void 0 ? void 0 : maximizeButton.remove();
    }
    windowElement.style.width = `${initialWidth}px`;
    windowElement.style.height = `${initialHeight}px`;
    let isMinimized = false;
    let isMaximized = false;
    minimizeButton === null || minimizeButton === void 0 ? void 0 : minimizeButton.addEventListener('click', () => {
        ({ isMinimized, isMaximized } = minimizeWindow(windowElement, isMinimized, isMaximized));
    });
    maximizeButton === null || maximizeButton === void 0 ? void 0 : maximizeButton.addEventListener('click', () => {
        ({ isMinimized, isMaximized } = maximizeWindow(windowElement, isMinimized, isMaximized));
    });
    closeButton.addEventListener('click', () => {
        if (!isMobileView()) {
            // DESKTOP: do the normal close behavior
            windowElement.remove();
            const index = openWindows.indexOf(title);
            if (index !== -1) {
                openWindows.splice(index, 1);
            }
        }
        else {
            // MOBILE: override close behavior
            if (title === 'Program Manager') {
                // IF main window, show exit popup, and Rick Roll if user confirms
                const exitPopup = document.getElementById('exit-popup');
                exitPopup.classList.remove('hidden');
            }
            else if (windowElement.classList.contains('project-details-window')) {
                // If a project detail window, remove it & open (or reopen) the Projects window
                windowElement.remove();
                const idx = openWindows.indexOf(title);
                if (idx !== -1) {
                    openWindows.splice(idx, 1);
                }
                // Reopen the Projects window
                loadProjects();
            }
            else {
                // Otherwise, just remove the window & go back to main window
                windowElement.remove();
                const idx = openWindows.indexOf(title);
                if (idx !== -1) {
                    openWindows.splice(idx, 1);
                }
            }
        }
    });
    // Set up menu actions if menu bar is present
    if (menuBar) {
        const menuAbout = menuBar.querySelector('#menu-about');
        const menuProjects = menuBar.querySelector('#menu-projects');
        const menuContact = menuBar.querySelector('#menu-contact');
        menuAbout === null || menuAbout === void 0 ? void 0 : menuAbout.addEventListener('click', () => {
            const aboutTemplate = document.getElementById('about-me-template');
            if (!aboutTemplate) {
                console.error('Template not found: about-me-template');
                return;
            }
            const aboutContent = aboutTemplate.content.querySelector('.content');
            if (!aboutContent) {
                console.error('Content not found in template: about-me-template');
                return;
            }
            createWindow('About Me', aboutContent.outerHTML, 1100, 600);
        });
        menuProjects === null || menuProjects === void 0 ? void 0 : menuProjects.addEventListener('click', loadProjects);
        menuContact === null || menuContact === void 0 ? void 0 : menuContact.addEventListener('click', () => {
            const contactTemplate = document.getElementById('contact-template');
            const contactContent = contactTemplate === null || contactTemplate === void 0 ? void 0 : contactTemplate.content.querySelector('.content');
            if (!contactContent) {
                console.error('Content not found in template: contact-template');
                return;
            }
            createWindow('Contact', contactContent.outerHTML, 460, 550);
            const form = document.getElementById('contact-form');
            const status = document.getElementById('form-status');
            // Initialize EmailJS for the contact form
            emailjs.init('X6AgiUWnj6pe7fYLf');
            form.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                if (status)
                    status.textContent = 'Sending...';
                try {
                    yield emailjs.sendForm('portfolio_contact', 'template_ebyt5cb', form);
                    if (status)
                        status.textContent = 'Message sent successfully!';
                    form.reset();
                }
                catch (error) {
                    if (status)
                        status.textContent = 'Failed to send message. Try again later.';
                    console.error('EmailJS error:', error);
                }
            }));
        });
    }
    windowElement.style.left = `${windowOffsetX}px`;
    windowElement.style.top = `${windowOffsetY}px`;
    // Update offsets for subsequent windows
    windowOffsetX += WINDOW_OFFSET_INCREMENT;
    windowOffsetY += WINDOW_OFFSET_INCREMENT;
    // Ensure new windows remain on-screen
    if (windowOffsetX > window.innerWidth - MIN_WINDOW_WIDTH)
        windowOffsetX = INITIAL_WINDOW_OFFSET_X;
    if (windowOffsetY > window.innerHeight - MIN_WINDOW_HEIGHT)
        windowOffsetY = INITIAL_WINDOW_OFFSET_Y;
    (_a = document.getElementById('program-manager')) === null || _a === void 0 ? void 0 : _a.appendChild(windowElement);
    // Set up a MutationObserver to track when the window is removed from the DOM
    const observer = new MutationObserver(() => {
        if (!document.body.contains(windowElement)) {
            const idx = openWindows.indexOf(title);
            if (idx !== -1)
                openWindows.splice(idx, 1);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Apply window behaviors
    applyDrag(windowElement);
    applyResize(windowElement);
    if (currentTranslations) {
        applyLocalization(currentTranslations);
    }
    return windowElement;
}
/** Sets up controls (minimize, maximize, close) for the main window and exit popup */
function setupProgramManagerControls() {
    const programManager = document.getElementById('program-manager');
    const mainWindow = programManager.querySelector('.window');
    const minimizeButton = mainWindow.querySelector('.controls .minimize');
    const maximizeButton = mainWindow.querySelector('.controls .maximize');
    const closeButton = mainWindow.querySelector('.controls .close');
    const exitPopup = document.getElementById('exit-popup');
    const exitYes = document.getElementById('exit-yes');
    const exitNo = document.getElementById('exit-no');
    let isMinimized = false;
    let isMaximized = false;
    minimizeButton.addEventListener('click', () => {
        ({ isMinimized, isMaximized } = minimizeWindow(mainWindow, isMinimized, isMaximized));
    });
    maximizeButton.addEventListener('click', () => {
        ({ isMinimized, isMaximized } = maximizeWindow(mainWindow, isMinimized, isMaximized));
    });
    closeButton.addEventListener('click', () => {
        console.log("Main window close button clicked!");
        exitPopup.classList.remove('hidden');
    });
    exitNo.addEventListener('click', () => {
        exitPopup.classList.add('hidden');
    });
    exitYes.addEventListener('click', () => {
        // Redirect user (simulating exiting the site)
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    });
    if (isMobileView()) {
        minimizeButton === null || minimizeButton === void 0 ? void 0 : minimizeButton.remove();
        maximizeButton === null || maximizeButton === void 0 ? void 0 : maximizeButton.remove();
    }
}
// Initialize main window controls
setupProgramManagerControls();
setupLocalizationControls();
/**
 * Open the About Me window via desktop icon or menu item.
 * Reuses the About Me template content.
 */
document.querySelectorAll('#menu-about, #icon-about').forEach((element) => {
    element.addEventListener('click', () => {
        const aboutTemplate = document.getElementById('about-me-template');
        if (!aboutTemplate) {
            console.error('Template not found: about-me-template');
            return;
        }
        const aboutContent = aboutTemplate.content.querySelector('.content');
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
        const contactTemplate = document.getElementById('contact-template');
        const contactContent = contactTemplate === null || contactTemplate === void 0 ? void 0 : contactTemplate.content.querySelector('.content');
        if (!contactContent) {
            console.error('Content not found in template: contact-template');
            return;
        }
        createWindow('Contact', contactContent.outerHTML, 460, 550);
        const form = document.getElementById('contact-form');
        const status = document.getElementById('form-status');
        emailjs.init('X6AgiUWnj6pe7fYLf');
        form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
            e.preventDefault();
            if (status)
                status.textContent = 'Sending...';
            try {
                yield emailjs.sendForm('portfolio_contact', 'template_ebyt5cb', form);
                if (status)
                    status.textContent = 'Message sent successfully!';
                form.reset();
            }
            catch (error) {
                if (status)
                    status.textContent = 'Failed to send message. Try again later.';
                console.error('EmailJS error:', error);
            }
        }));
    });
});
// Dynamic Project Data
let projects = [];
/**
 * Loads the localized projects dynamically.
 * @param {Record<string, any>} translations - The loaded translation object.
 */
function loadLocalizedProjects(translations) {
    projects = [
        {
            id: "jampaPortfolio",
            title: translations.projects.jampaPortfolio.title,
            summary: translations.projects.jampaPortfolio.summary,
            details: translations.projects.jampaPortfolio.details,
            image: "src/assets/projects/jampa_portfolio.png",
            github: "https://github.com/jampamatos/portfolio",
        },
        {
            id: "waiveOfTheFist",
            title: translations.projects.waveOfTheFist.title,
            summary: translations.projects.waveOfTheFist.summary,
            details: translations.projects.waveOfTheFist.details,
            image: "src/assets/projects/wave-of-the-fist.png",
            github: "https://github.com/jampamatos/wave_of_the_fist",
        },
        {
            id: "catsVsDogs",
            title: translations.projects.catsVsDogs.title,
            summary: translations.projects.catsVsDogs.summary,
            details: translations.projects.catsVsDogs.details,
            image: "src/assets/projects/cats_vs_dogs_tl.png",
            github: "https://github.com/jampamatos/cats_vs_dogs_tl",
        },
        {
            id: "flaskInvoice",
            title: translations.projects.flaskInvoice.title,
            summary: translations.projects.flaskInvoice.summary,
            details: translations.projects.flaskInvoice.details,
            image: "src/assets/projects/flask_invoice_parser.png",
            github: "https://github.com/jampamatos/CauzinPrecos",
        },
        {
            id: "rubyNotification",
            title: translations.projects.rubyNotification.title,
            summary: translations.projects.rubyNotification.summary,
            details: translations.projects.rubyNotification.details,
            image: "src/assets/projects/rails_notification_system.png",
            github: "https://github.com/jampamatos/beezen_alert_system",
        },
        {
            id: "dataEngineeringPortfolio",
            title: translations.projects.dataEngineeringPortfolio.title,
            summary: translations.projects.dataEngineeringPortfolio.summary,
            details: translations.projects.dataEngineeringPortfolio.details,
            image: "src/assets/projects/data_engineering_portfolio.png",
            github: "https://github.com/jampamatos/codecademy_stuff/tree/main/Data",
        },
        {
            id: "jampong",
            title: translations.projects.jampong.title,
            summary: translations.projects.jampong.summary,
            details: translations.projects.jampong.details,
            image: "src/assets/projects/jampong.png",
            github: "https://github.com/jampamatos/pong",
        },
        {
            id: "fiftyBird",
            title: translations.projects.fiftyBird.title,
            summary: translations.projects.fiftyBird.summary,
            details: translations.projects.fiftyBird.details,
            image: "src/assets/projects/fifty_bird.png",
            github: "https://github.com/jampamatos/flappy",
        },
        // Add more projects as needed
    ];
}
/**
 * Fetches and applies translations, including localized project data.
 * @param {string} language - The selected language.
 */
function applyLocalizedContent(language) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 1. Fetch new translations
            currentTranslations = yield fetchTranslations(language);
            if (currentTranslations) {
                // 2. Update projects array
                loadLocalizedProjects(currentTranslations);
                // 3. Apply text changes to the entire DOM
                applyLocalization(currentTranslations);
                // 4. If "Projects" is open, refresh it with the newly updated projects array
                if (openWindows.includes("Projects")) {
                    updateOpenProjectsWindow();
                }
            }
            console.log(`Localization applied: ${language}`);
        }
        catch (error) {
            console.error("Error applying localization:", error);
        }
    });
}
/** Updates open Project window to repopulate it with updated translations */
function updateOpenProjectsWindow() {
    const projectWindow = document.getElementById("projects-window");
    if (!projectWindow)
        return;
    // Update the window title from translations
    const titleElement = projectWindow.querySelector(".title");
    titleElement.textContent = (currentTranslations === null || currentTranslations === void 0 ? void 0 : currentTranslations.labels.projects) || "Projects";
    // Clear the grid
    const gridElement = projectWindow.querySelector(".project-grid");
    if (!gridElement)
        return;
    gridElement.innerHTML = "";
    // Re-append project items
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
    console.log("Projects window updated with new language.");
    // **New Code: Update Open Project Detail Windows**
    const openDetailWindows = document.querySelectorAll('.project-details-window');
    openDetailWindows.forEach((detailWin) => {
        const projectId = detailWin.getAttribute('data-project-id');
        if (!projectId)
            return;
        const project = projects.find(p => p.id === projectId);
        if (!project)
            return;
        const imageElement = detailWin.querySelector(".project-image");
        const titleElement = detailWin.querySelector("h3");
        const descriptionElement = detailWin.querySelector("p");
        const linkElement = detailWin.querySelector(".project-link");
        // Update the content with the new localized text
        if (imageElement) {
            imageElement.src = project.image;
            imageElement.alt = project.title;
        }
        if (titleElement) {
            titleElement.textContent = project.title;
        }
        if (descriptionElement) {
            descriptionElement.textContent = project.details;
        }
        if (linkElement) {
            linkElement.href = project.github;
        }
    });
    console.log("All open project detail windows updated with new language.");
}
/** Load the Projects window and dynamically append project items */
function loadProjects() {
    if (openWindows.includes('Projects')) {
        console.log("Projects window is already open.");
        return;
    }
    // Create a Projects window with an empty grid placeholder
    const newWindow = createWindow("Projects", '<div class="project-grid"></div>', 800, 600, { showMenuBar: true, showMinMax: true });
    if (!newWindow)
        return;
    // Set a stable ID or data attribute
    newWindow.setAttribute("id", "projects-window");
    // Find the newly created Projects window
    const windows = document.querySelectorAll('.window');
    const projectWindow = Array.from(windows).find(win => {
        var _a;
        const windowTitle = (_a = win.querySelector('.title')) === null || _a === void 0 ? void 0 : _a.textContent;
        return windowTitle === "Projects";
    });
    if (!projectWindow) {
        console.error("Projects window not found after creation.");
        return;
    }
    const gridElement = projectWindow.querySelector('.project-grid');
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
function openProjectDetails(project) {
    const existing = document.querySelector(`.project-details-window[data-project-id="${project.id}"]`);
    if (existing) {
        bringToFront(existing); // Focus/elevate existing window
        return;
    }
    const detailsTemplate = document.getElementById("project-details-template");
    const detailsFragment = detailsTemplate.content.cloneNode(true);
    const windowElement = detailsFragment.querySelector(".project-details-window");
    const imageElement = windowElement.querySelector(".project-image");
    const titleElement = windowElement.querySelector("h3");
    const descriptionElement = windowElement.querySelector("p");
    const linkElement = windowElement.querySelector(".project-link");
    // Populate the project detail fields
    imageElement.src = project.image;
    imageElement.alt = project.title;
    titleElement.textContent = project.title;
    descriptionElement.textContent = project.details;
    linkElement.href = project.github;
    // Assign the project ID to the window for future reference
    windowElement.setAttribute("data-project-id", project.id);
    const detailsContent = windowElement.querySelector('.project-details-content');
    // Create the project details window without menu bar or min/max buttons
    const newWindow = createWindow(project.title, detailsContent.outerHTML, 800, 500, { showMenuBar: false, showMinMax: false });
    if (newWindow) {
        newWindow.classList.add('project-details-window');
        newWindow.setAttribute("data-project-id", project.id); // Ensure the attribute is set
    }
}
/**
 * Fetches the JSON file containing translations for the specified language.
 * @param {string} language - The language code (e.g., 'en', 'es', 'pt').
 * @returns {Promise<any>} - A Promise resolving to the translation object.
 */
function fetchTranslations(language) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`src/locales/${language}.json`);
        if (!response.ok) {
            throw new Error(`Could not load ${language} translations.`);
        }
        return response.json();
    });
}
/**
 * Sets up the event listeners for localization functionality.
 * - Show the popup when the globe (🌍) button is clicked.
 * - Closes the popup on the "×" button.
 * - Fetches the chosen language's JSON file when a language button is clicked.
 */
function setupLocalizationControls() {
    // Get the "Localization button from the main window's controls
    const localizationButton = document.querySelector('.window.main-window .localization-button');
    // Get the #localization-popup and its close button
    const localizationPopup = document.getElementById('localization-popup');
    const popupCloseBtn = localizationPopup === null || localizationPopup === void 0 ? void 0 : localizationPopup.querySelector('.controls .close');
    // Show the popup when the localization button is clicked
    if (localizationButton) {
        localizationButton.addEventListener('click', () => {
            localizationPopup.classList.remove('hidden');
        });
    }
    // Hide popup on the popup's close button
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', () => {
            localizationPopup.classList.add('hidden');
        });
    }
    // Add click event to each language button
    const languageButtons = localizationPopup.querySelectorAll('.localization-option');
    languageButtons.forEach((button) => {
        button.addEventListener('click', (event) => __awaiter(this, void 0, void 0, function* () {
            const target = event.currentTarget;
            const lang = target.dataset.lang;
            // Attempt to apply localized content
            try {
                yield applyLocalizedContent(lang); // Reload everything dynamically
                localizationPopup.classList.add('hidden');
            }
            catch (error) {
                console.error('Error fetching translations:', error);
            }
        }));
    });
}
/**
 * Applies the specified translations to all elements with a [data-i18n] attribute.
 * @param {Record<string, any>} translations - The loaded translations object (from JSON).
 */
function applyLocalization(translations) {
    if (!translations) {
        return; // Immediately return if no translations
    }
    // Find all elements with the [data-i18n] attribute
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach((element) => {
        const keyPath = element.getAttribute('data-i18n');
        // Retrieve the translated text via the key path
        const textValue = getNestedValue(translations, keyPath);
        // If found, update textContent
        if (textValue) {
            element.innerHTML = textValue;
        }
    });
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach((element) => {
        const keyPath = element.getAttribute('data-i18n-placeholder');
        const textValue = getNestedValue(translations, keyPath);
        if (textValue) {
            element.placeholder = textValue;
        }
    });
}
/**
 * Safely retrieves a nested value from an object given a dot-notated path, e.g. "mainWindow.title".
 * @param {Record<string, any>} obj - The object containing translations.
 * @param {string} path - The dotted path string (e.g. "mainWindow.title").
 * @returns {string | undefined} - The nested value if found, otherwise undefined.
 */
function getNestedValue(obj, path) {
    let result = obj;
    const keys = path.split('.');
    for (const key of keys) {
        // If result is falsy or doesn't have this key, return undefined
        if (!result || !(key in result)) {
            return undefined;
        }
        result = result[key];
    }
    // We only want to return a string, otherwise undefined
    return typeof result === 'string' ? result : undefined;
}
/**
 * Detects the user's preferred language and matches it to the supported list.
 * Defaults to English if no match is found.
 * @returns {string} - The detected or default language.
 */
function detectUserLanguage() {
    const userLang = navigator.language.split('-')[0]; // Extract base language (e.g., "pt" from "pt-BR")
    return SUPPORTED_LANGUAGES.includes(userLang) ? userLang : 'en'; // Defaults to English
}
// Setup on load
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detectedLanguage = detectUserLanguage();
        yield applyLocalizedContent(detectedLanguage);
    }
    catch (error) {
        console.error("Error applying localization:", error);
    }
    const splashScreen = document.getElementById('splash-screen');
    const loadingMessage = document.getElementById('loading-message');
    // List of loading messages to cycle through
    const messages = [
        "Initializing Jampindows 98 Environment...",
        "Starting Very Modern UI...",
        "Loading Icons and Shortcuts...",
        "Connecting to the Webs...",
        "Syncing Nostalgia Levels...",
        "Ready to Explore!"
    ];
    let index = 0;
    const updateMessage = () => {
        if (loadingMessage) {
            loadingMessage.textContent = messages[index];
            index = (index + 1) % messages.length;
        }
    };
    const interval = setInterval(updateMessage, 1000);
    // Remove splash screen after 7 seconds
    if (splashScreen) {
        setTimeout(() => {
            clearInterval(interval);
            splashScreen.classList.add('hidden');
            setTimeout(() => splashScreen.remove(), 1000);
        }, 6000);
    }
}));
