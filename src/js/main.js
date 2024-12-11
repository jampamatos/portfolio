"use strict";
document.querySelectorAll('.resize-handle').forEach((handle) => {
    handle.addEventListener('mousedown', (event) => {
        const e = event;
        const windowElement = e.target.closest('.window');
        const handleClass = e.target.classList;
        const initialWidth = windowElement.offsetWidth;
        const initialHeight = windowElement.offsetHeight;
        const initialX = e.clientX;
        const initialY = e.clientY;
        const initialLeft = windowElement.offsetLeft;
        const initialTop = windowElement.offsetTop;
        const resize = (event) => {
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;
            if (handleClass.contains('right')) {
                windowElement.style.width = `${Math.max(initialWidth + deltaX, 230)}px`;
            }
            else if (handleClass.contains('left')) {
                const newWidth = Math.max(initialWidth - deltaX, 230);
                if (newWidth > 230) {
                    windowElement.style.width = `${newWidth}px`;
                    windowElement.style.left = `${initialLeft + deltaX}px`;
                }
            }
            if (handleClass.contains('bottom')) {
                windowElement.style.height = `${Math.max(initialHeight + deltaY, 200)}px`;
            }
            else if (handleClass.contains('top')) {
                const newHeight = Math.max(initialHeight - deltaY, 200);
                if (newHeight > 200) {
                    windowElement.style.height = `${newHeight}px`;
                    windowElement.style.top = `${initialTop + deltaY}px`;
                }
            }
            if (handleClass.contains('top-left')) {
                const newWidth = Math.max(initialWidth - deltaX, 230);
                const newHeight = Math.max(initialHeight - deltaY, 200);
                if (newWidth > 230) {
                    windowElement.style.width = `${newWidth}px`;
                    windowElement.style.left = `${initialLeft + deltaX}px`;
                }
                if (newHeight > 200) {
                    windowElement.style.height = `${newHeight}px`;
                    windowElement.style.top = `${initialTop + deltaY}px`;
                }
            }
            else if (handleClass.contains('top-right')) {
                const newWidth = Math.max(initialWidth + deltaX, 230);
                const newHeight = Math.max(initialHeight - deltaY, 200);
                if (newWidth > 230) {
                    windowElement.style.width = `${newWidth}px`;
                }
                if (newHeight > 200) {
                    windowElement.style.height = `${newHeight}px`;
                    windowElement.style.top = `${initialTop + deltaY}px`;
                }
            }
            else if (handleClass.contains('bottom-left')) {
                const newWidth = Math.max(initialWidth - deltaX, 230);
                const newHeight = Math.max(initialHeight + deltaY, 200);
                if (newWidth > 230) {
                    windowElement.style.width = `${newWidth}px`;
                    windowElement.style.left = `${initialLeft + deltaX}px`;
                }
                if (newHeight > 200) {
                    windowElement.style.height = `${newHeight}px`;
                }
            }
            else if (handleClass.contains('bottom-right')) {
                const newWidth = Math.max(initialWidth + deltaX, 230);
                const newHeight = Math.max(initialHeight + deltaY, 200);
                if (newWidth > 230) {
                    windowElement.style.width = `${newWidth}px`;
                }
                if (newHeight > 200) {
                    windowElement.style.height = `${newHeight}px`;
                }
            }
        };
        const stopResize = () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        };
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        event.preventDefault();
    });
});
document.querySelectorAll('.title-bar').forEach((titleBar) => {
    titleBar.addEventListener('mousedown', (event) => {
        const e = event;
        const windowElement = e.target.closest('.window');
        const initialX = e.clientX; // Posição inicial do mouse (X)
        const initialY = e.clientY; // Posição inicial do mouse (Y)
        const initialLeft = windowElement.offsetLeft; // Posição inicial da janela (X)
        const initialTop = windowElement.offsetTop; // Posição inicial da janela (Y)
        // Dimensões do viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // Dimensões da janela
        const windowWidth = windowElement.offsetWidth;
        const windowHeight = windowElement.offsetHeight;
        const moveWindow = (event) => {
            const deltaX = event.clientX - initialX; // Movimento no eixo X
            const deltaY = event.clientY - initialY; // Movimento no eixo Y
            // Calcula novos valores de posição
            const newLeft = Math.min(Math.max(0, initialLeft + deltaX), // Não ultrapassa o lado esquerdo
            viewportWidth - windowWidth // Não ultrapassa o lado direito
            );
            const newTop = Math.min(Math.max(0, initialTop + deltaY), // Não ultrapassa o topo
            viewportHeight - windowHeight // Não ultrapassa a parte inferior
            );
            // Atualiza a posição da janela
            windowElement.style.left = `${newLeft}px`;
            windowElement.style.top = `${newTop}px`;
        };
        const stopMoving = () => {
            document.removeEventListener('mousemove', moveWindow);
            document.removeEventListener('mouseup', stopMoving);
        };
        document.addEventListener('mousemove', moveWindow); // Listener para arrastar
        document.addEventListener('mouseup', stopMoving); // Listener para parar de arrastar
        event.preventDefault(); // Evita comportamento padrão, como seleção de texto
    });
});
function applyDrag(windowElement) {
    const titleBar = windowElement.querySelector('.title-bar');
    titleBar.addEventListener('mousedown', (event) => {
        const e = event;
        const initialX = e.clientX;
        const initialY = e.clientY;
        const initialLeft = windowElement.offsetLeft;
        const initialTop = windowElement.offsetTop;
        const moveWindow = (event) => {
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;
            const newLeft = Math.max(0, initialLeft + deltaX);
            const newTop = Math.max(0, initialTop + deltaY);
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
    });
}
function applyResize(windowElement) {
    const resizeHandles = windowElement.querySelectorAll('.resize-handle');
    resizeHandles.forEach((handle) => {
        handle.addEventListener('mousedown', (event) => {
            const e = event;
            const handleClass = e.target.classList;
            const initialWidth = windowElement.offsetWidth;
            const initialHeight = windowElement.offsetHeight;
            const initialX = e.clientX;
            const initialY = e.clientY;
            const initialLeft = windowElement.offsetLeft;
            const initialTop = windowElement.offsetTop;
            const resize = (event) => {
                const deltaX = event.clientX - initialX;
                const deltaY = event.clientY - initialY;
                let newWidth = initialWidth;
                let newHeight = initialHeight;
                let newLeft = initialLeft;
                let newTop = initialTop;
                // Redimensionamento horizontal
                if (handleClass.contains('right') || handleClass.contains('top-right') || handleClass.contains('bottom-right')) {
                    newWidth = Math.max(initialWidth + deltaX, 230);
                }
                if (handleClass.contains('left') || handleClass.contains('top-left') || handleClass.contains('bottom-left')) {
                    const potentialWidth = initialWidth - deltaX;
                    if (potentialWidth >= 230) {
                        newWidth = potentialWidth;
                        newLeft = initialLeft + deltaX;
                    }
                    else {
                        newWidth = 230;
                        newLeft = initialLeft + (initialWidth - 230); // Ajusta left quando atinge o limite
                    }
                }
                // Redimensionamento vertical
                if (handleClass.contains('bottom') || handleClass.contains('bottom-left') || handleClass.contains('bottom-right')) {
                    newHeight = Math.max(initialHeight + deltaY, 200);
                }
                if (handleClass.contains('top') || handleClass.contains('top-left') || handleClass.contains('top-right')) {
                    const potentialHeight = initialHeight - deltaY;
                    if (potentialHeight >= 200) {
                        newHeight = potentialHeight;
                        newTop = initialTop + deltaY;
                    }
                    else {
                        newHeight = 200;
                        newTop = initialTop + (initialHeight - 200); // Ajusta top quando atinge o limite
                    }
                }
                // Aplica os novos valores calculados
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
        });
    });
}
let windowOffsetX = 20; // Initial horizontal offset
let windowOffsetY = 20; // Initial vertical offset
// Track open windows
const openWindows = [];
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
function createWindow(title, content) {
    var _a;
    if (openWindows.includes(title)) {
        console.log(`A window with the title "${title}" is already open.`);
        return;
    }
    openWindows.push(title);
    const template = document.getElementById('window-template');
    const clone = template.content.cloneNode(true);
    const windowElement = clone.querySelector('.window');
    const titleElement = clone.querySelector('.title');
    const contentElement = clone.querySelector('.content');
    titleElement.textContent = title;
    contentElement.innerHTML = content;
    // State flags
    let isMinimized = false;
    let isMaximized = false;
    const minimizeButton = windowElement.querySelector('.controls .minimize');
    const maximizeButton = windowElement.querySelector('.controls .maximize');
    const closeButton = windowElement.querySelector('.controls .close');
    minimizeButton.addEventListener('click', () => {
        if (!isMinimized && !isMaximized) {
            // Normal => Minimized
            windowElement.dataset.originalWidth = windowElement.style.width;
            windowElement.dataset.originalHeight = windowElement.style.height;
            windowElement.dataset.originalLeft = windowElement.style.left;
            windowElement.dataset.originalTop = windowElement.style.top;
            windowElement.style.width = '';
            windowElement.style.height = '';
            windowElement.classList.add('minimized');
            isMinimized = true;
        }
        else if (isMinimized) {
            // Minimized => Normal
            restoreFromMinimized(windowElement);
            isMinimized = false;
        }
        else if (isMaximized) {
            // Maximized => Minimized
            // First restore from maximized
            restoreFromMaximized(windowElement);
            isMaximized = false;
            // Now minimize
            windowElement.dataset.originalWidth = windowElement.style.width;
            windowElement.dataset.originalHeight = windowElement.style.height;
            windowElement.dataset.originalLeft = windowElement.style.left;
            windowElement.dataset.originalTop = windowElement.style.top;
            windowElement.style.width = '';
            windowElement.style.height = '';
            windowElement.classList.add('minimized');
            isMinimized = true;
        }
    });
    maximizeButton.addEventListener('click', () => {
        if (!isMaximized && !isMinimized) {
            // Normal => Maximized
            windowElement.dataset.originalWidth = windowElement.style.width;
            windowElement.dataset.originalHeight = windowElement.style.height;
            windowElement.dataset.originalLeft = windowElement.style.left;
            windowElement.dataset.originalTop = windowElement.style.top;
            windowElement.style.left = '0px';
            windowElement.style.top = '0px';
            windowElement.style.width = `${window.innerWidth - 4}px`;
            windowElement.style.height = `${window.innerHeight - 4}px`;
            isMaximized = true;
        }
        else if (isMaximized) {
            // Maximized => Normal
            restoreFromMaximized(windowElement);
            isMaximized = false;
        }
        else if (isMinimized) {
            // Minimized => Maximized
            // First restore from minimized
            restoreFromMinimized(windowElement);
            isMinimized = false;
            // Now maximize
            windowElement.dataset.originalWidth = windowElement.style.width;
            windowElement.dataset.originalHeight = windowElement.style.height;
            windowElement.dataset.originalLeft = windowElement.style.left;
            windowElement.dataset.originalTop = windowElement.style.top;
            windowElement.style.left = '0px';
            windowElement.style.top = '0px';
            windowElement.style.width = `${window.innerWidth - 4}px`;
            windowElement.style.height = `${window.innerHeight - 4}px`;
            isMaximized = true;
        }
    });
    closeButton.addEventListener('click', () => {
        windowElement.remove();
        const index = openWindows.indexOf(title);
        if (index !== -1) {
            openWindows.splice(index, 1);
        }
    });
    // Menu links (if any)
    const menuAbout = windowElement.querySelector('#menu-about');
    const menuProjects = windowElement.querySelector('#menu-projects');
    const menuContact = windowElement.querySelector('#menu-contact');
    if (menuAbout) {
        menuAbout.addEventListener('click', () => {
            createWindow('About Me', '<p>About me!</p>');
        });
    }
    if (menuProjects) {
        menuProjects.addEventListener('click', () => {
            createWindow('Projects', '<p>Here are the projects!</p>');
        });
    }
    if (menuContact) {
        menuContact.addEventListener('click', () => {
            createWindow('Contact', '<p>Let\'s talk!</p>');
        });
    }
    windowElement.style.left = `${windowOffsetX}px`;
    windowElement.style.top = `${windowOffsetY}px`;
    windowOffsetX += 20;
    windowOffsetY += 20;
    if (windowOffsetX > window.innerWidth - 230)
        windowOffsetX = 20;
    if (windowOffsetY > window.innerHeight - 200)
        windowOffsetY = 20;
    (_a = document.getElementById('program-manager')) === null || _a === void 0 ? void 0 : _a.appendChild(windowElement);
    applyDrag(windowElement);
    applyResize(windowElement);
}
// For the main window, apply similar logic
function setupProgramManagerControls() {
    const programManager = document.getElementById('program-manager');
    const mainWindow = programManager.querySelector('.window');
    const minimizeButton = mainWindow.querySelector('.controls .minimize');
    const maximizeButton = mainWindow.querySelector('.controls .maximize');
    const closeButton = mainWindow.querySelector('.controls .close');
    const exitPopup = document.getElementById('exit-popup');
    const exitYes = document.getElementById('exit-yes');
    const exitNo = document.getElementById('exit-no');
    let isMinimized = false;
    let isMaximized = false;
    minimizeButton.addEventListener('click', () => {
        if (!isMinimized && !isMaximized) {
            mainWindow.dataset.originalWidth = mainWindow.style.width;
            mainWindow.dataset.originalHeight = mainWindow.style.height;
            mainWindow.dataset.originalLeft = mainWindow.style.left;
            mainWindow.dataset.originalTop = mainWindow.style.top;
            mainWindow.style.width = '';
            mainWindow.style.height = '';
            mainWindow.classList.add('minimized');
            isMinimized = true;
        }
        else if (isMinimized) {
            restoreFromMinimized(mainWindow);
            isMinimized = false;
        }
        else if (isMaximized) {
            restoreFromMaximized(mainWindow);
            isMaximized = false;
            mainWindow.dataset.originalWidth = mainWindow.style.width;
            mainWindow.dataset.originalHeight = mainWindow.style.height;
            mainWindow.dataset.originalLeft = mainWindow.style.left;
            mainWindow.dataset.originalTop = mainWindow.style.top;
            mainWindow.style.width = '';
            mainWindow.style.height = '';
            mainWindow.classList.add('minimized');
            isMinimized = true;
        }
    });
    maximizeButton.addEventListener('click', () => {
        if (!isMaximized && !isMinimized) {
            mainWindow.dataset.originalWidth = mainWindow.style.width;
            mainWindow.dataset.originalHeight = mainWindow.style.height;
            mainWindow.dataset.originalLeft = mainWindow.style.left;
            mainWindow.dataset.originalTop = mainWindow.style.top;
            mainWindow.style.left = '0px';
            mainWindow.style.top = '0px';
            mainWindow.style.width = `${window.innerWidth - 4}px`;
            mainWindow.style.height = `${window.innerHeight - 4}px`;
            isMaximized = true;
        }
        else if (isMaximized) {
            restoreFromMaximized(mainWindow);
            isMaximized = false;
        }
        else if (isMinimized) {
            restoreFromMinimized(mainWindow);
            isMinimized = false;
            mainWindow.dataset.originalWidth = mainWindow.style.width;
            mainWindow.dataset.originalHeight = mainWindow.style.height;
            mainWindow.dataset.originalLeft = mainWindow.style.left;
            mainWindow.dataset.originalTop = mainWindow.style.top;
            mainWindow.style.left = '0px';
            mainWindow.style.top = '0px';
            mainWindow.style.width = `${window.innerWidth - 4}px`;
            mainWindow.style.height = `${window.innerHeight - 4}px`;
            isMaximized = true;
        }
    });
    closeButton.addEventListener('click', () => {
        exitPopup.classList.remove('hidden');
    });
    exitNo.addEventListener('click', () => {
        exitPopup.classList.add('hidden');
    });
    exitYes.addEventListener('click', () => {
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    });
}
setupProgramManagerControls();
document.querySelectorAll('#menu-about, #icon-about').forEach((element) => {
    element.addEventListener('click', () => {
        createWindow('About Me', '<p>About me!</p>');
    });
});
document.querySelectorAll('#menu-projects, #icon-projects').forEach((element) => {
    element.addEventListener('click', () => {
        createWindow('Projects', '<p>Here are the projects!</p>');
    });
});
document.querySelectorAll('#menu-contact, #icon-contact').forEach((element) => {
    element.addEventListener('click', () => {
        createWindow('Contact', '<p>Let\'s talk!</p>');
    });
});
