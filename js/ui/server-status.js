/**
 * Server Status Display Component for AI Singularity Game
 * 
 * This component provides a real-time view of backend servers
 * and allows starting, stopping, and monitoring their status.
 * It integrates with the server-bridge to provide server management
 * capabilities directly from the UI.
 */

class ServerStatusDisplay {
    constructor() {
        this.initialized = false;
        this.servers = {};
        this.selectedServer = null;
        this.logFilter = 'all';
        this.refreshInterval = null;
        this.logAutoScroll = true;
    }

    /**
     * Initialize the server status display
     * @param {Object} options - Initialization options
     * @param {HTMLElement} options.container - Container element for the display
     * @param {number} options.refreshRate - Refresh rate in milliseconds
     */
    init(options = {}) {
        if (this.initialized) {
            console.warn('Server status display already initialized');
            return;
        }

        this.container = options.container || document.getElementById('server-status-panel');
        this.logsContainer = options.logsContainer || document.getElementById('server-log-content');
        this.refreshRate = options.refreshRate || 5000; // 5 seconds by default
        
        // Create the display UI if container exists
        if (this.container) {
            this.createUI();
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial update
        this.updateServerStatus();
        
        // Start regular refresh if auto-refresh is enabled
        if (options.autoRefresh !== false) {
            this.startRefreshInterval();
        }
        
        this.initialized = true;
        console.log('Server status display initialized');
    }
    
    /**
     * Create the server status display UI
     */
    createUI() {
        // Create controls for the server display
        const controlsHTML = `
            <div class="server-controls-header flex items-center space-between mb-10">
                <div class="server-controls-title text-highlight">Server Management</div>
                <div class="server-controls-actions">
                    <button id="refresh-servers-btn" class="server-button" title="Refresh server status">
                        <span class="server-button-icon">↻</span> Refresh
                    </button>
                    <select id="server-auto-refresh" class="server-select">
                        <option value="0">Manual refresh</option>
                        <option value="5000" selected>Refresh every 5s</option>
                        <option value="10000">Refresh every 10s</option>
                        <option value="30000">Refresh every 30s</option>
                    </select>
                </div>
            </div>
            <div id="server-status-grid" class="server-status-grid"></div>
        `;
        
        this.container.innerHTML = controlsHTML;
        
        // Create the logs UI if container exists
        if (this.logsContainer) {
            // Create logs controls above the logs container
            const logsControlsContainer = document.createElement('div');
            logsControlsContainer.className = 'flex items-center space-between mb-10';
            logsControlsContainer.innerHTML = `
                <div class="flex items-center gap-10">
                    <select id="server-logs-filter" class="server-select">
                        <option value="all">All Servers</option>
                    </select>
                    <select id="server-logs-level" class="server-select">
                        <option value="all">All Levels</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                        <option value="success">Success</option>
                    </select>
                </div>
                <div class="flex items-center gap-10">
                    <label class="server-logs-autoscroll">
                        <input type="checkbox" id="server-logs-autoscroll" checked>
                        Auto-scroll
                    </label>
                    <button id="clear-server-logs" class="server-button">
                        <span class="server-button-icon">×</span> Clear
                    </button>
                </div>
            `;
            
            // Insert the controls before the logs container
            this.logsContainer.parentNode.insertBefore(logsControlsContainer, this.logsContainer);
        }
    }
    
    /**
     * Set up event listeners for the server status display
     */
    setupEventListeners() {
        // Listen for server status updates from the bridge
        if (window.eventBus) {
            window.eventBus.subscribe('server:status:updated', (servers) => {
                this.servers = servers;
                this.updateServerDisplay();
            });
            
            window.eventBus.subscribe('server:logs:updated', (logs) => {
                this.updateServerLogs(logs);
            });
        }
        
        // Set up event listener for manual refresh button
        document.addEventListener('click', (event) => {
            if (event.target.closest('#refresh-servers-btn')) {
                this.updateServerStatus();
            }
            
            if (event.target.closest('#clear-server-logs')) {
                this.clearServerLogs();
            }
            
            // Delegation for server control buttons
            if (event.target.closest('.start-server')) {
                const button = event.target.closest('.start-server');
                const serverId = button.dataset.serverId;
                if (serverId) {
                    this.startServer(serverId);
                }
            }
            
            if (event.target.closest('.stop-server')) {
                const button = event.target.closest('.stop-server');
                const serverId = button.dataset.serverId;
                if (serverId) {
                    this.stopServer(serverId);
                }
            }
            
            if (event.target.closest('.restart-server')) {
                const button = event.target.closest('.restart-server');
                const serverId = button.dataset.serverId;
                if (serverId) {
                    this.restartServer(serverId);
                }
            }
            
            if (event.target.closest('.view-logs-server')) {
                const button = event.target.closest('.view-logs-server');
                const serverId = button.dataset.serverId;
                if (serverId) {
                    this.viewServerLogs(serverId);
                }
            }
        });
        
        // Auto-refresh change handler
        document.addEventListener('change', (event) => {
            if (event.target.id === 'server-auto-refresh') {
                const refreshRate = parseInt(event.target.value, 10);
                this.setRefreshRate(refreshRate);
            }
            
            if (event.target.id === 'server-logs-filter') {
                const filter = event.target.value;
                this.setLogFilter(filter);
            }
            
            if (event.target.id === 'server-logs-level') {
                const level = event.target.value;
                this.setLogLevel(level);
            }
            
            if (event.target.id === 'server-logs-autoscroll') {
                const autoscroll = event.target.checked;
                this.logAutoScroll = autoscroll;
            }
        });
    }
    
    /**
     * Update the server status by fetching from the server bridge
     */
    updateServerStatus() {
        if (window.serverBridge) {
            window.serverBridge.fetchServers()
                .then(() => {
                    this.servers = window.serverBridge.servers;
                    this.updateServerDisplay();
                    this.showNotification('Server status updated');
                })
                .catch(error => {
                    console.error('Error updating server status:', error);
                    this.showNotification('Failed to update server status', 'error');
                });
        }
    }
    
    /**
     * Update the server display with current server status
     */
    updateServerDisplay() {
        const serverGrid = document.getElementById('server-status-grid');
        if (!serverGrid) return;
        
        // Clear current content
        serverGrid.innerHTML = '';
        
        // Get servers from bridge if available
        if (!this.servers && window.serverBridge) {
            this.servers = window.serverBridge.servers;
        }
        
        // If no servers available, show message
        if (!this.servers || Object.keys(this.servers).length === 0) {
            serverGrid.innerHTML = `
                <div class="server-status-empty">
                    <p>No servers available</p>
                    <button class="server-button refresh-servers-btn">Refresh</button>
                </div>
            `;
            return;
        }
        
        // Update server logs filter dropdown with available servers
        const logsFilter = document.getElementById('server-logs-filter');
        if (logsFilter) {
            // Save current selection
            const currentSelection = logsFilter.value;
            
            // Clear current options except "All Servers"
            while (logsFilter.options.length > 1) {
                logsFilter.remove(1);
            }
            
            // Add options for each server
            for (const [id, server] of Object.entries(this.servers)) {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = server.name || id;
                logsFilter.appendChild(option);
            }
            
            // Restore selection if possible
            if (currentSelection && Array.from(logsFilter.options).some(option => option.value === currentSelection)) {
                logsFilter.value = currentSelection;
            }
        }
        
        // Create server cards
        for (const [id, server] of Object.entries(this.servers)) {
            const serverCard = document.createElement('div');
            serverCard.className = 'server-card';
            serverCard.dataset.serverId = id;
            
            // Determine status class
            let statusClass = 'status-stopped';
            if (server.status === 'running') statusClass = 'status-running';
            else if (server.status === 'starting') statusClass = 'status-starting';
            
            // Generate metrics HTML
            let metricsHtml = '';
            if (server.metrics) {
                for (const [metricName, metricValue] of Object.entries(server.metrics)) {
                    metricsHtml += `
                        <div class="server-metric">
                            <div class="metric-name">${this.formatKey(metricName)}</div>
                            <div class="metric-value">${metricValue}</div>
                        </div>
                    `;
                }
            }
            
            // Server type icon based on ID
            let serverIcon = '🖥️';
            if (id.includes('mcp')) serverIcon = '🌐';
            else if (id.includes('metrics')) serverIcon = '📊';
            else if (id.includes('claude')) serverIcon = '🧠';
            
            serverCard.innerHTML = `
                <div class="server-header">
                    <div class="server-name">
                        <span class="server-icon">${serverIcon}</span>
                        ${server.name || id}
                    </div>
                    <div class="server-status ${statusClass}">
                        ${server.status || 'Unknown'}
                    </div>
                </div>
                <div class="server-details">
                    <div class="server-info">
                        <div class="server-info-item">
                            <span class="server-info-label">Port:</span>
                            <span class="server-info-value">${server.port || 'N/A'}</span>
                        </div>
                        <div class="server-info-item">
                            <span class="server-info-label">PID:</span>
                            <span class="server-info-value">${server.pid || 'N/A'}</span>
                        </div>
                        <div class="server-info-item">
                            <span class="server-info-label">Uptime:</span>
                            <span class="server-info-value">${server.uptime ? this.formatUptime(server.uptime) : 'N/A'}</span>
                        </div>
                    </div>
                    <div class="server-metrics">
                        ${metricsHtml || '<div class="server-no-metrics">No metrics available</div>'}
                    </div>
                </div>
                <div class="server-controls">
                    <button class="server-button start-server" data-server-id="${id}" ${server.status === 'running' ? 'disabled' : ''}>
                        <span class="server-button-icon">▶</span> Start
                    </button>
                    <button class="server-button stop-server" data-server-id="${id}" ${server.status !== 'running' ? 'disabled' : ''}>
                        <span class="server-button-icon">■</span> Stop
                    </button>
                    <button class="server-button restart-server" data-server-id="${id}" ${server.status !== 'running' ? 'disabled' : ''}>
                        <span class="server-button-icon">↻</span> Restart
                    </button>
                    <button class="server-button view-logs-server" data-server-id="${id}">
                        <span class="server-button-icon">📋</span> Logs
                    </button>
                </div>
            `;
            
            serverGrid.appendChild(serverCard);
        }
    }
    
    /**
     * Update server logs display
     * @param {Object} logs - Server logs data
     */
    updateServerLogs(logs) {
        if (!this.logsContainer) return;
        
        // If no logs provided, try to get them from server bridge
        if (!logs && window.serverBridge) {
            logs = window.serverBridge.logs;
        }
        
        // If still no logs, return
        if (!logs || Object.keys(logs).length === 0) {
            this.logsContainer.innerHTML = `<div class="log-empty">No logs available</div>`;
            return;
        }
        
        // Get current scroll position and check if at bottom
        const isAtBottom = this.logsContainer.scrollHeight - this.logsContainer.scrollTop <= this.logsContainer.clientHeight + 10;
        
        // Build HTML for logs
        let logEntries = [];
        
        for (const [serverId, serverLogs] of Object.entries(logs)) {
            // Skip if filtering by server and this isn't the selected one
            if (this.logFilter !== 'all' && this.logFilter !== serverId) continue;
            
            for (const logEntry of serverLogs) {
                // Get log level and skip if filtering by level
                const logLevel = logEntry.level || 'info';
                if (this.logLevel !== 'all' && this.logLevel !== logLevel) continue;
                
                // Determine log level class
                let levelClass = 'log-level-info';
                if (logLevel === 'warning') levelClass = 'log-level-warning';
                else if (logLevel === 'error') levelClass = 'log-level-error';
                else if (logLevel === 'success') levelClass = 'log-level-success';
                
                // Add log entry with timestamp
                logEntries.push({
                    timestamp: logEntry.timestamp || new Date().toISOString(),
                    html: `
                        <div class="log-entry" data-server="${serverId}" data-level="${logLevel}">
                            <span class="log-timestamp">${this.formatTimestamp(logEntry.timestamp)}</span>
                            <span class="log-server">[${serverId}]</span>
                            <span class="${levelClass}">${logEntry.message}</span>
                        </div>
                    `
                });
            }
        }
        
        // Sort log entries by timestamp (newest first)
        logEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Get limited number of entries to avoid performance issues
        logEntries = logEntries.slice(0, 500);
        
        // Reverse to show oldest first
        logEntries.reverse();
        
        // Join HTML and update container
        this.logsContainer.innerHTML = logEntries.map(entry => entry.html).join('');
        
        // Restore scroll position if auto-scroll enabled
        if (this.logAutoScroll && isAtBottom) {
            this.logsContainer.scrollTop = this.logsContainer.scrollHeight;
        }
    }
    
    /**
     * Start a server
     * @param {string} serverId - ID of the server to start
     */
    startServer(serverId) {
        if (window.serverBridge) {
            // Disable button to prevent multiple clicks
            const button = document.querySelector(`.start-server[data-server-id="${serverId}"]`);
            if (button) button.disabled = true;
            
            window.serverBridge.startServer(serverId)
                .then(() => {
                    this.showNotification(`Server ${serverId} started successfully`);
                    // Update server status after a short delay to allow for startup
                    setTimeout(() => this.updateServerStatus(), 1000);
                })
                .catch(error => {
                    this.showNotification(`Failed to start server ${serverId}`, 'error');
                    console.error(`Error starting server ${serverId}:`, error);
                    // Re-enable button on failure
                    if (button) button.disabled = false;
                });
        }
    }
    
    /**
     * Stop a server
     * @param {string} serverId - ID of the server to stop
     */
    stopServer(serverId) {
        if (window.serverBridge) {
            // Disable button to prevent multiple clicks
            const button = document.querySelector(`.stop-server[data-server-id="${serverId}"]`);
            if (button) button.disabled = true;
            
            window.serverBridge.stopServer(serverId)
                .then(() => {
                    this.showNotification(`Server ${serverId} stopped successfully`);
                    // Update server status after a short delay to allow for shutdown
                    setTimeout(() => this.updateServerStatus(), 1000);
                })
                .catch(error => {
                    this.showNotification(`Failed to stop server ${serverId}`, 'error');
                    console.error(`Error stopping server ${serverId}:`, error);
                    // Re-enable button on failure
                    if (button) button.disabled = false;
                });
        }
    }
    
    /**
     * Restart a server
     * @param {string} serverId - ID of the server to restart
     */
    restartServer(serverId) {
        if (window.serverBridge) {
            // Disable button to prevent multiple clicks
            const button = document.querySelector(`.restart-server[data-server-id="${serverId}"]`);
            if (button) button.disabled = true;
            
            window.serverBridge.restartServer(serverId)
                .then(() => {
                    this.showNotification(`Server ${serverId} restarted successfully`);
                    // Update server status after a short delay to allow for restart
                    setTimeout(() => this.updateServerStatus(), 1000);
                })
                .catch(error => {
                    this.showNotification(`Failed to restart server ${serverId}`, 'error');
                    console.error(`Error restarting server ${serverId}:`, error);
                    // Re-enable button on failure
                    if (button) button.disabled = false;
                });
        }
    }
    
    /**
     * View logs for a specific server
     * @param {string} serverId - ID of the server to view logs for
     */
    viewServerLogs(serverId) {
        // Set the log filter dropdown to the selected server
        const logsFilter = document.getElementById('server-logs-filter');
        if (logsFilter) {
            logsFilter.value = serverId;
        }
        
        // Update the log filter
        this.setLogFilter(serverId);
        
        // Make sure logs section is visible
        // This depends on your UI structure
        const logsSection = this.logsContainer.closest('.card, .section');
        if (logsSection) {
            // Scroll to the logs section
            logsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    /**
     * Clear server logs
     */
    clearServerLogs() {
        if (this.logsContainer) {
            this.logsContainer.innerHTML = `
                <div class="log-entry">
                    <span class="log-timestamp">${this.formatTimestamp(new Date().toISOString())}</span>
                    <span class="log-level-info">Logs cleared</span>
                </div>
            `;
        }
    }
    
    /**
     * Set the log filter
     * @param {string} filter - Server ID to filter by or 'all'
     */
    setLogFilter(filter) {
        this.logFilter = filter;
        this.updateServerLogs();
    }
    
    /**
     * Set the log level filter
     * @param {string} level - Log level to filter by or 'all'
     */
    setLogLevel(level) {
        this.logLevel = level;
        this.updateServerLogs();
    }
    
    /**
     * Start the refresh interval
     */
    startRefreshInterval() {
        // Clear any existing interval
        this.stopRefreshInterval();
        
        // Don't start interval if refresh rate is 0
        if (this.refreshRate <= 0) return;
        
        // Start new interval
        this.refreshInterval = setInterval(() => {
            this.updateServerStatus();
        }, this.refreshRate);
    }
    
    /**
     * Stop the refresh interval
     */
    stopRefreshInterval() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
    
    /**
     * Set the refresh rate
     * @param {number} rate - Refresh rate in milliseconds
     */
    setRefreshRate(rate) {
        this.refreshRate = rate;
        
        // Restart interval with new rate
        this.stopRefreshInterval();
        
        if (rate > 0) {
            this.startRefreshInterval();
        }
    }
    
    /**
     * Format a key string to be more readable
     * @param {string} key - Key to format
     * @returns {string} - Formatted key
     */
    formatKey(key) {
        // Convert camelCase to Title Case with spaces
        return key
            // Insert a space before capital letters and uppercase the first letter
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    }
    
    /**
     * Format a timestamp
     * @param {string} timestamp - Timestamp to format
     * @returns {string} - Formatted timestamp
     */
    formatTimestamp(timestamp) {
        if (!timestamp) return '00:00:00';
        
        // If timestamp is ISO format, convert to time only
        if (typeof timestamp === 'string' && timestamp.includes('T')) {
            const date = new Date(timestamp);
            return date.toTimeString().split(' ')[0];
        }
        
        return timestamp;
    }
    
    /**
     * Format uptime
     * @param {number} uptime - Uptime in milliseconds
     * @returns {string} - Formatted uptime
     */
    formatUptime(uptime) {
        if (!uptime) return 'N/A';
        
        // Convert to seconds
        let seconds = Math.floor(uptime / 1000);
        
        // Calculate hours, minutes, seconds
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;
        
        // Format as HH:MM:SS
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Show a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, warning, error)
     */
    showNotification(message, type = 'success') {
        // Use unified dashboard's notification system if available
        if (window.unifiedDashboard && window.unifiedDashboard.showNotification) {
            window.unifiedDashboard.showNotification(message, type);
            return;
        }
        
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set notification content and style
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Remove element after animation completes
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Create and export singleton instance
window.serverStatusDisplay = new ServerStatusDisplay();