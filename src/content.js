import './styles/floating-button.css';
import './styles/panel.css';
import './styles/modal.css';
import './styles/toast.css';

import { createFloatingButton, createModal, createModalOverlay, createPanel, createToast } from './ui.js';
import { loadClips, renderClips } from './state.js';
import { bindEvents } from './events.js';
import { enableDragging } from './drag.js';

// Guard against double injection (e.g. extension reload while the tab is open).
if (!document.querySelector('.clipboard-floating-btn')) {
    const floatingBtn = createFloatingButton();
    const panel = createPanel();
    const modal = createModal();
    const modalOverlay = createModalOverlay();
    const toast = createToast();

    document.body.append(floatingBtn, panel, modal, modalOverlay, toast);

    loadClips(() => renderClips(toast));

    const { togglePanel } = bindEvents(floatingBtn, panel, modal, modalOverlay, toast);
    // Dragging owns pointer events and tells us when a real click (not a drag) happened.
    enableDragging(floatingBtn, { onClick: togglePanel });
}
