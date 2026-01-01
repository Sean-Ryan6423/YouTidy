# YouTidy

A Chrome extension that tidies up YouTube's player interface - hide unwanted controls, lock your preferred view mode, and block distracting hotkeys.

## Features

### Mini Player Controls
- **Auto-close mini player** - Automatically closes the mini player when it appears
- **Block "i" hotkey** - Prevents the keyboard shortcut that opens the mini player
- **Hide context menu option** - Removes "Mini player" from right-click menus
- **Continue Watching control** - Toggle to auto-close the premium "Continue Watching" mini player

### View Mode
- **Preferred view mode** - Choose between Default or Theater (Cinema) mode
- **Lock view mode** - Automatically applies your preferred mode and blocks the "t" hotkey

### Keyboard Shortcuts
- **Jump ahead with Enter** - Press Enter to click the "Jump ahead" button when it appears (skip sponsors/intros)
- **Smart hotkey blocking** - Hotkeys are automatically disabled when their corresponding buttons are hidden

### Hotkey Blocking
- **Block "Play on TV" hotkey (c)** - Prevents accidental casting
- **Block autoplay hotkey (shift+n)** - Prevents autoplay shortcuts

### Hide Player Controls
- **Hide mini player button** - Removes the miniplayer icon from controls
- **Hide "Play on TV" button** - Removes the cast icon
- **Hide theater mode button** - Removes the theater toggle icon
- **Hide autoplay toggle** - Removes the autoplay switch

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the folder containing this extension

### Usage

Click the extension icon in the toolbar to access settings. All toggles apply immediately - no page refresh needed.

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
3. **CSS injection** - Hides unwanted player control buttons
4. **Chrome Storage API** - Syncs settings across devices

## License

MIT License - see [LICENSE](LICENSE) for details.
