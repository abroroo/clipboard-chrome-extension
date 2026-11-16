/**
 * Free-form dragging for the floating button: drag anywhere, snap to the nearest
 * horizontal edge on release, remember the spot per device, and tell a click from a drag.
 */
import { loadPosition, savePosition } from './storage.js';

const DRAG_THRESHOLD_PX = 5;
const EDGE_MARGIN_PX = 20;

export function enableDragging(floatingBtn, { onClick } = {}) {
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
    };
    const edgeLeft = (side) => (side === 'left' ? EDGE_MARGIN_PX : window.innerWidth - size() - EDGE_MARGIN_PX);

    const snapToEdge = () => {
        const rect = floatingBtn.getBoundingClientRect();
        const side = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
        const { top } = clamp(edgeLeft(side), rect.top);
        floatingBtn.classList.add('snapping');
        place(edgeLeft(side), top);
        floatingBtn.dataset.side = side;
        setTimeout(() => floatingBtn.classList.remove('snapping'), 350);
        return { side, top: top / window.innerHeight };
    };

    const applyStored = (pos) => {
        const side = pos?.side === 'left' ? 'left' : 'right';
        const topRatio = typeof pos?.top === 'number' ? pos.top : 0.5;
        const { top } = clamp(edgeLeft(side), topRatio * window.innerHeight);
        place(edgeLeft(side), top);
        floatingBtn.dataset.side = side;
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
            savePosition(snapToEdge());
        } else {
            onClick?.();
        }
    };
    floatingBtn.addEventListener('pointerup', end);
    floatingBtn.addEventListener('pointercancel', end);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => loadPosition().then(applyStored), 100);
    });

    loadPosition().then(applyStored);
}
