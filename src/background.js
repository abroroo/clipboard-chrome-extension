// Service worker: relays the keyboard shortcut to the active tab's content script.
chrome.commands.onCommand.addListener(async (command) => {
    if (command !== 'toggle-panel') return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    try {
        await chrome.tabs.sendMessage(tab.id, { type: 'cliply:toggle' });
    } catch {
        // No content script on this page (chrome://, store pages, etc.). Nothing to do.
    }
});

// "Settings" from the in-page menu: open the toolbar popup where supported (Chrome 127+).
chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'cliply:open-popup' && chrome.action?.openPopup) {
        chrome.action.openPopup().catch(() => {});
    }
});
