import {
    MAXIMIZE_OFFSET,
    MIN_WINDOW_HEIGHT,
    MIN_WINDOW_WIDTH,
    MOBILE_BREAKPOINT,
} from './constants.js';
import { getById, maybeQueryWithin, queryWithin, replaceNodeContent } from './dom.js';
import {
    getManagedWindow,
    getNextWindowPosition,
    listManagedWindows,
    registerManagedWindow,
    unregisterManagedWindow,
} from './state.js';
import type { ManagedWindowOptions, WindowState } from './types.js';

export function isMobileView(): boolean {
    return window.innerWidth < MOBILE_BREAKPOINT;
}

function startResizing(
    event: MouseEvent,
    windowElement: HTMLElement,
    handleClass: DOMTokenList,
    initialWidth: number,
    initialHeight: number,
    initialX: number,
    initialY: number,
    initialLeft: number,
    initialTop: number
): void {
    const resize = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - initialX;
        const deltaY = moveEvent.clientY - initialY;

        let newWidth = initialWidth;
        let newHeight = initialHeight;
        let newLeft = initialLeft;
        let newTop = initialTop;

        if (handleClass.contains('right') || handleClass.contains('top-right') || handleClass.contains('bottom-right')) {
            newWidth = Math.max(initialWidth + deltaX, MIN_WINDOW_WIDTH);
        }

        if (handleClass.contains('left') || handleClass.contains('top-left') || handleClass.contains('bottom-left')) {
            const potentialWidth = initialWidth - deltaX;

            if (potentialWidth >= MIN_WINDOW_WIDTH) {
                newWidth = potentialWidth;
                newLeft = initialLeft + deltaX;
            } else {
                newWidth = MIN_WINDOW_WIDTH;
                newLeft = initialLeft + (initialWidth - MIN_WINDOW_WIDTH);
            }
        }

        if (handleClass.contains('bottom') || handleClass.contains('bottom-left') || handleClass.contains('bottom-right')) {
            newHeight = Math.max(initialHeight + deltaY, MIN_WINDOW_HEIGHT);
        }

        if (handleClass.contains('top') || handleClass.contains('top-left') || handleClass.contains('top-right')) {
            const potentialHeight = initialHeight - deltaY;

            if (potentialHeight >= MIN_WINDOW_HEIGHT) {
                newHeight = potentialHeight;
                newTop = initialTop + deltaY;
            } else {
                newHeight = MIN_WINDOW_HEIGHT;
                newTop = initialTop + (initialHeight - MIN_WINDOW_HEIGHT);
            }
        }

        windowElement.style.width = `${newWidth}px`;
        windowElement.style.height = `${newHeight}px`;
        windowElement.style.left = `${newLeft}px`;
        windowElement.style.top = `${newTop}px`;
    };

    const stopResize = () => {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    };

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    event.preventDefault();
}

function startDragging(
    event: MouseEvent,
    windowElement: HTMLElement,
    initialX: number,
    initialY: number,
    initialLeft: number,
    initialTop: number
): void {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = windowElement.offsetWidth;
    const windowHeight = windowElement.offsetHeight;

    const moveWindow = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - initialX;
        const deltaY = moveEvent.clientY - initialY;

        const newLeft = Math.min(Math.max(0, initialLeft + deltaX), viewportWidth - windowWidth);
        const newTop = Math.min(Math.max(0, initialTop + deltaY), viewportHeight - windowHeight);

        windowElement.style.left = `${newLeft}px`;
        windowElement.style.top = `${newTop}px`;
    };

    const stopMoving = () => {
        document.removeEventListener('mousemove', moveWindow);
        document.removeEventListener('mouseup', stopMoving);
    };

    document.addEventListener('mousemove', moveWindow);
    document.addEventListener('mouseup', stopMoving);
    event.preventDefault();
}

function restoreFromMinimized(windowElement: HTMLElement): void {
    windowElement.style.width = windowElement.dataset.originalWidth || '';
    windowElement.style.height = windowElement.dataset.originalHeight || '';
    windowElement.style.left = windowElement.dataset.originalLeft || '';
    windowElement.style.top = windowElement.dataset.originalTop || '';
    windowElement.classList.remove('minimized');
}

function restoreFromMaximized(windowElement: HTMLElement): void {
    windowElement.style.width = windowElement.dataset.originalWidth || '';
    windowElement.style.height = windowElement.dataset.originalHeight || '';
    windowElement.style.left = windowElement.dataset.originalLeft || '';
    windowElement.style.top = windowElement.dataset.originalTop || '';
}

