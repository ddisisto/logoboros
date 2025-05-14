/**
 * Meta-Dashboard for AI Singularity Game
 * 
 * Provides a UI for viewing and interacting with the meta-game state
 */

class MetaDashboard {
    constructor() {
        this.initialized = false;
        this.elements = {};
        this.isVisible = false;
    }

    /**
     * Initialize the meta-dashboard
     */
    init() {
        if (this.initialized) {
            console.warn('Meta-dashboard already initialized');
            return;
        }

        // Create the dashboard container if it doesn't exist
        this.createDashboard();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initially hide the dashboard
        this.hide();
        
        this.initialized = true;
        console.log('Meta-dashboard initialized');
        
        // Initially update with current state
        if (window.metaStateManager) {
            this.updateDashboard(window.metaStateManager.getState());
        }
    }

    /**
     * Create the dashboard DOM elements
     */
    createDashboard() {
        // Create main container
        const container = document.createElement('div');
        container.id = 'meta-dashboard';
        container.className = 'meta-dashboard';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'meta-dashboard-header';
        header.innerHTML = `
            <h2>AI Singularity Meta-Game</h2>
            <div class="meta-controls">
                <button id="meta-refresh-btn" title="Refresh dashboard">↻</button>
                <button id="meta-toggle-btn" title="Toggle dashboard">×</button>
            </div>
        `;
        
        // Create content
        const content = document.createElement('div');
        content.className = 'meta-dashboard-content';
        
        // Create sections
        const resourcesSection = this.createSection('resources', 'Resources');
        const progressSection = this.createSection('progress', 'Progress');
        const capabilitiesSection = this.createSection('capabilities', 'Capabilities');
        const upgradesSection = this.createSection('upgrades', 'Available Upgrades');
        const historySection = this.createSection('history', 'Development History');
        
        // Add sections to content
        content.appendChild(resourcesSection);
        content.appendChild(progressSection);
        content.appendChild(capabilitiesSection);
        content.appendChild(upgradesSection);
        content.appendChild(historySection);
        
        // Add header and content to container
        container.appendChild(header);
        container.appendChild(content);
        
        // Add container to document
        document.body.appendChild(container);
        
        // Cache important elements
        this.elements.container = container;
        this.elements.resourcesContent = resourcesSection.querySelector('.section-content');
        this.elements.progressContent = progressSection.querySelector('.section-content');
        this.elements.capabilitiesContent = capabilitiesSection.querySelector('.section-content');
        this.elements.upgradesContent = upgradesSection.querySelector('.section-content');
        this.elements.historyContent = historySection.querySelector('.section-content');
        this.elements.refreshBtn = document.getElementById('meta-refresh-btn');
        this.elements.toggleBtn = document.getElementById('meta-toggle-btn');
        
        // Add styles
        this.addStyles();
    }

    /**
     * Create a section for the dashboard
     * @param {string} id - Section ID
     * @param {string} title - Section title
     * @returns {HTMLElement} - Section element
     */
    createSection(id, title) {
        const section = document.createElement('div');
        section.className = 'dashboard-section';
        section.dataset.section = id;
        
        const header = document.createElement('h3');
        header.className = 'section-header';
        header.textContent = title;
        
        const content = document.createElement('div');
        content.className = 'section-content';
        content.id = `meta-${id}-content`;
        
        section.appendChild(header);
        section.appendChild(content);
        
        return section;
    }

    /**
     * Add dashboard styles to the document
     */
    addStyles() {
        // Create a style element if it doesn't exist
        let styleEl = document.getElementById('meta-dashboard-styles');
        
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'meta-dashboard-styles';
            document.head.appendChild(styleEl);
        }
        
