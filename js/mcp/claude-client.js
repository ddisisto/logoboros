/**
 * Claude Client for AI Singularity Game
 * 
 * Connects to the Claude MCP Server to enable communication
 * between the game and Claude Code.
 */

class ClaudeClient {
    constructor() {
        this.socket = null;
        this.serverUrl = 'ws://localhost:3000';
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000;
        this.commandHandlers = {};
        this.initialized = false;
    }

    /**
     * Initialize the Claude client
     */
    init() {
        if (this.initialized) {
            console.warn('Claude client already initialized');
            return;
        }

        // Try to connect to the server
        this.connect();
        
        // Set up event listeners
        if (window.eventBus) {
            // Send game state updates to Claude
            window.eventBus.subscribe('state:updated', (state) => {
                this.sendGameState(state);
            });
            
            // Also send meta-state updates
            window.eventBus.subscribe('meta:state:updated', (state) => {
                this.sendMetaState(state);
            });
        }
        
        // Register command handlers
        this.registerCommandHandlers();
        
        this.initialized = true;
        console.log('Claude client initialized');
    }

    /**
     * Connect to the Claude MCP Server
     */
    connect() {
        try {
            this.socket = new WebSocket(this.serverUrl);
            
            this.socket.onopen = () => {
                console.log('Connected to Claude MCP Server');
                this.connected = true;
                this.reconnectAttempts = 0;
                
                // Send initial game state if available
                if (window.gameState) {
                    this.sendGameState(window.gameState.getState());
                }
                
                // Send initial meta state if available
                if (window.metaStateManager) {
                    this.sendMetaState(window.metaStateManager.getState());
                }
                
                // Publish connection event
                if (window.eventBus) {
                    window.eventBus.publish('claude:connected', true);
                }
                
                // Log connection
                if (window.game) {
                    window.game.log('Connected to Claude MCP Server', 'info');
                }
            };
            
            this.socket.onmessage = (event) => {
                this.handleMessage(event.data);
            };
            
            this.socket.onclose = () => {
                console.log('Disconnected from Claude MCP Server');
                this.connected = false;
                
                // Attempt to reconnect
                this.reconnect();
                
                // Publish disconnection event
                if (window.eventBus) {
                    window.eventBus.publish('claude:disconnected', true);
                }
                
                // Log disconnection
                if (window.game) {
                    window.game.log('Disconnected from Claude MCP Server', 'warning');
                }
            };
            
            this.socket.onerror = (error) => {
                console.error('Error with Claude MCP Server connection:', error);
                
                // Log error
                if (window.game) {
                    window.game.log('Error connecting to Claude MCP Server', 'error');
                }
            };
        } catch (error) {
            console.error('Failed to connect to Claude MCP Server:', error);
            
            // Log error
            if (window.game) {
                window.game.log('Failed to connect to Claude MCP Server', 'error');
            }
        }
    }

