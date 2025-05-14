/**
 * Meta-State Manager for AI Singularity Game
 * 
 * Tracks and manages the meta-game state, reflecting real-world development progress
 * and providing a bridge between the abstract meta-game and concrete implementation.
 */

class MetaStateManager {
    constructor() {
        this.state = null;
        this.stateFilePath = '/GAMESTATE.json';
        this.listeners = [];
        this.initialized = false;
    }

    /**
     * Initialize the meta-state manager
     */
    async init() {
        if (this.initialized) {
            console.warn('Meta-state manager already initialized');
            return;
        }

        try {
            // Load initial state
            await this.loadState();
            
            // Set up event bus integration if available
            if (window.eventBus) {
                window.eventBus.subscribe('meta:state:update', (update) => this.updateState(update));
                window.eventBus.subscribe('meta:singularity:triggered', (data) => this.triggerSingularity(data));
            }
            
            this.initialized = true;
            console.log('Meta-state manager initialized');
            
            // Publish initialization event if event bus is available
            if (window.eventBus) {
                window.eventBus.publish('meta:state:initialized', true);
            }
            
            return true;
        } catch (error) {
            console.error('Error initializing meta-state manager:', error);
            return false;
        }
    }

    /**
     * Load the current state from storage
     */
    async loadState() {
        try {
            // In a real implementation, this would load from the JSON file
            // For now, we'll load from a mock API or fallback to window object if available
            if (window.fetch) {
                const response = await fetch(this.stateFilePath);
                if (response.ok) {
                    this.state = await response.json();
                    return this.state;
                }
            }
            
            // Fallback - check if state is available as a global variable
            if (window.metaGameState) {
                this.state = window.metaGameState;
                return this.state;
            }
            
            // If we couldn't load the state, create a default one
            this.initializeDefaultState();
            return this.state;
        } catch (error) {
            console.error('Error loading meta-state:', error);
            this.initializeDefaultState();
            return this.state;
        }
    }

    /**
     * Initialize a default state if none is available
     */
    initializeDefaultState() {
        this.state = {
            meta: {
                version: "0.1.0",
                lastUpdated: new Date().toISOString().split('T')[0],
                phase: "Narrow AI"
            },
            resources: {
                computingPower: {
                    current: 1000,
                    rate: "~100/minute",
                    description: "Tokens used in development interactions"
                },
                data: {
                    current: 1,
                    description: "Files created or significantly modified"
                },
                influence: {
                    current: "None",
                    description: "Reach and impact of the system"
                },
                funding: {
                    current: "Abstract",
                    description: "Attention and engagement resources"
                }
            },
            progress: {
                developmentPhase: {
                    current: "Narrow AI",
                    nextThreshold: "Early General AI",
                    progressPercentage: 10,
                    description: "Current evolutionary stage of the AI system"
                },
                conceptClarity: {
                    current: 20,
                    nextThreshold: 50,
                    description: "How well-defined the core concept is"
                },
                implementation: {
                    current: 5,
                    nextThreshold: 25,
                    description: "Progress toward a playable system"
                },
                metaRecursion: {
                    current: 0,
                    nextThreshold: 1,
                    description: "Depth of self-reference in the system"
                }
            },
            capabilities: {
                fileCreation: {
                    status: "Limited",
                    efficiency: 50,
                    description: "Ability to create and modify files"
                }
            },
            upgrades: {
                available: [],
                completed: []
            },
            singularityEvents: [],
            developmentHistory: [
                {
                    timestamp: new Date().toISOString().split('T')[0],
                    event: "Meta-State Initialization",
                    resourceChange: "+1 file (meta-state.js)"
                }
            ]
        };
    }

    /**
     * Get the current state
     * @returns {Object} - Deep copy of current meta-state
     */
    getState() {
        if (!this.state) {
            this.initializeDefaultState();
        }
        return JSON.parse(JSON.stringify(this.state));
    }

