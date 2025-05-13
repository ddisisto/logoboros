/**
 * AI Singularity Game - MCP Bridge
 * 
 * This script acts as a bridge between the game and potential MCP capabilities.
 * It listens for custom events from the game and could connect to real MCP servers.
 */

class MCPBridge {
    constructor() {
        this.connections = [];
        this.eventLog = [];
        this.isConnected = false;
        this.activeRequests = new Map();
        
        // Initialize the bridge
        this.init();
    }
    
    init() {
        console.log("MCP Bridge initialized and listening for events");
        
        // Listen for MCP connection events from the game
        document.addEventListener('mcpConnection', this.handleMCPConnection.bind(this));
        
        // Listen for MCP server responses
        document.addEventListener('mcpConnectionResponse', this.handleMCPConnectionResponse.bind(this));
        document.addEventListener('mcpResourceResponse', this.handleMCPResourceResponse.bind(this));
        document.addEventListener('mcpToolResponse', this.handleMCPToolResponse.bind(this));
        
        console.log("MCP Bridge event listeners set up for: mcpConnection, mcpConnectionResponse, mcpResourceResponse, mcpToolResponse");
        
        // Create a UI for the bridge
        this.createUI();
    }
    
    handleMCPConnection(event) {
        console.log("MCP Bridge received connection event:", event.detail);
        
        // Log the event
        this.eventLog.push({
            type: 'connection-request',
            timestamp: new Date(),
            data: event.detail
        });
        
        // Update the UI
        this.updateUI();
        
        // Check if we have a real MCP server available
        if (window.mcpServer) {
            console.log("Real MCP server detected, initiating connection");
            this.connectToRealMCPServer(event.detail);
        } else {
            console.log("No real MCP server detected, falling back to simulation");
            this.simulateMCPServerConnection(event.detail);
        }
        
        // Debug: Check if mcpConnectionRequest event is being dispatched correctly
        console.log("DEBUG: Adding test event listener for mcpConnectionRequest");
        const testListener = (e) => {
            console.log("DEBUG: mcpConnectionRequest event received by test listener:", e.detail);
        };
        document.addEventListener('mcpConnectionRequest', testListener);
    }
    
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
        console.log("DEBUG: About to dispatch mcpConnectionRequest event with detail:", connectionRequest.detail);
        document.dispatchEvent(connectionRequest);
        console.log("DEBUG: Dispatched mcpConnectionRequest event");
        
