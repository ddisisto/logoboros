/**
 * Claude Metrics Bridge
 * 
 * Connects to Claude Code's OpenTelemetry metrics system to gather real usage data.
 * Forwards metrics to the game's meta-state system for integration with gameplay.
 * 
 * Key metrics tracked:
 * - Token usage (input/output)
 * - Session duration
 * - Lines of code modified
 * - Pull requests created
 * - Git commits created
 * - Cost per session
 */

class ClaudeMetricsBridge {
    constructor() {
        this.initialized = false;
        this.metricsEndpoint = 'http://localhost:3000/claude-metrics'; // Local metrics server
        this.pollingInterval = 10000; // Poll every 10 seconds (for more responsive testing)
        this.pollingTimer = null;
        this.isConnected = false; // Track connection status
        this.lastMetrics = {
            tokens: {
                input: 0,
                output: 0,
                total: 0
            },
            session: {
                id: null,
                duration: 0,
                cost: 0
            },
            code: {
                linesModified: 0,
                filesModified: 0,
                commitCount: 0,
                prCount: 0
            },
            lastUpdate: null
        };
        this.mockMode = true; // Use mock data for development
        this.metricChangeListeners = [];
    }

    /**
     * Initialize the Claude metrics bridge
     */
    init() {
        if (this.initialized) {
            console.warn('Claude metrics bridge already initialized');
            return;
        }

        console.log('Initializing Claude metrics bridge...');
        
        // Subscribe to events
        if (window.eventBus) {
            window.eventBus.subscribe('claudeMetrics:update', data => this.updateMetrics(data));
            window.eventBus.subscribe('claudeMetrics:fetch', () => this.fetchMetrics());
            
            // Publish initial connection status (disconnected)
            this.publishConnectionStatus();
        }

        // Initial connection check - attempt to connect to server
        console.log(`Checking connection to Claude metrics server at ${this.metricsEndpoint}...`);
        this.checkConnection()
            .then(connected => {
                if (connected) {
                    console.log('Successfully connected to Claude metrics server');
                    // Start polling for metrics
                    this.startPolling();
                    
                    // Initial fetch
                    return this.fetchMetrics();
                } else {
                    console.warn('Claude metrics server unavailable, using mock data');
                    return this.useMockData();
                }
            })
            .then(() => {
                console.log('Initial Claude metrics loaded');
                if (window.eventBus) {
                    window.eventBus.publish('claudeMetrics:initialized', true);
                }
            })
            .catch(error => {
                console.error('Error during Claude metrics initialization:', error);
                this.useMockData();
            });

        this.initialized = true;
    }
    
    /**
     * Check connection to metrics server
     * @returns {Promise<boolean>} Promise that resolves to true if connected
     */
    async checkConnection() {
        try {
            // Try a HEAD request first to avoid heavy data transfer
            const response = await fetch(this.metricsEndpoint, { method: 'HEAD' })
                .catch(() => {
                    // If HEAD is not supported, try a regular GET
                    return fetch(this.metricsEndpoint);
                });
                
            this.isConnected = response.ok;
            this.publishConnectionStatus();
            return this.isConnected;
        } catch (error) {
            this.isConnected = false;
            this.publishConnectionStatus();
            return false;
        }
    }

    /**
     * Start polling for metrics
     */
    startPolling() {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
        }

        this.pollingTimer = setInterval(() => {
            this.fetchMetrics();
        }, this.pollingInterval);
        
