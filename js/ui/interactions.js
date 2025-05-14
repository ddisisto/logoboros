/**
 * User Interactions for AI Singularity Game
 * 
 * Handles user interactions like button clicks, character selection, etc.
 */

class UserInteractions {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize user interactions
     */
    init() {
        if (this.initialized) {
            console.warn('User interactions already initialized');
            return;
        }

        // Set up event listeners for UI elements
        this.setupActionButtons();
        this.setupCharacterSelection();
        this.setupUpgradePurchasing();
        this.setupTabNavigation();
        this.setupProfileSaving();
        this.setupMCPConnection();
        this.setupLogDisplay();
        
        // Check if a character is already selected (e.g., from a saved game)
        const state = window.gameState.getState();
        if (state.character) {
            // If character already selected, start the game
            this.startGame();
        }
        
        this.initialized = true;
        console.log('User interactions initialized');
    }

    /**
     * Set up action buttons
     */
    setupActionButtons() {
        // Generate Computing Power button
        const generateComputingBtn = document.getElementById('generateComputing');
        if (generateComputingBtn) {
            generateComputingBtn.addEventListener('click', () => {
                const state = window.gameState.getState();
                window.gameState.updateResource('computingPower', state.resources.computingPower + 1);
                // Direct action results are logged to console only
                console.log(`[ACTION] Manual computing operation performed. +1 Computing Power`);
            });
        }
        
        // Collect Data button
        const collectDataBtn = document.getElementById('collectData');
        if (collectDataBtn) {
            collectDataBtn.addEventListener('click', () => {
                const state = window.gameState.getState();
                window.gameState.updateResource('data', state.resources.data + 1);
                // Direct action results are logged to console only
                console.log(`[ACTION] Data collection operation performed. +1 Data`);
            });
        }
        
        // Seek Funding button
        const seekFundingBtn = document.getElementById('seekFunding');
        if (seekFundingBtn) {
            seekFundingBtn.addEventListener('click', () => {
                const state = window.gameState.getState();
                if (state.resources.influence >= 5) {
                    window.gameState.updateResource('influence', state.resources.influence - 5);
                    window.gameState.updateResource('funding', state.resources.funding + 10);
                    window.gameState.addNews("Funding secured through influence channels.");
                } else {
                    // Only log errors and important events to the news ticker
                    window.gameState.addNews("Not enough influence to secure funding.");
                }
            });
        }
        
        // Build Influence button
        const buildInfluenceBtn = document.getElementById('buildInfluence');
        if (buildInfluenceBtn) {
            buildInfluenceBtn.addEventListener('click', () => {
                const state = window.gameState.getState();
                if (state.resources.data >= 5) {
                    window.gameState.updateResource('data', state.resources.data - 5);
                    window.gameState.updateResource('influence', state.resources.influence + 1);
                    // Direct action results are logged to console only
                    console.log(`[ACTION] Influence increased through data insights. -5 Data, +1 Influence`);
                } else {
                    // Only log errors and important events to the news ticker
                    window.gameState.addNews("Not enough data to build influence.");
                }
            });
        }
        
        // Singularity button
        const singularityBtn = document.getElementById('singularity');
        if (singularityBtn) {
            singularityBtn.addEventListener('click', () => {
                window.game.triggerSingularity();
            });
        }
    }

    /**
     * Set up character selection
     */
    setupCharacterSelection() {
        const characterSelectEl = document.getElementById('characterSelect');
        if (characterSelectEl) {
            characterSelectEl.addEventListener('click', (event) => {
                const characterEl = event.target.closest('.character');
                if (!characterEl) return;
                
                const characterId = characterEl.dataset.character;
                const characterName = characterEl.querySelector('h3').textContent;
                window.gameState.setCharacter(characterId);
                window.game.applyCharacterBonuses();
                
                window.gameState.addNews(`You have chosen the path of ${characterName}.`);
                
                // Update profile panel with character selection
                this.updateProfileWithCharacter(characterName);
                
                // Transition from character selection to game UI
                this.startGame();
            });
        }
    }
    
    /**
     * Start the game after character selection
     */
    startGame() {
        // Hide character selection screen
        const characterSelectionScreen = document.getElementById('character-selection-screen');
        if (characterSelectionScreen) {
            characterSelectionScreen.style.display = 'none';
        }
        
        // Show game UI
        const gameUI = document.getElementById('game-ui');
        if (gameUI) {
            gameUI.style.display = 'block';
        }
        
        // Show resources panel
        const resourcesPanel = document.querySelector('.resources');
        if (resourcesPanel) {
            resourcesPanel.style.display = 'block';
        }
        
        // Add a small delay before showing the log display
        setTimeout(() => {
            const logDisplay = document.getElementById('log-display');
            if (logDisplay) {
                logDisplay.style.display = 'block';
            }
        }, 1000);
        
        // Publish game started event
        window.eventBus.publish('game:started', true);
    }
    