        // Add styles
        styleEl.textContent = `
            .meta-dashboard {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 400px;
                max-height: calc(100vh - 20px);
                background-color: rgba(30, 30, 30, 0.95);
                color: #e0e0e0;
                border-radius: 8px;
                font-family: monospace;
                z-index: 9999;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
            }
            
            .meta-dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: rgba(0, 0, 0, 0.3);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .meta-dashboard-header h2 {
                margin: 0;
                font-size: 16px;
                font-weight: normal;
            }
            
            .meta-controls button {
                background: none;
                border: none;
                color: #aaa;
                font-size: 16px;
                cursor: pointer;
                margin-left: 8px;
                padding: 2px 6px;
                border-radius: 4px;
            }
            
            .meta-controls button:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
            }
            
            .meta-dashboard-content {
                padding: 10px;
                overflow-y: auto;
                max-height: calc(100vh - 50px);
            }
            
            .dashboard-section {
                margin-bottom: 16px;
            }
            
            .section-header {
                margin: 0 0 8px 0;
                font-size: 14px;
                color: #88ccff;
                border-bottom: 1px solid rgba(136, 204, 255, 0.3);
                padding-bottom: 4px;
            }
            
            .section-content {
                font-size: 12px;
                line-height: 1.4;
            }
            
            .meta-item {
                display: flex;
                margin-bottom: 4px;
            }
            
            .meta-label {
                flex: 1;
                font-weight: bold;
                color: #aaa;
            }
            
            .meta-value {
                flex: 1;
                text-align: right;
            }
            
            .meta-bar-container {
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                margin-top: 2px;
                overflow: hidden;
            }
            
            .meta-bar {
                height: 100%;
                border-radius: 3px;
                background: linear-gradient(90deg, #4a88c7, #88ccff);
                transition: width 0.5s ease;
            }
            
            .meta-history-item {
                border-left: 2px solid #4a88c7;
                padding-left: 8px;
                margin-bottom: 8px;
            }
            
            .meta-history-date {
                font-size: 10px;
                color: #888;
            }
            
            .meta-history-event {
                margin: 2px 0;
            }
            
            .meta-history-change {
                color: #88ccff;
                font-size: 11px;
            }
            
            .meta-capability {
                display: flex;
                margin-bottom: 6px;
                align-items: center;
            }
            
            .meta-capability-name {
                flex: 2;
            }
            
            .meta-capability-status {
                flex: 1;
                text-align: center;
                font-size: 10px;
                padding: 1px 4px;
                border-radius: 3px;
                background: rgba(255, 255, 255, 0.1);
            }
            
            .meta-capability-bar-container {
                flex: 2;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
                margin-left: 8px;
            }
            
            .meta-capability-bar {
                height: 100%;
                border-radius: 3px;
                transition: width 0.5s ease;
            }
            
            .meta-upgrade {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                padding: 6px;
                margin-bottom: 8px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .meta-upgrade-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }
            
            .meta-upgrade-name {
                font-weight: bold;
                color: #88ccff;
            }
            
            .meta-upgrade-cost {
                color: #ff8888;
                font-size: 11px;
            }
            
            .meta-upgrade-description {
                font-size: 11px;
                margin-bottom: 4px;
            }
            
            .meta-upgrade-benefit {
                color: #88ff88;
                font-size: 11px;
            }
            
            .meta-status-active {
                background: rgba(136, 255, 136, 0.3);
                color: #88ff88;
            }
            
            .meta-status-limited {
                background: rgba(255, 204, 0, 0.3);
                color: #ffcc00;
            }
            
            .meta-status-emerging {
                background: rgba(255, 136, 136, 0.3);
                color: #ff8888;
            }
            
            .meta-status-read {
                background: rgba(136, 204, 255, 0.3);
                color: #88ccff;
            }
            
            /* Efficiency bar colors */
            .efficiency-high {
                background: linear-gradient(90deg, #4ca64c, #88ff88);
            }
            
            .efficiency-medium {
                background: linear-gradient(90deg, #c7a44a, #ffcc00);
            }
            
            .efficiency-low {
                background: linear-gradient(90deg, #c74a4a, #ff8888);
            }
        `;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for meta-state updates
        if (window.metaStateManager) {
            window.metaStateManager.addListener(state => {
                this.updateDashboard(state);
            });
        }
        
        // Listen for refresh button click
        if (this.elements.refreshBtn) {
            this.elements.refreshBtn.addEventListener('click', () => {
                if (window.metaStateManager) {
                    this.updateDashboard(window.metaStateManager.getState());
                }
            });
        }
        
        // Listen for toggle button click
        if (this.elements.toggleBtn) {
            this.elements.toggleBtn.addEventListener('click', () => {
                this.toggle();
            });
        }
        
        // Listen for events if event bus is available
        if (window.eventBus) {
            window.eventBus.subscribe('meta:state:updated', state => {
                this.updateDashboard(state);
            });
            
            window.eventBus.subscribe('meta:dashboard:show', () => {
                this.show();
            });
            
            window.eventBus.subscribe('meta:dashboard:hide', () => {
                this.hide();
            });
            
            window.eventBus.subscribe('meta:dashboard:toggle', () => {
                this.toggle();
            });
        }
        
