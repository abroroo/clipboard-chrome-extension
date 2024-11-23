import {showToast} from "./events";

export let clips = [];

export function loadClips(callback) {
        chrome.storage.local.get(['clips'], (result) => {
            if (result.clips) {
                clips = result.clips;
                callback();
            }
        });
    }

export function addClip(text, callback) {
        clips.unshift({id: Date.now(), text});
        chrome.storage.local.set({clips}, callback);
    }

export function renderClips(toast) {
        const container = document.querySelector('.clips-container');
        container.innerHTML = clips.map(clip => `
        <div class="clip-item" data-id="${clip.id}">
            <div class="clip-text">${clip.text}</div>
            <button class="delete-btn" data-id="${clip.id}">x</button>
        </div>
    `).join('');


    document.querySelectorAll('.clip-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                item.classList.add('active');
                const text = item.querySelector('.clip-text').textContent;
                navigator.clipboard.writeText(text).then(() => {
                    showToast(toast,'Copied to clipboard!');
                });
            }
        });
    });


    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            clips = clips.filter(clip => clip.id !== id);
            chrome.storage.local.set({clips}, () => renderClips(toast));
            showToast(toast,'Clip deleted!');
        });
    });

    }

