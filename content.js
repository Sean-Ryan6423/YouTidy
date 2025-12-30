/**
 * Hide YouTube Mini Player Extension
 * Automatically closes the mini player and blocks the "i" hotkey
 */

(function() {
    'use strict';

    // Settings (loaded from storage)
    let settings = {
        closeContinueWatching: true  // Default: close the continue watching mini player
    };

    /**
     * Load settings from chrome.storage
     */
    function loadSettings() {
        if (chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.get(['closeContinueWatching'], (result) => {
                settings.closeContinueWatching = result.closeContinueWatching !== false;
            });

            // Listen for setting changes
            chrome.storage.onChanged.addListener((changes, namespace) => {
                if (namespace === 'sync' && changes.closeContinueWatching) {
                    settings.closeContinueWatching = changes.closeContinueWatching.newValue !== false;
                }
            });
        }
    }

    /**
     * Close the "Continue Watching" premium mini player
     */
    function closeContinueWatchingPlayer() {
        if (!settings.closeContinueWatching) return false;

        // Try various selectors for the continue watching / premium mini player
        const selectors = [
            // Toast-style mini player
            'ytd-miniplayer-toast-renderer button[aria-label="Close"]',
            'ytd-miniplayer-toast-renderer .close-button',
            'ytd-miniplayer-toast-renderer [class*="close"]',
            // Persistent player popup
            'ytd-persistent-miniplayer-renderer button[aria-label="Close"]',
            'ytd-persistent-miniplayer-renderer .close-button',
            // Generic mini player close buttons
            '.ytd-miniplayer button[aria-label="Close"]',
            '.ytp-miniplayer-close-button',
            // Continue watching overlay
            'ytd-reel-shelf-renderer button[aria-label="Dismiss"]',
            '[class*="miniplayer"] button[aria-label="Close"]',
            '[class*="miniplayer"] [class*="close"]'
        ];

        for (const selector of selectors) {
            const closeButton = document.querySelector(selector);
            if (closeButton && closeButton.offsetParent !== null) {
                closeButton.click();
                return true;
            }
        }

        return false;
    }

    /**
     * Check for and close the continue watching player
     */
    function checkAndCloseContinueWatching() {
        if (!settings.closeContinueWatching) return;

        // Look for any visible mini player elements
        const miniPlayerElements = [
            'ytd-miniplayer-toast-renderer',
            'ytd-persistent-miniplayer-renderer'
        ];

        for (const selector of miniPlayerElements) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) {
                setTimeout(closeContinueWatchingPlayer, 100);
                return;
            }
        }
    }

    /**
     * Set up observer for continue watching player
     */
    function setupContinueWatchingObserver() {
        const observer = new MutationObserver((mutations) => {
            if (!settings.closeContinueWatching) return;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const tagName = node.tagName?.toLowerCase() || '';
                            if (tagName.includes('miniplayer') || 
                                tagName.includes('toast') ||
                                node.querySelector?.('[class*="miniplayer"]')) {
                                setTimeout(closeContinueWatchingPlayer, 100);
                                setTimeout(closeContinueWatchingPlayer, 300);
                            }
                        }
                    }
                }
                
                // Check for attribute changes that might indicate player appeared
                if (mutation.type === 'attributes') {
                    const tagName = mutation.target.tagName?.toLowerCase() || '';
                    if (tagName.includes('miniplayer')) {
                        setTimeout(closeContinueWatchingPlayer, 100);
                    }
                }
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['active', 'hidden', 'style', 'class']
        });

        // Initial check on page load
        setTimeout(checkAndCloseContinueWatching, 1000);
        setTimeout(checkAndCloseContinueWatching, 3000);
    }

    /**
     * Remove the mini player option from context menus
     */
    function removeMiniPlayerFromContextMenu() {
        // Find all menu items and remove the one for mini player
        const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item');
        menuItems.forEach(item => {
            const text = item.textContent?.toLowerCase() || '';
            if (text.includes('mini player') || text.includes('miniplayer')) {
                item.style.display = 'none';
            }
        });
    }

    /**
     * Set up observer for context menu appearance
     */
    function setupContextMenuObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if a menu/popup was added
                            if (node.tagName === 'YTD-MENU-POPUP-RENDERER' ||
                                node.tagName === 'TP-YT-IRON-DROPDOWN' ||
                                node.classList?.contains('ytp-popup') ||
                                node.querySelector?.('ytd-menu-service-item-renderer')) {
                                // Small delay to ensure menu items are rendered
                                setTimeout(removeMiniPlayerFromContextMenu, 10);
                                setTimeout(removeMiniPlayerFromContextMenu, 50);
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Check if the target element is an input field where typing should be allowed
     */
    function isInputField(element) {
        const tagName = element.tagName.toLowerCase();
        return (
            tagName === 'input' ||
            tagName === 'textarea' ||
            element.isContentEditable ||
            element.getAttribute('contenteditable') === 'true'
        );
    }

    /**
     * Close the mini player by clicking its close button
     */
    function closeMiniPlayer() {
        const closeButton = document.querySelector('.ytp-miniplayer-close-button');
        if (closeButton) {
            closeButton.click();
            return true;
        }
        return false;
    }

    /**
     * Check if mini player is currently visible/active
     */
    function isMiniPlayerActive() {
        const miniPlayer = document.querySelector('ytd-miniplayer[active]');
        return miniPlayer !== null;
    }

    /**
     * Set up MutationObserver to watch for mini player appearing
     */
    function setupMiniPlayerObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // Check for attribute changes on the miniplayer element
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'active' &&
                    mutation.target.tagName === 'YTD-MINIPLAYER') {
                    if (mutation.target.hasAttribute('active')) {
                        // Small delay to ensure the close button is rendered
                        setTimeout(closeMiniPlayer, 50);
                    }
                }
                
                // Check for added nodes that might be the miniplayer
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'YTD-MINIPLAYER' || 
                                node.querySelector?.('ytd-miniplayer[active]')) {
                                setTimeout(closeMiniPlayer, 50);
                            }
                        }
                    }
                }
            }
            
            // Also check if mini player is currently active
            if (isMiniPlayerActive()) {
                setTimeout(closeMiniPlayer, 50);
            }
        });

        // Observe the entire document for changes
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['active']
        });

        // Initial check in case mini player is already open
        if (isMiniPlayerActive()) {
            closeMiniPlayer();
        }
    }

    /**
     * Block the "i" hotkey that opens the mini player
     * Uses capture phase to intercept before YouTube's handlers
     */
    function setupHotkeyBlocker() {
        document.addEventListener('keydown', (event) => {
            // Only block 'i' key when not in an input field
            if ((event.key === 'i' || event.key === 'I') && !isInputField(event.target)) {
                // Don't block if modifier keys are pressed (Ctrl+I, Alt+I, etc.)
                if (!event.ctrlKey && !event.altKey && !event.metaKey) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            }
        }, true); // true = capture phase
    }

    /**
     * Initialize the extension
     */
    function initialize() {
        loadSettings();
        setupMiniPlayerObserver();
        setupHotkeyBlocker();
        setupContextMenuObserver();
        setupContinueWatchingObserver();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