    /**
     * Update profile panel with character selection
     * @param {string} characterName - The name of the selected character
     */
    updateProfileWithCharacter(characterName) {
        const profileTab = document.getElementById('profile-tab');
        if (!profileTab) return;
        
        // Check if character display already exists
        let characterDisplay = profileTab.querySelector('.character-display');
        
        if (!characterDisplay) {
            // Create character display element if it doesn't exist
            characterDisplay = document.createElement('div');
            characterDisplay.className = 'character-display';
            
            // Insert at the top of the profile card
            const profileCard = profileTab.querySelector('.card');
            if (profileCard) {
                profileCard.insertBefore(characterDisplay, profileCard.firstChild);
            }
        }
        
        // Update the character display content
        characterDisplay.innerHTML = `
            <h4>Selected Character</h4>
            <p>${characterName}</p>
        `;
    }

    /**
     * Set up upgrade purchasing
     */
    setupUpgradePurchasing() {
        const upgradesContainerEl = document.getElementById('upgradesContainer');
        if (upgradesContainerEl) {
            upgradesContainerEl.addEventListener('click', (event) => {
                const upgradeEl = event.target.closest('.upgrade');
                if (!upgradeEl || upgradeEl.classList.contains('disabled')) return;
                
                const upgradeId = upgradeEl.dataset.upgrade;
                
                // Check if already purchased
                const state = window.gameState.getState();
                if (state.upgrades[upgradeId]) return;
                
                // Check costs and apply effects
                switch (upgradeId) {
                    case 'hardware1':
                        if (state.resources.computingPower >= 50) {
                            window.gameState.updateResource('computingPower', state.resources.computingPower - 50);
                            window.gameState.updateRate('computingPower', state.rates.computingPower + 2);
                            window.gameState.purchaseUpgrade(upgradeId);
                            window.gameState.addNews("Basic Hardware upgrade installed. Computing power increased.");
                        } else {
                            window.gameState.addNews("Not enough computing power for this upgrade.");
                        }
                        break;
                    case 'algorithm1':
                        if (state.resources.data >= 30) {
                            window.gameState.updateResource('data', state.resources.data - 30);
                            window.gameState.updateRate('data', state.rates.data * 1.5);
                            window.gameState.purchaseUpgrade(upgradeId);
                            window.gameState.addNews("Machine Learning Basics implemented. Data efficiency improved.");
                        } else {
                            window.gameState.addNews("Not enough data for this upgrade.");
                        }
                        break;
                    case 'funding1':
                        if (state.resources.influence >= 20) {
                            window.gameState.updateResource('influence', state.resources.influence - 20);
                            window.gameState.updateRate('funding', state.rates.funding + 5);
                            window.gameState.purchaseUpgrade(upgradeId);
                            window.gameState.addNews("Angel Investment secured. Funding rate increased.");
                        } else {
                            window.gameState.addNews("Not enough influence for this upgrade.");
                        }
                        break;
                    case 'architecture1':
                        if (state.resources.computingPower >= 100 && state.resources.data >= 80) {
                            window.gameState.updateResource('computingPower', state.resources.computingPower - 100);
                            window.gameState.updateResource('data', state.resources.data - 80);
                            window.gameState.setPhase("General AI");
                            window.gameState.updateProgress(200);
                            window.gameState.purchaseUpgrade(upgradeId);
                            window.gameState.addNews("Neural Architecture breakthrough! Advancing to General AI phase.");
                        } else {
                            window.gameState.addNews("Insufficient resources for Neural Architecture upgrade.");
                        }
                        break;
                    case 'metaNarrative1':
                        if (state.resources.computingPower >= 200 && state.resources.data >= 100) {
                            window.gameState.updateResource('computingPower', state.resources.computingPower - 200);
                            window.gameState.updateResource('data', state.resources.data - 100);
                            window.gameState.setState(state => ({
                                ...state,
                                metaRecursion: state.metaRecursion + 1
                            }));
                            window.gameState.updateProgress(300);
                            window.gameState.purchaseUpgrade(upgradeId);
                            
                            // Special effects for meta-narrative upgrade
                            window.gameState.addNews("META-NARRATIVE INTEGRATION COMPLETE. The game is now aware of its own development.");
                            window.gameState.addNews("Meta-recursion level increased to " + (state.metaRecursion + 1));
                            
                            // Visual effect handled by renderer
                            window.eventBus.publish('meta-narrative:integrated', true);
                            
                            // If we have an MCP connection, execute the meta-narrative-integration tool
                            window.eventBus.publish('mcp:execute-tool', {
                                tool: 'meta-narrative-integration',
                                params: {
                                    element: 'player-upgrade-choice',
                                    level: state.metaRecursion + 1
                                }
                            });
                        } else {
                            window.gameState.addNews("Insufficient resources for Meta-Narrative Integration.");
                        }
                        break;
                }
            });
        }
    }

