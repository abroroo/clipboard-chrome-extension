// Create and inject HTML elements

    const floatingBtn = document.createElement('div');
    floatingBtn.className = 'clipboard-floating-btn';
    floatingBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
`;

    const panel = document.createElement('div');
    panel.className = 'clipboard-panel';
    panel.innerHTML = `
  <div class="panel-header">
    <div class="panel-title">Go to Korean...</div>
    <button class="add-btn">+ New</button>
  </div>
  <div class="clips-container"></div>
`;

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


    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const toast = document.createElement('div');
    toast.className = 'toast';

    document.body.appendChild(floatingBtn);
    document.body.appendChild(panel);
    document.body.appendChild(modal);
    document.body.appendChild(modalOverlay);
    document.body.appendChild(toast);

// State management
    let clips = [];

// Load saved clips
    chrome.storage.local.get(['clips'], (result) => {
        if (result.clips) {
            clips = result.clips;
            renderClips();
        }
    });

// Event handlers
    floatingBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
    });

    document.querySelector('.add-btn').addEventListener('click', () => {
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        document.querySelector('.modal-textarea').focus();
    });

    document.querySelector('.cancel-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

// Event handler to close the panel when clicking outside of it
document.addEventListener('click', (event) => {
    const isClickInside = panel.contains(event.target) || floatingBtn.contains(event.target) || modal.contains(event.target);

    if (!isClickInside) {
        panel.classList.remove('active');
    }
});


document.querySelector('.save-btn').addEventListener('click', () => {
        const text = document.querySelector('.modal-textarea').value.trim();
        if (text) {
            addClip(text);
            closeModal();
            showToast('Clip saved successfully!');
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.querySelector('.modal-textarea').value = '';
    }

    function addClip(text) {
        clips.unshift({id: Date.now(), text});
        chrome.storage.local.set({clips}, renderClips);
    }

    function renderClips() {
        const container = document.querySelector('.clips-container');
        container.innerHTML = clips.map(clip => `
    <div class="clip-item" data-id="${clip.id}">
      <div class="clip-text">${clip.text}</div>
      <button class="delete-btn" data-id="${clip.id}">x</button>
    </div>
  `).join('');

        // Add click handlers for copying
        document.querySelectorAll('.clip-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-btn')) {
                    item.classList.add('active');
                    const text = item.querySelector('.clip-text').textContent;
                    navigator.clipboard.writeText(text).then(() => {
                        showToast('Copied to clipboard!');
                    });
                }
            });
        });


        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                clips = clips.filter(clip => clip.id !== id);
                chrome.storage.local.set({clips}, renderClips);
                showToast('Clip deleted!');
            });
        });
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => {
                toast.classList.remove('active')
            }
            , 3000);
    }





// Dragging the button logic


const floatingBtn2 = document.querySelector('.clipboard-floating-btn');

// Variables to store the initial position
let isDragging = false;
let startY, initialY;

// Mouse down event to start dragging
floatingBtn2.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    const rect = floatingBtn2.getBoundingClientRect();
    initialY = rect.top;
    document.body.style.userSelect = 'none'; // Prevent text selection
});

// Mouse move event to drag the button
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const dy = e.clientY - startY;
        const newY = initialY + dy;

        // Update the button's position
        floatingBtn2.style.top = `${newY}px`;
    }
});

// Mouse up event to stop dragging
document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = ''; // Re-enable text selection
    }
});




