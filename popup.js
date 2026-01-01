/**
 * YouTidy - Popup settings script
 */

// Get all setting elements
const closeContinueWatchingToggle = document.getElementById('closeContinueWatching');
const preferredViewModeSelect = document.getElementById('preferredViewMode');
const lockViewModeToggle = document.getElementById('lockViewMode');
const blockPlayOnTVToggle = document.getElementById('blockPlayOnTV');
const blockAutoplayToggle = document.getElementById('blockAutoplay');
const jumpAheadKeyInput = document.getElementById('jumpAheadKey');
const hideMiniPlayerBtnToggle = document.getElementById('hideMiniPlayerBtn');
const hidePlayOnTVBtnToggle = document.getElementById('hidePlayOnTVBtn');
const hideTheaterBtnToggle = document.getElementById('hideTheaterBtn');
const hideAutoplayBtnToggle = document.getElementById('hideAutoplayBtn');

// Default settings
const defaults = {
    closeContinueWatching: true,
    preferredViewMode: 'theater',
    lockViewMode: true,
    blockPlayOnTV: true,
    blockAutoplay: true,
    jumpAheadKey: 'Enter',
    hideMiniPlayerBtn: true,
    hidePlayOnTVBtn: true,
    hideTheaterBtn: true,
    hideAutoplayBtn: true
};

// Helper to get display name for a key
function getKeyDisplayName(key) {
    const displayNames = {
        'Enter': 'Enter',
        ' ': 'Space',
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'Escape': 'Esc'
    };
    return displayNames[key] || key.toUpperCase();
}

// Load saved settings
chrome.storage.sync.get(Object.keys(defaults), (result) => {
    closeContinueWatchingToggle.checked = result.closeContinueWatching ?? defaults.closeContinueWatching;
    preferredViewModeSelect.value = result.preferredViewMode ?? defaults.preferredViewMode;
    lockViewModeToggle.checked = result.lockViewMode ?? defaults.lockViewMode;
    blockPlayOnTVToggle.checked = result.blockPlayOnTV ?? defaults.blockPlayOnTV;
    blockAutoplayToggle.checked = result.blockAutoplay ?? defaults.blockAutoplay;
    jumpAheadKeyInput.value = getKeyDisplayName(result.jumpAheadKey ?? defaults.jumpAheadKey);
    hideMiniPlayerBtnToggle.checked = result.hideMiniPlayerBtn ?? defaults.hideMiniPlayerBtn;
    hidePlayOnTVBtnToggle.checked = result.hidePlayOnTVBtn ?? defaults.hidePlayOnTVBtn;
    hideTheaterBtnToggle.checked = result.hideTheaterBtn ?? defaults.hideTheaterBtn;
    hideAutoplayBtnToggle.checked = result.hideAutoplayBtn ?? defaults.hideAutoplayBtn;
});

// Save settings when changed
closeContinueWatchingToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ closeContinueWatching: closeContinueWatchingToggle.checked });
});

preferredViewModeSelect.addEventListener('change', () => {
    chrome.storage.sync.set({ preferredViewMode: preferredViewModeSelect.value });
});

lockViewModeToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ lockViewMode: lockViewModeToggle.checked });
});

blockPlayOnTVToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ blockPlayOnTV: blockPlayOnTVToggle.checked });
});

blockAutoplayToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ blockAutoplay: blockAutoplayToggle.checked });
});

jumpAheadKeyInput.addEventListener('keydown', (event) => {
    event.preventDefault();
    const key = event.key;
    // Don't allow modifier keys alone
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) return;
    
    jumpAheadKeyInput.value = getKeyDisplayName(key);
    chrome.storage.sync.set({ jumpAheadKey: key });
});

hideMiniPlayerBtnToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ hideMiniPlayerBtn: hideMiniPlayerBtnToggle.checked });
});

hidePlayOnTVBtnToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ hidePlayOnTVBtn: hidePlayOnTVBtnToggle.checked });
});

hideTheaterBtnToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ hideTheaterBtn: hideTheaterBtnToggle.checked });
});

hideAutoplayBtnToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ hideAutoplayBtn: hideAutoplayBtnToggle.checked });
});

