import { showToast } from './events.js';

export const MAX_CLIP_LENGTH = 2000;

export let clips = [];

const storage = {
    get: (keys) => new Promise((resolve) => chrome.storage.local.get(keys, resolve)),
    set: (obj) => new Promise((resolve) => chrome.storage.local.set(obj, resolve)),
};

const escapeHtml = (s) =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

export async function loadClips(callback) {
    try {
        const result = await storage.get(['clips']);
        clips = Array.isArray(result.clips) ? result.clips.filter((c) => c && typeof c.text === 'string') : [];
    } catch (err) {
        console.error('[Cliply] failed to load clips', err);
        clips = [];
    }
    callback();
}

export async function loadPosition(callback) {
    try {
        const result = await storage.get(['position']);
        callback(result.position || null);
    } catch {
        callback(null);
    }
}

export function savePosition(position) {
    storage.set({ position }).catch((err) => console.error('[Cliply] failed to save position', err));
}

/** Validates and stores a clip. Returns { ok, reason }. */
export async function addClip(rawText) {
    const text = (rawText || '').trim();
    if (!text) return { ok: false, reason: 'Clip is empty.' };
    if (text.length > MAX_CLIP_LENGTH) return { ok: false, reason: `Clip is too long (max ${MAX_CLIP_LENGTH} characters).` };
    if (clips.some((c) => c.text === text)) return { ok: false, reason: 'You already saved that clip.' };

    clips.unshift({ id: Date.now(), text });
    try {
        await storage.set({ clips });
        return { ok: true };
    } catch (err) {
        clips.shift();
        console.error('[Cliply] failed to save clip', err);
        return { ok: false, reason: 'Could not save. Please try again.' };
    }
}

export async function removeClip(id) {
    const previous = clips;
    clips = clips.filter((clip) => clip.id !== id);
    try {
        await storage.set({ clips });
    } catch (err) {
        clips = previous;
        console.error('[Cliply] failed to delete clip', err);
    }
}

let currentFilter = '';
export function setFilter(query) {
    currentFilter = (query || '').trim().toLowerCase();
}

export function renderClips(toast) {
    const container = document.querySelector('.clips-container');
    const search = document.querySelector('.clip-search');
    if (!container) return;

    const visible = currentFilter ? clips.filter((c) => c.text.toLowerCase().includes(currentFilter)) : clips;

    // Only show the search box once the list is long enough to need it.
    if (search) search.hidden = clips.length < 5;

    if (clips.length === 0) {
        container.innerHTML = `
        <div class="clips-empty">
            <div class="clips-empty-title">No clips yet</div>
            <div class="clips-empty-hint">Hit <b>+ New</b> to save text you type often.</div>
        </div>`;
        return;
    }

    if (visible.length === 0) {
        container.innerHTML = `<div class="clips-empty"><div class="clips-empty-hint">No clips match “${escapeHtml(currentFilter)}”.</div></div>`;
        return;
    }

    container.innerHTML = visible
        .map(
            (clip, i) => `
        <div class="clip-item" data-id="${clip.id}" style="--i:${i}" role="button" tabindex="0" title="Click to copy">
            <div class="clip-text">${escapeHtml(clip.text)}</div>
            <button class="delete-btn" data-id="${clip.id}" aria-label="Delete clip">×</button>
        </div>`
        )
        .join('');

    container.querySelectorAll('.clip-item').forEach((item) => {
        const copy = async () => {
            const clip = clips.find((c) => c.id === Number(item.dataset.id));
            if (!clip) return;
            try {
                await navigator.clipboard.writeText(clip.text);
                item.classList.add('copied');
                setTimeout(() => item.classList.remove('copied'), 600);
                showToast(toast, 'Copied to clipboard!');
            } catch (err) {
                console.error('[Cliply] clipboard write failed', err);
                showToast(toast, 'Could not copy. Click the page first, then try again.', 'error');
            }
        };
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-btn')) copy();
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); }
            if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); item.querySelector('.delete-btn').click(); }
        });
    });

    container.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const item = btn.closest('.clip-item');
            item.classList.add('removing');
            await new Promise((r) => setTimeout(r, 180));
            await removeClip(Number(btn.dataset.id));
            renderClips(toast);
        });
    });
}
