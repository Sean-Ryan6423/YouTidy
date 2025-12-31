/**
 * YouTidy - Tidy up YouTube's player interface
 * Hide unwanted controls, lock view modes, and block distracting hotkeys
 */

(function() {
    'use strict';

    // Settings (loaded from storage)
    let settings = {
        closeContinueWatching: true,
        preferredViewMode: 'theater',
        lockViewMode: true,
        blockPlayOnTV: true,
        blockAutoplay: true,
        hideMiniPlayerBtn: true,
        hidePlayOnTVBtn: true,
        hideTheaterBtn: true,
        hideAutoplayBtn: true
    };

    // CSS style element for hiding controls
    let hideControlsStyle = null;

    /**
     * Load settings from chrome.storage
     */
    function loadSettings() {
        const settingKeys = [
            'closeContinueWatching', 'preferredViewMode', 'lockViewMode', 
            'blockPlayOnTV', 'blockAutoplay', 'hideMiniPlayerBtn', 
            'hidePlayOnTVBtn', 'hideTheaterBtn', 'hideAutoplayBtn'
        ];

        if (chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.get(settingKeys, (result) => {
                settings.closeContinueWatching = result.closeContinueWatching ?? true;
                settings.preferredViewMode = result.preferredViewMode ?? 'theater';
                settings.lockViewMode = result.lockViewMode ?? true;
                settings.blockPlayOnTV = result.blockPlayOnTV ?? true;
                settings.blockAutoplay = result.blockAutoplay ?? true;
                settings.hideMiniPlayerBtn = result.hideMiniPlayerBtn ?? true;
                settings.hidePlayOnTVBtn = result.hidePlayOnTVBtn ?? true;
                settings.hideTheaterBtn = result.hideTheaterBtn ?? true;
                settings.hideAutoplayBtn = result.hideAutoplayBtn ?? true;
                
                // Apply preferred view mode on load
                applyPreferredViewMode();
                // Apply control hiding
                applyHideControls();
            });

            // Listen for setting changes
            chrome.storage.onChanged.addListener((changes, namespace) => {
                if (namespace === 'sync') {
                    if (changes.closeContinueWatching) {
                        settings.closeContinueWatching = changes.closeContinueWatching.newValue ?? true;
                    }
                    if (changes.preferredViewMode) {
                        settings.preferredViewMode = changes.preferredViewMode.newValue ?? 'theater';
                        applyPreferredViewMode();
                    }
                    if (changes.lockViewMode) {
                        settings.lockViewMode = changes.lockViewMode.newValue ?? true;
                    }
                    if (changes.blockPlayOnTV) {
                        settings.blockPlayOnTV = changes.blockPlayOnTV.newValue ?? true;
                    }
                    if (changes.blockAutoplay) {
                        settings.blockAutoplay = changes.blockAutoplay.newValue ?? true;
                    }
                    if (changes.hideMiniPlayerBtn) {
                        settings.hideMiniPlayerBtn = changes.hideMiniPlayerBtn.newValue ?? true;
                        applyHideControls();
                    }
                    if (changes.hidePlayOnTVBtn) {
                        settings.hidePlayOnTVBtn = changes.hidePlayOnTVBtn.newValue ?? true;
                        applyHideControls();
                    }
                    if (changes.hideTheaterBtn) {
                        settings.hideTheaterBtn = changes.hideTheaterBtn.newValue ?? true;
                        applyHideControls();
                    }
                    if (changes.hideAutoplayBtn) {
                        settings.hideAutoplayBtn = changes.hideAutoplayBtn.newValue ?? true;
                        applyHideControls();
                    }
                }
            });
        }
    }

    /**
     * Apply CSS to hide player control buttons
     */
    function applyHideControls() {
        // Remove existing style if present
        if (hideControlsStyle) {
            hideControlsStyle.remove();
        }

        const rules = [];

        if (settings.hideMiniPlayerBtn) {
            rules.push('.ytp-miniplayer-button { display: none !important; }');
        }

        if (settings.hidePlayOnTVBtn) {
            rules.push('.ytp-remote-button { display: none !important; }');
            rules.push('.ytp-cast-button { display: none !important; }');
        }

        if (settings.hideTheaterBtn) {
            rules.push('.ytp-size-button { display: none !important; }');
        }

        if (settings.hideAutoplayBtn) {
            rules.push('.ytp-autonav-toggle-button-container { display: none !important; }');
            rules.push('.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"] { display: none !important; }');
        }

        if (rules.length > 0) {
            hideControlsStyle = document.createElement('style');
            hideControlsStyle.id = 'yt-hide-controls-style';
            hideControlsStyle.textContent = rules.join('\n');
            document.head.appendChild(hideControlsStyle);
        }
    }

    /**
     * Apply the preferred view mode (default or theater)
     */
    function applyPreferredViewMode() {
        // Only apply on watch pages
        if (!window.location.pathname.includes('/watch')) return;

        const player = document.querySelector('#movie_player');
        if (!player) {
            // Retry after a delay if player not found yet
            setTimeout(applyPreferredViewMode, 500);
            return;
        }

        const isTheaterMode = document.querySelector('ytd-watch-flexy')?.hasAttribute('theater');
        
        if (settings.preferredViewMode === 'theater' && !isTheaterMode) {
            // Switch to theater mode
            const theaterButton = document.querySelector('.ytp-size-button');
            if (theaterButton) theaterButton.click();
        } else if (settings.preferredViewMode === 'default' && isTheaterMode) {
            // Switch to default mode
            const theaterButton = document.querySelector('.ytp-size-button');
            if (theaterButton) theaterButton.click();
        }
    }

    /**
     * Set up observer to apply view mode when navigating to videos
     */
    function setupViewModeObserver() {
        let lastUrl = location.href;
        
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                if (window.location.pathname.includes('/watch')) {
                    // Delay to ensure page is loaded
                    setTimeout(applyPreferredViewMode, 1000);
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
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
        // YouTube page menu items (three-dot menus, etc.)
        const pageMenuItems = document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item');
        pageMenuItems.forEach(item => {
            const text = item.textContent?.toLowerCase() || '';
            if (text.includes('mini player') || text.includes('miniplayer')) {
                item.style.display = 'none';
            }
        });

        // Video player right-click context menu items
        const playerMenuItems = document.querySelectorAll('.ytp-menuitem, .ytp-panel-menu .ytp-menuitem');
        playerMenuItems.forEach(item => {
            const text = item.textContent?.toLowerCase() || '';
            if (text.includes('miniplayer') || text.includes('mini player')) {
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
                                node.classList?.contains('ytp-contextmenu') ||
                                node.querySelector?.('ytd-menu-service-item-renderer') ||
                                node.querySelector?.('.ytp-menuitem')) {
                                // Small delay to ensure menu items are rendered
                                setTimeout(removeMiniPlayerFromContextMenu, 10);
                                setTimeout(removeMiniPlayerFromContextMenu, 50);
                                setTimeout(removeMiniPlayerFromContextMenu, 100);
                            }
                        }
                    }
                }
                
                // Also check for attribute changes that might show a menu
                if (mutation.type === 'attributes' && 
                    (mutation.target.classList?.contains('ytp-contextmenu') ||
                     mutation.target.classList?.contains('ytp-popup'))) {
                    setTimeout(removeMiniPlayerFromContextMenu, 10);
                    setTimeout(removeMiniPlayerFromContextMenu, 50);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'hidden']
        });

        // Also listen for contextmenu events to catch right-clicks
        document.addEventListener('contextmenu', () => {
            setTimeout(removeMiniPlayerFromContextMenu, 10);
            setTimeout(removeMiniPlayerFromContextMenu, 50);
            setTimeout(removeMiniPlayerFromContextMenu, 100);
            setTimeout(removeMiniPlayerFromContextMenu, 200);
        }, true);
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
     * Block hotkeys based on settings
     * Uses capture phase to intercept before YouTube's handlers
     */
    function setupHotkeyBlocker() {
        document.addEventListener('keydown', (event) => {
            // Skip if in an input field
            if (isInputField(event.target)) return;

            const key = event.key.toLowerCase();

            // Block shift+n (next with autoplay) if autoplay blocking is enabled
            if (key === 'n' && event.shiftKey && settings.blockAutoplay) {
                event.stopPropagation();
                event.preventDefault();
                return;
            }

            // Skip other checks if modifier keys are pressed
            if (event.ctrlKey || event.altKey || event.metaKey) return;

            // Block 'i' key (mini player) - always blocked
            if (key === 'i') {
                event.stopPropagation();
                event.preventDefault();
                return;
            }

            // Block 't' key (theater mode toggle) if view mode is locked
            if (key === 't' && settings.lockViewMode) {
                event.stopPropagation();
                event.preventDefault();
                return;
            }

            // Block 'c' key (play on TV / cast) if setting is enabled
            if (key === 'c' && settings.blockPlayOnTV) {
                event.stopPropagation();
                event.preventDefault();
                return;
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
        setupViewModeObserver();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

