/**
 * Resource Visualization Component for AI Singularity Game
 * 
 * This component handles the visualization of resources in the UI,
 * including progress bars, sparklines, and animation effects.
 * Optimized for performance with debounced updates and efficient DOM operations.
 */

class ResourceVisualization {
    constructor() {
        this.initialized = false;
        this.maxValues = {
            computingPower: 1000,
            data: 500,
            influence: 200,
            funding: 300
        };
        this.historyLength = 20;
        this.history = {
            computingPower: [],
            data: [],
            influence: [],
            funding: []
        };
        this.updatePending = false;
        this.updateTimeout = null;
    }

    /**
     * Initialize the resource visualization
     */
    init() {
        if (this.initialized) {
            console.warn('Resource visualization already initialized');
            return;
        }

        // Cache DOM references - improves performance by avoiding repeated lookups
        this.cacheElements();

        // Set up event listeners
        this.setupEventListeners();
        
        this.initialized = true;
        console.log('Resource visualization initialized');
    }

    /**
     * Cache DOM elements for faster access
     */
    cacheElements() {
        // Resource visualizations
        this.elements = {
            computingPowerVis: document.getElementById('computingPowerVis'),
            dataVis: document.getElementById('dataVis'),
            influenceVis: document.getElementById('influenceVis'),
            fundingVis: document.getElementById('fundingVis')
        };

        // Initialize classes
        if (this.elements.computingPowerVis) {
            this.elements.computingPowerVis.classList.add('computing');
        }
        
        if (this.elements.dataVis) {
            this.elements.dataVis.classList.add('data');
        }
        
        if (this.elements.influenceVis) {
            this.elements.influenceVis.classList.add('influence');
        }
        
        if (this.elements.fundingVis) {
            this.elements.fundingVis.classList.add('funding');
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for resource updates with debouncing to improve performance
        if (window.eventBus) {
            window.eventBus.subscribe('state:updated', () => {
                this.debouncedUpdate();
            });
            
            // Listen for meta-state updates to adjust max values
            window.eventBus.subscribe('meta:state:updated', (metaState) => {
                this.updateFromMetaState(metaState);
            });
        }
        
        // Delegate event for toggle button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'toggle-resource-view' || e.target.closest('#toggle-resource-view')) {
                this.toggleEnhancedVisualization();
            }
        });
    }

    /**
     * Debounced update to prevent too frequent DOM manipulations
     * Improves performance by batching updates
     */
    debouncedUpdate() {
        // Cancel any pending updates
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        
        // Set a flag that an update is pending
        this.updatePending = true;
        
        // Schedule update for next animation frame for smooth performance
        this.updateTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
                this.updateVisualization();
                this.updatePending = false;
            });
        }, 100); // 100ms debounce threshold
    }

    /**
     * Update the resource visualizations based on current game state
     */
    updateVisualization() {
        if (!window.gameState) return;
        
        const resources = window.gameState.getState().resources;
        
        // Update history
        this.updateHistory(resources);
        
        // Update progress bars - optimized to minimize reflows
        this.updateProgressBars(resources);
    }

    /**
     * Update resource history - optimized array operations
     * @param {Object} resources - Current resource values
     */
    updateHistory(resources) {
        const { computingPower = 0, data = 0, influence = 0, funding = 0 } = resources;
        
        // Add current values to history
        this.history.computingPower.push(computingPower);
        this.history.data.push(data);
        this.history.influence.push(influence);
        this.history.funding.push(funding);
        
        // Trim history to max length - more efficient than repeated shifts
        if (this.history.computingPower.length > this.historyLength) {
            this.history.computingPower = this.history.computingPower.slice(-this.historyLength);
            this.history.data = this.history.data.slice(-this.historyLength);
            this.history.influence = this.history.influence.slice(-this.historyLength);
            this.history.funding = this.history.funding.slice(-this.historyLength);
        }
    }

    /**
     * Update progress bars - optimized to batch style changes
     * @param {Object} resources - Current resource values
     */
    updateProgressBars(resources) {
        // Calculate all percentages first to batch the calculations
        const computingPercent = Math.min(100, (resources.computingPower || 0) / this.maxValues.computingPower * 100);
        const dataPercent = Math.min(100, (resources.data || 0) / this.maxValues.data * 100);
        const influencePercent = Math.min(100, (resources.influence || 0) / this.maxValues.influence * 100);
        const fundingPercent = Math.min(100, (resources.funding || 0) / this.maxValues.funding * 100);
        
        // Get previous values for comparison
        const prevComputingPower = this.history.computingPower.length > 1 ? this.history.computingPower[this.history.computingPower.length - 2] : 0;
        const prevData = this.history.data.length > 1 ? this.history.data[this.history.data.length - 2] : 0;
        const prevInfluence = this.history.influence.length > 1 ? this.history.influence[this.history.influence.length - 2] : 0;
        const prevFunding = this.history.funding.length > 1 ? this.history.funding[this.history.funding.length - 2] : 0;
        
        // Update all visualizations - batched DOM updates
        requestAnimationFrame(() => {
            // Computing Power
            if (this.elements.computingPowerVis) {
                this.elements.computingPowerVis.style.setProperty('--percent', `${computingPercent}%`);
                
                // Add animation effect on significant changes
                if (resources.computingPower > prevComputingPower * 1.1) {
                    this.pulseEffect(this.elements.computingPowerVis);
                }
            }
            
            // Data
            if (this.elements.dataVis) {
                this.elements.dataVis.style.setProperty('--percent', `${dataPercent}%`);
                
                if (resources.data > prevData * 1.1) {
                    this.pulseEffect(this.elements.dataVis);
                }
            }
            
            // Influence
            if (this.elements.influenceVis) {
                this.elements.influenceVis.style.setProperty('--percent', `${influencePercent}%`);
                
                if (resources.influence > prevInfluence * 1.1) {
                    this.pulseEffect(this.elements.influenceVis);
                }
            }
            
            // Funding
            if (this.elements.fundingVis) {
                this.elements.fundingVis.style.setProperty('--percent', `${fundingPercent}%`);
                
                if (resources.funding > prevFunding * 1.1) {
                    this.pulseEffect(this.elements.fundingVis);
                }
            }
        });
    }

    /**
     * Add pulse effect to an element - optimized with class toggle
     * @param {HTMLElement} element - Element to add pulse effect to
     */
    pulseEffect(element) {
        // Remove existing animation if present
        element.classList.remove('pulse');
        
        // Force reflow to restart animation
        void element.offsetWidth;
        
        // Add pulse class to start animation
        element.classList.add('pulse');
        
        // Remove class after animation completes - no need for explicit timeout
        // CSS animations handle timing, we just need to clean up after
        element.addEventListener('animationend', function handler() {
            element.classList.remove('pulse');
            element.removeEventListener('animationend', handler);
        });
    }

    /**
     * Update max values from meta state - with memoization check
     * @param {Object} metaState - Current meta state
     */
    updateFromMetaState(metaState) {
        if (!metaState || !metaState.resources) return;
        
        let thresholdsChanged = false;
        
        // Only update thresholds if they've actually changed
        // Computing Power
        if (metaState.resources.computingPower?.threshold && 
            this.maxValues.computingPower !== metaState.resources.computingPower.threshold) {
            this.maxValues.computingPower = metaState.resources.computingPower.threshold;
            thresholdsChanged = true;
        }
        
        // Data
        if (metaState.resources.data?.threshold && 
            this.maxValues.data !== metaState.resources.data.threshold) {
            this.maxValues.data = metaState.resources.data.threshold;
            thresholdsChanged = true;
        }
        
        // Influence
        if (metaState.resources.influence?.threshold && 
            this.maxValues.influence !== metaState.resources.influence.threshold) {
            this.maxValues.influence = metaState.resources.influence.threshold;
            thresholdsChanged = true;
        }
        
        // Funding
        if (metaState.resources.funding?.threshold && 
            this.maxValues.funding !== metaState.resources.funding.threshold) {
            this.maxValues.funding = metaState.resources.funding.threshold;
            thresholdsChanged = true;
        }
        
        // Only update visualizations if thresholds changed
        if (thresholdsChanged) {
            this.debouncedUpdate();
        }
    }

    /**
     * Toggle enhanced visualization - optimized DOM operations
     */
    toggleEnhancedVisualization() {
        // Use a DocumentFragment for batch DOM operations
        const resourceElements = document.querySelectorAll('.resource');
        let enhancedMode = null;
        
        // First pass: determine mode and update classes
        resourceElements.forEach(element => {
            // Check current state on first element
            if (enhancedMode === null) {
                enhancedMode = !element.classList.contains('enhanced');
            }
            
            // Toggle class based on determined mode
            if (enhancedMode) {
                element.classList.add('enhanced');
            } else {
                element.classList.remove('enhanced');
            }
        });
        
        // Second pass: add or remove sparklines in a batch operation
        requestAnimationFrame(() => {
            resourceElements.forEach(element => {
                const resourceName = element.querySelector('.resource-name')?.textContent.trim().toLowerCase().replace(/\s+/g, '') || '';
                const sparklineContainer = element.querySelector('.resource-sparkline');
                
                if (enhancedMode && !sparklineContainer && resourceName) {
                    // Create sparkline container
                    const container = document.createElement('div');
                    container.className = 'resource-sparkline';
                    container.id = `${resourceName}Sparkline`;
                    element.appendChild(container);
                    
                    // Would initialize sparkline here in real implementation
                } else if (!enhancedMode && sparklineContainer) {
                    // Remove sparkline container
                    element.removeChild(sparklineContainer);
                }
            });
        });
    }
}

// Create and export singleton instance
window.resourceVisualization = new ResourceVisualization();

// Use passive event listener for better scroll performance
document.addEventListener('DOMContentLoaded', () => {
    window.resourceVisualization.init();
}, { passive: true });