/**
 * Event Bus for AI Singularity Game
 * 
 * Provides a centralized event system for communication between components
 */

class EventBus {
    constructor() {
        this.events = {};
        this.debug = false;
    }

    /**
     * Enable or disable debug logging
     * @param {boolean} enabled - Whether to enable debug logging
     */
    setDebug(enabled) {
        this.debug = enabled;
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {function} callback - Callback function
     * @returns {function} - Unsubscribe function
     */
    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        
        if (this.debug) {
            console.log(`[EventBus] Subscribed to ${event}, total subscribers: ${this.events[event].length}`);
        }
        
        // Return unsubscribe function
        return () => this.unsubscribe(event, callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {function} callback - Callback function
     */
    unsubscribe(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
            
            if (this.debug) {
                console.log(`[EventBus] Unsubscribed from ${event}, remaining subscribers: ${this.events[event].length}`);
            }
        }
    }

    /**
     * Publish an event
     * @param {string} event - Event name
     * @param {any} data - Event data
     */
    publish(event, data) {
        if (this.debug) {
            console.log(`[EventBus] Publishing ${event} with data:`, data);
        }
        
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`[EventBus] Error in ${event} handler:`, error);
                }
            });
        }
    }

    /**
     * Clear all event subscriptions
     */
    clear() {
        this.events = {};
        
        if (this.debug) {
            console.log('[EventBus] All events cleared');
        }
    }
}

// Create and export a singleton instance as a global variable
window.eventBus = new EventBus();