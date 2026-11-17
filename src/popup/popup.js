import css from './popup.css';
import { loadClips, replaceAllClips, loadSettings, saveSettings, sortClips, MAX_CLIPS } from '../storage.js';

document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));

const $ = (sel) => document.querySelector(sel);
const status = (msg, isErr = false) => { $('#status').textContent = msg; $('#status').className = isErr ? 'err' : 'muted'; };

async function refresh() {
    const clips = await loadClips();
    $('#count').textContent = clips.length;

    const { hiddenHosts, snapToEdge } = await loadSettings();
    $('#snap').checked = snapToEdge !== false;
    const list = $('#hidden-list');
    list.innerHTML = '';
    $('#hidden-empty').hidden = hiddenHosts.length > 0;
    for (const hostName of hiddenHosts) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = hostName;
        const btn = document.createElement('button');
        btn.textContent = 'Show again';
        btn.addEventListener('click', async () => {
            await saveSettings({ hiddenHosts: hiddenHosts.filter((h) => h !== hostName) });
            status(`Cliply will show on ${hostName} after a reload.`);
            refresh();
        });
        li.append(span, btn);
        list.appendChild(li);
    }
}

$('#snap').addEventListener('change', async (e) => {
    try {
        await saveSettings({ snapToEdge: e.target.checked });
        status(e.target.checked ? 'Button will snap to the nearest edge.' : 'Button will stay where you drop it.');
    } catch {
        e.target.checked = !e.target.checked;
        status('Could not save that setting.', true);
    }
});

chrome.commands.getAll((cmds) => {
    const c = cmds.find((x) => x.name === 'toggle-panel');
    if (c?.shortcut) $('#shortcut').textContent = c.shortcut;
    else $('#shortcut').textContent = 'not set';
});
$('#shortcuts-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});

$('#export').addEventListener('click', async () => {
    const clips = await loadClips();
    const blob = new Blob([JSON.stringify({ app: 'cliply', version: 1, exportedAt: new Date().toISOString(), clips }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: `cliply-clips-${new Date().toISOString().slice(0, 10)}.json` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status(`Exported ${clips.length} clips.`);
});

$('#import').addEventListener('click', () => $('#import-file').click());
$('#import-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        const data = JSON.parse(await file.text());
        const incoming = (Array.isArray(data) ? data : data?.clips) || [];
        const valid = incoming
            .filter((c) => c && typeof c.text === 'string' && c.text.trim())
            .map((c, i) => ({ id: typeof c.id === 'number' ? c.id : Date.now() + i, text: c.text.trim().slice(0, 2000), pinned: Boolean(c.pinned) }));
        if (!valid.length) throw new Error('No clips found in that file.');

        // Merge: keep existing, add new by text, cap at the limit.
        const existing = await loadClips();
        const seen = new Set(existing.map((c) => c.text));
        const merged = [...existing];
        for (const c of valid) {
            if (seen.has(c.text)) continue;
            seen.add(c.text);
            merged.push(merged.some((m) => m.id === c.id) ? { ...c, id: Date.now() + merged.length } : c);
        }
        const final = sortClips(merged).slice(0, MAX_CLIPS);
        await replaceAllClips(final);
        status(`Imported ${final.length - existing.length} new clips (${final.length} total).`);
        refresh();
    } catch (err) {
        status(err.message || 'Import failed.', true);
    } finally {
        e.target.value = '';
    }
});

refresh();
