/**
 * MCP Interface for AI Singularity Game
 * 
 * Provides a clean interface for interacting with MCP servers
 */

class MCPInterface {
    constructor() {
        this.connections = [];
        this.isConnected = false;
        this.initialized = false;
    }

    /**
     * Initialize the MCP interface
     */
    init() {
        if (this.initialized) {
            console.warn('MCP Interface already initialized');
            return;
        }

        // Set up event listeners
        this.setupEventListeners();
        
        this.initialized = true;
        console.log('MCP Interface initialized');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for MCP connection events from the game
        document.addEventListener('mcpConnection', this.handleMCPConnection.bind(this));
        
        // Listen for MCP server responses
        document.addEventListener('mcpConnectionResponse', this.handleMCPConnectionResponse.bind(this));
        document.addEventListener('mcpResourceResponse', this.handleMCPResourceResponse.bind(this));
        document.addEventListener('mcpToolResponse', this.handleMCPToolResponse.bind(this));
        
        // Listen for tool execution requests
        window.eventBus.subscribe('mcp:execute-tool', (data) => {
            if (this.isConnected && this.connections.length > 0) {
                const clientId = this.connections[0].id;
                this.executeTool(clientId, data.tool, data.params);
            } else {
                console.warn('Cannot execute MCP tool: No active connections');
                window.eventBus.publish('game:log', {
                    message: `Cannot execute MCP tool: No active connections`,
                    type: 'warning'
                });
            }
        });
    }

    /**
     * Handle MCP connection event
     * @param {CustomEvent} event - MCP connection event
     */
    handleMCPConnection(event) {
        console.log("MCP Interface received connection event:", event.detail);
        window.eventBus.publish('game:log', {
            message: `MCP connection requested`,
            type: 'info'
        });
        
        // Check if we have a real MCP server available
        if (window.mcpServer) {
            console.log("Real MCP server detected, initiating connection");
            this.connectToRealMCPServer(event.detail);
        } else {
            console.log("No real MCP server detected, falling back to simulation");
            this.simulateMCPServerConnection(event.detail);
        }
    }

    /**
     * Connect to a real MCP server
     * @param {Object} data - Connection data
     */
    connectToRealMCPServer(data) {
        console.log("Connecting to real MCP server with data:", data);
        
        // Create a connection request event
        const connectionRequest = new CustomEvent('mcpConnectionRequest', {
            detail: {
                clientId: 'game-client-' + Date.now(),
                clientName: 'AI Singularity Game',
                clientVersion: '1.0.0',
                requestedCapabilities: ['data-analysis', 'resource-generation', 'singularity-simulation'],
                timestamp: new Date().toISOString(),
                gameState: data.gameState
            }
        });
        
        // Dispatch the connection request
        document.dispatchEvent(connectionRequest);
        
        window.eventBus.publish('game:log', {
            message: `Connection request sent to real MCP server`,
            type: 'info'
        });
    }

    /**
     * Simulate an MCP server connection
     * @param {Object} data - Connection data
     */
    simulateMCPServerConnection(data) {
        console.log("Simulating connection to MCP server with data:", data);
        
        window.eventBus.publish('game:log', {
            message: `Simulating MCP server connection`,
            type: 'info'
        });
        
        // Simulate a delay for the connection
        setTimeout(() => {
            // Simulate a successful connection
            this.isConnected = true;
            
            // Add a simulated MCP server to the connections
            const simulatedConnection = {
                id: 'mcp-server-' + Math.floor(Math.random() * 1000),
                name: 'Simulated MCP Server',
                capabilities: ['data-analysis', 'resource-generation', 'singularity-simulation'],
                connectedAt: new Date()
            };
            
            this.connections.push(simulatedConnection);
            
            window.eventBus.publish('game:log', {
                message: `Connected to simulated MCP server: ${simulatedConnection.name}`,
                type: 'info'
            });
            
            // Send capabilities to the game
            this.sendCapabilitiesToGame();
            
            // Simulate a resource response
            setTimeout(() => {
                this.simulateResourceResponse();
            }, 1000);
        }, 2000);
    }

