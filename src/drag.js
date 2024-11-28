export function enableDragging(floatingBtn) {
    let isDragging = false;
    let startY, initialY;
    let animationFrameId = null;

    const onMove = (clientY) => {
        if (isDragging) {
            const dy = clientY - startY;

            // Use requestAnimationFrame to update position
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(() => {
                    const clampedY = Math.max(0, Math.min(window.innerHeight - floatingBtn.offsetHeight, initialY + dy));
                    floatingBtn.style.top = `${clampedY}px`;
                    animationFrameId = null; // Reset for the next frame
                });
            }
        }
    };

    const onMouseMove = (e) => {
        onMove(e.clientY);
    };

    const onTouchMove = (e) => {
        onMove(e.touches[0].clientY);
    };

    const onStart = (clientY) => {
        floatingBtn.classList.add('dragging');
        isDragging = true;
        startY = clientY;
        initialY = floatingBtn.getBoundingClientRect().top;
        document.body.style.userSelect = 'none'; // Prevent text selection
    };

    floatingBtn.addEventListener('mousedown', (e) => {
        onStart(e.clientY);
    });

    floatingBtn.addEventListener('touchstart', (e) => {
        onStart(e.touches[0].clientY);
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);

    const onEnd = () => {
        if (isDragging) {
            isDragging = false;
            floatingBtn.classList.remove('dragging');
            document.body.style.userSelect = ''; // Re-enable text selection
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId); // Clean up if dragging ends
                animationFrameId = null;
            }
        }
    };

    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
}