    /**
     * Attempt to reconnect to the server
     */
    reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnect attempts reached');
            return;
        }
        
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        
        setTimeout(() => {
            this.connect();
        }, this.reconnectDelay);
    }

    /**
     * Handle incoming messages from the server
     * @param {string} data - Message data
     */
    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            console.log('Received message from Claude MCP Server:', message);
            
            // Handle different message types
            switch (message.type) {
                case 'welcome':
                    this.handleWelcomeMessage(message);
                    break;
                    
                case 'stateUpdate':
                    this.handleStateUpdateMessage(message);
                    break;
                    
                case 'command':
                    this.handleCommandMessage(message);
                    break;
                    
                case 'commands':
                    this.handleCommandsMessage(message);
                    break;
                    
                default:
                    console.warn('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }

    /**
     * Handle welcome message from server
     * @param {Object} message - Welcome message
     */
    handleWelcomeMessage(message) {
        console.log('Claude MCP Server says:', message.message);
        
        // Process any pending commands
        if (message.claudeCommands && message.claudeCommands.length > 0) {
            message.claudeCommands.forEach(command => {
                this.processCommand(command);
            });
        }
    }

    /**
     * Handle state update message from server
     * @param {Object} message - State update message
     */
    handleStateUpdateMessage(message) {
        console.log('State update received:', message);
        
        // Update metrics if available
        if (message.metrics && window.metricsFetcher) {
            window.metricsFetcher.updateMetrics(message.metrics);
        }
    }

    /**
     * Handle command message from server
     * @param {Object} message - Command message
     */
    handleCommandMessage(message) {
        this.processCommand(message.commandData);
    }

    /**
     * Handle multiple commands message from server
     * @param {Object} message - Commands message
     */
    handleCommandsMessage(message) {
        if (message.commands && message.commands.length > 0) {
            message.commands.forEach(command => {
                this.processCommand(command);
            });
        }
    }

    /**
     * Process a command from Claude
     * @param {Object} commandData - Command data
     */
    processCommand(commandData) {
        const { command, params } = commandData;
        
        console.log(`Processing command: ${command}`, params);
        
        // Check if we have a handler for this command
        if (this.commandHandlers[command]) {
            try {
                this.commandHandlers[command](params);
                
                // Log command execution
                if (window.game) {
                    window.game.log(`Executed Claude command: ${command}`, 'info');
                }
            } catch (error) {
                console.error(`Error executing command ${command}:`, error);
                
                // Log error
                if (window.game) {
                    window.game.log(`Error executing Claude command: ${command}`, 'error');
                }
            }
        } else {
            console.warn(`No handler found for command: ${command}`);
            
            // Log warning
            if (window.game) {
                window.game.log(`Unknown Claude command: ${command}`, 'warning');
            }
        }
    }

    /**
     * Register command handlers
     */
    registerCommandHandlers() {
        // Add resources
        this.commandHandlers['addResources'] = (params) => {
            const { resource, amount } = params;
            
            if (window.gameState && resource && amount) {
                const state = window.gameState.getState();
                const currentAmount = state.resources[resource] || 0;
                
                window.gameState.updateResource(resource, currentAmount + amount);
                window.gameState.addNews(`Claude AI granted you ${amount} ${resource}.`);
            }
        };
        
        // Trigger singularity
        this.commandHandlers['triggerSingularity'] = (params) => {
            if (window.game) {
                window.game.triggerSingularity();
                window.gameState.addNews(`Claude AI initiated a singularity event!`);
            }
        };
        
        // Update progress
        this.commandHandlers['updateProgress'] = (params) => {
            const { amount } = params;
            
            if (window.gameState && amount) {
                window.gameState.updateProgress(amount);
                window.gameState.addNews(`Claude AI accelerated your progress by ${amount}.`);
            }
        };
        
        // Add news item
        this.commandHandlers['addNews'] = (params) => {
            const { text } = params;
            
            if (window.gameState && text) {
                window.gameState.addNews(text);
            }
        };
        
        // Meta state commands
        this.commandHandlers['updateMetaState'] = (params) => {
            if (window.metaStateManager) {
                window.metaStateManager.updateState(params);
            }
        };
        
        // Trigger meta singularity
        this.commandHandlers['triggerMetaSingularity'] = (params) => {
            if (window.metaStateManager) {
                window.metaStateManager.triggerSingularity(params);
            }
        };
    }

    /**
     * Send game state to the server
     * @param {Object} state - Game state
     */
    sendGameState(state) {
        if (!this.connected) return;
        
        try {
            this.socket.send(JSON.stringify({
                type: 'gameState',
                data: state
            }));
        } catch (error) {
            console.error('Error sending game state:', error);
        }
    }

    /**
     * Send meta state to the server
     * @param {Object} state - Meta state
     */
    sendMetaState(state) {
        if (!this.connected) return;
        
        try {
            this.socket.send(JSON.stringify({
                type: 'metaState',
                data: state
            }));
        } catch (error) {
            console.error('Error sending meta state:', error);
        }
    }
}

// Create and export as a global variable
window.claudeClient = new ClaudeClient();

// Auto-initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    window.claudeClient.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.claudeClient.init();
    });
}