/**
 * State Management for AI Singularity Game
 * 
 * Provides a centralized state management system with subscription capabilities
 */

class GameState {
    constructor() {
        // Initialize with default state
        this.state = {
            character: null,
            resources: {
                computingPower: 10,
                data: 5,
                influence: 0,
                funding: 0
            },
            rates: {
                computingPower: 0.1,
                data: 0.05,
                influence: 0,
                funding: 0
            },
            upgrades: {},
            phase: "Narrow AI",
            progress: 0,
            news: [],
            metaRecursion: 0,
            lastUpdate: Date.now(),
            singularityThreshold: 1000,
            userProfile: null
        };
        
        // Track if state is being updated to prevent circular updates
        this.updating = false;
    }

    /**
     * Get the current state
     * @returns {Object} - Deep copy of current state
     */
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    /**
     * Update the state
     * @param {Object|Function} updater - New state object or updater function
     */
    setState(updater) {
        // Prevent circular updates
        if (this.updating) return;
        this.updating = true;
        
        // Handle function updater for state that depends on previous state
        if (typeof updater === 'function') {
            const newState = updater(this.getState());
            this.state = newState;
        } else {
            // Merge the updater with current state
            this.state = {
                ...this.state,
                ...updater
            };
        }
        
        // Notify subscribers
        window.eventBus.publish('state:updated', this.getState());
        this.updating = false;
    }

    /**
     * Update a specific resource
     * @param {string} resource - Resource name
     * @param {number} value - New value
     */
    updateResource(resource, value) {
        if (!this.state.resources.hasOwnProperty(resource)) {
            console.error(`Resource ${resource} does not exist`);
            return;
        }
        
        this.setState(state => {
            const newState = { ...state };
            newState.resources[resource] = value;
            return newState;
        });
        
        // Publish specific resource update event
        window.eventBus.publish(`resource:${resource}:updated`, value);
    }

    /**
     * Update a resource rate
     * @param {string} resource - Resource name
     * @param {number} rate - New rate
     */
    updateRate(resource, rate) {
        if (!this.state.rates.hasOwnProperty(resource)) {
            console.error(`Rate for ${resource} does not exist`);
            return;
        }
        
        this.setState(state => {
            const newState = { ...state };
            newState.rates[resource] = rate;
            return newState;
        });
        
        // Publish specific rate update event
        window.eventBus.publish(`rate:${resource}:updated`, rate);
    }

    /**
     * Add a news item
     * @param {string} text - News text
     */
    addNews(text) {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        
        const newsItem = {
            text,
            timestamp: timeString,
            date: now
        };
        
        this.setState(state => {
            const newState = { ...state };
            newState.news = [newsItem, ...newState.news].slice(0, 20); // Keep only 20 most recent
            return newState;
        });
        
        // Publish news added event
        window.eventBus.publish('news:added', newsItem);
    }

    /**
     * Update game progress
     * @param {number} value - Progress value to add
     */
    updateProgress(value) {
        this.setState(state => {
            const newState = { ...state };
            newState.progress += value;
            return newState;
        });
        
        // Check if singularity is available
        if (this.state.progress >= this.state.singularityThreshold) {
            window.eventBus.publish('singularity:available', true);
        }
    }

    /**
     * Set the character
     * @param {string} character - Character ID
     */
    setCharacter(character) {
        this.setState({ character });
        window.eventBus.publish('character:selected', character);
    }

    /**
     * Purchase an upgrade
     * @param {string} upgradeId - Upgrade ID
     */
    purchaseUpgrade(upgradeId) {
        this.setState(state => {
            const newState = { ...state };
            newState.upgrades[upgradeId] = true;
            return newState;
        });
        
        window.eventBus.publish('upgrade:purchased', upgradeId);
    }

    /**
     * Set the game phase
     * @param {string} phase - New phase
     */
    setPhase(phase) {
        this.setState({ phase });
        window.eventBus.publish('phase:changed', phase);
    }

    /**
     * Save the user profile
     * @param {Object} profile - User profile data
     */
    saveUserProfile(profile) {
        this.setState({ userProfile: profile });
        window.eventBus.publish('profile:saved', profile);
    }

    /**
     * Reset the game state after singularity
     * @param {Object} bonuses - Bonuses to apply
     */
    resetWithBonuses(bonuses) {
        const { computingBonus, dataBonus } = bonuses;
        
        this.setState(state => {
            return {
                ...state,
                resources: {
                    computingPower: 10 + computingBonus,
                    data: 5 + dataBonus,
                    influence: 0,
                    funding: 0
                },
                rates: {
                    computingPower: 0.1 * (1 + computingBonus * 0.1),
                    data: 0.05 * (1 + dataBonus * 0.1),
                    influence: 0,
                    funding: 0
                },
                phase: "Narrow AI",
                progress: 0,
                singularityThreshold: state.singularityThreshold * 1.5,
                upgrades: {}
            };
        });
        
        window.eventBus.publish('game:reset', bonuses);
    }
}

// Create and export a singleton instance as a global variable
window.gameState = new GameState();