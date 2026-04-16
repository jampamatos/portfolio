import {
    SPLASH_HIDE_DELAY_MS,
    SPLASH_MESSAGES,
    SPLASH_MESSAGE_INTERVAL_MS,
} from './constants.js';
import { maybeGetById } from './dom.js';

export function startSplashScreen(): void {
    const splashScreen = maybeGetById<HTMLElement>('splash-screen');
    const loadingMessage = maybeGetById<HTMLElement>('loading-message');

    if (!splashScreen || !loadingMessage) {
        return;
    }

    let messageIndex = 0;

    const intervalId = window.setInterval(() => {
        loadingMessage.textContent = SPLASH_MESSAGES[messageIndex];
        messageIndex = (messageIndex + 1) % SPLASH_MESSAGES.length;
    }, SPLASH_MESSAGE_INTERVAL_MS);

    window.setTimeout(() => {
        window.clearInterval(intervalId);
        splashScreen.classList.add('hidden');
        window.setTimeout(() => splashScreen.remove(), 1000);
    }, SPLASH_HIDE_DELAY_MS);
}
