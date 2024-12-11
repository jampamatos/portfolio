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
