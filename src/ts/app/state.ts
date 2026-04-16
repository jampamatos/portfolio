import {
    INITIAL_WINDOW_OFFSET_X,
    INITIAL_WINDOW_OFFSET_Y,
    MIN_WINDOW_HEIGHT,
    MIN_WINDOW_WIDTH,
    WINDOW_OFFSET_INCREMENT,
} from './constants.js';
import type { Project, ProjectCatalogEntry, TranslationDictionary } from './types.js';

const managedWindows = new Map<string, HTMLElement>();

export const appState = {
    windowOffsetX: INITIAL_WINDOW_OFFSET_X,
    windowOffsetY: INITIAL_WINDOW_OFFSET_Y,
    currentTranslations: null as TranslationDictionary | null,
    projectCatalog: [] as ProjectCatalogEntry[],
    projects: [] as Project[],
};

export function getCurrentTranslations(): TranslationDictionary | null {
    return appState.currentTranslations;
}

export function setCurrentTranslations(translations: TranslationDictionary | null): void {
    appState.currentTranslations = translations;
}

export function getProjects(): Project[] {
    return appState.projects;
}

export function setProjects(projects: Project[]): void {
    appState.projects = projects;
}

export function getProjectCatalog(): ProjectCatalogEntry[] {
    return appState.projectCatalog;
}

export function setProjectCatalog(projectCatalog: ProjectCatalogEntry[]): void {
    appState.projectCatalog = projectCatalog;
}

export function getManagedWindow(key: string): HTMLElement | null {
    const windowElement = managedWindows.get(key);

    if (windowElement && !windowElement.isConnected) {
        managedWindows.delete(key);
        return null;
    }

    return windowElement ?? null;
}

export function registerManagedWindow(key: string, windowElement: HTMLElement): void {
    managedWindows.set(key, windowElement);
}

export function unregisterManagedWindow(key: string): void {
    managedWindows.delete(key);
}

export function listManagedWindows(): HTMLElement[] {
    return Array.from(managedWindows.entries()).flatMap(([key, windowElement]) => {
        if (!windowElement.isConnected) {
            managedWindows.delete(key);
            return [];
        }

        return [windowElement];
    });
}

export function getNextWindowPosition(viewportWidth: number, viewportHeight: number): { left: number; top: number } {
    const position = {
        left: appState.windowOffsetX,
        top: appState.windowOffsetY,
    };

    appState.windowOffsetX += WINDOW_OFFSET_INCREMENT;
    appState.windowOffsetY += WINDOW_OFFSET_INCREMENT;

    if (appState.windowOffsetX > viewportWidth - MIN_WINDOW_WIDTH) {
        appState.windowOffsetX = INITIAL_WINDOW_OFFSET_X;
    }

    if (appState.windowOffsetY > viewportHeight - MIN_WINDOW_HEIGHT) {
        appState.windowOffsetY = INITIAL_WINDOW_OFFSET_Y;
    }

    return position;
}
