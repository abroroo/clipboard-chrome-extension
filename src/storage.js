/**
 * Storage layer.
 *
 * Clips live in chrome.storage.sync so they follow the user across devices.
 * sync has an 8KB-per-item limit, so each clip is its own key ("clip:<id>")
 * and an "order" key holds the id list. Position is per-device (local).
 * Old installs kept a single `clips` array in local storage; we migrate once.
 */

const CLIP_PREFIX = 'clip:';
const ORDER_KEY = 'order';
export const MAX_CLIPS = 300;

const sync = chrome.storage.sync;
const local = chrome.storage.local;

const get = (area, keys) => new Promise((resolve, reject) =>
    area.get(keys, (r) => (chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(r))));
const set = (area, obj) => new Promise((resolve, reject) =>
    area.set(obj, () => (chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve())));
const remove = (area, keys) => new Promise((resolve, reject) =>
    area.remove(keys, () => (chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve())));

const isClip = (c) => c && typeof c.id === 'number' && typeof c.text === 'string';

async function migrateFromLocal() {
    const { clips } = await get(local, ['clips']);
    if (!Array.isArray(clips) || clips.length === 0) return false;
    const valid = clips.filter(isClip);
    await writeAll(valid);
    await remove(local, ['clips']);
    return true;
}

async function writeAll(clips) {
    const payload = { [ORDER_KEY]: clips.map((c) => c.id) };
    for (const c of clips) payload[CLIP_PREFIX + c.id] = c;
    await set(sync, payload);
}

/** Returns clips in display order (pinned first, then newest first). */
export async function loadClips() {
    let all = await get(sync, null);
    if (!all[ORDER_KEY]) {
        const migrated = await migrateFromLocal();
        if (migrated) all = await get(sync, null);
    }
    const order = Array.isArray(all[ORDER_KEY]) ? all[ORDER_KEY] : [];
    const clips = order.map((id) => all[CLIP_PREFIX + id]).filter(isClip);
    return sortClips(clips);
}

export function sortClips(clips) {
    return [...clips].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.id - a.id);
}

export async function saveClip(clip) {
    const { [ORDER_KEY]: order = [] } = await get(sync, [ORDER_KEY]);
    const nextOrder = order.includes(clip.id) ? order : [clip.id, ...order];
    await set(sync, { [CLIP_PREFIX + clip.id]: clip, [ORDER_KEY]: nextOrder });
}

export async function deleteClip(id) {
    const { [ORDER_KEY]: order = [] } = await get(sync, [ORDER_KEY]);
    await set(sync, { [ORDER_KEY]: order.filter((x) => x !== id) });
    await remove(sync, [CLIP_PREFIX + id]);
}

export async function replaceAllClips(clips) {
    const all = await get(sync, null);
    const stale = Object.keys(all).filter((k) => k.startsWith(CLIP_PREFIX));
    if (stale.length) await remove(sync, stale);
    await writeAll(clips);
}

// ---- per-device position ----
export const loadPosition = () => get(local, ['position']).then((r) => r.position || null).catch(() => null);
export const savePosition = (position) => set(local, { position }).catch((e) => console.error('[Cliply]', e));

// ---- settings (synced) ----
export async function loadSettings() {
    const { settings } = await get(sync, ['settings']);
    return { hiddenHosts: [], snapToEdge: true, ...(settings || {}) };
}
export async function saveSettings(patch) {
    const current = await loadSettings();
    const next = { ...current, ...patch };
    await set(sync, { settings: next });
    return next;
}

/** Subscribe to changes made elsewhere (other tabs, other devices, the popup). */
export function onClipsChanged(callback) {
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;
        if (Object.keys(changes).some((k) => k === ORDER_KEY || k.startsWith(CLIP_PREFIX) || k === 'settings')) callback(changes);
    });
}
