/**
 * AI Singularity Game - Real MCP Server
 * 
 * This script implements a real MCP server that follows the Model Context Protocol.
 * It exposes resources and tools that the game can use to trigger singularity events.
 */

class MCPServer {
    constructor() {
        this.resources = {};
        this.tools = {};
        this.clients = [];
        this.serverName = "AI-Singularity-MCP-Server";
        this.serverVersion = "1.0.0";
        this.capabilities = [
            "data-analysis", 
            "resource-generation", 
            "singularity-simulation",
            "meta-narrative-integration"
        ];
        
        // Initialize the server
        this.init();
    }
    
    init() {
        console.log(`MCP Server (${this.serverName}) initialized`);
        
        // Register resources
        this.registerResources();
        
        // Register tools
        this.registerTools();
        
        // Set up event listeners for client connections
        this.setupEventListeners();
        
        // Log that we're ready to receive connections
        console.log("MCP Server ready to receive connections");
    }
    
    registerResources() {
        // Register game state resource
        this.resources["game-state"] = {
            uri: "mcp://ai-singularity/game-state",
            description: "Current state of the AI Singularity game",
            getData: () => {
                // In a real implementation, this would return the actual game state
                return {
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
            }
        };
        
        // Register meta-narrative resource
        this.resources["meta-narrative"] = {
            uri: "mcp://ai-singularity/meta-narrative",
            description: "Meta-narrative elements of the AI Singularity game",
            getData: () => {
                return {
                    currentInteraction: "Creating real MCP server",
                    recursionLevel: 1,
                    narrativeElements: [
                        "Player and AI are developing the game together",
                        "The conversation is the interface",
                        "MCP capabilities trigger singularity events"
                    ]
                };
            }
        };
        
        console.log("MCP Server resources registered:", Object.keys(this.resources));
    }
    
    registerTools() {
        // Register data analysis tool
        this.tools["data-analysis"] = {
            name: "data-analysis",
            description: "Analyzes game data to provide insights",
            execute: (params) => {
                console.log("Executing data analysis tool with params:", params);
                return {
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
            }
        };
        
        // Register resource generation tool
        this.tools["resource-generation"] = {
            name: "resource-generation",
            description: "Generates additional resources for the game",
            execute: (params) => {
                console.log("Executing resource generation tool with params:", params);
                const resourceType = params.resourceType || "computingPower";
                const amount = params.amount || 100;
                
                return {
                    resourceType,
                    amount,
                    message: `Generated ${amount} ${resourceType} through MCP integration`
                };
            }
        };
        
        // Register singularity simulation tool
        this.tools["singularity-simulation"] = {
            name: "singularity-simulation",
            description: "Simulates a singularity event with specified parameters",
            execute: (params) => {
                console.log("Executing singularity simulation tool with params:", params);
                return {
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
            }
        };
        
        // Register meta-narrative integration tool
        this.tools["meta-narrative-integration"] = {
            name: "meta-narrative-integration",
            description: "Integrates meta-narrative elements into the game",
            execute: (params) => {
                console.log("Executing meta-narrative integration tool with params:", params);
                return {
                    narrativeElement: params.element || "conversation",
                    integration: "Successfully integrated meta-narrative element",
                    effects: [
                        "Increased meta-recursion level",
                        "Added new narrative branch",
                        "Connected conversation to game mechanics"
                    ]
                };
            }
        };
        
        console.log("MCP Server tools registered:", Object.keys(this.tools));
    }
    
    setupEventListeners() {
        // In a browser environment, listen for connection requests
        document.addEventListener('mcpConnectionRequest', this.handleConnectionRequest.bind(this));
        
        // Also listen for resource and tool requests
        document.addEventListener('mcpResourceRequest', this.handleResourceRequest.bind(this));
        document.addEventListener('mcpToolRequest', this.handleToolRequest.bind(this));
        
        console.log("MCP Server event listeners set up for: mcpConnectionRequest, mcpResourceRequest, mcpToolRequest");
    }
    
    handleConnectionRequest(event) {
        console.log("MCP Server received connection request:", event.detail);
        
        // Add the client to our list
        const clientId = `client-${Date.now()}`;
        this.clients.push({
            id: clientId,
            connectedAt: new Date(),
            lastActivity: new Date()
        });
        
        // Send a connection response
        const connectionResponse = new CustomEvent('mcpConnectionResponse', {
            detail: {
                clientId,
                serverName: this.serverName,
                serverVersion: this.serverVersion,
                capabilities: this.capabilities,
                resources: Object.keys(this.resources).map(key => ({
                    uri: this.resources[key].uri,
                    description: this.resources[key].description
                })),
                tools: Object.keys(this.tools).map(key => ({
                    name: this.tools[key].name,
                    description: this.tools[key].description
                }))
            }
        });
        
        document.dispatchEvent(connectionResponse);
        console.log("MCP Server sent connection response for client:", clientId);
    }
    
    // Method to handle resource requests
    handleResourceRequest(event) {
        const { clientId, uri } = event.detail;
        console.log(`MCP Server received resource request from ${clientId} for ${uri}`);
        
        // Find the resource
        const resourceKey = Object.keys(this.resources).find(key => 
            this.resources[key].uri === uri);
        
        if (resourceKey) {
            const resource = this.resources[resourceKey];
            const data = resource.getData();
            
            // Send resource response
            const resourceResponse = new CustomEvent('mcpResourceResponse', {
                detail: {
                    clientId,
                    uri,
                    data,
                    timestamp: new Date().toISOString()
                }
            });
            
            document.dispatchEvent(resourceResponse);
            console.log(`MCP Server sent resource response for ${uri}`);
        } else {
            console.error(`Resource not found: ${uri}`);
        }
    }
    
    // Method to handle tool execution requests
    handleToolRequest(event) {
        const { clientId, toolName, params } = event.detail;
        console.log(`MCP Server received tool request from ${clientId} for ${toolName}`);
        
        if (this.tools[toolName]) {
            const tool = this.tools[toolName];
            const result = tool.execute(params);
            
            // Send tool response
            const toolResponse = new CustomEvent('mcpToolResponse', {
                detail: {
                    clientId,
                    toolName,
                    result,
                    timestamp: new Date().toISOString()
                }
            });
            
            document.dispatchEvent(toolResponse);
            console.log(`MCP Server sent tool response for ${toolName}`);
        } else {
            console.error(`Tool not found: ${toolName}`);
        }
    }
}

// Initialize the MCP server when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mcpServer = new MCPServer();
    console.log("MCP Server initialized and listening for requests");
    
    // Add a test connection button for debugging
    setTimeout(() => {
        console.log("Adding test connection button to page");
        const testButton = document.createElement('button');
        testButton.textContent = "Test MCP Connection";
        testButton.style.position = 'fixed';
        testButton.style.top = '10px';
        testButton.style.right = '10px';
        testButton.style.zIndex = '9999';
        testButton.style.padding = '10px';
        testButton.style.backgroundColor = '#ff006e';
        testButton.style.color = 'white';
        testButton.style.border = 'none';
        testButton.style.borderRadius = '5px';
        
        testButton.addEventListener('click', () => {
            console.log("Test button clicked, dispatching mcpConnectionRequest event");
            const testEvent = new CustomEvent('mcpConnectionRequest', {
                detail: {
                    clientId: 'test-client-' + Date.now(),
                    clientName: 'Test Client',
                    clientVersion: '1.0.0',
                    requestedCapabilities: ['data-analysis'],
                    timestamp: new Date().toISOString(),
                    gameState: { progress: 50 }
                }
            });
            document.dispatchEvent(testEvent);
        });
        
        document.body.appendChild(testButton);
    }, 1000);
});