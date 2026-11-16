import { showToast } from './events.js';
import * as store from './storage.js';

export const MAX_CLIP_LENGTH = 2000;

export let clips = [];

const escapeHtml = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export async function loadClips() {
    try {
        clips = await store.loadClips();
    } catch (err) {
        console.error('[Cliply] failed to load clips', err);
        clips = [];
    }
    return clips;
}

const validate = (text, ignoreId) => {
    if (!text) return 'Clip is empty.';
    if (text.length > MAX_CLIP_LENGTH) return `Clip is too long (max ${MAX_CLIP_LENGTH} characters).`;
    if (clips.some((c) => c.text === text && c.id !== ignoreId)) return 'You already saved that clip.';
    if (!ignoreId && clips.length >= store.MAX_CLIPS) return `You have reached the limit of ${store.MAX_CLIPS} clips.`;
    return null;
};

/** Adds a clip. Returns { ok, reason }. */
export async function addClip(rawText) {
    const text = (rawText || '').trim();
    const reason = validate(text);
    if (reason) return { ok: false, reason };
    const clip = { id: Date.now(), text, pinned: false };
    clips = store.sortClips([clip, ...clips]);
    try {
        await store.saveClip(clip);
        return { ok: true };
    } catch (err) {
        clips = clips.filter((c) => c.id !== clip.id);
        console.error('[Cliply] failed to save clip', err);
        return { ok: false, reason: friendlyStorageError(err) };
    }
}

export async function updateClip(id, patch) {
    const idx = clips.findIndex((c) => c.id === id);
    if (idx === -1) return { ok: false, reason: 'Clip not found.' };
    if (patch.text !== undefined) {
        patch.text = patch.text.trim();
        const reason = validate(patch.text, id);
        if (reason) return { ok: false, reason };
    }
    const previous = clips[idx];
    const next = { ...previous, ...patch };
    clips = store.sortClips(clips.map((c) => (c.id === id ? next : c)));
    try {
        await store.saveClip(next);
        return { ok: true };
    } catch (err) {
        clips = store.sortClips(clips.map((c) => (c.id === id ? previous : c)));
        return { ok: false, reason: friendlyStorageError(err) };
    }
}

export async function removeClip(id) {
    const previous = clips;
    clips = clips.filter((clip) => clip.id !== id);
    try {
        await store.deleteClip(id);
    } catch (err) {
        clips = previous;
        console.error('[Cliply] failed to delete clip', err);
    }
}

const friendlyStorageError = (err) =>
    /QUOTA/i.test(err?.message || '') ? 'Sync storage is full. Delete some clips.' : 'Could not save. Please try again.';

let currentFilter = '';
export function setFilter(query) {
    currentFilter = (query || '').trim().toLowerCase();
}

/**
 * @param {ShadowRoot} root
 * @param {HTMLElement} toast
 * @param {{ onCopy:(clip)=>void, onEdit:(clip)=>void }} handlers
 */
export function renderClips(root, toast, handlers) {
    const container = root.querySelector('.clips-container');
    const search = root.querySelector('.clip-search');
    if (!container) return;

    const visible = currentFilter ? clips.filter((c) => c.text.toLowerCase().includes(currentFilter)) : clips;
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
        <div class="clip-item${clip.pinned ? ' pinned' : ''}" data-id="${clip.id}" style="--i:${i}" role="button" tabindex="0" title="Click to paste or copy">
            <div class="clip-text">${escapeHtml(clip.text)}</div>
            <div class="clip-actions">
                <button class="icon-btn pin-btn" data-id="${clip.id}" aria-label="${clip.pinned ? 'Unpin' : 'Pin'}" title="${clip.pinned ? 'Unpin' : 'Pin to top'}">${clip.pinned ? '★' : '☆'}</button>
                <button class="icon-btn edit-btn" data-id="${clip.id}" aria-label="Edit" title="Edit">✎</button>
                <button class="icon-btn delete-btn" data-id="${clip.id}" aria-label="Delete" title="Delete">×</button>
            </div>
        </div>`
        )
        .join('');

    const byId = (el) => clips.find((c) => c.id === Number(el.dataset.id));

    container.querySelectorAll('.clip-item').forEach((item) => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.clip-actions')) return;
            const clip = byId(item);
            if (clip) handlers.onCopy(clip, item);
        });
        item.addEventListener('keydown', (e) => {
            const clip = byId(item);
            if (!clip) return;
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlers.onCopy(clip, item); }
            else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); item.querySelector('.delete-btn').click(); }
            else if (e.key.toLowerCase() === 'e') { e.preventDefault(); handlers.onEdit(clip); }
            else if (e.key.toLowerCase() === 'p') { e.preventDefault(); item.querySelector('.pin-btn').click(); }
        });
    });

    container.querySelectorAll('.pin-btn').forEach((btn) =>
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const clip = byId(btn);
            const result = await updateClip(clip.id, { pinned: !clip.pinned });
            if (!result.ok) showToast(toast, result.reason, 'error');
            renderClips(root, toast, handlers);
        })
    );

    container.querySelectorAll('.edit-btn').forEach((btn) =>
        btn.addEventListener('click', (e) => { e.stopPropagation(); handlers.onEdit(byId(btn)); })
    );

    container.querySelectorAll('.delete-btn').forEach((btn) =>
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const item = btn.closest('.clip-item');
            item.classList.add('removing');
            await new Promise((r) => setTimeout(r, 180));
            await removeClip(Number(btn.dataset.id));
            renderClips(root, toast, handlers);
        })
    );
}
