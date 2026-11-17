/**
 * Dragging for the floating button.
 *
 * - Drag anywhere; a short movement threshold separates a click from a drag.
 * - On release, either snap to the nearest left/right edge (default) or stay
 *   exactly where dropped, depending on the `snapToEdge` setting.
 * - The position is stored per device as viewport ratios, so it survives
 *   reloads and adapts to different window sizes.
 *
 * Stored shapes:
 *   snapped: { side: 'left' | 'right', top: <0..1> }
 *   free:    { mode: 'free', left: <0..1>, top: <0..1> }
 */
import { loadPosition, savePosition } from './storage.js';

const DRAG_THRESHOLD_PX = 5;
const EDGE_MARGIN_PX = 20;

export function enableDragging(floatingBtn, { onClick, getSnapToEdge = () => true } = {}) {
    let pointerId = null;
    let dragging = false;
    let startX = 0, startY = 0, originLeft = 0, originTop = 0;
    let frame = null;

    const size = () => floatingBtn.offsetWidth || 36;
    const clamp = (left, top) => ({
        left: Math.max(0, Math.min(window.innerWidth - size(), left)),
        top: Math.max(0, Math.min(window.innerHeight - size(), top)),
    });
    const place = (left, top) => {
        floatingBtn.style.left = `${left}px`;
        floatingBtn.style.top = `${top}px`;
        // Which side the panel should open towards: away from the nearer edge.
        floatingBtn.dataset.side = left + size() / 2 < window.innerWidth / 2 ? 'left' : 'right';
    };
    const edgeLeft = (side) => (side === 'left' ? EDGE_MARGIN_PX : window.innerWidth - size() - EDGE_MARGIN_PX);

    const glide = () => {
        floatingBtn.classList.add('snapping');
        setTimeout(() => floatingBtn.classList.remove('snapping'), 350);
    };

    /** Settles the button after a drag and returns the shape to store. */
    const settle = () => {
        const rect = floatingBtn.getBoundingClientRect();
        if (getSnapToEdge()) {
            const side = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
            const { top } = clamp(edgeLeft(side), rect.top);
            glide();
            place(edgeLeft(side), top);
            return { side, top: top / window.innerHeight };
        }
        const { left, top } = clamp(rect.left, rect.top);
        place(left, top);
        return { mode: 'free', left: left / window.innerWidth, top: top / window.innerHeight };
    };

    const applyStored = (pos) => {
        const topRatio = typeof pos?.top === 'number' ? pos.top : 0.5;
        if (pos?.mode === 'free' && typeof pos.left === 'number') {
            const { left, top } = clamp(pos.left * window.innerWidth, topRatio * window.innerHeight);
            if (getSnapToEdge()) {
                // Setting was switched on since this was saved: snap to the nearer edge.
                const side = left + size() / 2 < window.innerWidth / 2 ? 'left' : 'right';
                place(edgeLeft(side), clamp(edgeLeft(side), top).top);
            } else {
                place(left, top);
            }
            return;
        }
        const side = pos?.side === 'left' ? 'left' : 'right';
        const { top } = clamp(edgeLeft(side), topRatio * window.innerHeight);
        place(edgeLeft(side), top);
    };

    floatingBtn.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        pointerId = e.pointerId;
        dragging = false;
        startX = e.clientX; startY = e.clientY;
        const rect = floatingBtn.getBoundingClientRect();
        originLeft = rect.left; originTop = rect.top;
        floatingBtn.setPointerCapture(pointerId);
    });

    floatingBtn.addEventListener('pointermove', (e) => {
        if (e.pointerId !== pointerId) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
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
    });

    const end = (e) => {
        if (e.pointerId !== pointerId) return;
        pointerId = null;
        if (frame) { cancelAnimationFrame(frame); frame = null; }
        if (dragging) {
            dragging = false;
            floatingBtn.classList.remove('dragging');
            document.body.style.userSelect = '';
            savePosition(settle());
        } else {
            onClick?.();
        }
    };
    floatingBtn.addEventListener('pointerup', end);
    floatingBtn.addEventListener('pointercancel', end);

    const restore = () => loadPosition().then(applyStored);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(restore, 100);
    });

    applyStored(null); // place immediately at the default spot, then restore the saved one
    restore();

    return {
        /** Call when the snap setting changes: re-settles the button in place. */
        onSnapSettingChanged() {
            if (getSnapToEdge()) glide();
            savePosition(settle());
        },
    };
}
