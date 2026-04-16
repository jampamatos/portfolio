import { maybeGetById, maybeQueryWithin } from './dom.js';
import { openAboutWindow } from './about.js';
import { openContactWindow } from './contact.js';
import { openProjectsWindow } from './projects.js';

export function bindDesktopTriggers(): void {
    maybeGetById<HTMLElement>('icon-about')?.addEventListener('click', openAboutWindow);
    maybeGetById<HTMLElement>('icon-projects')?.addEventListener('click', openProjectsWindow);
    maybeGetById<HTMLElement>('icon-contact')?.addEventListener('click', openContactWindow);
}

export function bindWindowMenu(windowElement: HTMLElement): void {
    if (windowElement.dataset.windowMenuBound === 'true') {
        return;
    }

    maybeQueryWithin<HTMLElement>(windowElement, '[data-window-action="about"]')?.addEventListener('click', openAboutWindow);
    maybeQueryWithin<HTMLElement>(windowElement, '[data-window-action="projects"]')?.addEventListener('click', openProjectsWindow);
    maybeQueryWithin<HTMLElement>(windowElement, '[data-window-action="contact"]')?.addEventListener('click', openContactWindow);

    windowElement.dataset.windowMenuBound = 'true';
}
