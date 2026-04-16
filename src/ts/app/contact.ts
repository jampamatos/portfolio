declare const emailjs: {
    init: (publicKey: string) => void;
    sendForm: (serviceId: string, templateId: string, form: HTMLFormElement) => Promise<unknown>;
};

import {
    EMAILJS_PUBLIC_KEY,
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    TITLE_KEYS,
    WINDOW_KEYS,
} from './constants.js';
import { maybeQueryWithin } from './dom.js';
import { applyCurrentLocalization, getCurrentText } from './localization.js';
import { bindWindowMenu } from './menus.js';
import { getTemplateElement } from './templates.js';
import { createWindow } from './windows.js';

let emailInitialized = false;

function ensureEmailInitialized(): void {
    if (!emailInitialized) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        emailInitialized = true;
    }
}

function setupContactForm(windowElement: HTMLElement): void {
    if (windowElement.dataset.contactFormBound === 'true') {
        return;
    }

    const form = maybeQueryWithin<HTMLFormElement>(windowElement, '#contact-form');
    const statusMessage = maybeQueryWithin<HTMLElement>(windowElement, '#status-message');

    if (!form) {
        return;
    }

    ensureEmailInitialized();
    windowElement.dataset.contactFormBound = 'true';

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (statusMessage) {
            statusMessage.textContent = 'Sending...';
        }

        try {
            await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);

            if (statusMessage) {
                statusMessage.textContent = 'Message sent successfully!';
            }

            form.reset();
        } catch (error) {
            if (statusMessage) {
                statusMessage.textContent = 'Failed to send message. Try again later.';
            }

            console.error('EmailJS error:', error);
        }
    });
}

export function openContactWindow(): void {
    const content = getTemplateElement<HTMLElement>('contact-template', '.contact-content');
    applyCurrentLocalization(content);

    const windowElement = createWindow({
        key: WINDOW_KEYS.contact,
        title: getCurrentText(TITLE_KEYS.contact, 'Contact'),
        titleKey: TITLE_KEYS.contact,
        content,
        initialWidth: 460,
        initialHeight: 550,
    });

    if (!windowElement) {
        return;
    }

    bindWindowMenu(windowElement);
    applyCurrentLocalization(windowElement);
    setupContactForm(windowElement);
}
