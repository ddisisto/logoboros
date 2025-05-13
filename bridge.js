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
        
        // Initialize the bridge
        this.init();
    }
    
    init() {
        console.log("MCP Bridge initialized and listening for events");
        
        // Listen for MCP connection events from the game
        document.addEventListener('mcpConnection', this.handleMCPConnection.bind(this));
        
        // Create a UI for the bridge
        this.createUI();
    }
    
    handleMCPConnection(event) {
        console.log("MCP Bridge received connection event:", event.detail);
        
        // Log the event
        this.eventLog.push({
            type: 'connection',
            timestamp: new Date(),
            data: event.detail
        });
        
        // Update the UI
        this.updateUI();
        
        // Simulate connecting to a real MCP server
        this.simulateMCPServerConnection(event.detail);
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
        // Create a custom event to send capabilities back to the game
        const capabilitiesEvent = new CustomEvent('mcpCapabilities', {
            detail: {
                connections: this.connections,
                capabilities: ['data-access', 'tool-execution', 'prompt-templates'],
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
                    if (event.type === 'connection') {
                        html += `<div>Game state progress: ${event.data.gameState.progress}</div>`;
                    } else if (event.type === 'server-connection') {
                        html += `<div>Connected to: ${event.server.name}</div>`;
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
});