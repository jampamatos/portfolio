document.querySelectorAll('.resize-handle').forEach((handle) => {
    handle.addEventListener('mousedown', (event) => {
        const e = event as MouseEvent;
        const windowElement = (e.target as HTMLElement).closest('.window') as HTMLElement;
        const handleClass = (e.target as HTMLElement).classList;

        const initialWidth = windowElement.offsetWidth;
        const initialHeight = windowElement.offsetHeight;
        const initialX = e.clientX;
        const initialY = e.clientY;
        const initialLeft = windowElement.offsetLeft;
        const initialTop = windowElement.offsetTop;

        const resize = (event: MouseEvent) => {
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;

            if (handleClass.contains('right')) {
                windowElement.style.width = `${Math.max(initialWidth + deltaX, 230)}px`;
            } else if (handleClass.contains('left')) {
                const newWidth = Math.max(initialWidth - deltaX, 230);
                if (newWidth > 230) {
                    windowElement.style.width = `${newWidth}px`;
                    windowElement.style.left = `${initialLeft + deltaX}px`;
                }
            }

            if (handleClass.contains('bottom')) {
                windowElement.style.height = `${Math.max(initialHeight + deltaY, 200)}px`;
            } else if (handleClass.contains('top')) {
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
            } else if (handleClass.contains('top-right')) {
                const newWidth = Math.max(initialWidth + deltaX, 230);
                const newHeight = Math.max(initialHeight - deltaY, 200);
                if (newWidth > 230) {
                    windowElement.style.width = `${newWidth}px`;
                }
                if (newHeight > 200) {
                    windowElement.style.height = `${newHeight}px`;
                    windowElement.style.top = `${initialTop + deltaY}px`;
                }
            } else if (handleClass.contains('bottom-left')) {
                const newWidth = Math.max(initialWidth - deltaX, 230);
                const newHeight = Math.max(initialHeight + deltaY, 200);
                if (newWidth > 230) {
                    windowElement.style.width = `${newWidth}px`;
                    windowElement.style.left = `${initialLeft + deltaX}px`;
                }
                if (newHeight > 200) {
                    windowElement.style.height = `${newHeight}px`;
                }
            } else if (handleClass.contains('bottom-right')) {
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
        const e = event as MouseEvent;
        const windowElement = (e.target as HTMLElement).closest('.window') as HTMLElement;

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

        const moveWindow = (event: MouseEvent) => {
            const deltaX = event.clientX - initialX; // Movimento no eixo X
            const deltaY = event.clientY - initialY; // Movimento no eixo Y

            // Calcula novos valores de posição
            const newLeft = Math.min(
                Math.max(0, initialLeft + deltaX), // Não ultrapassa o lado esquerdo
                viewportWidth - windowWidth // Não ultrapassa o lado direito
            );
            const newTop = Math.min(
                Math.max(0, initialTop + deltaY), // Não ultrapassa o topo
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

function applyDrag(windowElement: HTMLElement) {
    const titleBar = windowElement.querySelector('.title-bar') as HTMLElement;

    titleBar.addEventListener('mousedown', (event) => {
        const e = event as MouseEvent;

        const initialX = e.clientX;
        const initialY = e.clientY;
        const initialLeft = windowElement.offsetLeft;
        const initialTop = windowElement.offsetTop;

        const moveWindow = (event: MouseEvent) => {
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

function applyResize(windowElement: HTMLElement) {
    const resizeHandles = windowElement.querySelectorAll('.resize-handle');

    resizeHandles.forEach((handle) => {
        handle.addEventListener('mousedown', (event) => {
            const e = event as MouseEvent;
            const handleClass = (e.target as HTMLElement).classList;

            const initialWidth = windowElement.offsetWidth;
            const initialHeight = windowElement.offsetHeight;
            const initialX = e.clientX;
            const initialY = e.clientY;
            const initialLeft = windowElement.offsetLeft;
            const initialTop = windowElement.offsetTop;

            const resize = (event: MouseEvent) => {
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
                    } else {
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
                    } else {
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

let windowOffsetX = 20; // Posição inicial do deslocamento horizontal
let windowOffsetY = 20; // Posição inicial do deslocamento vertical

// Lista para rastrear janelas abertas
const openWindows: string[] = [];

function createWindow(title: string, content: string) {
    if (openWindows.includes(title)) {
        console.log(`A window with the title "${title}" is already open.`);
        return;
    }

    openWindows.push(title);

    const template = document.getElementById('window-template') as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as HTMLElement;

    const windowElement = clone.querySelector('.window') as HTMLElement;
    const titleElement = clone.querySelector('.title') as HTMLElement;
    const contentElement = clone.querySelector('.content') as HTMLElement;

    titleElement.textContent = title;
    contentElement.innerHTML = content;

    // Inicializa estado minimizado
    let isMinimized = false;
    let isMaximized = false;

    // Botão Minimizar
    const minimizeButton = windowElement.querySelector('.controls button:first-child') as HTMLElement;
    minimizeButton.addEventListener('click', () => {
        if (!isMinimized) {
            // Store current inline styles
            windowElement.dataset.originalWidth = windowElement.style.width;
            windowElement.dataset.originalHeight = windowElement.style.height;
            // We still store top and left if we need them upon restore
            windowElement.dataset.originalLeft = windowElement.style.left;
            windowElement.dataset.originalTop = windowElement.style.top;
    
            // Remove only width and height so .minimized can apply
            // Keep the left and top so position stays the same
            windowElement.style.width = '';
            windowElement.style.height = '';
            // DO NOT REMOVE LEFT AND TOP
            // windowElement.style.left = '';
            // windowElement.style.top = '';
    
            // Add minimized class
            windowElement.classList.add('minimized');
            isMinimized = true;
        } else {
            // Restore inline styles when unminimizing
            windowElement.style.width = windowElement.dataset.originalWidth || '';
            windowElement.style.height = windowElement.dataset.originalHeight || '';
            windowElement.style.left = windowElement.dataset.originalLeft || '';
            windowElement.style.top = windowElement.dataset.originalTop || '';
    
            windowElement.classList.remove('minimized');
            isMinimized = false;
        }
    });

    // Maximize Button
    const maximizeButton = windowElement.querySelector('.controls .maximize') as HTMLElement;
    maximizeButton.addEventListener('click', () => {
        if (!isMaximized) {
            // Store current size and position
            windowElement.dataset.originalWidth = windowElement.style.width;
            windowElement.dataset.originalHeight = windowElement.style.height;
            windowElement.dataset.originalLeft = windowElement.style.left;
            windowElement.dataset.originalTop = windowElement.style.top;

            // Maximize to full viewport
            windowElement.style.left = '0px';
            windowElement.style.top = '0px';
            windowElement.style.width = `${window.innerWidth}px`;
            windowElement.style.height = `${window.innerHeight}px`;

            isMaximized = true;
        } else {
            // Restore from maximized
            windowElement.style.width = windowElement.dataset.originalWidth || '';
            windowElement.style.height = windowElement.dataset.originalHeight || '';
            windowElement.style.left = windowElement.dataset.originalLeft || '';
            windowElement.style.top = windowElement.dataset.originalTop || '';

            isMaximized = false;
        }
    });

    // Botão Fechar
    const closeButton = windowElement.querySelector('.controls button:last-child') as HTMLElement;
    closeButton.addEventListener('click', () => {
        windowElement.remove();
        const index = openWindows.indexOf(title);
        if (index !== -1) {
            openWindows.splice(index, 1);
        }
    });

    windowElement.style.left = `${windowOffsetX}px`;
    windowElement.style.top = `${windowOffsetY}px`;

    windowOffsetX += 20;
    windowOffsetY += 20;

    if (windowOffsetX > window.innerWidth - 230) windowOffsetX = 20;
    if (windowOffsetY > window.innerHeight - 200) windowOffsetY = 20;

    document.getElementById('program-manager')?.appendChild(windowElement);

    applyDrag(windowElement);
    applyResize(windowElement);
}

// Lógica para a janela principal (program-manager)
function setupProgramManagerControls() {
    const programManager = document.getElementById('program-manager') as HTMLElement;
    const mainWindow = programManager.querySelector('.window') as HTMLElement;
    const titleBar = mainWindow.querySelector('.title-bar') as HTMLElement;
    const minimizeButton = titleBar.querySelector('.controls .minimize') as HTMLElement;
    const maximizeButton = titleBar.querySelector('.controls .maximize') as HTMLElement;
    const closeButton = titleBar.querySelector('.controls .close') as HTMLElement;

    const exitPopup = document.getElementById('exit-popup') as HTMLElement;
    const exitYes = document.getElementById('exit-yes') as HTMLElement;
    const exitNo = document.getElementById('exit-no') as HTMLElement;
    
    let isMinimized = false;
    let isMaximized = false;

    // Botão Minimizar (Main Window)
    minimizeButton.addEventListener('click', () => {
        if (!isMinimized) {
            // Store the main window's current dimensions and position
            mainWindow.dataset.originalWidth = mainWindow.style.width;
            mainWindow.dataset.originalHeight = mainWindow.style.height;
            mainWindow.dataset.originalLeft = mainWindow.style.left;
            mainWindow.dataset.originalTop = mainWindow.style.top;

            // Remove dimensions so minimized class can apply proper minimal view
            mainWindow.style.width = '';
            mainWindow.style.height = '';
            
            // Add minimized class
            mainWindow.classList.add('minimized');
            isMinimized = true;
        } else {
            // Restore the main window's original dimensions and position
            mainWindow.style.width = mainWindow.dataset.originalWidth || '';
            mainWindow.style.height = mainWindow.dataset.originalHeight || '';
            mainWindow.style.left = mainWindow.dataset.originalLeft || '';
            mainWindow.style.top = mainWindow.dataset.originalTop || '';

            mainWindow.classList.remove('minimized');
            isMinimized = false;
        }
    });

    // Botão Maximizar (Main Window)
    maximizeButton.addEventListener('click', () => {
        if (!isMaximized) {
            // Store current size and position
            mainWindow.dataset.originalWidth = mainWindow.style.width;
            mainWindow.dataset.originalHeight = mainWindow.style.height;
            mainWindow.dataset.originalLeft = mainWindow.style.left;
            mainWindow.dataset.originalTop = mainWindow.style.top;
            
            // Maximize to viewport
            mainWindow.style.left = '0px';
            mainWindow.style.top = '0px';
            mainWindow.style.width = `${window.innerWidth}px`;
            mainWindow.style.height = `${window.innerHeight}px`;

            isMaximized = true;
        } else {
            // Restore from maximized
            mainWindow.style.width = mainWindow.dataset.originalWidth || '';
            mainWindow.style.height = mainWindow.dataset.originalHeight || '';
            mainWindow.style.left = mainWindow.dataset.originalLeft || '';
            mainWindow.style.top = mainWindow.dataset.originalTop || '';

            isMaximized = false;
        }
    });

    // Botão Fechar (Main Window)
    closeButton.addEventListener('click', () => {
        exitPopup.classList.remove('hidden');
    });

    // Fechar o popup ao clicar em "No"
    exitNo.addEventListener('click', () => {
        exitPopup.classList.add('hidden');
    });

    // Redirecionar ao clicar em "Yes"
    exitYes.addEventListener('click', () => {
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    });
}

// Chamar a função para configurar os controles da janela principal
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
