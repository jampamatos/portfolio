import { maybeGetById, maybeQueryWithin } from './dom.js';
import { openAboutWindow } from './about.js';
import { openContactWindow } from './contact.js';
import { openProjectsWindow } from './projects.js';
export function bindDesktopTriggers() {
    maybeGetById('icon-about')?.addEventListener('click', openAboutWindow);
    maybeGetById('icon-projects')?.addEventListener('click', openProjectsWindow);
    maybeGetById('icon-contact')?.addEventListener('click', openContactWindow);
}
export function bindWindowMenu(windowElement) {
    if (windowElement.dataset.windowMenuBound === 'true') {
        return;
    }
    maybeQueryWithin(windowElement, '[data-window-action="about"]')?.addEventListener('click', openAboutWindow);
    maybeQueryWithin(windowElement, '[data-window-action="projects"]')?.addEventListener('click', openProjectsWindow);
    maybeQueryWithin(windowElement, '[data-window-action="contact"]')?.addEventListener('click', openContactWindow);
    windowElement.dataset.windowMenuBound = 'true';
}
