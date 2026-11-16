import { addClip, renderClips, setFilter, MAX_CLIP_LENGTH } from './state.js';

const PANEL_GAP_PX = 12;

/**
 * Positions the panel next to the floating button: on the opposite side of
 * the edge the button is snapped to, vertically centred on it, clamped to the viewport.
 */
export function positionPanel(floatingBtn, panel) {
    const btn = floatingBtn.getBoundingClientRect();
    const side = floatingBtn.dataset.side || 'right';

    // Measure while hidden-but-laid-out.
    const wasActive = panel.classList.contains('active');
    if (!wasActive) panel.style.visibility = 'hidden';
    panel.style.display = 'flex';
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;
    if (!wasActive) { panel.style.display = ''; panel.style.visibility = ''; }

    const left = side === 'right' ? btn.left - PANEL_GAP_PX - pw : btn.right + PANEL_GAP_PX;
    const top = btn.top + btn.height / 2 - ph / 2;

    panel.style.left = `${Math.max(8, Math.min(window.innerWidth - pw - 8, left))}px`;
    panel.style.top = `${Math.max(8, Math.min(window.innerHeight - ph - 8, top))}px`;
    panel.style.transformOrigin = side === 'right' ? 'right center' : 'left center';
}

export function bindEvents(floatingBtn, panel, modal, modalOverlay, toast) {
    const textarea = modal.querySelector('.modal-textarea');
    const counter = modal.querySelector('.modal-counter');
    const saveBtn = modal.querySelector('.save-btn');
    const search = panel.querySelector('.clip-search');

    const openPanel = () => {
        positionPanel(floatingBtn, panel);
        panel.classList.add('active');
        floatingBtn.classList.add('open');
    };
    const closePanel = () => {
        panel.classList.remove('active');
        floatingBtn.classList.remove('open');
    };
    const togglePanel = () => (panel.classList.contains('active') ? closePanel() : openPanel());

    const openModal = () => {
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        updateCounter();
        requestAnimationFrame(() => textarea.focus());
    };

    const updateCounter = () => {
        const len = textarea.value.trim().length;
        counter.textContent = `${len} / ${MAX_CLIP_LENGTH}`;
        counter.classList.toggle('over', len > MAX_CLIP_LENGTH);
        saveBtn.disabled = len === 0 || len > MAX_CLIP_LENGTH;
    };

    const submit = async () => {
        const result = await addClip(textarea.value);
        if (!result.ok) {
            showToast(toast, result.reason, 'error');
            textarea.focus();
            return;
        }
        closeModal(modal, modalOverlay);
        setFilter('');
        if (search) search.value = '';
        renderClips(toast);
        showToast(toast, 'Clip saved!');
    };

    panel.querySelector('.add-btn').addEventListener('click', openModal);
    modal.querySelector('.cancel-btn').addEventListener('click', () => closeModal(modal, modalOverlay));
    modalOverlay.addEventListener('click', () => closeModal(modal, modalOverlay));
    saveBtn.addEventListener('click', submit);
    textarea.addEventListener('input', updateCounter);

    textarea.addEventListener('keydown', (event) => {
        // Enter saves; Shift+Enter inserts a newline; Cmd/Ctrl+Enter always saves.
        const plainEnter = event.key === 'Enter' && !event.shiftKey;
        const modEnter = event.key === 'Enter' && (event.metaKey || event.ctrlKey);
        if (plainEnter || modEnter) {
            event.preventDefault();
            if (!saveBtn.disabled) submit();
        } else if (event.key === 'Escape') {
            event.stopPropagation(); // only close the modal, keep the panel open
            closeModal(modal, modalOverlay);
        }
    });

    if (search) {
        search.addEventListener('input', () => {
            setFilter(search.value);
            renderClips(toast);
        });
        search.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { e.stopPropagation(); search.value = ''; setFilter(''); renderClips(toast); }
        });
    }

    document.addEventListener('click', (event) => {
        const inside = panel.contains(event.target) || floatingBtn.contains(event.target) || modal.contains(event.target);
        if (!inside && panel.classList.contains('active')) closePanel();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (modal.classList.contains('active')) closeModal(modal, modalOverlay);
        else if (panel.classList.contains('active')) closePanel();
    });

    window.addEventListener('resize', () => {
        if (panel.classList.contains('active')) positionPanel(floatingBtn, panel);
    });

    return { togglePanel, openPanel, closePanel };
}

export function closeModal(modal, modalOverlay) {
    modal.classList.remove('active');
    modalOverlay.classList.remove('active');
    modal.querySelector('.modal-textarea').value = '';
}

let toastTimer = null;
export function showToast(toast, message, kind = 'success') {
    toast.textContent = message;
    toast.classList.toggle('toast-red', kind === 'error');
    toast.classList.add('active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('active'), kind === 'error' ? 3500 : 2200);
}
