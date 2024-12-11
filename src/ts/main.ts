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
