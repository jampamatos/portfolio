import { bindDesktopTriggers } from './app/menus.js';
import { applyLocalization, detectUserLanguage, fetchTranslations, getNestedValue, } from './app/localization.js';
import { buildProjects, fetchProjectCatalog, refreshProjectWindows } from './app/projects.js';
import { setupLocalizationControls, setupProgramManagerControls } from './app/shell.js';
import { startSplashScreen } from './app/splash.js';
import { getProjectCatalog, setCurrentTranslations, setProjectCatalog, setProjects } from './app/state.js';
import { syncManagedWindowTitles } from './app/windows.js';
async function ensureProjectCatalogLoaded() {
    if (getProjectCatalog().length > 0) {
        return;
    }
    setProjectCatalog(await fetchProjectCatalog());
}
async function applyLocalizedContent(language) {
    await ensureProjectCatalogLoaded();
    const translations = await fetchTranslations(language);
    const projectCatalog = getProjectCatalog();
    setCurrentTranslations(translations);
    setProjects(buildProjects(projectCatalog, translations));
    applyLocalization(document, translations);
    syncManagedWindowTitles((titleKey) => getNestedValue(translations, titleKey));
    refreshProjectWindows();
    document.documentElement.lang = language;
    console.log(`Localization applied: ${language}`);
}
async function initializeApplication() {
    try {
        await ensureProjectCatalogLoaded();
        await applyLocalizedContent(detectUserLanguage());
    }
    catch (error) {
        console.error('Error applying localization:', error);
    }
    startSplashScreen();
}
setupProgramManagerControls();
bindDesktopTriggers();
setupLocalizationControls(applyLocalizedContent);
window.addEventListener('load', () => {
    void initializeApplication();
});