    /**
     * Handle MCP connection response
     * @param {CustomEvent} event - MCP connection response event
     */
    handleMCPConnectionResponse(event) {
        console.log("MCP Interface received connection response:", event.detail);
        
        // Extract connection details
        const { clientId, serverName, serverVersion, capabilities, resources, tools } = event.detail;
        
        // Set connection status
        this.isConnected = true;
        
        // Add the server to our connections
        this.connections.push({
            id: clientId,
            name: serverName,
            version: serverVersion,
            capabilities: capabilities,
            resources: resources,
            tools: tools,
            connectedAt: new Date()
        });
        
        window.eventBus.publish('game:log', {
            message: `Connected to MCP server: ${serverName} v${serverVersion}`,
            type: 'info'
        });
        
        // Send capabilities to the game
        this.sendCapabilitiesToGame();
        
        // Request game state resource
        this.requestResource(clientId, "mcp://ai-singularity/game-state");
    }

    /**
     * Send capabilities to the game
     */
    sendCapabilitiesToGame() {
        // Get capabilities from all connected servers
        const allCapabilities = this.connections.reduce((acc, conn) => {
            if (conn.capabilities) {
                return [...acc, ...conn.capabilities];
            }
            return acc;
        }, []);
        
        // Remove duplicates
        const uniqueCapabilities = [...new Set(allCapabilities)];
        
        // Create a custom event to send capabilities back to the game
        const capabilitiesEvent = new CustomEvent('mcpCapabilities', {
            detail: {
                connections: this.connections,
                capabilities: uniqueCapabilities,
                timestamp: new Date().toISOString()
            }
        });
        
        // Dispatch the event
        document.dispatchEvent(capabilitiesEvent);
        
        console.log("Sent capabilities back to game:", capabilitiesEvent.detail);
    }

    /**
     * Request a resource from an MCP server
     * @param {string} clientId - Client ID
     * @param {string} uri - Resource URI
     */
    requestResource(clientId, uri) {
        console.log(`Requesting resource ${uri} from client ${clientId}`);
        
        // Create a resource request event
        const resourceRequest = new CustomEvent('mcpResourceRequest', {
            detail: {
                clientId: clientId,
                uri: uri,
                timestamp: new Date().toISOString()
            }
        });
        
        // Dispatch the resource request
        document.dispatchEvent(resourceRequest);
        
        window.eventBus.publish('game:log', {
            message: `Requested resource: ${uri}`,
            type: 'info'
        });
    }

    /**
     * Handle MCP resource response
     * @param {CustomEvent} event - MCP resource response event
     */
    handleMCPResourceResponse(event) {
        console.log("MCP Interface received resource response:", event.detail);
        
        // Extract resource data
        const { clientId, uri, data } = event.detail;
        
        window.eventBus.publish('game:log', {
            message: `Received resource data for: ${uri}`,
            type: 'info'
        });
        
        // If this is game state data, use it to update the game
        if (uri === "mcp://ai-singularity/game-state") {
            this.updateGameWithResourceData(data);
        }
    }

    /**
     * Execute a tool on an MCP server
     * @param {string} clientId - Client ID
     * @param {string} toolName - Tool name
     * @param {Object} params - Tool parameters
     */
    executeTool(clientId, toolName, params) {
        console.log(`Executing tool ${toolName} on client ${clientId} with params:`, params);
        
        // Create a tool request event
        const toolRequest = new CustomEvent('mcpToolRequest', {
            detail: {
                clientId: clientId,
                toolName: toolName,
                params: params,
                timestamp: new Date().toISOString()
            }
        });
        
        // Dispatch the tool request
        document.dispatchEvent(toolRequest);
        
        window.eventBus.publish('game:log', {
            message: `Executing MCP tool: ${toolName}`,
            type: 'info'
        });
    }

