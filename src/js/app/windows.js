import { MAXIMIZE_OFFSET, MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH, MOBILE_BREAKPOINT, } from './constants.js';
import { getById, maybeQueryWithin, queryWithin, replaceNodeContent } from './dom.js';
import { getManagedWindow, getNextWindowPosition, listManagedWindows, registerManagedWindow, unregisterManagedWindow, } from './state.js';
export function isMobileView() {
    return window.innerWidth < MOBILE_BREAKPOINT;
}
function startResizing(event, windowElement, handleClass, initialWidth, initialHeight, initialX, initialY, initialLeft, initialTop) {
    const resize = (moveEvent) => {
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
            }
            else {
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
            }
            else {
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
function startDragging(event, windowElement, initialX, initialY, initialLeft, initialTop) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = windowElement.offsetWidth;
    const windowHeight = windowElement.offsetHeight;
    const moveWindow = (moveEvent) => {
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
function restoreFromMinimized(windowElement) {
    windowElement.style.width = windowElement.dataset.originalWidth || '';
    windowElement.style.height = windowElement.dataset.originalHeight || '';
    windowElement.style.left = windowElement.dataset.originalLeft || '';
    windowElement.style.top = windowElement.dataset.originalTop || '';
    windowElement.classList.remove('minimized');
}
function restoreFromMaximized(windowElement) {
    windowElement.style.width = windowElement.dataset.originalWidth || '';
    windowElement.style.height = windowElement.dataset.originalHeight || '';
    windowElement.style.left = windowElement.dataset.originalLeft || '';
    windowElement.style.top = windowElement.dataset.originalTop || '';
}
export function minimizeWindow(windowElement, isMinimized, isMaximized) {
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
export function maximizeWindow(windowElement, isMinimized, isMaximized) {
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
export function applyDrag(windowElement) {
    if (isMobileView()) {
        return;
    }
    const titleBar = maybeQueryWithin(windowElement, '.title-bar');
    titleBar?.addEventListener('mousedown', (event) => {
        const target = event.target;
        if (target.closest('.controls')) {
            return;
        }
        startDragging(event, windowElement, event.clientX, event.clientY, windowElement.offsetLeft, windowElement.offsetTop);
    });
}
export function applyResize(windowElement) {
    if (isMobileView()) {
        return;
    }
    const resizeHandles = windowElement.querySelectorAll('.resize-handle');
    resizeHandles.forEach((handle) => {
        handle.addEventListener('mousedown', (event) => {
            const handleClass = event.currentTarget.classList;
            startResizing(event, windowElement, handleClass, windowElement.offsetWidth, windowElement.offsetHeight, event.clientX, event.clientY, windowElement.offsetLeft, windowElement.offsetTop);
        });
    });
}
export function bringToFront(windowElement) {
    const highestZIndex = Array.from(document.querySelectorAll('.window')).reduce((highest, element) => {
        const zIndex = parseInt(getComputedStyle(element).zIndex || '1', 10) || 1;
        return Math.max(highest, zIndex);
    }, 1);
    windowElement.style.zIndex = String(highestZIndex + 1);
    windowElement.focus();
}
export function updateWindowTitle(windowElement, title) {
    queryWithin(windowElement, '.title').textContent = title;
}
function enableWindowFocus(windowElement) {
    windowElement.addEventListener('mousedown', () => {
        bringToFront(windowElement);
    });
}
export function closeWindow(windowElement) {
    const key = windowElement.dataset.windowKey;
    if (key) {
        unregisterManagedWindow(key);
    }
    windowElement.remove();
}
function closeManagedWindowsForMobile() {
    listManagedWindows().forEach((windowElement) => {
        closeWindow(windowElement);
    });
}
function initializeWindowControls(windowElement, onClose) {
    let windowState = {
        isMinimized: false,
        isMaximized: false,
    };
    const minimizeButton = maybeQueryWithin(windowElement, '.controls .minimize');
    const maximizeButton = maybeQueryWithin(windowElement, '.controls .maximize');
    const closeButton = maybeQueryWithin(windowElement, '.controls .close');
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
export function createWindow({ key, title, titleKey, content, initialWidth = 600, initialHeight = 400, showMenuBar = true, showMinMax = true, className = '', onClose, }) {
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
    const windowTemplate = getById('window-template');
    const windowFragment = windowTemplate.content.cloneNode(true);
    const windowElement = queryWithin(windowFragment, '.window');
    const contentContainer = queryWithin(windowElement, '.content');
    const menuBar = maybeQueryWithin(windowElement, '.menu-bar');
    const minimizeButton = maybeQueryWithin(windowElement, '.controls .minimize');
    const maximizeButton = maybeQueryWithin(windowElement, '.controls .maximize');
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
    getById('program-manager').appendChild(windowElement);
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
export function syncManagedWindowTitles(resolveTitle) {
    document.querySelectorAll('.window[data-title-key]').forEach((windowElement) => {
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
