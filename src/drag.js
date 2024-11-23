export function enableDragging(floatingBtn) {
    let isDragging = false;
    let startY, initialY;
    let animationFrameId = null;

    const onMouseMove = (e) => {
        if (isDragging) {
            const dy = e.clientY - startY;

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

    floatingBtn.addEventListener('mousedown', (e) => {
        floatingBtn.classList.add('dragging');
        isDragging = true;
        startY = e.clientY;
        initialY = floatingBtn.getBoundingClientRect().top;
        document.body.style.userSelect = 'none'; // Prevent text selection
    });

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            floatingBtn.classList.remove('dragging');
            document.body.style.userSelect = ''; // Re-enable text selection
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId); // Clean up if dragging ends
                animationFrameId = null;
            }
        }
    });
}
