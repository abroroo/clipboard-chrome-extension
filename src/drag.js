
export function enableDragging(floatingBtn) {
        let isDragging = false;
        let startY, initialY;

        floatingBtn.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            initialY = floatingBtn.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dy = e.clientY - startY;
                floatingBtn.style.top = `${initialY + dy}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
            }
        });
    }