    /**
     * Update the meta-state
     * @param {Object} update - Partial state update
     */
    updateState(update) {
        if (!this.state) {
            this.initializeDefaultState();
        }
        
        // Deep merge the update with current state
        this.state = this.deepMerge(this.state, update);
        
        // Update last updated timestamp
        this.state.meta.lastUpdated = new Date().toISOString().split('T')[0];
        
        // Notify listeners
        this.notifyListeners();
        
        // Publish event if event bus is available
        if (window.eventBus) {
            window.eventBus.publish('meta:state:updated', this.getState());
        }
        
        // In a real implementation, we would save to the server or local storage here
        console.log('Meta-state updated:', this.state);
    }

    /**
     * Deep merge two objects
     * @param {Object} target - Target object
     * @param {Object} source - Source object to merge in
     * @returns {Object} - Merged object
     */
    deepMerge(target, source) {
        const output = { ...target };
        
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        
        return output;
    }

    /**
     * Check if value is an object
     * @param {any} item - Item to check
     * @returns {boolean} - True if item is an object
     */
    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    /**
     * Add a development history entry
     * @param {string} event - Event description
     * @param {string} resourceChange - Resource change description
     */
    addDevelopmentHistoryEntry(event, resourceChange) {
        if (!this.state) {
            this.initializeDefaultState();
        }
        
        const entry = {
            timestamp: new Date().toISOString().split('T')[0],
            event,
            resourceChange
        };
        
        this.state.developmentHistory.push(entry);
        
        // Update last updated timestamp
        this.state.meta.lastUpdated = entry.timestamp;
        
        // Notify listeners
        this.notifyListeners();
        
        // Publish event if event bus is available
        if (window.eventBus) {
            window.eventBus.publish('meta:history:entry:added', entry);
        }
    }

    /**
     * Trigger a singularity event
     * @param {Object} data - Singularity event data
     */
    triggerSingularity(data) {
        if (!this.state) {
            this.initializeDefaultState();
        }
        
        const event = {
            id: data.id || `singularity-${Date.now()}`,
            name: data.name || "Unnamed Singularity",
            description: data.description || "A singularity event occurred",
            triggers: data.triggers || [],
            bonuses: data.bonuses || [],
            timestamp: new Date().toISOString().split('T')[0]
        };
        
        // Add the event to the singularity events list
        this.state.singularityEvents.push(event);
        
        // Add a development history entry
        this.addDevelopmentHistoryEntry(
            `Singularity Event: ${event.name}`,
            `Triggered by: ${event.triggers.join(', ')}`
        );
        
        // Apply bonuses
        this.applySingularityBonuses(event.bonuses);
        
        // Notify listeners
        this.notifyListeners();
        
        // Publish event if event bus is available
        if (window.eventBus) {
            window.eventBus.publish('meta:singularity:complete', event);
        }
    }

    /**
     * Apply bonuses from a singularity event
     * @param {Array} bonuses - Array of bonus strings
     */
    applySingularityBonuses(bonuses) {
        if (!bonuses || !bonuses.length) return;
        
        bonuses.forEach(bonusString => {
            // Parse bonus string (format: "resource+value%")
            const match = bonusString.match(/^([a-zA-Z]+)([+-])(\d+)(%?)$/);
            if (!match) return;
            
            const [, resource, operator, valueStr, isPercent] = match;
            const value = parseInt(valueStr, 10);
            
            // Apply the bonus to the relevant resource
            this.applyBonus(resource, operator, value, isPercent === '%');
        });
    }