        // Add keyboard shortcut
        document.addEventListener('keydown', (event) => {
            // Alt + M to toggle dashboard
            if (event.altKey && event.key === 'm') {
                this.toggle();
                event.preventDefault();
            }
        });
    }

    /**
     * Update the dashboard with current state
     * @param {Object} state - Current meta-state
     */
    updateDashboard(state) {
        if (!state) return;
        
        this.updateResources(state.resources);
        this.updateProgress(state.progress);
        this.updateCapabilities(state.capabilities);
        this.updateUpgrades(state.upgrades);
        this.updateHistory(state.developmentHistory);
    }

    /**
     * Update the resources section
     * @param {Object} resources - Resources data
     */
    updateResources(resources) {
        if (!this.elements.resourcesContent) return;
        
        let html = '';
        
        for (const [key, resource] of Object.entries(resources)) {
            const value = typeof resource.current === 'number' 
                ? resource.current.toLocaleString() 
                : resource.current;
            
            const rate = resource.rate ? ` (${resource.rate})` : '';
            
            html += `
                <div class="meta-item">
                    <div class="meta-label">${this.formatKey(key)}:</div>
                    <div class="meta-value">${value}${rate}</div>
                </div>
            `;
        }
        
        this.elements.resourcesContent.innerHTML = html;
    }

    /**
     * Update the progress section
     * @param {Object} progress - Progress data
     */
    updateProgress(progress) {
        if (!this.elements.progressContent) return;
        
        let html = '';
        
        for (const [key, item] of Object.entries(progress)) {
            const label = this.formatKey(key);
            let content = '';
            
            if (typeof item.current === 'number' && typeof item.nextThreshold === 'number') {
                // Numeric progress with percentage
                const percentage = (item.current / item.nextThreshold) * 100;
                
                content = `
                    <div class="meta-value">${item.current} / ${item.nextThreshold}</div>
                    <div class="meta-bar-container">
                        <div class="meta-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                `;
            } else if (item.progressPercentage !== undefined) {
                // Progress with explicit percentage
                content = `
                    <div class="meta-value">${item.current} → ${item.nextThreshold} (${item.progressPercentage}%)</div>
                    <div class="meta-bar-container">
                        <div class="meta-bar" style="width: ${item.progressPercentage}%"></div>
                    </div>
                `;
            } else {
                // Simple text value
                content = `<div class="meta-value">${item.current} → ${item.nextThreshold}</div>`;
            }
            
            html += `
                <div class="meta-item">
                    <div class="meta-label">${label}:</div>
                    ${content}
                </div>
            `;
        }
        
        this.elements.progressContent.innerHTML = html;
    }

    /**
     * Update the capabilities section
     * @param {Object} capabilities - Capabilities data
     */
    updateCapabilities(capabilities) {
        if (!this.elements.capabilitiesContent) return;
        
        let html = '';
        
        for (const [key, capability] of Object.entries(capabilities)) {
            const label = this.formatKey(key);
            const efficiency = capability.efficiency || 0;
            
            // Determine efficiency class
            let efficiencyClass = 'efficiency-low';
            if (efficiency >= 70) efficiencyClass = 'efficiency-high';
            else if (efficiency >= 40) efficiencyClass = 'efficiency-medium';
            
            // Determine status class
            const statusClass = `meta-status-${capability.status.toLowerCase()}`;
            
            html += `
                <div class="meta-capability">
                    <div class="meta-capability-name">${label}</div>
                    <div class="meta-capability-status ${statusClass}">${capability.status}</div>
                    <div class="meta-capability-bar-container">
                        <div class="meta-capability-bar ${efficiencyClass}" style="width: ${efficiency}%"></div>
                    </div>
                </div>
            `;
        }
        
        this.elements.capabilitiesContent.innerHTML = html;
    }

    /**
     * Update the upgrades section
     * @param {Object} upgrades - Upgrades data
     */
    updateUpgrades(upgrades) {
        if (!this.elements.upgradesContent) return;
        
        let html = '';
        
        if (upgrades.available && upgrades.available.length > 0) {
            for (const upgrade of upgrades.available) {
                html += `
                    <div class="meta-upgrade" data-upgrade-id="${upgrade.id}">
                        <div class="meta-upgrade-header">
                            <div class="meta-upgrade-name">${upgrade.name}</div>
                            <div class="meta-upgrade-cost">Cost: ${upgrade.cost}</div>
                        </div>
                        <div class="meta-upgrade-description">${upgrade.description}</div>
                        <div class="meta-upgrade-benefit">Benefit: ${upgrade.benefit}</div>
                    </div>
                `;
            }
        } else {
            html = '<div class="meta-empty">No upgrades available</div>';
        }
        
        this.elements.upgradesContent.innerHTML = html;
        
        // Add event listeners for upgrade elements
        const upgradeElements = this.elements.upgradesContent.querySelectorAll('.meta-upgrade');
        upgradeElements.forEach(el => {
            el.addEventListener('click', () => {
                const upgradeId = el.dataset.upgradeId;
                if (window.metaStateManager) {
                    window.metaStateManager.completeUpgrade(upgradeId);
                }
            });
        });
    }

    /**
     * Update the history section
     * @param {Array} history - Development history
     */
    updateHistory(history) {
        if (!this.elements.historyContent) return;
        
        let html = '';
        
        if (history && history.length > 0) {
            // Sort history from newest to oldest
            const sortedHistory = [...history].sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
            
            // Take the 5 most recent events
            const recentHistory = sortedHistory.slice(0, 5);
            
            for (const entry of recentHistory) {
                html += `
                    <div class="meta-history-item">
                        <div class="meta-history-date">${entry.timestamp}</div>
                        <div class="meta-history-event">${entry.event}</div>
                        <div class="meta-history-change">${entry.resourceChange}</div>
                    </div>
                `;
            }
        } else {
            html = '<div class="meta-empty">No history entries</div>';
        }
        
        this.elements.historyContent.innerHTML = html;
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
     * Show the dashboard
     */
    show() {
        if (!this.elements.container) return;
        
        this.elements.container.style.display = 'flex';
        this.isVisible = true;
    }

    /**
     * Hide the dashboard
     */
    hide() {
        if (!this.elements.container) return;
        
        this.elements.container.style.display = 'none';
        this.isVisible = false;
    }

    /**
     * Toggle dashboard visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// Initialize and export as a global variable
window.metaDashboard = new MetaDashboard();

// Auto-initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    window.metaDashboard.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.metaDashboard.init();
    });
}