import { SUPPORTED_LANGUAGES } from './constants.js';
import { getCurrentTranslations } from './state.js';
import type { TranslationDictionary } from './types.js';

export async function fetchTranslations(language: string): Promise<TranslationDictionary> {
    const response = await fetch(`src/locales/${language}.json`);

    if (!response.ok) {
        throw new Error(`Could not load ${language} translations.`);
    }

    return response.json() as Promise<TranslationDictionary>;
}

export function getNestedValue(obj: TranslationDictionary, path: string): string | undefined {
    let result: unknown = obj;

    for (const key of path.split('.')) {
        if (!result || typeof result !== 'object' || !(key in result)) {
            return undefined;
        }

        result = (result as Record<string, unknown>)[key];
    }

    return typeof result === 'string' ? result : undefined;
}

export function applyLocalization(root: ParentNode, translations: TranslationDictionary): void {
    root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
        const keyPath = element.getAttribute('data-i18n');
        if (!keyPath) {
            return;
        }

        const textValue = getNestedValue(translations, keyPath);
        if (textValue) {
            element.innerHTML = textValue;
        }
    });

    root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((element) => {
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

export function applyCurrentLocalization(root: ParentNode): void {
    const translations = getCurrentTranslations();
    if (translations) {
        applyLocalization(root, translations);
    }
}

export function getCurrentText(keyPath: string, fallback: string): string {
    const translations = getCurrentTranslations();
    if (!translations) {
        return fallback;
    }

    return getNestedValue(translations, keyPath) ?? fallback;
}

export function detectUserLanguage(): string {
    const userLanguage = navigator.language.split('-')[0];
    return SUPPORTED_LANGUAGES.includes(userLanguage as (typeof SUPPORTED_LANGUAGES)[number]) ? userLanguage : 'en';
}