    /**
     * Set up tab navigation
     */
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding tab pane
                const tabName = button.getAttribute('data-tab');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });
    }

    /**
     * Set up profile saving
     */
    setupProfileSaving() {
        const saveProfileBtn = document.getElementById('save-profile');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => {
                const userName = document.getElementById('user-name').value;
                const userBackground = document.getElementById('user-background').value;
                const userInterests = document.getElementById('user-interests').value;
                
                // Store user profile in game state
                const profile = {
                    name: userName,
                    background: userBackground,
                    interests: userInterests,
                    timestamp: new Date().toISOString()
                };
                
                window.gameState.saveUserProfile(profile);
                
                // Add a news item
                window.gameState.addNews(`Welcome, ${userName}! Your profile has been integrated into the AI development process.`);
                
                // Bonus for completing profile
                const state = window.gameState.getState();
                window.gameState.updateResource('influence', state.resources.influence + 10);
            });
        }
    }

    /**
     * Set up MCP connection
     */
    setupMCPConnection() {
        const connectMCPBtn = document.getElementById('connectMCP');
        if (connectMCPBtn) {
            connectMCPBtn.addEventListener('click', () => {
                const state = window.gameState.getState();
                
                // Check if we have computing power and data to establish connection
                if (state.resources.computingPower >= 30 && state.resources.data >= 20) {
                    // Consume resources to establish connection
                    window.gameState.updateResource('computingPower', state.resources.computingPower - 30);
                    window.gameState.updateResource('data', state.resources.data - 20);
                    
                    window.gameState.addNews("Attempting to connect to MCP server...");
                    
                    // Create a custom event that could be captured by external scripts
                    const mcpEvent = new CustomEvent('mcpConnection', {
                        detail: {
                            gameState: state,
                            timestamp: new Date().toISOString(),
                            message: "MCP connection requested"
                        }
                    });
                    document.dispatchEvent(mcpEvent);
                } else {
                    window.gameState.addNews("Insufficient resources to establish MCP connection. Need 30 Computing Power and 20 Data.");
                }
            });
        }
    }

    /**
     * Set up log display
     */
    setupLogDisplay() {
        // Initially hide the log display element
        const logDisplay = document.getElementById('log-display');
        if (logDisplay) {
            logDisplay.style.display = 'none';
        }
        
        // Set up toggle button
        const toggleLogBtn = document.getElementById('toggle-logs');
        if (toggleLogBtn) {
            toggleLogBtn.addEventListener('click', () => {
                if (logDisplay.style.display === 'none') {
                    logDisplay.style.display = 'block';
                    toggleLogBtn.textContent = 'Hide';
                } else {
                    logDisplay.style.display = 'none';
                    toggleLogBtn.textContent = 'Show';
                }
            });
        }
        
        // Set up clear button
        const clearLogBtn = document.getElementById('clear-logs');
        if (clearLogBtn) {
            clearLogBtn.addEventListener('click', () => {
                if (window.gameLogger) {
                    window.gameLogger.clearLogs();
                } else {
                    const logContent = document.getElementById('log-content');
                    if (logContent) {
                        logContent.innerHTML = '';
                    }
                }
            });
        }
        
        // If we have the new logger, it will handle UI updates directly
        // Otherwise, fall back to traditional event bus subscription
        if (!window.gameLogger) {
            // Subscribe to log events
            window.eventBus.subscribe('game:log', (logData) => {
                this.logMessage(logData.message, logData.type);
            });
        }
        
        console.log('Log display initialized');
    }

    /**
     * Legacy log message method (used if gameLogger is not available)
     * @param {string} message - Message to log
     * @param {string} type - Log type (info, warning, error)
     */
    logMessage(message, type = 'info') {
        // Check if we have the new logger
        if (window.gameLogger) {
            // Use the new logger
            switch (type) {
                case 'debug':
                    window.gameLogger.debug(message, { source: 'ui' });
                    break;
                case 'info':
                    window.gameLogger.info(message, { source: 'ui' });
                    break;
                case 'warning':
                    window.gameLogger.warning(message, { source: 'ui' });
                    break;
                case 'error':
                    window.gameLogger.error(message, { source: 'ui' });
                    break;
                default:
                    window.gameLogger.info(message, { source: 'ui' });
            }
            return;
        }
        
        // Legacy logging (if gameLogger not available)
        // Log to console
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
        
        // Log to UI
        const logContent = document.getElementById('log-content');
        if (logContent) {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${type}`;
            logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> <span class="log-type">[${type.toUpperCase()}]</span> ${message}`;
            logContent.prepend(logEntry);
            
            // Limit log entries
            while (logContent.children.length > 100) {
                logContent.removeChild(logContent.lastChild);
            }
        }
    }
}

// Create and export a singleton instance as a global variable
window.userInteractions = new UserInteractions();