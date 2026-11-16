import { addClip, updateClip, renderClips, setFilter, MAX_CLIP_LENGTH } from './state.js';
import { loadSettings, saveSettings } from './storage.js';

const PANEL_GAP_PX = 12;

/** Positions the panel beside the floating button, flipped to the free side, clamped to the viewport. */
export function positionPanel(floatingBtn, panel) {
    const btn = floatingBtn.getBoundingClientRect();
    const side = floatingBtn.dataset.side || 'right';

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

/**
 * @param {ShadowRoot} root
 * @param {{ host, floatingBtn, panel, modal, modalOverlay, toast, pasteTarget }} els
 */
export function bindEvents(root, { host, floatingBtn, panel, modal, modalOverlay, toast, pasteTarget }) {
    const textarea = modal.querySelector('.modal-textarea');
    const counter = modal.querySelector('.modal-counter');
    const title = modal.querySelector('.modal-title');
    const saveBtn = modal.querySelector('.save-btn');
    const search = panel.querySelector('.clip-search');
    const menu = panel.querySelector('.panel-menu');

    let editingId = null;

    const render = () => renderClips(root, toast, { onCopy, onEdit });

    // ---- panel ----
    const openPanel = () => {
        positionPanel(floatingBtn, panel);
        panel.classList.add('active');
        floatingBtn.classList.add('open');
    };
    const closePanel = () => {
        panel.classList.remove('active');
        floatingBtn.classList.remove('open');
        menu.hidden = true;
    };
    const togglePanel = () => (panel.classList.contains('active') ? closePanel() : openPanel());

    // ---- modal (add + edit) ----
    const openModal = (clip = null) => {
        editingId = clip ? clip.id : null;
        title.textContent = clip ? 'Edit Clip' : 'Save a New Clip';
        saveBtn.textContent = clip ? 'Update' : 'Save';
        textarea.value = clip ? clip.text : '';
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        updateCounter();
        requestAnimationFrame(() => { textarea.focus(); textarea.setSelectionRange(textarea.value.length, textarea.value.length); });
    };
    const closeModal = () => {
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
        textarea.value = '';
        editingId = null;
    };
    const updateCounter = () => {
        const len = textarea.value.trim().length;
        counter.textContent = `${len} / ${MAX_CLIP_LENGTH}`;
        counter.classList.toggle('over', len > MAX_CLIP_LENGTH);
        saveBtn.disabled = len === 0 || len > MAX_CLIP_LENGTH;
    };
    const submit = async () => {
        const result = editingId ? await updateClip(editingId, { text: textarea.value }) : await addClip(textarea.value);
        if (!result.ok) {
            showToast(toast, result.reason, 'error');
            textarea.focus();
            return;
        }
        const wasEdit = Boolean(editingId);
        closeModal();
        setFilter('');
        if (search) search.value = '';
        render();
        showToast(toast, wasEdit ? 'Clip updated!' : 'Clip saved!');
    };

    // ---- clip actions ----
    async function onCopy(clip, item) {
        let copied = false;
        try {
            await navigator.clipboard.writeText(clip.text);
            copied = true;
        } catch (err) {
            console.warn('[Cliply] clipboard write failed', err);
        }
        const pasted = pasteTarget.insert(clip.text);
        if (pasted || copied) {
            item.classList.add('copied');
            setTimeout(() => item.classList.remove('copied'), 600);
            showToast(toast, pasted ? (copied ? 'Pasted & copied!' : 'Pasted!') : 'Copied to clipboard!');
            if (pasted) closePanel();
        } else {
            showToast(toast, 'Could not copy. Click the page first, then try again.', 'error');
        }
    }
    function onEdit(clip) {
        if (clip) openModal(clip);
    }

    // ---- wiring ----
    panel.querySelector('.add-btn').addEventListener('click', () => openModal());
    panel.querySelector('.menu-btn').addEventListener('click', (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; });
    panel.querySelector('.hide-site-btn').addEventListener('click', async () => {
        const hostName = location.hostname;
        try {
            const { hiddenHosts } = await loadSettings();
            await saveSettings({ hiddenHosts: [...new Set([...hiddenHosts, hostName])] });
            host.remove();
        } catch (err) {
            console.error('[Cliply] could not hide on site', err);
            showToast(toast, 'Could not save that setting.', 'error');
        }
    });
    panel.querySelector('.open-settings-btn').addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'cliply:open-popup' }).catch(() => {});
        showToast(toast, 'Click the Cliply icon in the toolbar for settings.');
        menu.hidden = true;
    });

    modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', submit);
    textarea.addEventListener('input', updateCounter);
    textarea.addEventListener('keydown', (event) => {
        const plainEnter = event.key === 'Enter' && !event.shiftKey;
        const modEnter = event.key === 'Enter' && (event.metaKey || event.ctrlKey);
        if (plainEnter || modEnter) {
            event.preventDefault();
            if (!saveBtn.disabled) submit();
        } else if (event.key === 'Escape') {
            event.stopPropagation();
            closeModal();
        }
    });

    if (search) {
        search.addEventListener('input', () => { setFilter(search.value); render(); });
        search.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { e.stopPropagation(); search.value = ''; setFilter(''); render(); }
        });
    }

    // Clicks outside our shadow host close the panel. composedPath keeps shadow internals private,
    // so test the host element instead of individual children.
    document.addEventListener('click', (event) => {
        if (!event.composedPath().includes(host) && panel.classList.contains('active')) closePanel();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (modal.classList.contains('active')) closeModal();
        else if (panel.classList.contains('active')) closePanel();
    });

    window.addEventListener('resize', () => {
        if (panel.classList.contains('active')) positionPanel(floatingBtn, panel);
    });

    // Keyboard shortcut relayed by the background worker.
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg?.type === 'cliply:toggle') togglePanel();
    });

    return { togglePanel, openPanel, closePanel, render };
}

let toastTimer = null;
export function showToast(toast, message, kind = 'success') {
    toast.textContent = message;
    toast.classList.toggle('toast-red', kind === 'error');
    toast.classList.add('active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('active'), kind === 'error' ? 3500 : 2200);
}
