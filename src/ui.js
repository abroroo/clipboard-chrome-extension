const ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 512 512" aria-hidden="true">
<rect x="128" y="96" width="256" height="352" rx="40" fill="#FEB300"/>
<rect x="160" y="128" width="192" height="288" rx="24" fill="#F9F9F9"/>
<rect x="192" y="56" width="128" height="64" rx="24" fill="#424242"/>
<circle cx="256" cy="288" r="72" fill="#067AFE"/>
<path d="M224 288 l22 22 l44 -48" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export function createFloatingButton() {
    const el = document.createElement('div');
    el.className = 'clipboard-floating-btn';
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Open Cliply');
    el.title = 'Cliply (Alt+C) — drag to move';
    el.innerHTML = ICON;
    return el;
}

export function createPanel() {
    const el = document.createElement('div');
    el.className = 'clipboard-panel';
    el.innerHTML = `
        <div class="panel-header">
            <div class="panel-title">Quick Access Clips</div>
            <div class="panel-actions">
                <button class="add-btn">+ New</button>
                <button class="menu-btn" aria-label="More" title="More">⋯</button>
            </div>
        </div>
        <div class="panel-menu" hidden>
            <button class="menu-item hide-site-btn">Hide Cliply on this site</button>
            <button class="menu-item open-settings-btn">Settings, export &amp; import</button>
            <div class="menu-hint">Toggle with <kbd>Alt</kbd>+<kbd>C</kbd></div>
        </div>
        <input class="clip-search" type="search" placeholder="Search clips…" hidden />
        <div class="clips-container"></div>`;
    return el;
}

export function createModal() {
    const el = document.createElement('div');
    el.className = 'add-clip-modal';
    el.setAttribute('role', 'dialog');
    el.innerHTML = `
        <h3 class="modal-title">Save a New Clip</h3>
        <textarea class="modal-textarea" placeholder="Enter text to save..."></textarea>
        <div class="modal-footer">
            <span class="modal-counter">0 / 2000</span>
            <span class="modal-hint">Enter to save · Shift+Enter for a new line</span>
        </div>
        <div class="modal-buttons">
            <button class="modal-btn cancel-btn">Cancel</button>
            <button class="modal-btn save-btn">Save</button>
        </div>`;
    return el;
}

export function createModalOverlay() {
    const el = document.createElement('div');
    el.className = 'modal-overlay';
    return el;
}

export function createToast() {
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    return el;
}
