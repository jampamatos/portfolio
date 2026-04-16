import { TITLE_KEYS, WINDOW_KEYS } from './constants.js';
import { applyCurrentLocalization, getCurrentText } from './localization.js';
import { bindWindowMenu } from './menus.js';
import { getTemplateElement } from './templates.js';
import { createWindow } from './windows.js';

export function openAboutWindow(): void {
    const content = getTemplateElement<HTMLElement>('about-me-template', '.about-me-content');
    applyCurrentLocalization(content);

    const windowElement = createWindow({
        key: WINDOW_KEYS.about,
        title: getCurrentText(TITLE_KEYS.about, 'About Me'),
        titleKey: TITLE_KEYS.about,
        content,
        initialWidth: 1100,
        initialHeight: 600,
    });

    if (!windowElement) {
        return;
    }

    bindWindowMenu(windowElement);
    applyCurrentLocalization(windowElement);
}
