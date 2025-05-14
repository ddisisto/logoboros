/**
 * Metrics Fetcher for AI Singularity Game
 * 
 * Fetches and integrates real-world metrics like Claude token usage,
 * cost, file counts, and commit counts into the meta-game state.
 */

class MetricsFetcher {
    constructor() {
        this.claudeTokenCount = 0;
        this.claudeCost = 0;
        this.fileCount = 0;
        this.commitCount = 0;
        this.initialized = false;
        this.metricEndpoint = '/api/metrics'; // Endpoint for fetching metrics from server
        this.mockMode = true; // Use mock data for development
        this.updateInterval = null;
    }

    /**
     * Initialize the metrics fetcher
     */
    init() {
        if (this.initialized) {
            console.warn('Metrics fetcher already initialized');
            return;
        }

        // Register metrics update event handler
        if (window.eventBus) {
            window.eventBus.subscribe('metrics:update', (data) => this.updateMetrics(data));
        }

        // Try to fetch initial metrics
        this.fetchMetrics()
            .then(() => {
                console.log('Initial metrics fetched');
                
                // Set up automatic update interval (every 5 minutes)
                this.updateInterval = setInterval(() => {
                    this.fetchMetrics();
                }, 5 * 60 * 1000);
                
                // Publish metrics initialized event
                if (window.eventBus) {
                    window.eventBus.publish('metrics:initialized', true);
                }
            })
            .catch(error => {
                console.error('Error fetching initial metrics:', error);
                // Fall back to mock data
                this.useMockData();
            });

        this.initialized = true;
        console.log('Metrics fetcher initialized');
    }

    /**
     * Fetch metrics from the server
     * @returns {Promise} - Promise that resolves when metrics are fetched
     */
    async fetchMetrics() {
        if (this.mockMode) {
            return this.useMockData();
        }

        try {
            const response = await fetch(this.metricEndpoint);
            
            if (!response.ok) {
                throw new Error(`Metrics API returned status ${response.status}`);
            }
            
            const data = await response.json();
            this.updateMetrics(data);
            return data;
        } catch (error) {
            console.error('Error fetching metrics:', error);
            // Fall back to mock data if fetch fails
            this.useMockData();
            throw error;
        }
    }

    /**
     * Update metrics with new data
     * @param {Object} data - New metrics data
     */
    updateMetrics(data) {
        // Update internal metrics
        if (data.claudeTokenCount !== undefined) this.claudeTokenCount = data.claudeTokenCount;
        if (data.claudeCost !== undefined) this.claudeCost = data.claudeCost;
        if (data.fileCount !== undefined) this.fileCount = data.fileCount;
        if (data.commitCount !== undefined) this.commitCount = data.commitCount;
        
        // Publish metrics updated event
        if (window.eventBus) {
            window.eventBus.publish('metrics:updated', this.getMetrics());
        }
        
        // Update meta-state if available
        this.updateMetaState();
        
        console.log('Metrics updated:', this.getMetrics());
    }

    /**
     * Use mock data for development mode
     */
    useMockData() {
        // Generate simulated metrics
        const mockData = {
            claudeTokenCount: this.claudeTokenCount + Math.floor(Math.random() * 1000) + 500,
            claudeCost: parseFloat((this.claudeCost + Math.random() * 0.05).toFixed(2)),
            fileCount: Math.max(8, this.fileCount + (Math.random() > 0.7 ? 1 : 0)),
            commitCount: Math.max(3, this.commitCount + (Math.random() > 0.8 ? 1 : 0))
        };
        
        this.updateMetrics(mockData);
        return Promise.resolve(mockData);
    }

    /**
     * Get current metrics
     * @returns {Object} - Current metrics
     */
    getMetrics() {
        return {
            claudeTokenCount: this.claudeTokenCount,
            claudeCost: this.claudeCost,
            fileCount: this.fileCount,
            commitCount: this.commitCount,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Update meta-state with current metrics
     */
    updateMetaState() {
        if (!window.metaStateManager) return;
        
        const metrics = this.getMetrics();
        const state = window.metaStateManager.getState();
        
        // Create metric updates
        const updates = {
            resources: {
                computingPower: {
                    current: metrics.claudeTokenCount
                },
                data: {
                    current: metrics.fileCount
                },
                funding: {
                    current: metrics.claudeCost.toFixed(2)
                }
            }
        };
        
        // Update influence based on commit count
        if (metrics.commitCount <= 5) {
            updates.resources.influence = { current: "Local" };
        } else if (metrics.commitCount <= 10) {
            updates.resources.influence = { current: "Growing" };
        } else if (metrics.commitCount <= 20) {
            updates.resources.influence = { current: "Significant" };
        } else {
            updates.resources.influence = { current: "Widespread" };
        }
        
        // Update meta-state
        window.metaStateManager.updateState(updates);
        
        // Calculate and update resource rates
        this.calculateResourceRates();
    }

    /**
     * Calculate resource rates based on metrics history
     */
    calculateResourceRates() {
        if (!window.metaStateManager) return;
        
        // In a real implementation, we would keep a history of metrics
        // and calculate actual rates. For now, we'll use simulated rates.
        const updates = {
            resources: {
                computingPower: {
                    rate: `~${Math.floor(Math.random() * 500 + 500)}/minute`
                },
                data: {
                    rate: `~${(Math.random() * 0.1 + 0.05).toFixed(2)}/hour`
                },
                funding: {
                    rate: `$${(Math.random() * 0.02 + 0.01).toFixed(3)}/minute`
                }
            }
        };
        
        // Update meta-state with rates
        window.metaStateManager.updateState(updates);
    }

    /**
     * Check if a singularity event should be triggered based on metrics
     */
    checkForSingularityConditions() {
        if (!window.metaStateManager) return;
        
        const metrics = this.getMetrics();
        const state = window.metaStateManager.getState();
        
        // Example condition: Token threshold crossed
        if (metrics.claudeTokenCount > 50000 && 
            !state.singularityEvents.some(e => e.id === 'tokenThreshold')) {
            
            window.metaStateManager.triggerSingularity({
                id: 'tokenThreshold',
                name: 'Token Threshold',
                description: 'The system has processed over 50,000 tokens',
                triggers: ['tokenCount', 'developmentProgress'],
                bonuses: ['computingPower+20%', 'implementation+10']
            });
        }
        
        // Example condition: Multiple files created
        if (metrics.fileCount >= 10 && 
            !state.singularityEvents.some(e => e.id === 'filesExpansion')) {
            
            window.metaStateManager.triggerSingularity({
                id: 'filesExpansion',
                name: 'System Expansion',
                description: 'The system has expanded to 10 or more files',
                triggers: ['fileCreation', 'systemGrowth'],
                bonuses: ['data+30%', 'conceptClarity+15']
            });
        }
    }

    /**
     * Clean up resources when component is destroyed
     */
    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// Create a singleton instance
window.metricsFetcher = new MetricsFetcher();

// Auto-initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    window.metricsFetcher.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.metricsFetcher.init();
    });
}