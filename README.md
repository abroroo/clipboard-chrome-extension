# Cliply: Handy Clipboard Panel

[Cliply](https://chromewebstore.google.com/detail/cliply-save-copy-clips/bdhpdkpenfghlmklamghdiilckaplbgm) is a simple, draggable tool designed to save and manage your frequently used text snippets. With a floating button that seamlessly integrates into any webpage, Cliply lets you access, copy, and add new clips effortlessly.

Perfect for quick tasks like saving common phrases, repeated text, or notes—Cliply ensures everything you need is just a click away. Inspired by the need to simplify repetitive typing (especially in different languages), Cliply makes your daily text management faster and easier.

🌟 **Save it. Copy it. Done.**

## Features

- **Floating button** you can drag anywhere; it snaps to the nearest edge and remembers its spot.
- **Paste directly** into the field you were typing in, or copy to the clipboard if none is focused.
- **Keyboard shortcut** `Alt+C` toggles the panel (change it at `chrome://extensions/shortcuts`).
- **Pin** favourites to the top, **edit** clips inline, **search** once the list grows.
- **Synced** across your Chrome profile via `chrome.storage.sync`.
- **Hide on specific sites** from the ⋯ menu; manage from the toolbar popup.
- **Export / import** your clips as JSON from the toolbar popup.
- Rendered inside a Shadow DOM so host-page styles never leak in.

## Development

```bash
npm install
npm run build   # production bundle into dist/
npm run dev     # watch mode
```

Load the repo folder as an unpacked extension at `chrome://extensions`.

## Project structure

```
manifest.json      Chrome MV3 manifest
src/               Extension source (content script, popup, background, styles)
dist/              Built bundles loaded by the manifest (npm run build)
icons/             Toolbar icon and source logo
promo/             Promo video, store assets and thumbnail (Remotion), see promo/README.md
```

To package for the Chrome Web Store: `npm run build`, then zip `manifest.json`, `icons/` and `dist/`.

#### 💡 Fun Fact

The idea for Cliply was inspired by the need to text in Korean efficiently. Instead of repeatedly typing commonly used phrases, they were saved as snippets to be quickly copied whenever needed!


## Contributing & License

Feel free to open issues for bugs or feature suggestions!

This project is licensed under the [MIT License](https://www.mit.edu/~amini/LICENSE.md).
