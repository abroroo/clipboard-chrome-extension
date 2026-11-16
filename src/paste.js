/**
 * Tracks the last editable element the user focused on the host page so a clip
 * can be inserted straight into it. Our own UI lives in a Shadow DOM under `host`
 * and is ignored.
 */
export function createPasteTarget(host) {
    let target = null;

    const isEditable = (el) =>
        el &&
        el !== document.body &&
        !host.contains(el) &&
        (el.isContentEditable ||
            (el.tagName === 'TEXTAREA' && !el.readOnly && !el.disabled) ||
            (el.tagName === 'INPUT' && /^(text|search|url|email|tel|password|number|)$/i.test(el.type || '') && !el.readOnly && !el.disabled));

    document.addEventListener('focusin', (e) => {
        if (isEditable(e.target)) target = e.target;
    }, true);

    /** Inserts text at the caret of the remembered field. Returns true on success. */
    const insert = (text) => {
        if (!target || !target.isConnected || !isEditable(target)) return false;
        try {
            target.focus({ preventScroll: true });
            if (target.isContentEditable) {
                // execCommand is deprecated but is still the only way to insert into
                // arbitrary rich editors (Gmail, Notion, Slack) with undo support.
                const ok = document.execCommand('insertText', false, text);
                if (!ok) return false;
            } else {
                const start = target.selectionStart ?? target.value.length;
                const end = target.selectionEnd ?? start;
                target.setRangeText(text, start, end, 'end');
                // React/Vue listen for input events, not value assignment.
                target.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
            }
            return true;
        } catch (err) {
            console.error('[Cliply] insert failed', err);
            return false;
        }
    };

    return { insert, hasTarget: () => Boolean(target && target.isConnected) };
}
