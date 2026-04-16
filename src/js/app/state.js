import { INITIAL_WINDOW_OFFSET_X, INITIAL_WINDOW_OFFSET_Y, MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH, WINDOW_OFFSET_INCREMENT, } from './constants.js';
const managedWindows = new Map();
export const appState = {
    windowOffsetX: INITIAL_WINDOW_OFFSET_X,
    windowOffsetY: INITIAL_WINDOW_OFFSET_Y,
    currentTranslations: null,
    projectCatalog: [],
    projects: [],
};
export function getCurrentTranslations() {
    return appState.currentTranslations;
}
export function setCurrentTranslations(translations) {
    appState.currentTranslations = translations;
}
export function getProjects() {
    return appState.projects;
}
export function setProjects(projects) {
    appState.projects = projects;
}
export function getProjectCatalog() {
    return appState.projectCatalog;
}
export function setProjectCatalog(projectCatalog) {
    appState.projectCatalog = projectCatalog;
}
export function getManagedWindow(key) {
    const windowElement = managedWindows.get(key);
    if (windowElement && !windowElement.isConnected) {
        managedWindows.delete(key);
        return null;
    }
    return windowElement ?? null;
}
export function registerManagedWindow(key, windowElement) {
    managedWindows.set(key, windowElement);
}
export function unregisterManagedWindow(key) {
    managedWindows.delete(key);
}
export function listManagedWindows() {
    return Array.from(managedWindows.entries()).flatMap(([key, windowElement]) => {
        if (!windowElement.isConnected) {
            managedWindows.delete(key);
            return [];
        }
        return [windowElement];
    });
}
export function getNextWindowPosition(viewportWidth, viewportHeight) {
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
