/**
 * Free-form dragging for the floating button.
 *
 * - Drag anywhere in the window (x and y), not just along the right edge.
 * - On release, snap to the nearest horizontal edge so it never sits over content.
 * - Distinguish a click from a drag (small movement threshold) so a drag
 *   doesn't also toggle the panel.
 * - Persist the position so it survives reloads and new tabs.
 */
import { loadPosition, savePosition } from './state.js';

const DRAG_THRESHOLD_PX = 5;
const EDGE_MARGIN_PX = 20;

export function enableDragging(floatingBtn, { onClick } = {}) {
    let pointerId = null;
    let dragging = false;
    let startX = 0, startY = 0;
    let originLeft = 0, originTop = 0;
    let frame = null;

    const size = () => floatingBtn.offsetWidth || 36;

    const clamp = (left, top) => ({
        left: Math.max(0, Math.min(window.innerWidth - size(), left)),
        top: Math.max(0, Math.min(window.innerHeight - size(), top)),
    });

    const place = (left, top) => {
        floatingBtn.style.left = `${left}px`;
        floatingBtn.style.top = `${top}px`;
        floatingBtn.style.right = 'auto';
        floatingBtn.style.transform = 'none';
    };

    /** Snap to the nearest side; returns the stored shape {side, top}. */
    const snapToEdge = () => {
        const rect = floatingBtn.getBoundingClientRect();
        const side = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
        const left = side === 'left' ? EDGE_MARGIN_PX : window.innerWidth - size() - EDGE_MARGIN_PX;
        const { top } = clamp(left, rect.top);
        floatingBtn.classList.add('snapping');
        place(left, top);
        floatingBtn.dataset.side = side;
        setTimeout(() => floatingBtn.classList.remove('snapping'), 350);
        return { side, top: top / window.innerHeight }; // store relative so it scales across screens
    };

    const applyStored = (pos) => {
        const side = pos?.side === 'left' ? 'left' : 'right';
        const topRatio = typeof pos?.top === 'number' ? pos.top : 0.5;
        const left = side === 'left' ? EDGE_MARGIN_PX : window.innerWidth - size() - EDGE_MARGIN_PX;
        const { top } = clamp(left, topRatio * window.innerHeight);
        place(left, top);
        floatingBtn.dataset.side = side;
    };

    const onPointerDown = (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        pointerId = e.pointerId;
        dragging = false;
        startX = e.clientX;
        startY = e.clientY;
        const rect = floatingBtn.getBoundingClientRect();
        originLeft = rect.left;
        originTop = rect.top;
        floatingBtn.setPointerCapture(pointerId);
    };

    const onPointerMove = (e) => {
        if (e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!dragging) {
            if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
            dragging = true;
            floatingBtn.classList.add('dragging');
            document.body.style.userSelect = 'none';
        }
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = null;
            const { left, top } = clamp(originLeft + dx, originTop + dy);
            place(left, top);
        });
    };

    const onPointerUp = (e) => {
        if (e.pointerId !== pointerId) return;
        pointerId = null;
        if (frame) { cancelAnimationFrame(frame); frame = null; }
        if (dragging) {
            dragging = false;
            floatingBtn.classList.remove('dragging');
            document.body.style.userSelect = '';
            savePosition(snapToEdge());
        } else {
            onClick?.();
        }
    };

    floatingBtn.addEventListener('pointerdown', onPointerDown);
    floatingBtn.addEventListener('pointermove', onPointerMove);
    floatingBtn.addEventListener('pointerup', onPointerUp);
    floatingBtn.addEventListener('pointercancel', onPointerUp);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => loadPosition(applyStored), 100);
    });

    loadPosition(applyStored);
}
