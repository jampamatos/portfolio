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
    // Verifica se a janela já está aberta
    if (openWindows.includes(title)) {
        console.log(`A window with the title "${title}" is already open.`);
        return;
    }

    // Adiciona o título da janela à lista de janelas abertas
    openWindows.push(title);

    // Seleciona o template
    const template = document.getElementById('window-template') as HTMLTemplateElement;

    // Clona o conteúdo do template
    const clone = template.content.cloneNode(true) as HTMLElement;

    // Configura a nova janela
    const windowElement = clone.querySelector('.window') as HTMLElement;
    const titleElement = clone.querySelector('.title') as HTMLElement;
    const contentElement = clone.querySelector('.content') as HTMLElement;

    // Define o título e o conteúdo
    titleElement.textContent = title;
    contentElement.innerHTML = content;

    // Adiciona evento para remover a janela da lista ao fechar
    const closeButton = windowElement.querySelector('.controls button:last-child') as HTMLElement;
    closeButton.addEventListener('click', () => {
        // Remove a janela do DOM
        windowElement.remove();
        // Remove o título da janela da lista de janelas abertas
        const index = openWindows.indexOf(title);
        if (index !== -1) {
            openWindows.splice(index, 1);
        }
    });

    // Aplica o deslocamento inicial
    windowElement.style.left = `${windowOffsetX}px`;
    windowElement.style.top = `${windowOffsetY}px`;

    // Incrementa o deslocamento para a próxima janela
    windowOffsetX += 20;
    windowOffsetY += 20;

    // Reseta o deslocamento se sair do viewport
    if (windowOffsetX > window.innerWidth - 230) windowOffsetX = 20; // Respeita largura mínima
    if (windowOffsetY > window.innerHeight - 200) windowOffsetY = 20; // Respeita altura mínima

    // Adiciona a nova janela ao DOM
    document.getElementById('program-manager')?.appendChild(windowElement);

    // Reaplica funcionalidades
    applyDrag(windowElement); // Movimentação
    applyResize(windowElement); // Redimensionamento
}

document.querySelectorAll('#menu-projects, #icon-projects').forEach((element) => {
    element.addEventListener('click', () => {
        createWindow('Projects', '<p>Here are the projects!</p>');
    });
});
