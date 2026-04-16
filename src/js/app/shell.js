import { EXIT_REDIRECT_URL } from './constants.js';
import { getById, maybeQueryWithin, queryWithin } from './dom.js';
import { applyDrag, applyResize, bringToFront, isMobileView, maximizeWindow, minimizeWindow } from './windows.js';
function initializeMainWindowGeometry(mainWindow) {
    const computedStyle = window.getComputedStyle(mainWindow);
    if (!mainWindow.style.width) {
        mainWindow.style.width = computedStyle.width;
    }
    if (!mainWindow.style.height) {
        mainWindow.style.height = computedStyle.height;
    }
    if (!mainWindow.style.left || !mainWindow.style.top) {
        if (isMobileView()) {
            mainWindow.style.left = computedStyle.left;
            mainWindow.style.top = computedStyle.top;
            return;
        }
        const windowWidth = parseFloat(computedStyle.width);
        const windowHeight = parseFloat(computedStyle.height);
        const centeredLeft = Math.max((window.innerWidth - windowWidth) / 2, 0);
        const centeredTop = Math.max((window.innerHeight - windowHeight) / 2, 0);
        mainWindow.style.left = `${centeredLeft}px`;
        mainWindow.style.top = `${centeredTop}px`;
    }
}
export function setupProgramManagerControls() {
    const programManager = getById('program-manager');
    const mainWindow = queryWithin(programManager, '.window.main-window');
    const minimizeButton = queryWithin(mainWindow, '.controls .minimize');
    const maximizeButton = queryWithin(mainWindow, '.controls .maximize');
    const closeButton = queryWithin(mainWindow, '.controls .close');
    const exitPopup = getById('exit-popup');
    const exitPopupClose = maybeQueryWithin(exitPopup, '.controls .close');
    const exitYes = getById('exit-yes');
    const exitNo = getById('exit-no');
    let windowState = {
        isMinimized: false,
        isMaximized: false,
    };
    initializeMainWindowGeometry(mainWindow);
    applyDrag(mainWindow);
    applyResize(mainWindow);
    mainWindow.addEventListener('mousedown', () => {
        bringToFront(mainWindow);
    });
    minimizeButton.addEventListener('click', () => {
        windowState = minimizeWindow(mainWindow, windowState.isMinimized, windowState.isMaximized);
    });
    maximizeButton.addEventListener('click', () => {
        windowState = maximizeWindow(mainWindow, windowState.isMinimized, windowState.isMaximized);
    });
    closeButton.addEventListener('click', () => {
        exitPopup.classList.remove('hidden');
        bringToFront(exitPopup);
    });
    exitNo.addEventListener('click', () => {
        exitPopup.classList.add('hidden');
    });
    exitPopupClose?.addEventListener('click', () => {
        exitPopup.classList.add('hidden');
    });
    exitYes.addEventListener('click', () => {
        window.location.href = EXIT_REDIRECT_URL;
    });
    if (isMobileView()) {
        minimizeButton.remove();
        maximizeButton.remove();
    }
}
export function setupLocalizationControls(onLanguageSelect) {
    const localizationButton = queryWithin(document, '.window.main-window .localization-button');
    const localizationPopup = getById('localization-popup');
    const popupCloseButton = maybeQueryWithin(localizationPopup, '.controls .close');
    const languageButtons = localizationPopup.querySelectorAll('.localization-option');
    localizationButton.addEventListener('click', () => {
        localizationPopup.classList.remove('hidden');
        bringToFront(localizationPopup);
    });
    popupCloseButton?.addEventListener('click', () => {
        localizationPopup.classList.add('hidden');
    });
    languageButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const language = button.dataset.lang;
            if (!language) {
                return;
            }
            try {
                await onLanguageSelect(language);
                localizationPopup.classList.add('hidden');
            }
            catch (error) {
                console.error('Error fetching translations:', error);
            }
        });
    });
}
