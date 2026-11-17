import floatingCss from './styles/floating-button.css';
import panelCss from './styles/panel.css';
import modalCss from './styles/modal.css';
import toastCss from './styles/toast.css';

import { createFloatingButton, createModal, createModalOverlay, createPanel, createToast } from './ui.js';
import { loadClips } from './state.js';
import { bindEvents } from './events.js';
import { enableDragging } from './drag.js';
import { createPasteTarget } from './paste.js';
import { loadSettings, onClipsChanged } from './storage.js';

const HOST_ID = 'cliply-host';

async function mount() {
    if (document.getElementById(HOST_ID)) return; // already injected (extension reload)
    if (window.top !== window) return;            // skip iframes; one Cliply per page

    let settings = await loadSettings().catch(() => ({ hiddenHosts: [], snapToEdge: true }));
    if (settings.hiddenHosts.includes(location.hostname)) return;

    // Everything lives in a closed-off Shadow DOM so host-page CSS can't leak in or out.
    const host = document.createElement('div');
    host.id = HOST_ID;
    host.style.cssText = 'all: initial; position: fixed; inset: 0; width: 0; height: 0; z-index: 2147483646;';
    const root = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = [floatingCss, panelCss, modalCss, toastCss].join('\n');
    root.appendChild(style);

    const floatingBtn = createFloatingButton();
    const panel = createPanel();
    const modal = createModal();
    const modalOverlay = createModalOverlay();
    const toast = createToast();
    root.append(floatingBtn, panel, modalOverlay, modal, toast);
    document.documentElement.appendChild(host);

    const pasteTarget = createPasteTarget(host);
    const { togglePanel, render } = bindEvents(root, { host, floatingBtn, panel, modal, modalOverlay, toast, pasteTarget });

    await loadClips();
    render();

    const drag = enableDragging(floatingBtn, {
        onClick: togglePanel,
        getSnapToEdge: () => settings.snapToEdge !== false,
    });

    // Keep in step with other tabs / devices / the popup.
    onClipsChanged(async (changes) => {
        if (changes.settings) {
            const prevSnap = settings.snapToEdge;
            settings = { hiddenHosts: [], snapToEdge: true, ...(changes.settings.newValue || {}) };
            if (settings.snapToEdge !== prevSnap) drag.onSnapSettingChanged();
        }
        await loadClips();
        render();
    });
}

mount().catch((err) => console.error('[Cliply] failed to start', err));