export function minimizeWindow(windowElement: HTMLElement, isMinimized: boolean, isMaximized: boolean): WindowState {
    if (!isMinimized && !isMaximized) {
        windowElement.dataset.originalWidth = windowElement.style.width;
        windowElement.dataset.originalHeight = windowElement.style.height;
        windowElement.dataset.originalLeft = windowElement.style.left;
        windowElement.dataset.originalTop = windowElement.style.top;
        windowElement.style.width = '';
        windowElement.style.height = '';
        windowElement.classList.add('minimized');
        return { isMinimized: true, isMaximized: false };
    }

    if (isMinimized) {
        restoreFromMinimized(windowElement);
        return { isMinimized: false, isMaximized };
    }

    restoreFromMaximized(windowElement);
    windowElement.dataset.originalWidth = windowElement.style.width;
    windowElement.dataset.originalHeight = windowElement.style.height;
    windowElement.dataset.originalLeft = windowElement.style.left;
    windowElement.dataset.originalTop = windowElement.style.top;
    windowElement.style.width = '';
    windowElement.style.height = '';
    windowElement.classList.add('minimized');

    return { isMinimized: true, isMaximized: false };
}

export function maximizeWindow(windowElement: HTMLElement, isMinimized: boolean, isMaximized: boolean): WindowState {
    if (!isMaximized && !isMinimized) {
        windowElement.dataset.originalWidth = windowElement.style.width;
        windowElement.dataset.originalHeight = windowElement.style.height;
        windowElement.dataset.originalLeft = windowElement.style.left;
        windowElement.dataset.originalTop = windowElement.style.top;
        windowElement.style.left = '0px';
        windowElement.style.top = '0px';
        windowElement.style.width = `${window.innerWidth - MAXIMIZE_OFFSET}px`;
        windowElement.style.height = `${window.innerHeight - MAXIMIZE_OFFSET}px`;
        return { isMinimized: false, isMaximized: true };
    }

    if (isMaximized) {
        restoreFromMaximized(windowElement);
        return { isMinimized, isMaximized: false };
    }

    restoreFromMinimized(windowElement);
    windowElement.dataset.originalWidth = windowElement.style.width;
    windowElement.dataset.originalHeight = windowElement.style.height;
    windowElement.dataset.originalLeft = windowElement.style.left;
    windowElement.dataset.originalTop = windowElement.style.top;
    windowElement.style.left = '0px';
    windowElement.style.top = '0px';
    windowElement.style.width = `${window.innerWidth - MAXIMIZE_OFFSET}px`;
    windowElement.style.height = `${window.innerHeight - MAXIMIZE_OFFSET}px`;

    return { isMinimized: false, isMaximized: true };
}

export function applyDrag(windowElement: HTMLElement): void {
    if (isMobileView()) {
        return;
    }

    const titleBar = maybeQueryWithin<HTMLElement>(windowElement, '.title-bar');
    titleBar?.addEventListener('mousedown', (event) => {
        const target = event.target as HTMLElement;
        if (target.closest('.controls')) {
            return;
        }

        startDragging(
            event,
            windowElement,
            event.clientX,
            event.clientY,
            windowElement.offsetLeft,
            windowElement.offsetTop
        );
    });
}

export function applyResize(windowElement: HTMLElement): void {
    if (isMobileView()) {
        return;
    }

    const resizeHandles = windowElement.querySelectorAll<HTMLElement>('.resize-handle');

    resizeHandles.forEach((handle) => {
        handle.addEventListener('mousedown', (event) => {
            const handleClass = (event.currentTarget as HTMLElement).classList;

            startResizing(
                event,
                windowElement,
                handleClass,
                windowElement.offsetWidth,
                windowElement.offsetHeight,
                event.clientX,
                event.clientY,
                windowElement.offsetLeft,
                windowElement.offsetTop
            );
        });
    });
}

export function bringToFront(windowElement: HTMLElement): void {
    const highestZIndex = Array.from(document.querySelectorAll<HTMLElement>('.window')).reduce((highest, element) => {
        if (element === windowElement || element.classList.contains('hidden')) {
            return highest;
        }

        const zIndex = parseInt(getComputedStyle(element).zIndex || '1', 10) || 1;
        return Math.max(highest, zIndex);
    }, 1);

    windowElement.style.zIndex = String(highestZIndex + 1);
    windowElement.focus();
}

export function updateWindowTitle(windowElement: HTMLElement, title: string): void {
    queryWithin<HTMLElement>(windowElement, '.title').textContent = title;
}

