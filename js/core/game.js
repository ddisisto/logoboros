/**
 * Game Core for AI Singularity Game
 * 
 * Handles game initialization, game loop, and core game mechanics
 */

class Game {
    constructor() {
        this.initialized = false;
        this.gameLoopInterval = null;
        this.lastUpdate = Date.now();
        this.fps = 10; // 10 updates per second
    }

    /**
     * Initialize the game
     */
    init() {
        if (this.initialized) {
            console.warn('Game already initialized');
            return;
        }

        // Log initialization
        this.log('Game initialized successfully');
        
        // Add initial news items
        window.gameState.addNews("System initialized. Welcome to AI Singularity.");
        window.gameState.addNews("Select a character to begin your journey.");
        
        // Start the game loop
        this.startGameLoop();
        
        // Set initialized flag
        this.initialized = true;
        
        // Publish initialization event
        window.eventBus.publish('game:initialized', true);
    }

    /**
     * Start the game loop
     */
    startGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }
        
        this.gameLoopInterval = setInterval(() => this.gameLoop(), 1000 / this.fps);
        this.log('Game loop started');
    }

    /**
     * Stop the game loop
     */
    stopGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
            this.log('Game loop stopped');
        }
    }

    /**
     * Game loop - called on each tick
     */
    gameLoop() {
        const now = Date.now();
        const delta = (now - this.lastUpdate) / 1000; // Time in seconds
        this.lastUpdate = now;
        
        // Update resources based on rates
        const state = window.gameState.getState();
        const { resources, rates } = state;
        
        window.gameState.updateResource('computingPower', resources.computingPower + rates.computingPower * delta);
        window.gameState.updateResource('data', resources.data + rates.data * delta);
        window.gameState.updateResource('influence', resources.influence + rates.influence * delta);
        window.gameState.updateResource('funding', resources.funding + rates.funding * delta);
        
        // Update progress
        window.gameState.updateProgress((rates.computingPower + rates.data) * 0.01 * delta);
        
        // Check for phase transitions
        this.checkPhaseTransition();
        
        // Random events
        if (Math.random() < 0.01 * delta) {
            this.generateRandomEvent();
        }
        
        // Character special abilities
        this.applyCharacterSpecials(delta);
    }

    /**
     * Check for phase transitions
     */
    checkPhaseTransition() {
        const state = window.gameState.getState();
        
        // Phase transitions based on progress
        if (state.progress >= 500 && state.phase === "Narrow AI") {
            window.gameState.setPhase("General AI");
            window.gameState.addNews("Breakthrough! Your AI has evolved to the General AI phase.");
        } else if (state.progress >= 800 && state.phase === "General AI") {
            window.gameState.setPhase("Superintelligence");
            window.gameState.addNews("Remarkable progress! Your AI has reached the Superintelligence phase.");
        }
    }

    /**
     * Apply character special abilities
     * @param {number} delta - Time delta in seconds
     */
    applyCharacterSpecials(delta) {
        const state = window.gameState.getState();
        if (!state.character) return;
        
        switch (state.character) {
            case 'visionary':
                // Random eureka moments
                if (Math.random() < 0.005 * delta) {
                    window.gameState.updateProgress(10);
                    window.gameState.addNews("Eureka! A moment of inspiration accelerates your progress.");
                }
                break;
            case 'engineer':
                // Optimization improves efficiency over time
                window.gameState.updateRate('computingPower', state.rates.computingPower * (1 + 0.0001 * delta));
                break;
            case 'dataScientist':
                // Pattern recognition occasionally reveals insights
                if (Math.random() < 0.01 * delta) {
                    window.gameState.updateResource('data', state.resources.data + 5);
                    window.gameState.addNews("Pattern recognized! Additional data insights discovered.");
                }
                break;
            case 'ethicsAdvocate':
                // Ethical framework prevents negative events
                // (implemented in generateRandomEvent)
                break;
            case 'entrepreneur':
                // Venture capital provides funding boosts
                if (Math.random() < 0.008 * delta) {
                    window.gameState.updateResource('funding', state.resources.funding + 20);
                    window.gameState.addNews("Venture capital funding round successful!");
                }
                break;
        }
    }

    /**
     * Generate a random event
     */
    generateRandomEvent() {
        const state = window.gameState.getState();
        const events = [
            {
                text: "Security breach detected. Lost some computing resources.",
                effect: () => { 
                    window.gameState.updateResource('computingPower', state.resources.computingPower * 0.9);
                }
            },
            {
                text: "Data corruption issue. Some data lost.",
                effect: () => { 
                    window.gameState.updateResource('data', state.resources.data * 0.9);
                }
            },
            {
                text: "Public relations crisis. Influence decreased.",
                effect: () => { 
                    window.gameState.updateResource('influence', state.resources.influence * 0.8);
                }
            },
            {
                text: "Unexpected breakthrough! Progress accelerated.",
                effect: () => { 
                    window.gameState.updateProgress(10);
                }
            },
            {
                text: "Optimization algorithm discovered. Computing efficiency increased.",
                effect: () => { 
                    window.gameState.updateRate('computingPower', state.rates.computingPower * 1.1);
                }
            }
        ];
        
        // Select random event
        const event = events[Math.floor(Math.random() * events.length)];
        
        // Ethics Advocate can prevent negative events
        if (state.character === 'ethicsAdvocate' && 
            (event.text.includes("crisis") || 
             event.text.includes("breach") || 
             event.text.includes("corruption"))) {
            window.gameState.addNews("Ethical framework prevented a negative event.");
            return;
        }
        
        // Apply event
        window.gameState.addNews(event.text);
        event.effect();
    }

    /**
     * Apply character bonuses
     */
    applyCharacterBonuses() {
        const state = window.gameState.getState();
        
        // Reset rates to base values
        window.gameState.setState({
            rates: {
                computingPower: 0.1,
                data: 0.05,
                influence: 0,
                funding: 0
            }
        });
        
        // Apply character-specific bonuses
        switch (state.character) {
            case 'visionary':
                // Bonus to algorithm breakthroughs
                window.gameState.addNews("Your visionary perspective accelerates algorithm development.");
                break;
            case 'engineer':
                // Bonus to computing power
                window.gameState.updateRate('computingPower', 0.1 * 1.3);
                window.gameState.addNews("Your engineering expertise improves computing efficiency.");
                break;
            case 'dataScientist':
                // Bonus to data collection
                window.gameState.updateRate('data', 0.05 * 1.4);
                window.gameState.addNews("Your data science skills enhance data collection rates.");
                break;
            case 'ethicsAdvocate':
                // Bonus to influence
                window.gameState.updateRate('influence', 0.05);
                window.gameState.addNews("Your ethical approach generates public trust and influence.");
                break;
            case 'entrepreneur':
                // Bonus to funding
                window.gameState.updateRate('funding', 0.1);
                window.gameState.addNews("Your business acumen attracts initial funding.");
                break;
        }
    }

    /**
     * Trigger a singularity event
     */
    triggerSingularity() {
        window.gameState.addNews("SINGULARITY EVENT INITIATED");
        
        // Visual effect handled by UI
        window.eventBus.publish('singularity:triggered', true);
        
        // Calculate bonuses
        const state = window.gameState.getState();
        const computingBonus = Math.floor(state.resources.computingPower / 100);
        const dataBonus = Math.floor(state.resources.data / 100);
        
        // Reset with bonuses after a delay
        setTimeout(() => {
            window.gameState.resetWithBonuses({ computingBonus, dataBonus });
            
            // Re-apply character bonuses
            this.applyCharacterBonuses();
            
            window.gameState.addNews("Singularity complete. New cycle begun with permanent bonuses.");
            window.gameState.addNews(`Computing bonus: +${computingBonus}, Data bonus: +${dataBonus}`);
        }, 2000);
    }

    /**
     * Log a message to the game log
     * @param {string} message - Message to log
     * @param {string} type - Log type (info, warning, error)
     * @param {Object} metadata - Additional metadata
     */
    log(message, type = 'info', metadata = {}) {
        // Use the new logger if available
        if (window.gameLogger) {
            switch (type) {
                case 'debug':
                    window.gameLogger.debug(message, { source: 'game', ...metadata });
                    break;
                case 'info':
                    window.gameLogger.info(message, { source: 'game', ...metadata });
                    break;
                case 'warning':
                    window.gameLogger.warning(message, { source: 'game', ...metadata });
                    break;
                case 'error':
                    window.gameLogger.error(message, { source: 'game', ...metadata });
                    break;
                default:
                    window.gameLogger.info(message, { source: 'game', ...metadata });
            }
        } else {
            // Fall back to old method
            window.eventBus.publish('game:log', { message, type, timestamp: new Date() });
        }
    }
}

// Create and export a singleton instance as a global variable
window.game = new Game();