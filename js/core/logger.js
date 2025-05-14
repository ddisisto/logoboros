/**
 * Enhanced Logger for AI Singularity Game
 * 
 * Provides consistent logging that outputs to both the game UI and browser console,
 * with support for different log levels and structured metadata.
 */

class GameLogger {
    constructor() {
        this.logLevels = {
            debug: 0,
            info: 1,
            warning: 2,
            error: 3
        };
        this.minLevel = 'debug'; // Log everything by default
        this.initialized = false;
        this.history = [];
        this.maxHistorySize = 1000;
    }

    /**
     * Initialize the logger
     * @param {string} minLevel - Minimum log level to display
     */
    init(minLevel = 'debug') {
        if (this.initialized) {
            console.warn('Logger already initialized');
            return;
        }

        this.minLevel = minLevel;
        this.initialized = true;
        
        // Override console methods to capture them in our system
        this.overrideConsole();
        
        // Log initialization
        this.info('Logger initialized', { minLevel });
    }

    /**
     * Override console methods to capture logs
     */
    overrideConsole() {
        // Store original methods
        const originalConsole = {
            log: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error,
            debug: console.debug
        };
        
        // Override console.log
        console.log = (...args) => {
            // Call original method
            originalConsole.log(...args);
            
            // Add to our logs
            this.debug(args[0], { console: true, args: args.slice(1) });
        };
        
        // Override console.info
        console.info = (...args) => {
            // Call original method
            originalConsole.info(...args);
            
            // Add to our logs
            this.info(args[0], { console: true, args: args.slice(1) });
        };
        
        // Override console.warn
        console.warn = (...args) => {
            // Call original method
            originalConsole.warn(...args);
            
            // Add to our logs
            this.warning(args[0], { console: true, args: args.slice(1) });
        };
        
        // Override console.error
        console.error = (...args) => {
            // Call original method
            originalConsole.error(...args);
            
            // Add to our logs
            this.error(args[0], { console: true, args: args.slice(1) });
        };
        
        // Override console.debug
        console.debug = (...args) => {
            // Call original method
            originalConsole.debug(...args);
            
            // Add to our logs
            this.debug(args[0], { console: true, args: args.slice(1) });
        };
    }

    /**
     * Log a debug message
     * @param {string} message - Log message
     * @param {Object} metadata - Additional metadata
     */
    debug(message, metadata = {}) {
        this.log('debug', message, metadata);
    }

    /**
     * Log an info message
     * @param {string} message - Log message
     * @param {Object} metadata - Additional metadata
     */
    info(message, metadata = {}) {
        this.log('info', message, metadata);
    }

    /**
     * Log a warning message
     * @param {string} message - Log message
     * @param {Object} metadata - Additional metadata
     */
    warning(message, metadata = {}) {
        this.log('warning', message, metadata);
    }

    /**
     * Log an error message
     * @param {string} message - Log message
     * @param {Object} metadata - Additional metadata
     */
    error(message, metadata = {}) {
        this.log('error', message, metadata);
    }

    /**
     * Log a message with the specified level
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} metadata - Additional metadata
     */
    log(level, message, metadata = {}) {
        // Check if this log level should be displayed
        if (this.logLevels[level] < this.logLevels[this.minLevel]) {
            return;
        }
        
        // Create log entry
        const logEntry = {
            level,
            message,
            timestamp: new Date(),
            metadata
        };
        
        // Add to history
        this.addToHistory(logEntry);
        
        // If this wasn't triggered by console, log to console
        if (!metadata.console) {
            // Format for console
            const consoleMessage = this.formatForConsole(logEntry);
            
            // Output to console based on level
            switch (level) {
                case 'debug':
                    console.debug(consoleMessage.message, ...consoleMessage.args);
                    break;
                case 'info':
                    console.info(consoleMessage.message, ...consoleMessage.args);
                    break;
                case 'warning':
                    console.warn(consoleMessage.message, ...consoleMessage.args);
                    break;
                case 'error':
                    console.error(consoleMessage.message, ...consoleMessage.args);
                    break;
                default:
                    console.log(consoleMessage.message, ...consoleMessage.args);
            }
        }
        
        // Publish to event bus
        this.publishLogEvent(logEntry);
    }

    /**
     * Format a log entry for console output
     * @param {Object} logEntry - Log entry
     * @returns {Object} - Formatted console output
     */
    formatForConsole(logEntry) {
        // Format timestamp
        const timestamp = logEntry.timestamp.toLocaleTimeString();
        
        // Create base message with timestamp and level
        const formattedMessage = `[${timestamp}] [${logEntry.level.toUpperCase()}] ${logEntry.message}`;
        
        // Include metadata as additional arguments
        const args = [];
        if (Object.keys(logEntry.metadata).length > 0 && !logEntry.metadata.console) {
            args.push(logEntry.metadata);
        }
        
        return {
            message: formattedMessage,
            args
        };
    }

    /**
     * Format a log entry for UI display
     * @param {Object} logEntry - Log entry
     * @returns {string} - Formatted HTML for UI
     */
    formatForUI(logEntry) {
        // Format timestamp
        const timestamp = logEntry.timestamp.toLocaleTimeString();
        
        // Create HTML elements
        const html = `
            <div class="log-entry ${logEntry.level}">
                <span class="log-time">[${timestamp}]</span>
                <span class="log-type">[${logEntry.level.toUpperCase()}]</span>
                <span class="log-message">${logEntry.message}</span>
            </div>
        `;
        
        return html;
    }

    /**
     * Add a log entry to history
     * @param {Object} logEntry - Log entry
     */
    addToHistory(logEntry) {
        this.history.push(logEntry);
        
        // Trim history if it exceeds max size
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(-this.maxHistorySize);
        }
    }

    /**
     * Publish a log event to the event bus
     * @param {Object} logEntry - Log entry
     */
    publishLogEvent(logEntry) {
        if (window.eventBus) {
            window.eventBus.publish('log:entry', logEntry);
            window.eventBus.publish(`log:${logEntry.level}`, logEntry);
            
            // Also publish to meta system for metric tracking
            window.eventBus.publish('meta:log:entry', logEntry);
        }
        
        // Update UI if game is initialized
        this.updateUI(logEntry);
    }

    /**
     * Update the UI with a new log entry
     * @param {Object} logEntry - Log entry
     */
    updateUI(logEntry) {
        const logContent = document.getElementById('log-content');
        if (!logContent) return;
        
        // Create log entry element
        const logEntryHTML = this.formatForUI(logEntry);
        
        // Add to UI
        logContent.insertAdjacentHTML('afterbegin', logEntryHTML);
        
        // Limit log entries in UI
        while (logContent.children.length > 100) {
            logContent.removeChild(logContent.lastChild);
        }
    }

    /**
     * Get all logs
     * @returns {Array} - Array of log entries
     */
    getLogs() {
        return [...this.history];
    }

    /**
     * Get logs by level
     * @param {string} level - Log level
     * @returns {Array} - Array of log entries
     */
    getLogsByLevel(level) {
        return this.history.filter(entry => entry.level === level);
    }

    /**
     * Clear logs
     */
    clearLogs() {
        this.history = [];
        
        // Clear UI if available
        const logContent = document.getElementById('log-content');
        if (logContent) {
            logContent.innerHTML = '';
        }
        
        // Publish clear event
        if (window.eventBus) {
            window.eventBus.publish('log:cleared');
        }
    }
}

// Create and export as a global variable
window.gameLogger = new GameLogger();

// Auto-initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    window.gameLogger.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.gameLogger.init();
    });
}