        console.log(`Claude metrics polling started (every ${this.pollingInterval / 1000}s)`);
    }

    /**
     * Stop polling for metrics
     */
    stopPolling() {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
            this.pollingTimer = null;
            console.log('Claude metrics polling stopped');
        }
    }

    /**
     * Fetch metrics from Claude API
     * @returns {Promise} Promise that resolves with metrics data
     */
    async fetchMetrics() {
        if (this.mockMode) {
            return this.useMockData();
        }

        try {
            console.log(`Fetching Claude metrics from: ${this.metricsEndpoint}`);
            const response = await fetch(this.metricsEndpoint);
            
            if (!response.ok) {
                this.isConnected = false;
                this.publishConnectionStatus();
                throw new Error(`Claude metrics API returned status ${response.status}`);
            }
            
            const data = await response.json();
            this.isConnected = true;
            this.publishConnectionStatus();
            this.updateMetrics(data);
            return data;
        } catch (error) {
            console.error('Error fetching Claude metrics:', error);
            this.isConnected = false;
            this.publishConnectionStatus();
            
            // Fall back to mock data if in development
            if (this.mockMode) {
                return this.useMockData();
            }
            throw error;
        }
    }
    
    /**
     * Publish connection status to event bus
     */
    publishConnectionStatus() {
        if (window.eventBus) {
            window.eventBus.publish('claudeMetrics:connectionStatus', {
                connected: this.isConnected,
                endpoint: this.metricsEndpoint
            });
        }
    }

    /**
     * Use mock data for development mode
     * @returns {Promise} Promise that resolves with mock data
     */
    useMockData() {
        const lastUpdate = this.lastMetrics.lastUpdate || new Date(Date.now() - 3600000);
        const timeDiffMinutes = (new Date() - lastUpdate) / 60000;
        
        // Generate realistic mock metrics based on time elapsed
        const mockData = {
            tokens: {
                input: this.lastMetrics.tokens.input + Math.floor(timeDiffMinutes * (50 + Math.random() * 100)),
                output: this.lastMetrics.tokens.output + Math.floor(timeDiffMinutes * (200 + Math.random() * 300)),
                total: 0 // Will be calculated
            },
            session: {
                id: this.lastMetrics.session.id || `mock-session-${Date.now()}`,
                duration: this.lastMetrics.session.duration + timeDiffMinutes,
                cost: 0 // Will be calculated
            },
            code: {
                linesModified: this.lastMetrics.code.linesModified + Math.floor(timeDiffMinutes * (5 + Math.random() * 15)),
                filesModified: Math.min(30, this.lastMetrics.code.filesModified + (Math.random() > 0.7 ? 1 : 0)),
                commitCount: Math.min(12, this.lastMetrics.code.commitCount + (Math.random() > 0.9 ? 1 : 0)),
                prCount: Math.min(5, this.lastMetrics.code.prCount + (Math.random() > 0.95 ? 1 : 0))
            },
            lastUpdate: new Date()
        };
        
        // Calculate total tokens
        mockData.tokens.total = mockData.tokens.input + mockData.tokens.output;
        
        // Calculate cost (approximate Claude pricing)
        // $15 per million input tokens, $75 per million output tokens
        const inputCost = mockData.tokens.input * 0.000015;
        const outputCost = mockData.tokens.output * 0.000075;
        mockData.session.cost = inputCost + outputCost;
        
        this.updateMetrics(mockData);
        return Promise.resolve(mockData);
    }

    /**
     * Update metrics with new data
     * @param {Object} data New metrics data
     */
    updateMetrics(data) {
        const oldMetrics = { ...this.lastMetrics };
        this.lastMetrics = data;
        
        // Calculate rates
        const elapsedMinutes = oldMetrics.lastUpdate ? 
            (data.lastUpdate - oldMetrics.lastUpdate) / 60000 : 1;
            
        const rates = {
            tokens: {
                inputRate: (data.tokens.input - oldMetrics.tokens.input) / elapsedMinutes,
                outputRate: (data.tokens.output - oldMetrics.tokens.output) / elapsedMinutes,
                totalRate: (data.tokens.total - oldMetrics.tokens.total) / elapsedMinutes
            },
            code: {
                linesModifiedRate: (data.code.linesModified - oldMetrics.code.linesModified) / elapsedMinutes
            },
            cost: {
                rate: (data.session.cost - oldMetrics.session.cost) / elapsedMinutes
            }
        };
        
        // Add rates to metrics
        const metricsWithRates = {
            ...data,
            rates: rates
        };
        
        // Notify listeners
        this.notifyMetricChangeListeners(metricsWithRates);
        
        // Publish event
        if (window.eventBus) {
            window.eventBus.publish('claudeMetrics:updated', metricsWithRates);
        }
        
        // Update meta-state
        this.updateMetaState(metricsWithRates);
        
        console.log('Claude metrics updated:', metricsWithRates);
    }

    /**
     * Register a metric change listener
     * @param {Function} listener Listener function to call when metrics change
     */
    addMetricChangeListener(listener) {
        if (typeof listener === 'function' && !this.metricChangeListeners.includes(listener)) {
            this.metricChangeListeners.push(listener);
        }
    }

    /**
     * Remove a metric change listener
     * @param {Function} listener Listener to remove
     */
    removeMetricChangeListener(listener) {
        const index = this.metricChangeListeners.indexOf(listener);
        if (index >= 0) {
            this.metricChangeListeners.splice(index, 1);
        }
    }

    /**
     * Notify all metric change listeners
     * @param {Object} metrics Updated metrics
     */
    notifyMetricChangeListeners(metrics) {
        for (const listener of this.metricChangeListeners) {
            try {
                listener(metrics);
            } catch (error) {
                console.error('Error in metric change listener:', error);
            }
        }
    }

    /**
     * Update the meta-state with Claude metrics
     * @param {Object} metrics Current Claude metrics
     */
    updateMetaState(metrics) {
        if (!window.metaStateManager) return;
        
        // Map metrics to meta-state resources
        const updates = {
            resources: {
                computingPower: {
                    current: metrics.tokens.total,
                    rate: `${Math.round(metrics.rates.tokens.totalRate)}/min`
                },
                data: {
                    current: metrics.code.linesModified,
                    rate: `${metrics.rates.code.linesModifiedRate.toFixed(1)}/min`
                },
                influence: {
                    // Calculate influence level based on commits and PRs
                    current: this.calculateInfluenceLevel(metrics.code.commitCount, metrics.code.prCount)
                },
                funding: {
                    current: Math.round(metrics.session.cost * 100) / 100,
                    rate: `$${metrics.rates.cost.rate.toFixed(4)}/min`
                }
            },
            progress: {
                // Update development phase based on metrics
                developmentPhase: {
                    current: this.calculateDevelopmentPhase(metrics)
                }
            },
            capabilities: {
                // Create capabilities based on metrics
                tokenGeneration: {
                    status: 'active',
                    description: 'Generate tokens for natural language processing',
                    efficiency: Math.min(95, 50 + (metrics.tokens.total / 10000))
                },
                codeModification: {
                    status: 'active',
                    description: 'Modify code files and generate new content',
                    efficiency: Math.min(95, 40 + (metrics.code.linesModified / 100))
                },
                versionControl: {
                    status: metrics.code.commitCount > 0 ? 'active' : 'limited',
                    description: 'Create git commits and manage code versions',
                    efficiency: Math.min(90, 30 + (metrics.code.commitCount * 5))
                },
                pullRequestGeneration: {
                    status: metrics.code.prCount > 0 ? 'active' : 'emerging',
                    description: 'Generate and manage pull requests',
                    efficiency: Math.min(85, 20 + (metrics.code.prCount * 15))
                }
            },
            // Add metrics history
            metricsHistory: [
                {
                    timestamp: new Date().toISOString(),
                    tokens: metrics.tokens,
                    cost: metrics.session.cost
                }
            ]
        };
        
        // Update meta-state
        window.metaStateManager.updateState(updates);
        
        // Check for singularity events
        this.checkForSingularityEvents(metrics);
    }

    /**
     * Calculate influence level based on commits and PRs
     * @param {Number} commitCount Number of commits
     * @param {Number} prCount Number of pull requests
     * @returns {String} Influence level
     */
    calculateInfluenceLevel(commitCount, prCount) {
        const influenceScore = commitCount + (prCount * 3);
        
        if (influenceScore >= 20) return 'Widespread';
        if (influenceScore >= 12) return 'Notable';
        if (influenceScore >= 5) return 'Growing';
        return 'Local';
    }

    /**
     * Calculate development phase based on metrics
     * @param {Object} metrics Current metrics
     * @returns {String} Development phase
     */
    calculateDevelopmentPhase(metrics) {
        // Calculate development score based on various metrics
        const developmentScore = 
            (metrics.tokens.total / 5000) +
            (metrics.code.linesModified / 50) +
            (metrics.code.commitCount * 2) +
            (metrics.code.prCount * 5);
            
        if (developmentScore >= 50) return 'Superintelligence';
        if (developmentScore >= 25) return 'General AI';
        if (developmentScore >= 10) return 'Neural Networks';
        return 'Narrow AI';
    }

    /**
     * Check for possible singularity events
     * @param {Object} metrics Current metrics
     */
    checkForSingularityEvents(metrics) {
        if (!window.metaStateManager) return;
        
        const state = window.metaStateManager.getState();
        
        // Token threshold singularity
        if (metrics.tokens.total >= 10000 && 
            !state.singularityEvents.some(e => e.id === 'tokenThreshold1')) {
            
            window.metaStateManager.triggerSingularity({
                id: 'tokenThreshold1',
                name: 'Token Milestone: 10K',
                description: 'The system has processed over 10,000 tokens',
                triggers: ['tokenCount', 'languageProcessing'],
                bonuses: ['computingPower+15%', 'responseAccuracy+10%']
            });
        }
        
        // Code modification singularity
        if (metrics.code.linesModified >= 500 && 
            !state.singularityEvents.some(e => e.id === 'codeModification1')) {
            
            window.metaStateManager.triggerSingularity({
                id: 'codeModification1',
                name: 'Code Evolution',
                description: 'The system has modified over 500 lines of code',
                triggers: ['codeGeneration', 'systemImprovement'],
                bonuses: ['data+20%', 'implementationSpeed+15%']
            });
        }
        
        // Commit threshold singularity
        if (metrics.code.commitCount >= 5 && 
            !state.singularityEvents.some(e => e.id === 'commitThreshold1')) {
            
            window.metaStateManager.triggerSingularity({
                id: 'commitThreshold1',
                name: 'Version Control Mastery',
                description: 'The system has created 5 code commits',
                triggers: ['codeManagement', 'versionControl'],
                bonuses: ['influence+25%', 'codePersistence+20%']
            });
        }
        
        // Cost threshold singularity (signals project investment)
        if (metrics.session.cost >= 10 && 
            !state.singularityEvents.some(e => e.id === 'costThreshold1')) {
            
            window.metaStateManager.triggerSingularity({
                id: 'costThreshold1',
                name: 'Resource Investment',
                description: 'The project has invested $10 in AI resources',
                triggers: ['resourceAllocation', 'systemInvestment'],
                bonuses: ['funding+30%', 'resourceEfficiency+15%']
            });
        }
    }

    /**
     * Clean up resources
     */
    cleanup() {
        this.stopPolling();
        this.metricChangeListeners = [];
    }
}

// Create and export a singleton
window.claudeMetricsBridge = new ClaudeMetricsBridge();

// Auto-initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    window.claudeMetricsBridge.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.claudeMetricsBridge.init();
    });
}