        // Add a timeout to check if we get a response
        setTimeout(() => {
            if (!this.isConnected) {
                console.log("DEBUG: No connection response received after 2 seconds");
            }
        }, 2000);
    }
    
    handleMCPConnectionResponse(event) {
        console.log("MCP Bridge received connection response:", event.detail);
        console.log("DEBUG: Connection response received successfully!");
        
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
        
        // Log the connection
        this.eventLog.push({
            type: 'server-connection',
            timestamp: new Date(),
            server: this.connections[this.connections.length - 1]
        });
        
        // Update the UI
        this.updateUI();
        
        // Send capabilities to the game
        this.sendCapabilitiesToGame();
        
        // Request game state resource
        this.requestResource(clientId, "mcp://ai-singularity/game-state");
    }
    
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
    }
    
    handleMCPResourceResponse(event) {
        console.log("MCP Bridge received resource response:", event.detail);
        
        // Extract resource data
        const { clientId, uri, data } = event.detail;
        
        // Log the resource response
        this.eventLog.push({
            type: 'resource-response',
            timestamp: new Date(),
            uri: uri,
            data: data
        });
        
        // Update the UI
        this.updateUI();
        
        // If this is game state data, use it to update the game
        if (uri === "mcp://ai-singularity/game-state") {
            this.updateGameWithResourceData(data);
        }
    }
    
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
    }
    
    handleMCPToolResponse(event) {
        console.log("MCP Bridge received tool response:", event.detail);
        
        // Extract tool result
        const { clientId, toolName, result } = event.detail;
        
        // Log the tool response
        this.eventLog.push({
            type: 'tool-response',
            timestamp: new Date(),
            toolName: toolName,
            result: result
        });
        
        // Update the UI
        this.updateUI();
        
        // Update the game with the tool result
        this.updateGameWithToolResult(toolName, result);
    }
    
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
    
    simulateMCPServerConnection(data) {
        console.log("Simulating connection to MCP server with data:", data);
        
        // Simulate a delay for the connection
        setTimeout(() => {
            // Simulate a successful connection
            this.isConnected = true;
            
            // Add a simulated MCP server to the connections
            this.connections.push({
                id: 'mcp-server-' + Math.floor(Math.random() * 1000),
                name: 'Simulated MCP Server',
                capabilities: ['data-access', 'tool-execution', 'prompt-templates'],
                connectedAt: new Date()
            });
            
            // Log the connection
            this.eventLog.push({
                type: 'server-connection',
                timestamp: new Date(),
                server: this.connections[this.connections.length - 1]
            });
            
            // Update the UI
            this.updateUI();
            
            // Dispatch an event back to the game
            this.sendCapabilitiesToGame();
        }, 2000);
    }
    
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
    
    createUI() {
        // Create a floating UI for the bridge
        const ui = document.createElement('div');
        ui.id = 'mcp-bridge-ui';
        ui.style.position = 'fixed';
        ui.style.bottom = '10px';
        ui.style.right = '10px';
        ui.style.width = '300px';
        ui.style.maxHeight = '400px';
        ui.style.backgroundColor = '#1e1e1e';
        ui.style.color = '#fff';
        ui.style.padding = '10px';
        ui.style.borderRadius = '5px';
        ui.style.fontFamily = 'monospace';
        ui.style.fontSize = '12px';
        ui.style.zIndex = '1000';
        ui.style.overflow = 'auto';
        ui.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        
        // Add a header
        const header = document.createElement('div');
        header.style.borderBottom = '1px solid #333';
        header.style.paddingBottom = '5px';
        header.style.marginBottom = '5px';
        header.innerHTML = '<h3 style="margin: 0; color: #3a86ff;">MCP Bridge</h3>';
        ui.appendChild(header);
        
        // Add a status section
        const status = document.createElement('div');
        status.id = 'mcp-bridge-status';
        status.style.marginBottom = '10px';
        status.innerHTML = '<p>Status: <span style="color: #f85149;">Disconnected</span></p>';
        ui.appendChild(status);
        
        // Add a connections section
        const connections = document.createElement('div');
        connections.id = 'mcp-bridge-connections';
        connections.style.marginBottom = '10px';
        connections.innerHTML = '<h4 style="margin: 5px 0; color: #8338ec;">Connections</h4><p>No active connections</p>';
        ui.appendChild(connections);
        
        // Add an event log section
        const eventLog = document.createElement('div');
        eventLog.id = 'mcp-bridge-event-log';
        eventLog.innerHTML = '<h4 style="margin: 5px 0; color: #8338ec;">Event Log</h4><div id="mcp-bridge-events"></div>';
        ui.appendChild(eventLog);
        
        // Add the UI to the document
        document.body.appendChild(ui);
    }
    
    updateUI() {
        // Update the status
        const statusEl = document.getElementById('mcp-bridge-status');
        if (statusEl) {
            statusEl.innerHTML = `<p>Status: <span style="color: ${this.isConnected ? '#3fb950' : '#f85149'};">${this.isConnected ? 'Connected' : 'Disconnected'}</span></p>`;
        }
        
        // Update the connections
        const connectionsEl = document.getElementById('mcp-bridge-connections');
        if (connectionsEl) {
            if (this.connections.length > 0) {
                let html = '<h4 style="margin: 5px 0; color: #8338ec;">Connections</h4>';
                html += '<ul style="margin: 5px 0; padding-left: 20px;">';
                this.connections.forEach(conn => {
                    html += `<li>${conn.name} (${conn.id})<br><small>Connected: ${conn.connectedAt.toLocaleTimeString()}</small></li>`;
                });
                html += '</ul>';
                connectionsEl.innerHTML = html;
            } else {
                connectionsEl.innerHTML = '<h4 style="margin: 5px 0; color: #8338ec;">Connections</h4><p>No active connections</p>';
            }
        }
        
        // Update the event log
        const eventsEl = document.getElementById('mcp-bridge-events');
        if (eventsEl) {
            if (this.eventLog.length > 0) {
                let html = '';
                // Show the last 5 events
                const recentEvents = this.eventLog.slice(-5).reverse();
                recentEvents.forEach(event => {
                    html += `<div style="margin-bottom: 5px; padding: 5px; background-color: #2d333b; border-radius: 3px;">`;
                    html += `<div style="color: #8338ec; font-size: 10px;">${event.timestamp.toLocaleTimeString()} - ${event.type}</div>`;
                    
                    // Display different content based on event type
                    if (event.type === 'connection-request' || event.type === 'connection') {
                        html += `<div>Game state progress: ${event.data.gameState.progress}</div>`;
                    } else if (event.type === 'server-connection') {
                        html += `<div>Connected to: ${event.server.name}</div>`;
                        if (event.server.capabilities) {
                            html += `<div>Capabilities: ${event.server.capabilities.join(', ')}</div>`;
                        }
                    } else if (event.type === 'resource-response') {
                        html += `<div>Resource: ${event.uri}</div>`;
                        html += `<div>Data: ${JSON.stringify(event.data).substring(0, 50)}...</div>`;
                    } else if (event.type === 'tool-response') {
                        html += `<div>Tool: ${event.toolName}</div>`;
                        html += `<div>Result: ${JSON.stringify(event.result).substring(0, 50)}...</div>`;
                    }
                    
                    html += `</div>`;
                });
                eventsEl.innerHTML = html;
            } else {
                eventsEl.innerHTML = '<p>No events logged</p>';
            }
        }
    }
}

// Initialize the bridge when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mcpBridge = new MCPBridge();
    
    // Add buttons to test MCP tools
    const ui = document.getElementById('mcp-bridge-ui');
    if (ui && window.mcpServer) {
        const toolsSection = document.createElement('div');
        toolsSection.innerHTML = '<h4 style="margin: 5px 0; color: #8338ec;">MCP Tools</h4>';
        
        // Add buttons for each tool
        const tools = ['data-analysis', 'resource-generation', 'singularity-simulation', 'meta-narrative-integration'];
        tools.forEach(tool => {
            const button = document.createElement('button');
            button.textContent = `Execute ${tool}`;
            button.style.margin = '5px';
            button.style.padding = '5px';
            button.style.backgroundColor = '#3a86ff';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.cursor = 'pointer';
            
            button.addEventListener('click', () => {
                if (window.mcpBridge.connections.length > 0) {
                    const clientId = window.mcpBridge.connections[0].id;
                    window.mcpBridge.executeTool(clientId, tool, {
                        resourceType: 'computingPower',
                        amount: 100,
                        type: 'technological',
                        element: 'conversation'
                    });
                } else {
                    console.error('No active MCP connections');
                }
            });
            
            toolsSection.appendChild(button);
        });
        
        ui.appendChild(toolsSection);
    }
});