# Hide YouTube Mini Player

A Chrome extension that automatically closes the YouTube mini player and prevents it from opening.

## Features

- **Auto-close mini player** - Automatically clicks the close button when the mini player appears (not just hiding the element)
- **Block "i" hotkey** - Prevents the keyboard shortcut that opens the mini player
- **Hide context menu option** - Removes the "Mini player" option from right-click menus
- **Continue Watching control** - Toggle to auto-close the premium "Continue Watching" mini player (configurable)

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the folder containing this extension

### Usage

Once installed, the extension works automatically on all YouTube pages:

- The mini player will be closed immediately when it tries to open
- The "i" keyboard shortcut is blocked (except when typing in input fields)
- Right-click menu no longer shows the mini player option

Click the extension icon in the toolbar to access settings:

- **Close "Continue Watching" mini player** - Toggle whether to auto-close the premium continue watching feature

## Files

| File | Description |
|------|-------------|
| `manifest.json` | Extension configuration (Manifest V3) |
| `content.js` | Main script that runs on YouTube pages |
| `popup.html` | Settings popup UI |
| `popup.js` | Popup logic and storage handling |
| `icons/` | Extension icons |

## Permissions

This extension requires minimal permissions:

- **storage** - To save your preferences
- **Host permission for youtube.com** - To run the content script on YouTube

## How It Works

The extension uses:

1. **MutationObserver** - Watches for DOM changes to detect when mini players appear
2. **Event capturing** - Intercepts keyboard events before YouTube's handlers
3. **Chrome Storage API** - Syncs settings across devices

## License

MIT License - feel free to modify and distribute.

