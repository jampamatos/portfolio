import { SUPPORTED_LANGUAGES } from './constants.js';
import { getCurrentTranslations } from './state.js';
export async function fetchTranslations(language) {
    const response = await fetch(`src/locales/${language}.json`);
    if (!response.ok) {
        throw new Error(`Could not load ${language} translations.`);
    }
    return response.json();
}
export function getNestedValue(obj, path) {
    let result = obj;
    for (const key of path.split('.')) {
        if (!result || typeof result !== 'object' || !(key in result)) {
            return undefined;
        }
        result = result[key];
    }
    return typeof result === 'string' ? result : undefined;
}
export function applyLocalization(root, translations) {
    root.querySelectorAll('[data-i18n]').forEach((element) => {
        const keyPath = element.getAttribute('data-i18n');
        if (!keyPath) {
            return;
        }
        const textValue = getNestedValue(translations, keyPath);
        if (textValue) {
            element.innerHTML = textValue;
        }
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const keyPath = element.getAttribute('data-i18n-placeholder');
        if (!keyPath) {
            return;
        }
        const textValue = getNestedValue(translations, keyPath);
        if (textValue) {
            element.placeholder = textValue;
        }
    });
}
export function applyCurrentLocalization(root) {
    const translations = getCurrentTranslations();
    if (translations) {
        applyLocalization(root, translations);
    }
}
export function getCurrentText(keyPath, fallback) {
    const translations = getCurrentTranslations();
    if (!translations) {
        return fallback;
    }
    return getNestedValue(translations, keyPath) ?? fallback;
}
export function detectUserLanguage() {
    const userLanguage = navigator.language.split('-')[0];
    return SUPPORTED_LANGUAGES.includes(userLanguage) ? userLanguage : 'en';
}
