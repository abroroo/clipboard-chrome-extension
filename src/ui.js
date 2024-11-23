

    export function createFloatingButton() {
        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'clipboard-floating-btn';
        floatingBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
    `;
        return floatingBtn;
    }

    export function createPanel() {
        const panel = document.createElement('div');
        panel.className = 'clipboard-panel';
        panel.innerHTML = `
        <div class="panel-header">
            <div class="panel-title">Go to Korean...</div>
            <button class="add-btn">+ New</button>
        </div>
        <div class="clips-container"></div>
    `;
        return panel;
    }

    export function createModal() {
        const modal = document.createElement('div');
        modal.className = 'add-clip-modal';
        modal.innerHTML = `
        <h3 style="user-select: none; margin-bottom: 5px;">Add New Clip</h3>
        <textarea class="modal-textarea" placeholder="Enter text to save..."></textarea>
        <div class="modal-buttons">
            <button class="modal-btn cancel-btn">Cancel</button>
            <button class="modal-btn save-btn">Save</button>
        </div>
    `;
        return modal;
    }

    export function createModalOverlay() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        return modalOverlay;
    }

    export function createToast() {
        const toast = document.createElement('div');
        toast.className = 'toast';
        return toast;
    }
