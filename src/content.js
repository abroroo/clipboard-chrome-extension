import './styles/floating-button.css';
import './styles/panel.css';
import './styles/modal.css';
import './styles/toast.css';
import './styles/global.css';

import {createFloatingButton, createModal, createModalOverlay, createPanel, createToast} from './ui.js';
import {loadClips, renderClips} from './state.js';
import {bindEvents} from './events.js';
import {enableDragging} from './drag.js';


const floatingBtn = createFloatingButton();
const panel = createPanel();
const modal = createModal();
const modalOverlay = createModalOverlay();
const toast = createToast();

document.body.appendChild(floatingBtn);
document.body.appendChild(panel);
document.body.appendChild(modal);
document.body.appendChild(modalOverlay);
document.body.appendChild(toast);

loadClips(() => renderClips(toast));

bindEvents(floatingBtn, panel, modal, modalOverlay, toast);
enableDragging(floatingBtn);