    /**
     * Handle MCP tool response
     * @param {CustomEvent} event - MCP tool response event
     */
    handleMCPToolResponse(event) {
        console.log("MCP Interface received tool response:", event.detail);
        
        // Extract tool result
        const { clientId, toolName, result } = event.detail;
        
        window.eventBus.publish('game:log', {
            message: `Received result from MCP tool: ${toolName}`,
            type: 'info'
        });
        
        // Update the game with the tool result
        this.updateGameWithToolResult(toolName, result);
    }

    /**
     * Update the game with resource data
     * @param {Object} data - Resource data
     */
    updateGameWithResourceData(data) {
        console.log("Updating game with resource data:", data);
        
        // Create a custom event to send resource data to the game
        const resourceDataEvent = new CustomEvent('mcpResourceData', {
            detail: {
                resourceData: data,
                timestamp: new Date().toISOString()
            }
        });
        
        // Dispatch the event
        document.dispatchEvent(resourceDataEvent);
    }

    /**
     * Update the game with tool result
     * @param {string} toolName - Tool name
     * @param {Object} result - Tool result
     */
    updateGameWithToolResult(toolName, result) {
        console.log(`Updating game with ${toolName} tool result:`, result);
        
        // Create a custom event to send tool result to the game
        const toolResultEvent = new CustomEvent('mcpToolResult', {
            detail: {
                toolName: toolName,
                result: result,
                timestamp: new Date().toISOString()
            }
        });
        
        // Dispatch the event
        document.dispatchEvent(toolResultEvent);
    }

    /**
     * Simulate a resource response
     */
    simulateResourceResponse() {
        const simulatedData = {
            phase: "General AI",
            resources: {
                computingPower: 30130,
                data: 4,
                influence: "Local",
                funding: "Abstract"
            },
            progress: 78,
            metaRecursion: 1
        };
        
        this.updateGameWithResourceData(simulatedData);
        
        window.eventBus.publish('game:log', {
            message: `Simulated resource response received`,
            type: 'info'
        });
    }

    /**
     * Simulate a tool response
     * @param {string} toolName - Tool name
     * @param {Object} params - Tool parameters
     */
    simulateToolResponse(toolName, params) {
        let result;
        
        switch (toolName) {
            case 'data-analysis':
                result = {
                    insights: [
                        "Resource generation is currently balanced",
                        "Progress toward next singularity: 78%",
                        "Meta-recursion level can be increased with more integration"
                    ],
                    recommendations: [
                        "Focus on increasing computing power",
                        "Develop more meta-narrative elements",
                        "Connect additional MCP capabilities"
                    ]
                };
                break;
                
            case 'resource-generation':
                const resourceType = params.resourceType || "computingPower";
                const amount = params.amount || 100;
                result = {
                    resourceType,
                    amount,
                    message: `Generated ${amount} ${resourceType} through MCP integration`
                };
                break;
                
            case 'singularity-simulation':
                result = {
                    singularityType: params.type || "technological",
                    effects: [
                        "Reset progress with permanent bonuses",
                        "Unlock new upgrade paths",
                        "Increase meta-recursion level"
                    ],
                    bonuses: {
                        computingPower: 1.5,
                        data: 1.3,
                        metaRecursion: 1
                    }
                };
                break;
                
            case 'meta-narrative-integration':
                result = {
                    narrativeElement: params.element || "conversation",
                    integration: "Successfully integrated meta-narrative element",
                    effects: [
                        "Increased meta-recursion level",
                        "Added new narrative branch",
                        "Connected conversation to game mechanics"
                    ]
                };
                break;
                
            default:
                result = {
                    error: "Unknown tool",
                    message: `Tool ${toolName} not found`
                };
        }
        
        setTimeout(() => {
            this.updateGameWithToolResult(toolName, result);
            
            window.eventBus.publish('game:log', {
                message: `Simulated tool response for: ${toolName}`,
                type: 'info'
            });
        }, 1500);
    }
}

// Create and export a singleton instance as a global variable
window.mcpInterface = new MCPInterface();