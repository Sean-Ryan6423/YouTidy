/**
 * Popup script for Hide YouTube Mini Player extension
 */

const closeContinueWatchingToggle = document.getElementById('closeContinueWatching');

// Load saved settings
chrome.storage.sync.get(['closeContinueWatching'], (result) => {
    // Default to true (close it by default)
    closeContinueWatchingToggle.checked = result.closeContinueWatching !== false;
});

// Save settings when toggled
closeContinueWatchingToggle.addEventListener('change', () => {
    chrome.storage.sync.set({
        closeContinueWatching: closeContinueWatchingToggle.checked
    });
});

