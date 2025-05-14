/**
 * Unified Dashboard Controller for AI Singularity Game
 * 
 * This component handles the unified dashboard UI, including tab switching,
 * panel interactions, and notification system.
 */

class UnifiedDashboard {
    constructor() {
        this.initialized = false;
        this.currentTab = 'main';
        this.notifications = [];
    }

    /**
     * Initialize the unified dashboard
     */
    init() {
        if (this.initialized) {
            console.warn('Unified dashboard already initialized');
            return;
        }

        // Set up tab switching
        this.setupTabSwitching();
        
        // Set up event listeners
        this.setupEventListeners();
        
        this.initialized = true;
        console.log('Unified dashboard initialized');
    }

    /**
     * Set up tab switching functionality
     */
    setupTabSwitching() {
        // Get all tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        
        // Set up click event for each button
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab');
                this.switchToTab(tab);
            });
        });
        
        // Set active tab based on URL hash if present
        if (window.location.hash) {
            const tab = window.location.hash.substring(1);
            if (document.querySelector(`.tab-button[data-tab="${tab}"]`)) {
                this.switchToTab(tab);
            }
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for game events
        if (window.eventBus) {
            // Character selection triggers interface update
            window.eventBus.subscribe('character:selected', () => {
                this.showGameInterface();
            });
            
            // Listen for section toggle requests
            window.eventBus.subscribe('ui:toggle:section', (sectionId) => {
                this.toggleSection(sectionId);
            });
            
            // Listen for tab switch requests
            window.eventBus.subscribe('ui:switch:tab', (tab) => {
                this.switchToTab(tab);
            });
            
            // Listen for notifications
            window.eventBus.subscribe('ui:notification', (notification) => {
                this.showNotification(notification.message, notification.type, notification.duration);
            });
        }
    }

    /**
     * Switch to a specific tab
     * @param {string} tab - Tab ID to switch to
     */
    switchToTab(tab) {
        // Get all tab buttons and content panes
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        // Remove active class from all buttons and panes
        tabButtons.forEach(button => button.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to selected button and pane
        const selectedButton = document.querySelector(`.tab-button[data-tab="${tab}"]`);
        const selectedPane = document.getElementById(`${tab}-tab`);
        
        if (selectedButton && selectedPane) {
            selectedButton.classList.add('active');
            selectedPane.classList.add('active');
            this.currentTab = tab;
            
            // Update URL hash
            window.location.hash = tab;
            
            // Publish tab change event
            if (window.eventBus) {
                window.eventBus.publish('ui:tab:changed', tab);
            }
        }
    }

    /**
     * Show the game interface after character selection
     */
    showGameInterface() {
        const characterScreen = document.getElementById('character-selection-screen');
        const gameUI = document.getElementById('game-ui');
        
        if (characterScreen && gameUI) {
            characterScreen.style.display = 'none';
            gameUI.style.display = 'block';
            
            // Publish UI shown event
            if (window.eventBus) {
                window.eventBus.publish('ui:game:shown');
            }
        }
    }

    /**
     * Toggle a section of the UI
     * @param {string} sectionId - ID of the section to toggle
     */
    toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        
        if (section) {
            // Toggle visibility
            if (section.style.display === 'none') {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
            
            // Publish section toggle event
            if (window.eventBus) {
                window.eventBus.publish('ui:section:toggled', {
                    id: sectionId,
                    visible: section.style.display !== 'none'
                });
            }
        }
    }

    /**
     * Show a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, info, warning, error)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Create notification container if it doesn't exist
        let container = document.querySelector('.notification-container');
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to container
        container.appendChild(notification);
        
        // Add to tracked notifications
        const notificationId = Date.now();
        this.notifications.push({
            id: notificationId,
            element: notification,
            timer: setTimeout(() => {
                this.removeNotification(notificationId);
            }, duration)
        });
        
        // Add close button event
        const closeButton = notification.querySelector('.notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.removeNotification(notificationId);
            });
        }
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }

    /**
     * Remove a notification
     * @param {number} id - Notification ID to remove
     */
    removeNotification(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        
        if (index >= 0) {
            const notification = this.notifications[index];
            
            // Clear timer if exists
            if (notification.timer) {
                clearTimeout(notification.timer);
            }
            
            // Animate out
            notification.element.classList.remove('show');
            
            // Remove after animation
            setTimeout(() => {
                if (notification.element.parentNode) {
                    notification.element.parentNode.removeChild(notification.element);
                }
                
                // Remove from tracked notifications
                this.notifications.splice(index, 1);
                
                // Remove container if empty
                const container = document.querySelector('.notification-container');
                if (container && this.notifications.length === 0) {
                    container.parentNode.removeChild(container);
                }
            }, 300);
        }
    }
}

// Create and export singleton instance
window.unifiedDashboard = new UnifiedDashboard();

// Add initialization to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    window.unifiedDashboard.init();
});