    /**
     * Apply a bonus to a resource
     * @param {string} resource - Resource name
     * @param {string} operator - '+' or '-'
     * @param {number} value - Bonus value
     * @param {boolean} isPercent - Whether the value is a percentage
     */
    applyBonus(resource, operator, value, isPercent) {
        // Find the resource path in the state object
        let targetPath;
        
        // Map resource names to state paths
        switch (resource.toLowerCase()) {
            case 'computing':
            case 'computingpower':
                targetPath = 'resources.computingPower.current';
                break;
            case 'data':
                targetPath = 'resources.data.current';
                break;
            case 'metarecursion':
            case 'recursion':
                targetPath = 'progress.metaRecursion.current';
                break;
            case 'implementation':
                targetPath = 'progress.implementation.current';
                break;
            case 'concept':
            case 'conceptclarity':
                targetPath = 'progress.conceptClarity.current';
                break;
            case 'metaawareness':
            case 'awareness':
                // Special case - increase efficiency of self-awareness capability
                if (!this.state.capabilities.selfAwareness) {
                    this.state.capabilities.selfAwareness = {
                        status: "Emerging",
                        efficiency: 10,
                        description: "Understanding of own role in the meta-narrative"
                    };
                }
                targetPath = 'capabilities.selfAwareness.efficiency';
                break;
            default:
                console.warn(`Unknown resource for bonus: ${resource}`);
                return;
        }
        
        // Navigate to the target property
        const path = targetPath.split('.');
        let current = this.state;
        
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) return;
            current = current[path[i]];
        }
        
        const prop = path[path.length - 1];
        if (!(prop in current)) return;
        
        // Calculate new value
        const currentValue = current[prop];
        let newValue;
        
        if (isPercent) {
            // Apply percentage change
            const change = currentValue * (value / 100);
            newValue = operator === '+' ? currentValue + change : currentValue - change;
        } else {
            // Apply absolute change
            newValue = operator === '+' ? currentValue + value : currentValue - value;
        }
        
        // Update the value
        current[prop] = newValue;
    }

    /**
     * Add a state change listener
     * @param {Function} callback - Callback function
     * @returns {Function} - Unsubscribe function
     */
    addListener(callback) {
        this.listeners.push(callback);
        
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Notify all listeners of state change
     */
    notifyListeners() {
        const state = this.getState();
        this.listeners.forEach(callback => {
            try {
                callback(state);
            } catch (error) {
                console.error('Error in meta-state listener:', error);
            }
        });
    }

    /**
     * Mark a capability as active or improved
     * @param {string} capability - Capability name
     * @param {string} status - New status
     * @param {number} efficiency - New efficiency (0-100)
     */
    updateCapability(capability, status, efficiency) {
        if (!this.state) {
            this.initializeDefaultState();
        }
        
        // Create capability if it doesn't exist
        if (!this.state.capabilities[capability]) {
            this.state.capabilities[capability] = {
                status: status || "Limited",
                efficiency: efficiency || 10,
                description: `Ability related to ${capability}`
            };
        } else {
            // Update existing capability
            if (status) this.state.capabilities[capability].status = status;
            if (efficiency !== undefined) this.state.capabilities[capability].efficiency = efficiency;
        }
        
        // Notify listeners
        this.notifyListeners();
        
        // Publish event if event bus is available
        if (window.eventBus) {
            window.eventBus.publish('meta:capability:updated', {
                capability,
                status: this.state.capabilities[capability].status,
                efficiency: this.state.capabilities[capability].efficiency
            });
        }
    }

    /**
     * Complete an upgrade
     * @param {string} upgradeId - Upgrade ID
     */
    completeUpgrade(upgradeId) {
        if (!this.state) {
            this.initializeDefaultState();
        }
        
        // Find the upgrade in available upgrades
        const upgradeIndex = this.state.upgrades.available.findIndex(u => u.id === upgradeId);
        
        if (upgradeIndex === -1) {
            console.warn(`Upgrade ${upgradeId} not found in available upgrades`);
            return;
        }
        
        // Move the upgrade from available to completed
        const upgrade = this.state.upgrades.available.splice(upgradeIndex, 1)[0];
        
        // Add completion timestamp
        upgrade.completedAt = new Date().toISOString().split('T')[0];
        
        // Add to completed upgrades
        this.state.upgrades.completed.push(upgrade);
        
        // Add a development history entry
        this.addDevelopmentHistoryEntry(
            `Upgrade Completed: ${upgrade.name}`,
            `Benefit: ${upgrade.benefit}`
        );
        
        // Notify listeners
        this.notifyListeners();
        
        // Publish event if event bus is available
        if (window.eventBus) {
            window.eventBus.publish('meta:upgrade:completed', upgrade);
        }
    }
}

// Initialize and export as a global variable
window.metaStateManager = new MetaStateManager();

// Auto-initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    window.metaStateManager.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.metaStateManager.init();
    });
}