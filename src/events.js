import {addClip, renderClips} from './state.js';

export function bindEvents(floatingBtn, panel, modal, modalOverlay, toast) {
        floatingBtn.addEventListener('click', () => {
            panel.classList.toggle('active');
        });

        document.querySelector('.add-btn').addEventListener('click', () => {
            modal.classList.add('active');
            modalOverlay.classList.add('active');
            document.querySelector('.modal-textarea').focus();
        });

        document.querySelector('.cancel-btn').addEventListener('click', () => {
            closeModal(modal, modalOverlay);
        });

        modalOverlay.addEventListener('click', () => {
            closeModal(modal, modalOverlay);
        });

        document.addEventListener('click', (event) => {
            const isClickInside = panel.contains(event.target) || floatingBtn.contains(event.target) || modal.contains(event.target);

            if (!isClickInside) {
                panel.classList.remove('active');
            }
        });

        document.querySelector('.save-btn').addEventListener('click', () => {
            const text = document.querySelector('.modal-textarea').value.trim();
            if (text) {
                addClip(text, () => renderClips(toast));
                closeModal(modal, modalOverlay);
                showToast(toast, 'Clip saved successfully!');
            }
        });

    }

 export function closeModal(modal, modalOverlay) {
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.querySelector('.modal-textarea').value = '';
    }

 export function showToast(toast, message) {
        toast.textContent = message;

        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');

        }, 3000);
    }

