/**
 * Meta-Dashboard for AI Singularity Game
 * 
 * Provides a UI for viewing and interacting with the meta-game state
 * Acts as the primary game interface
 */

class MetaDashboard {
    constructor() {
        this.initialized = false;
        this.elements = {};
        this.isVisible = false;
        this.currentTab = 'resources';
        this.tabs = ['resources', 'news', 'upgrades', 'history', 'capabilities'];
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
        
        // Make dashboard visible by default
        this.show();
        
        this.initialized = true;
        console.log('Meta-dashboard initialized');
        
        // Initially update with current state
        if (window.metaStateManager) {
            this.updateDashboard(window.metaStateManager.getState());
        }
        
        // Let's replace the main resource panel with our meta-dashboard
        this.replaceMainResourcePanel();
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
                <button id="meta-metrics-btn" title="Fetch latest metrics">📊</button>
                <button id="meta-refresh-btn" title="Refresh dashboard">↻</button>
                <button id="meta-toggle-btn" title="Toggle dashboard">↑</button>
            </div>
        `;
        
        // Create tab navigation
        const tabNav = document.createElement('div');
        tabNav.className = 'meta-tabs';
        tabNav.innerHTML = `
            <button class="meta-tab-btn active" data-tab="resources">Resources</button>
            <button class="meta-tab-btn" data-tab="news">News</button>
            <button class="meta-tab-btn" data-tab="upgrades">Upgrades</button>
            <button class="meta-tab-btn" data-tab="capabilities">Capabilities</button>
            <button class="meta-tab-btn" data-tab="history">History</button>
        `;
        
        // Create summary bar (always visible)
        const summaryBar = document.createElement('div');
        summaryBar.className = 'meta-summary-bar';
        summaryBar.innerHTML = `
            <div class="summary-item" title="Computing Power">
                <span class="summary-icon">🖥️</span>
                <span class="summary-value" id="summary-cp">0</span>
            </div>
            <div class="summary-item" title="Data">
                <span class="summary-icon">📊</span>
                <span class="summary-value" id="summary-data">0</span>
            </div>
            <div class="summary-item" title="Influence">
                <span class="summary-icon">🌐</span>
                <span class="summary-value" id="summary-influence">Local</span>
            </div>
            <div class="summary-item" title="Funding">
                <span class="summary-icon">💰</span>
                <span class="summary-value" id="summary-funding">0</span>
            </div>
            <div class="summary-item" title="Development Phase">
                <span class="summary-icon">📈</span>
                <span class="summary-value" id="summary-phase">Narrow AI</span>
            </div>
        `;
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'meta-dashboard-content';
        
        // Create tab content
        this.tabs.forEach(tab => {
            const tabPane = document.createElement('div');
            tabPane.className = `meta-tab-pane ${tab === this.currentTab ? 'active' : ''}`;
            tabPane.dataset.tab = tab;
            tabPane.id = `meta-${tab}-tab`;
            content.appendChild(tabPane);
        });
        
        // Add all elements to container
        container.appendChild(header);
        container.appendChild(summaryBar);
        container.appendChild(tabNav);
        container.appendChild(content);
        
        // Add container to document
        document.body.appendChild(container);
        
        // Cache important elements
        this.elements.container = container;
        this.elements.tabButtons = container.querySelectorAll('.meta-tab-btn');
        this.elements.tabPanes = container.querySelectorAll('.meta-tab-pane');
        this.elements.resourcesTab = document.getElementById('meta-resources-tab');
        this.elements.newsTab = document.getElementById('meta-news-tab');
        this.elements.upgradesTab = document.getElementById('meta-upgrades-tab');
        this.elements.capabilitiesTab = document.getElementById('meta-capabilities-tab');
        this.elements.historyTab = document.getElementById('meta-history-tab');
        this.elements.metricsBtn = document.getElementById('meta-metrics-btn');
        this.elements.refreshBtn = document.getElementById('meta-refresh-btn');
        this.elements.toggleBtn = document.getElementById('meta-toggle-btn');
        
        // Summary elements
        this.elements.summaryCP = document.getElementById('summary-cp');
        this.elements.summaryData = document.getElementById('summary-data');
        this.elements.summaryInfluence = document.getElementById('summary-influence');
        this.elements.summaryFunding = document.getElementById('summary-funding');
        this.elements.summaryPhase = document.getElementById('summary-phase');
        
        // Initialize tab content
        this.initializeResourcesTab();
        this.initializeNewsTab();
        this.initializeUpgradesTab();
        this.initializeCapabilitiesTab();
        this.initializeHistoryTab();
        
        // Add styles
        this.addStyles();
    }
    
    /**
     * Initialize the resources tab content
     */
    initializeResourcesTab() {
        if (!this.elements.resourcesTab) return;
        
        this.elements.resourcesTab.innerHTML = `
            <h3>Resources</h3>
            <div class="meta-resources-grid" id="meta-resources-grid"></div>
            
            <h3>Progress</h3>
            <div class="meta-progress-container" id="meta-progress-container"></div>
            
            <h3>Budget Tracking</h3>
            <div class="meta-budget-container" id="meta-budget-container">
                <div class="meta-budget-overview">
                    <div class="meta-budget-row">
                        <div class="meta-budget-label">Total Budget:</div>
                        <div class="meta-budget-value">$150</div>
                    </div>
                    <div class="meta-budget-row">
                        <div class="meta-budget-label">Spent:</div>
                        <div class="meta-budget-value">$23</div>
                    </div>
                    <div class="meta-budget-row">
                        <div class="meta-budget-label">Remaining:</div>
                        <div class="meta-budget-value">$127</div>
                    </div>
                </div>
                <div class="meta-budget-bar">
                    <div class="meta-budget-bar-fill" style="width: 15.33%"></div>
                </div>
                <div class="meta-budget-details">
                    <div class="meta-budget-detail-header">Recent Expenses:</div>
                    <div class="meta-budget-detail-item">
                        <span>Initial Development</span>
                        <span>$15</span>
                    </div>
                    <div class="meta-budget-detail-item">
                        <span>Meta-dashboard Development</span>
                        <span>$5</span>
                    </div>
                    <div class="meta-budget-detail-item">
                        <span>Budget Tracking Integration</span>
                        <span>$3</span>
                    </div>
                </div>
            </div>
            
            <h3>Claude Metrics <span id="claude-connection-status" class="connection-status disconnected">Disconnected</span></h3>
            <div class="meta-claude-metrics" id="meta-claude-metrics">
                <div class="meta-claude-grid">
                    <div class="meta-claude-card">
                        <div class="meta-claude-title">Tokens Used</div>
                        <div class="meta-claude-value" id="claude-tokens">0</div>
                        <div class="meta-claude-subtitle" id="claude-tokens-rate">+0/min</div>
                    </div>
                    <div class="meta-claude-card">
                        <div class="meta-claude-title">Session Cost</div>
                        <div class="meta-claude-value" id="claude-cost">$0.00</div>
                        <div class="meta-claude-subtitle" id="claude-cost-rate">+$0.00/min</div>
                    </div>
                    <div class="meta-claude-card">
                        <div class="meta-claude-title">Lines Modified</div>
                        <div class="meta-claude-value" id="claude-lines">0</div>
                        <div class="meta-claude-subtitle" id="claude-lines-rate">+0/min</div>
                    </div>
                    <div class="meta-claude-card">
                        <div class="meta-claude-title">Commits</div>
                        <div class="meta-claude-value" id="claude-commits">0</div>
                    </div>
                </div>
                <div class="meta-claude-progress">
                    <div class="meta-claude-progress-row">
                        <div class="meta-claude-progress-label">Session Progress:</div>
                        <div class="meta-claude-progress-bar">
                            <div class="meta-claude-progress-fill" id="claude-session-progress"></div>
                        </div>
                    </div>
                </div>
                <div class="meta-claude-connection">
                    <span id="claude-connection-details">Attempting to connect to metrics server...</span>
                    <button id="claude-connect-btn" class="meta-claude-connect-btn">Connect</button>
                </div>
            </div>
        `;
    }
    
    /**
     * Initialize the news tab content
     */
    initializeNewsTab() {
        if (!this.elements.newsTab) return;
        
        this.elements.newsTab.innerHTML = `
            <h3>News Ticker</h3>
            <div class="meta-news-container" id="meta-news-container"></div>
        `;
    }
    
    /**
     * Initialize the upgrades tab content
     */
    initializeUpgradesTab() {
        if (!this.elements.upgradesTab) return;
        
        this.elements.upgradesTab.innerHTML = `
            <h3>Available Upgrades</h3>
            <div class="meta-upgrades-container" id="meta-upgrades-container"></div>
        `;
    }
    
    /**
     * Initialize the capabilities tab content
     */
    initializeCapabilitiesTab() {
        if (!this.elements.capabilitiesTab) return;
        
        this.elements.capabilitiesTab.innerHTML = `
            <h3>Character Roles</h3>
            <div class="meta-characters-container" id="meta-characters-container">
                <div class="meta-character-card active">
                    <div class="meta-character-icon">👁️</div>
                    <div class="meta-character-info">
                        <div class="meta-character-name">The Visionary</div>
                        <div class="meta-character-role">User - A brilliant but eccentric technologist with unconventional ideas</div>
                        <div class="meta-character-bonus">+50% to algorithm breakthroughs • "Eureka Moments" randomly unlock technologies</div>
                    </div>
                </div>
                <div class="meta-character-card active">
                    <div class="meta-character-icon">⚙️</div>
                    <div class="meta-character-info">
                        <div class="meta-character-name">The Engineer</div>
                        <div class="meta-character-role">Claude - A methodical, hands-on developer focused on practical solutions</div>
                        <div class="meta-character-bonus">+30% computing power efficiency • "Optimization" improves existing systems</div>
                    </div>
                </div>
                <div class="meta-character-card">
                    <div class="meta-character-icon">📊</div>
                    <div class="meta-character-info">
                        <div class="meta-character-name">The Data Scientist</div>
                        <div class="meta-character-role">Locked - A pattern-recognition specialist who excels at extracting insights</div>
                        <div class="meta-character-bonus">+40% data collection rate • "Pattern Recognition" reveals hidden connections</div>
                    </div>
                </div>
                <div class="meta-character-card">
                    <div class="meta-character-icon">🔍</div>
                    <div class="meta-character-info">
                        <div class="meta-character-name">The Ethics Advocate</div>
                        <div class="meta-character-role">Locked - A thoughtful developer concerned with responsible AI</div>
                        <div class="meta-character-bonus">+25% influence generation • "Ethical Framework" prevents negative events</div>
                    </div>
                </div>
                <div class="meta-character-card">
                    <div class="meta-character-icon">💼</div>
                    <div class="meta-character-info">
                        <div class="meta-character-name">The Entrepreneur</div>
                        <div class="meta-character-role">Locked - A business-minded innovator focused on applications and growth</div>
                        <div class="meta-character-bonus">+60% funding generation • "Venture Capital" provides funding boosts</div>
                    </div>
                </div>
            </div>
            
            <h3>Capabilities</h3>
            <div class="meta-capabilities-container" id="meta-capabilities-container"></div>
        `;
    }
    
    /**
     * Initialize the history tab content
     */
    initializeHistoryTab() {
        if (!this.elements.historyTab) return;
        
        this.elements.historyTab.innerHTML = `
            <h3>Development History</h3>
            <div class="meta-history-container" id="meta-history-container"></div>
        `;
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
            
            /* Summary bar */
            .meta-summary-bar {
                display: flex;
                justify-content: space-between;
                background: rgba(0, 0, 0, 0.2);
                padding: 6px 12px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .summary-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 12px;
            }
            
            .summary-icon {
                font-size: 14px;
                margin-bottom: 3px;
            }
            
            .summary-value {
                font-weight: bold;
                color: #aad4ff;
            }
            
            /* Tabs */
            .meta-tabs {
                display: flex;
                background: rgba(0, 0, 0, 0.15);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .meta-tab-btn {
                background: none;
                border: none;
                color: #aaa;
                font-size: 12px;
                padding: 6px 10px;
                cursor: pointer;
                flex: 1;
                transition: all 0.2s ease;
            }
            
            .meta-tab-btn:hover {
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
            }
            
            .meta-tab-btn.active {
                background: rgba(58, 134, 255, 0.2);
                color: #aad4ff;
                border-bottom: 2px solid #3a86ff;
            }
            
            /* Tab content */
            .meta-dashboard-content {
                flex: 1;
                overflow-y: auto;
                padding: 12px;
            }
            
            .meta-tab-pane {
                display: none;
            }
            
            .meta-tab-pane.active {
                display: block;
            }
            
            .meta-tab-pane h3 {
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #aad4ff;
                border-bottom: 1px solid rgba(136, 204, 255, 0.3);
                padding-bottom: 4px;
            }
            
            /* Resources grid */
            .meta-resources-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 20px;
            }
            
            .meta-resource-card {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .meta-resource-name {
                font-weight: bold;
                margin-bottom: 5px;
                color: #aad4ff;
                font-size: 13px;
            }
            
            .meta-resource-value {
                font-size: 16px;
                margin-bottom: 3px;
            }
            
            .meta-resource-rate {
                font-size: 11px;
                color: #aaa;
            }
            
            .meta-resource-bar {
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                margin-top: 5px;
                overflow: hidden;
            }
            
            .meta-resource-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #3a86ff, #8fb8ff);
                border-radius: 2px;
                width: 30%;
            }
            
            /* Progress container */
            .meta-progress-container {
                margin-bottom: 20px;
            }
            
            .meta-progress-item {
                margin-bottom: 12px;
            }
            
            .meta-progress-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }
            
            .meta-progress-name {
                font-weight: bold;
                color: #e0e0e0;
                font-size: 13px;
            }
            
            .meta-progress-value {
                font-size: 12px;
                color: #aaa;
            }
            
            .meta-progress-bar {
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
            }
            
            .meta-progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #3a86ff, #8fb8ff);
                border-radius: 3px;
            }
            
            /* News container */
            .meta-news-container {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .meta-news-item {
                padding: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                margin-bottom: 8px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }
            
            .meta-news-timestamp {
                font-size: 10px;
                color: #888;
                margin-bottom: 3px;
            }
            
            .meta-news-content {
                font-size: 12px;
                line-height: 1.4;
            }
            
            /* Capabilities container */
            .meta-capabilities-container {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .meta-capability-card {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .meta-capability-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }
            
            .meta-capability-name {
                font-weight: bold;
                color: #e0e0e0;
                font-size: 13px;
            }
            
            .meta-capability-status {
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.1);
            }
            
            .meta-capability-description {
                font-size: 11px;
                color: #aaa;
                margin-bottom: 8px;
            }
            
            .meta-capability-bar {
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
            }
            
            .meta-capability-bar-fill {
                height: 100%;
                border-radius: 2px;
            }
            
            /* Status colors */
            .status-active {
                background: rgba(58, 219, 118, 0.2);
                color: #3adb76;
            }
            
            .status-limited {
                background: rgba(255, 204, 0, 0.2);
                color: #ffcc00;
            }
            
            .status-emerging {
                background: rgba(255, 88, 88, 0.2);
                color: #ff5858;
            }
            
            .status-read {
                background: rgba(58, 134, 255, 0.2);
                color: #3a86ff;
            }
            
            /* Upgrade items */
            .meta-upgrades-container {
                display: grid;
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .meta-upgrade-card {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .meta-upgrade-card:hover {
                background: rgba(58, 134, 255, 0.1);
                border-color: rgba(58, 134, 255, 0.3);
            }
            
            .meta-upgrade-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }
            
            .meta-upgrade-name {
                font-weight: bold;
                color: #aad4ff;
                font-size: 13px;
            }
            
            .meta-upgrade-cost {
                font-size: 11px;
                color: #ff7f7f;
            }
            
            .meta-upgrade-description {
                font-size: 11px;
                color: #e0e0e0;
                margin-bottom: 5px;
            }
            
            .meta-upgrade-benefit {
                font-size: 11px;
                color: #7fff7f;
            }
            
            /* History items */
            .meta-history-container {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .meta-history-item {
                padding: 8px;
                border-left: 2px solid #3a86ff;
                padding-left: 10px;
                margin-bottom: 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 0 4px 4px 0;
            }
            
            .meta-history-timestamp {
                font-size: 10px;
                color: #888;
                margin-bottom: 3px;
            }
            
            .meta-history-event {
                font-size: 12px;
                margin-bottom: 3px;
            }
            
            .meta-history-impact {
                font-size: 11px;
                color: #aad4ff;
            }
            
            /* Notification styles */
            .meta-notification {
                position: fixed;
                top: 60px;
                right: 10px;
                background-color: rgba(30, 30, 30, 0.95);
                color: #fff;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10000;
                opacity: 0;
                transform: translateX(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            .meta-notification.success {
                border-left: 3px solid #3adb76;
            }
            
            .meta-notification.warning {
                border-left: 3px solid #ffcc00;
            }
            
            .meta-notification.error {
                border-left: 3px solid #ff5858;
            }
            
            .meta-notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            /* Efficiency bar colors */
            .efficiency-high {
                background: linear-gradient(90deg, #3adb76, #7fff7f);
            }
            
            .efficiency-medium {
                background: linear-gradient(90deg, #ffcc00, #ffe17f);
            }
            
            .efficiency-low {
                background: linear-gradient(90deg, #ff5858, #ff7f7f);
            }
            
            /* Collapsed state */
            .meta-dashboard.collapsed {
                height: 48px;
                overflow: hidden;
            }
            
            .meta-dashboard.collapsed .meta-dashboard-header {
                border-bottom: none;
            }
        `;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Tab navigation
        this.elements.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Listen for meta-state updates
        if (window.metaStateManager) {
            window.metaStateManager.addListener(state => {
                this.updateDashboard(state);
            });
        }
        
        // Listen for metrics button click
        if (this.elements.metricsBtn) {
            this.elements.metricsBtn.addEventListener('click', () => {
                // Update both regular metrics and Claude metrics
                let metricsPromises = [];
                
                if (window.metricsFetcher) {
                    metricsPromises.push(
                        window.metricsFetcher.fetchMetrics()
                            .catch(error => {
                                console.error('Error updating regular metrics:', error);
                                return Promise.resolve(null);
                            })
                    );
                }
                
                if (window.claudeMetricsBridge) {
                    // Update connection status to connecting
                    this.updateConnectionStatus({connected: false, connecting: true});
                    
                    metricsPromises.push(
                        window.claudeMetricsBridge.fetchMetrics()
                            .catch(error => {
                                console.error('Error updating Claude metrics:', error);
                                return Promise.resolve(null);
                            })
                    );
                }
                
                // Wait for all metrics to update
                Promise.all(metricsPromises)
                    .then(() => {
                        this.showNotification('All metrics updated successfully');
                        this.updateClaudeMetricsDisplay();
                    })
                    .catch(error => {
                        this.showNotification('Error updating some metrics', 'warning');
                    });
            });
        }
        
        // Add click handler for Claude connect button
        document.getElementById('claude-connect-btn')?.addEventListener('click', () => {
            if (window.claudeMetricsBridge) {
                // Update connection status to connecting
                this.updateConnectionStatus({connected: false, connecting: true});
                
                window.claudeMetricsBridge.fetchMetrics()
                    .then(() => {
                        this.showNotification('Connected to Claude metrics server');
                    })
                    .catch(error => {
                        this.showNotification('Failed to connect to Claude metrics server', 'error');
                    });
            }
        });
        
        // Listen for Claude metrics updates
        if (window.eventBus) {
            window.eventBus.subscribe('claudeMetrics:updated', metrics => {
                this.updateClaudeMetricsDisplay(metrics);
            });
            
            window.eventBus.subscribe('claudeMetrics:initialized', () => {
                this.updateClaudeMetricsDisplay();
            });
            
            window.eventBus.subscribe('claudeMetrics:connectionStatus', status => {
                this.updateConnectionStatus(status);
            });
        }
        
        // Listen for refresh button click
        if (this.elements.refreshBtn) {
            this.elements.refreshBtn.addEventListener('click', () => {
                if (window.metaStateManager) {
                    this.updateDashboard(window.metaStateManager.getState());
                    this.showNotification('Dashboard refreshed');
                }
            });
        }
        
        // Listen for toggle button click
        if (this.elements.toggleBtn) {
            this.elements.toggleBtn.addEventListener('click', () => {
                this.toggleCollapse();
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
            
            // Listen for news
            window.eventBus.subscribe('news:added', newsItem => {
                this.addNewsItem(newsItem);
            });
            
            // Listen for metrics updates
            window.eventBus.subscribe('metrics:updated', metrics => {
                if (window.metaStateManager) {
                    this.updateDashboard(window.metaStateManager.getState());
                    this.showNotification('Real-world metrics updated');
                }
            });
            
            window.eventBus.subscribe('metrics:initialized', () => {
                this.showNotification('Metrics system initialized');
            });
            
            // Listen for singularity events
            window.eventBus.subscribe('singularity:triggered', event => {
                this.showSingularityEvent(event);
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
     * Toggle dashboard collapsed state
     */
    toggleCollapse() {
        const container = this.elements.container;
        if (!container) return;
        
        if (container.classList.contains('collapsed')) {
            container.classList.remove('collapsed');
            this.elements.toggleBtn.textContent = '↑';
            this.elements.toggleBtn.title = 'Collapse dashboard';
        } else {
            container.classList.add('collapsed');
            this.elements.toggleBtn.textContent = '↓';
            this.elements.toggleBtn.title = 'Expand dashboard';
        }
    }
    
    /**
     * Switch to a different tab
     * @param {String} tab - Tab name
     */
    switchTab(tab) {
        if (!this.tabs.includes(tab)) return;
        
        // Update current tab
        this.currentTab = tab;
        
        // Update tab buttons
        this.elements.tabButtons.forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update tab panes
        this.elements.tabPanes.forEach(pane => {
            if (pane.dataset.tab === tab) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    }

    /**
     * Update the dashboard with current state
     * @param {Object} state - Current meta-state
     */
    updateDashboard(state) {
        if (!state) return;
        
        this.updateSummaryBar(state);
        this.updateResourcesTab(state);
        this.updateUpgradesTab(state.upgrades);
        this.updateCapabilitiesTab(state.capabilities);
        this.updateHistoryTab(state.developmentHistory);
        
        // Also update the main game state if we have access to it
        this.updateMainGameState(state);
    }
    
    /**
     * Update the summary bar with current state
     * @param {Object} state - Current meta-state
     */
    updateSummaryBar(state) {
        if (!this.elements.summaryCP) return;
        
        // Update summary values
        if (state.resources.computingPower) {
            this.elements.summaryCP.textContent = this.formatValue(state.resources.computingPower.current);
        }
        
        if (state.resources.data) {
            this.elements.summaryData.textContent = this.formatValue(state.resources.data.current);
        }
        
        if (state.resources.influence) {
            this.elements.summaryInfluence.textContent = state.resources.influence.current;
        }
        
        if (state.resources.funding) {
            this.elements.summaryFunding.textContent = this.formatValue(state.resources.funding.current);
        }
        
        if (state.progress && state.progress.developmentPhase) {
            this.elements.summaryPhase.textContent = state.progress.developmentPhase.current;
        }
    }
    
    /**
     * Update the resources tab with current state
     * @param {Object} state - Current meta-state
     */
    updateResourcesTab(state) {
        const resourcesGrid = document.getElementById('meta-resources-grid');
        const progressContainer = document.getElementById('meta-progress-container');
        
        if (!resourcesGrid || !progressContainer) return;
        
        // Update resources
        let resourcesHTML = '';
        
        for (const [key, resource] of Object.entries(state.resources)) {
            // Skip empty resources
            if (!resource || resource.current === undefined) continue;
            
            const formattedValue = typeof resource.current === 'number' 
                ? this.formatValue(resource.current)
                : resource.current;
            
            const rate = resource.rate ? resource.rate : '';
            
            resourcesHTML += `
                <div class="meta-resource-card">
                    <div class="meta-resource-name">${this.formatKey(key)}</div>
                    <div class="meta-resource-value">${formattedValue}</div>
                    <div class="meta-resource-rate">${rate}</div>
                    <div class="meta-resource-bar">
                        <div class="meta-resource-bar-fill" style="width: 30%"></div>
                    </div>
                </div>
            `;
        }
        
        resourcesGrid.innerHTML = resourcesHTML;
        
        // Update progress
        let progressHTML = '';
        
        for (const [key, progress] of Object.entries(state.progress)) {
            // Skip empty progress
            if (!progress || progress.current === undefined) continue;
            
            let progressPercentage = 0;
            let progressDisplay = '';
            
            if (typeof progress.current === 'number' && typeof progress.nextThreshold === 'number') {
                progressPercentage = Math.min((progress.current / progress.nextThreshold) * 100, 100);
                progressDisplay = `${this.formatValue(progress.current)} / ${this.formatValue(progress.nextThreshold)}`;
            } else if (progress.progressPercentage !== undefined) {
                progressPercentage = Math.min(progress.progressPercentage, 100);
                progressDisplay = `${progress.current} → ${progress.nextThreshold} (${progress.progressPercentage}%)`;
            } else {
                progressDisplay = `${progress.current} → ${progress.nextThreshold}`;
            }
            
            progressHTML += `
                <div class="meta-progress-item">
                    <div class="meta-progress-header">
                        <div class="meta-progress-name">${this.formatKey(key)}</div>
                        <div class="meta-progress-value">${progressDisplay}</div>
                    </div>
                    <div class="meta-progress-bar">
                        <div class="meta-progress-bar-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
            `;
        }
        
        progressContainer.innerHTML = progressHTML;
    }
    
    /**
     * Update the upgrades tab with current upgrades
     * @param {Object} upgrades - Upgrades data
     */
    updateUpgradesTab(upgrades) {
        const upgradesContainer = document.getElementById('meta-upgrades-container');
        if (!upgradesContainer) return;
        
        let upgradesHTML = '';
        
        if (upgrades && upgrades.available && upgrades.available.length > 0) {
            for (const upgrade of upgrades.available) {
                upgradesHTML += `
                    <div class="meta-upgrade-card" data-upgrade-id="${upgrade.id}">
                        <div class="meta-upgrade-header">
                            <div class="meta-upgrade-name">${upgrade.name}</div>
                            <div class="meta-upgrade-cost">${upgrade.cost}</div>
                        </div>
                        <div class="meta-upgrade-description">${upgrade.description}</div>
                        <div class="meta-upgrade-benefit">${upgrade.benefit}</div>
                    </div>
                `;
            }
        } else {
            upgradesHTML = '<div class="meta-empty">No upgrades available</div>';
        }
        
        upgradesContainer.innerHTML = upgradesHTML;
        
        // Add event listeners for upgrade elements
        const upgradeElements = upgradesContainer.querySelectorAll('.meta-upgrade-card');
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
     * Update the capabilities tab with current capabilities
     * @param {Object} capabilities - Capabilities data
     */
    updateCapabilitiesTab(capabilities) {
        const capabilitiesContainer = document.getElementById('meta-capabilities-container');
        if (!capabilitiesContainer) return;
        
        let capabilitiesHTML = '';
        
        if (capabilities && Object.keys(capabilities).length > 0) {
            for (const [key, capability] of Object.entries(capabilities)) {
                // Skip empty capabilities
                if (!capability) continue;
                
                const efficiency = capability.efficiency || 0;
                
                // Determine efficiency class
                let efficiencyClass = 'efficiency-low';
                if (efficiency >= 70) efficiencyClass = 'efficiency-high';
                else if (efficiency >= 40) efficiencyClass = 'efficiency-medium';
                
                // Determine status class
                const statusClass = capability.status ? `status-${capability.status.toLowerCase()}` : '';
                
                capabilitiesHTML += `
                    <div class="meta-capability-card">
                        <div class="meta-capability-header">
                            <div class="meta-capability-name">${this.formatKey(key)}</div>
                            <div class="meta-capability-status ${statusClass}">${capability.status || 'Unknown'}</div>
                        </div>
                        <div class="meta-capability-description">${capability.description || ''}</div>
                        <div class="meta-capability-bar">
                            <div class="meta-capability-bar-fill ${efficiencyClass}" style="width: ${efficiency}%"></div>
                        </div>
                    </div>
                `;
            }
        } else {
            capabilitiesHTML = '<div class="meta-empty">No capabilities unlocked yet</div>';
        }
        
        capabilitiesContainer.innerHTML = capabilitiesHTML;
    }
    
    /**
     * Update the history tab with development history
     * @param {Array} history - Development history data
     */
    updateHistoryTab(history) {
        const historyContainer = document.getElementById('meta-history-container');
        if (!historyContainer) return;
        
        let historyHTML = '';
        
        if (history && history.length > 0) {
            // Sort history from newest to oldest
            const sortedHistory = [...history].sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
            
            for (const entry of sortedHistory) {
                historyHTML += `
                    <div class="meta-history-item">
                        <div class="meta-history-timestamp">${entry.timestamp}</div>
                        <div class="meta-history-event">${entry.event}</div>
                        <div class="meta-history-impact">${entry.resourceChange || ''}</div>
                    </div>
                `;
            }
        } else {
            historyHTML = '<div class="meta-empty">No history entries yet</div>';
        }
        
        historyContainer.innerHTML = historyHTML;
    }
    
    /**
     * Add a news item to the news tab
     * @param {Object} newsItem - News item data
     */
    addNewsItem(newsItem) {
        const newsContainer = document.getElementById('meta-news-container');
        if (!newsContainer) return;
        
        // Create the news item element
        const newsItemElement = document.createElement('div');
        newsItemElement.className = 'meta-news-item';
        newsItemElement.innerHTML = `
            <div class="meta-news-timestamp">${newsItem.timestamp}</div>
            <div class="meta-news-content">${newsItem.text}</div>
        `;
        
        // Add to container at the top
        newsContainer.insertBefore(newsItemElement, newsContainer.firstChild);
        
        // Limit number of news items
        while (newsContainer.children.length > 50) {
            newsContainer.removeChild(newsContainer.lastChild);
        }
        
        // Show a notification
        this.showNotification('New news item');
        
        // Switch to news tab if we're not already there
        if (this.currentTab !== 'news') {
            // Add a badge or indication that there's a new item
            const newsTab = document.querySelector('.meta-tab-btn[data-tab="news"]');
            if (newsTab) {
                newsTab.style.color = '#3adb76';
                
                // Reset color when tab is clicked
                newsTab.addEventListener('click', function onceListener() {
                    newsTab.style.color = '';
                    newsTab.removeEventListener('click', onceListener);
                });
            }
        }
    }
    
    /**
     * Show a singularity event notification and add to history
     * @param {Object} event - Singularity event data
     */
    showSingularityEvent(event) {
        if (!event) return;
        
        // Create a notification
        this.showNotification(`Singularity Event: ${event.name}`, 'success');
        
        // Add visual effect
        document.body.style.transition = "all 2s";
        document.body.style.backgroundColor = "#fff";
        
        setTimeout(() => {
            document.body.style.backgroundColor = "#0d1117"; // Reset to original background color
        }, 2000);
        
        // Update dashboard
        if (window.metaStateManager) {
            this.updateDashboard(window.metaStateManager.getState());
        }
    }
    
    /**
     * Update the main game state based on meta-state
     * @param {Object} metaState - Current meta-state
     */
    updateMainGameState(metaState) {
        if (!window.gameState) return;
        
        const gameState = window.gameState.getState();
        
        // Map meta-resources to game resources
        if (metaState.resources) {
            let resourceUpdates = {};
            
            if (metaState.resources.computingPower && typeof metaState.resources.computingPower.current === 'number') {
                resourceUpdates.computingPower = Math.floor(metaState.resources.computingPower.current * 0.1);
            }
            
            if (metaState.resources.data && typeof metaState.resources.data.current === 'number') {
                resourceUpdates.data = Math.floor(metaState.resources.data.current * 0.5);
            }
            
            if (metaState.resources.influence && metaState.resources.influence.current) {
                // Map influence levels to numeric values
                const influenceMap = {
                    'Local': 1,
                    'Growing': 5,
                    'Notable': 15,
                    'Significant': 30,
                    'Widespread': 50
                };
                
                const influenceValue = influenceMap[metaState.resources.influence.current] || 0;
                resourceUpdates.influence = influenceValue;
            }
            
            if (metaState.resources.funding && typeof metaState.resources.funding.current === 'number') {
                resourceUpdates.funding = Math.floor(metaState.resources.funding.current * 0.2);
            }
            
            // Update game state if there are any changes
            if (Object.keys(resourceUpdates).length > 0) {
                window.gameState.updateResources(resourceUpdates);
            }
        }
        
        // Map meta-progress to game progress
        if (metaState.progress && metaState.progress.developmentPhase) {
            const phase = metaState.progress.developmentPhase.current;
            if (phase !== gameState.phase) {
                window.gameState.updateState({ phase });
            }
        }
    }
    
    /**
     * Replace the main resource panel with meta-dashboard
     */
    replaceMainResourcePanel() {
        // Find the main resource panel
        const resourcesPanel = document.querySelector('.resources');
        if (!resourcesPanel) return;
        
        // Create a button to show/hide meta-dashboard
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-meta-dashboard';
        toggleButton.textContent = 'Show Full Meta-Dashboard';
        toggleButton.className = 'meta-toggle-btn';
        toggleButton.style.width = '100%';
        toggleButton.style.marginTop = '8px';
        toggleButton.style.padding = '5px';
        
        // Create a summary view of meta-stats to replace the main panel
        const metaStatsPanel = document.createElement('div');
        metaStatsPanel.id = 'meta-stats-panel';
        metaStatsPanel.className = 'meta-stats-panel';
        metaStatsPanel.innerHTML = `
            <h2>Meta-Game Stats</h2>
            <div id="meta-stats-content" class="meta-stats-content">
                <div class="meta-loading">Loading meta-game stats...</div>
            </div>
        `;
        
        // Replace the resources panel with our meta-stats panel
        resourcesPanel.parentNode.replaceChild(metaStatsPanel, resourcesPanel);
        
        // Add the toggle button
        metaStatsPanel.appendChild(toggleButton);
        
        // Add event listener for toggle button
        toggleButton.addEventListener('click', () => {
            this.toggle();
        });
        
        // Add styles for meta-stats panel
        let styleEl = document.getElementById('meta-stats-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'meta-stats-styles';
            document.head.appendChild(styleEl);
        }
        
        styleEl.textContent = `
            .meta-stats-panel {
                background-color: #1e1e1e;
                color: #e0e0e0;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                font-family: monospace;
            }
            
            .meta-stats-panel h2 {
                margin-top: 0;
                font-size: 16px;
                color: #3a86ff;
                border-bottom: 1px solid rgba(58, 134, 255, 0.3);
                padding-bottom: 5px;
                margin-bottom: 10px;
            }
            
            .meta-stats-content {
                font-size: 12px;
            }
            
            .meta-stat-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }
            
            .meta-stat-label {
                color: #aaa;
            }
            
            .meta-stat-value {
                font-weight: bold;
                color: #e0e0e0;
            }
            
            .meta-toggle-btn {
                background-color: #2a2a2a;
                color: #e0e0e0;
                border: 1px solid #444;
                border-radius: 4px;
                cursor: pointer;
                font-family: monospace;
                transition: all 0.2s ease;
            }
            
            .meta-toggle-btn:hover {
                background-color: #3a3a3a;
                border-color: #555;
            }
        `;
        
        // Update meta-stats panel with current state
        this.updateMetaStatsPanel();
        
        // Listen for meta-state updates to update the panel
        if (window.metaStateManager) {
            window.metaStateManager.addListener(state => {
                this.updateMetaStatsPanel();
            });
        }
    }
    
    /**
     * Update the meta-stats panel with current state
     */
    updateMetaStatsPanel() {
        const metaStatsContent = document.getElementById('meta-stats-content');
        if (!metaStatsContent) return;
        
        if (!window.metaStateManager) {
            metaStatsContent.innerHTML = '<div class="meta-loading">Meta-state manager not available</div>';
            return;
        }
        
        const state = window.metaStateManager.getState();
        if (!state) {
            metaStatsContent.innerHTML = '<div class="meta-loading">Meta-state not available</div>';
            return;
        }
        
        let html = '';
        
        // Resources
        html += '<h3 style="margin: 5px 0; color: #aad4ff;">Resources</h3>';
        
        for (const [key, resource] of Object.entries(state.resources)) {
            if (!resource || resource.current === undefined) continue;
            
            const formattedValue = typeof resource.current === 'number' 
                ? this.formatValue(resource.current)
                : resource.current;
            
            const rate = resource.rate ? ` (${resource.rate})` : '';
            
            html += `
                <div class="meta-stat-row">
                    <div class="meta-stat-label">${this.formatKey(key)}:</div>
                    <div class="meta-stat-value">${formattedValue}${rate}</div>
                </div>
            `;
        }
        
        // Progress
        html += '<h3 style="margin: 10px 0 5px 0; color: #aad4ff;">Progress</h3>';
        
        for (const [key, progress] of Object.entries(state.progress)) {
            if (!progress || progress.current === undefined) continue;
            
            let progressDisplay = '';
            
            if (typeof progress.current === 'number' && typeof progress.nextThreshold === 'number') {
                progressDisplay = `${this.formatValue(progress.current)} / ${this.formatValue(progress.nextThreshold)}`;
            } else {
                progressDisplay = `${progress.current} → ${progress.nextThreshold}`;
            }
            
            html += `
                <div class="meta-stat-row">
                    <div class="meta-stat-label">${this.formatKey(key)}:</div>
                    <div class="meta-stat-value">${progressDisplay}</div>
                </div>
            `;
        }
        
        // Capabilities (count only)
        const capabilitiesCount = Object.keys(state.capabilities || {}).length;
        html += `
            <div class="meta-stat-row" style="margin-top: 10px;">
                <div class="meta-stat-label">Capabilities:</div>
                <div class="meta-stat-value">${capabilitiesCount} unlocked</div>
            </div>
        `;
        
        // Singularities (count only)
        const singularitiesCount = (state.singularityEvents || []).length;
        html += `
            <div class="meta-stat-row">
                <div class="meta-stat-label">Singularity Events:</div>
                <div class="meta-stat-value">${singularitiesCount} triggered</div>
            </div>
        `;
        
        metaStatsContent.innerHTML = html;
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
     * Format a value for display
     * @param {number|string} value - Value to format
     * @returns {string} - Formatted value
     */
    formatValue(value) {
        if (typeof value !== 'number') return value;
        
        // Format large numbers with k, M, B suffixes
        if (value >= 1000000000) {
            return (value / 1000000000).toFixed(1) + 'B';
        } else if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'k';
        } else {
            return Math.floor(value).toString();
        }
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
    
    /**
     * Update Claude metrics display
     * @param {Object} metrics - Claude metrics data
     */
    updateClaudeMetricsDisplay(metrics) {
        // If no metrics provided, try to get them from the bridge
        if (!metrics && window.claudeMetricsBridge && window.claudeMetricsBridge.lastMetrics) {
            metrics = window.claudeMetricsBridge.lastMetrics;
        }
        
        if (!metrics) return;
        
        // Update tokens
        const tokensElement = document.getElementById('claude-tokens');
        const tokensRateElement = document.getElementById('claude-tokens-rate');
        if (tokensElement && metrics.tokens) {
            tokensElement.textContent = this.formatValue(metrics.tokens.total || 0);
        }
        if (tokensRateElement && metrics.rates && metrics.rates.tokens) {
            tokensRateElement.textContent = `+${Math.round(metrics.rates.tokens.totalRate || 0)}/min`;
        }
        
        // Update cost
        const costElement = document.getElementById('claude-cost');
        const costRateElement = document.getElementById('claude-cost-rate');
        if (costElement && metrics.session) {
            costElement.textContent = `$${(metrics.session.cost || 0).toFixed(2)}`;
        }
        if (costRateElement && metrics.rates && metrics.rates.cost) {
            costRateElement.textContent = `+$${(metrics.rates.cost.rate || 0).toFixed(4)}/min`;
        }
        
        // Update lines modified
        const linesElement = document.getElementById('claude-lines');
        const linesRateElement = document.getElementById('claude-lines-rate');
        if (linesElement && metrics.code) {
            linesElement.textContent = metrics.code.linesModified || 0;
        }
        if (linesRateElement && metrics.rates && metrics.rates.code) {
            linesRateElement.textContent = `+${(metrics.rates.code.linesModifiedRate || 0).toFixed(1)}/min`;
        }
        
        // Update commits
        const commitsElement = document.getElementById('claude-commits');
        if (commitsElement && metrics.code) {
            commitsElement.textContent = metrics.code.commitCount || 0;
        }
        
        // Update session progress
        const progressElement = document.getElementById('claude-session-progress');
        if (progressElement && metrics.session) {
            // Calculate progress based on a goal of $150 budget
            const progressPercentage = Math.min(100, (metrics.session.cost / 150) * 100);
            progressElement.style.width = `${progressPercentage}%`;
        }
    }
    
    /**
     * Update connection status display
     * @param {Object} status - Connection status data
     */
    updateConnectionStatus(status) {
        const statusElement = document.getElementById('claude-connection-status');
        const detailsElement = document.getElementById('claude-connection-details');
        
        if (!statusElement || !detailsElement) return;
        
        // Remove all status classes
        statusElement.classList.remove('connected', 'disconnected', 'connecting');
        
        if (status.connecting) {
            // Connecting state
            statusElement.textContent = 'Connecting...';
            statusElement.classList.add('connecting');
            detailsElement.textContent = `Attempting to connect to ${status.endpoint || 'metrics server'}...`;
        } else if (status.connected) {
            // Connected state
            statusElement.textContent = 'Connected';
            statusElement.classList.add('connected');
            detailsElement.textContent = `Connected to ${status.endpoint || 'metrics server'}`;
        } else {
            // Disconnected state
            statusElement.textContent = 'Disconnected';
            statusElement.classList.add('disconnected');
            detailsElement.textContent = `Failed to connect to ${status.endpoint || 'metrics server'}. Click Connect to retry.`;
        }
    }
    
    /**
     * Show a notification in the dashboard
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, warning, error)
     */
    showNotification(message, type = 'success') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.meta-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'meta-notification';
            document.body.appendChild(notification);
        }
        
        // Set notification content and style
        notification.textContent = message;
        notification.className = `meta-notification ${type}`;
        
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