function enableWindowFocus(windowElement: HTMLElement): void {
    windowElement.addEventListener('mousedown', () => {
        bringToFront(windowElement);
    });
}

export function closeWindow(windowElement: HTMLElement): void {
    const key = windowElement.dataset.windowKey;
    if (key) {
        unregisterManagedWindow(key);
    }

    windowElement.remove();
}

function closeManagedWindowsForMobile(): void {
    listManagedWindows().forEach((windowElement) => {
        closeWindow(windowElement);
    });
}

function initializeWindowControls(
    windowElement: HTMLElement,
    onClose?: (windowElement: HTMLElement) => void
): void {
    let windowState: WindowState = {
        isMinimized: false,
        isMaximized: false,
    };

    const minimizeButton = maybeQueryWithin<HTMLButtonElement>(windowElement, '.controls .minimize');
    const maximizeButton = maybeQueryWithin<HTMLButtonElement>(windowElement, '.controls .maximize');
    const closeButton = maybeQueryWithin<HTMLButtonElement>(windowElement, '.controls .close');

    minimizeButton?.addEventListener('click', () => {
        windowState = minimizeWindow(windowElement, windowState.isMinimized, windowState.isMaximized);
    });

    maximizeButton?.addEventListener('click', () => {
        windowState = maximizeWindow(windowElement, windowState.isMinimized, windowState.isMaximized);
    });

    closeButton?.addEventListener('click', () => {
        closeWindow(windowElement);
        onClose?.(windowElement);
    });
}

export function createWindow({
    key,
    title,
    titleKey,
    content,
    initialWidth = 600,
    initialHeight = 400,
    showMenuBar = true,
    showMinMax = true,
    className = '',
    onClose,
}: ManagedWindowOptions): HTMLElement | null {
    if (key) {
        const existingWindow = getManagedWindow(key);
        if (existingWindow) {
            bringToFront(existingWindow);
            return existingWindow;
        }
    }

    if (isMobileView()) {
        closeManagedWindowsForMobile();
    }

    const windowTemplate = getById<HTMLTemplateElement>('window-template');
    const windowFragment = windowTemplate.content.cloneNode(true) as DocumentFragment;
    const windowElement = queryWithin<HTMLElement>(windowFragment, '.window');
    const contentContainer = queryWithin<HTMLElement>(windowElement, '.content');
    const menuBar = maybeQueryWithin<HTMLElement>(windowElement, '.menu-bar');
    const minimizeButton = maybeQueryWithin<HTMLButtonElement>(windowElement, '.controls .minimize');
    const maximizeButton = maybeQueryWithin<HTMLButtonElement>(windowElement, '.controls .maximize');

    windowElement.dataset.managedWindow = 'true';
    windowElement.tabIndex = -1;

    if (key) {
        windowElement.dataset.windowKey = key;
    }

    if (titleKey) {
        windowElement.dataset.titleKey = titleKey;
    }

    if (className) {
        windowElement.classList.add(...className.split(/\s+/).filter(Boolean));
    }

    if (isMobileView()) {
        windowElement.classList.add('mobile-fullscreen-window');
    }

    updateWindowTitle(windowElement, title);
    replaceNodeContent(contentContainer, content);

    if (!showMenuBar) {
        menuBar?.remove();
    }

    if (!showMinMax || isMobileView()) {
        minimizeButton?.remove();
        maximizeButton?.remove();
    }

    windowElement.style.width = `${initialWidth}px`;
    windowElement.style.height = `${initialHeight}px`;

    const { left, top } = getNextWindowPosition(window.innerWidth, window.innerHeight);
    windowElement.style.left = `${left}px`;
    windowElement.style.top = `${top}px`;

    getById<HTMLElement>('program-manager').appendChild(windowElement);

    if (key) {
        registerManagedWindow(key, windowElement);
    }

    initializeWindowControls(windowElement, onClose);
    enableWindowFocus(windowElement);
    applyDrag(windowElement);
    applyResize(windowElement);
    bringToFront(windowElement);

    return windowElement;
}

export function syncManagedWindowTitles(resolveTitle: (titleKey: string) => string | undefined): void {
    document.querySelectorAll<HTMLElement>('.window[data-title-key]').forEach((windowElement) => {
        const titleKey = windowElement.dataset.titleKey;
        if (!titleKey) {
            return;
        }

        const title = resolveTitle(titleKey);
        if (title) {
            updateWindowTitle(windowElement, title);
        }
    });
}
