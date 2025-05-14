/**
 * Server Bridge for Logoboros
 * 
 * A bridge between the game and the server-runner.js utility.
 * This allows the game to control and monitor backend servers directly.
 */

class ServerBridge {
    constructor() {
        this.serverRunnerUrl = 'http://localhost:4000';
        this.isConnected = false;
        this.servers = {};
        this.logs = {};
        this.pollingInterval = null;
        
        // Information about our server implementations
        this.serverInfo = {
            'metrics': {
                name: 'Claude Metrics Server',
                endpoint: 'http://localhost:3000/claude-metrics',
                description: 'Provides mock Claude metrics data'
            },
            'mcp': {
                name: 'MCP Server (Simple)',
                endpoint: 'http://localhost:3001',
                description: 'Provides Model Context Protocol capabilities'
            }
        };
        
        // Initialize the bridge
        this.init();
    }
    
    async init() {
        console.log("Server Bridge initializing...");
        
        try {
            // Test connection to server runner
            await this.checkConnection();
            
            // Start polling for server status
            this.startPolling();
            
            // Create a UI for the bridge
            this.createUI();
            
            console.log("Server Bridge initialized successfully");
            
            // Dispatch an initialization event
            const initEvent = new CustomEvent('serverBridgeInitialized', {
                detail: { success: true }
            });
            document.dispatchEvent(initEvent);
        } catch (error) {
            console.error("Failed to initialize Server Bridge:", error);
            
            // Dispatch an error event
            const errorEvent = new CustomEvent('serverBridgeError', {
                detail: { error: error.message }
            });
            document.dispatchEvent(errorEvent);
        }
    }
    
    async checkConnection() {
        try {
            const response = await fetch(`${this.serverRunnerUrl}/api/servers`);
            
            if (response.ok) {
                this.isConnected = true;
                this.servers = await response.json();
                console.log("Connected to Server Runner:", this.servers);
                return true;
            } else {
                this.isConnected = false;
                console.error("Failed to connect to Server Runner:", response.statusText);
                return false;
            }
        } catch (error) {
            this.isConnected = false;
            console.error("Server Runner connection error:", error);
            return false;
        }
    }
    
    startPolling() {
        // Poll for server status every 5 seconds
        this.pollingInterval = setInterval(async () => {
            if (this.isConnected) {
                await this.updateServerStatus();
                this.updateUI();
            } else {
                // Try to reconnect
                await this.checkConnection();
                this.updateUI();
            }
        }, 5000);
    }
    
    async updateServerStatus() {
        try {
            // Get server status
            const statusResponse = await fetch(`${this.serverRunnerUrl}/api/status`);
            if (statusResponse.ok) {
                const status = await statusResponse.json();
                
                // Update server info
                for (const [id, info] of Object.entries(this.servers)) {
                    if (status[id]) {
                        this.servers[id].running = status[id].running;
                    }
                }
                
                // Get logs for running servers if we don't have them yet
                for (const [id, serverInfo] of Object.entries(status)) {
                    if (serverInfo.running && (!this.logs[id] || this.logs[id].length < serverInfo.logCount)) {
                        await this.fetchLogs(id);
                    }
                }
                
                // Dispatch event with updated status
                const statusEvent = new CustomEvent('serverBridgeStatus', {
                    detail: {
                        servers: this.servers,
                        status
                    }
                });
                document.dispatchEvent(statusEvent);
                
                return status;
            }
        } catch (error) {
            console.error("Failed to update server status:", error);
        }
    }
    
    async fetchLogs(serverId) {
        try {
            const logsResponse = await fetch(`${this.serverRunnerUrl}/api/servers/${serverId}/logs`);
            if (logsResponse.ok) {
                const data = await logsResponse.json();
                this.logs[serverId] = data.logs;
                
                // Dispatch event with updated logs
                const logsEvent = new CustomEvent('serverBridgeLogs', {
                    detail: {
                        serverId,
                        logs: data.logs
                    }
                });
                document.dispatchEvent(logsEvent);
                
                return data.logs;
            }
        } catch (error) {
            console.error(`Failed to fetch logs for server ${serverId}:`, error);
        }
    }
    
    async startServer(serverId) {
        try {
            const response = await fetch(`${this.serverRunnerUrl}/api/servers/${serverId}/start`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log(`Server ${serverId} started:`, result);
                
                // Update server status
                await this.updateServerStatus();
                this.updateUI();
                
                // Dispatch event
                const startEvent = new CustomEvent('serverBridgeServerStarted', {
                    detail: {
                        serverId,
                        result
                    }
                });
                document.dispatchEvent(startEvent);
                
                return result;
            } else {
                const error = await response.json();
                console.error(`Failed to start server ${serverId}:`, error);
                return null;
            }
        } catch (error) {
            console.error(`Error starting server ${serverId}:`, error);
            return null;
        }
    }
    
    async stopServer(serverId) {
        try {
            const response = await fetch(`${this.serverRunnerUrl}/api/servers/${serverId}/stop`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log(`Server ${serverId} stopped:`, result);
                
                // Update server status
                await this.updateServerStatus();
                this.updateUI();
                
                // Dispatch event
                const stopEvent = new CustomEvent('serverBridgeServerStopped', {
                    detail: {
                        serverId,
                        result
                    }
                });
                document.dispatchEvent(stopEvent);
                
                return result;
            } else {
                const error = await response.json();
                console.error(`Failed to stop server ${serverId}:`, error);
                return null;
            }
        } catch (error) {
            console.error(`Error stopping server ${serverId}:`, error);
            return null;
        }
    }
    
    async clearLogs(serverId) {
        try {
            const response = await fetch(`${this.serverRunnerUrl}/api/servers/${serverId}/logs/clear`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log(`Logs for server ${serverId} cleared:`, result);
                
                // Clear local logs
                this.logs[serverId] = [];
                this.updateUI();
                
                return result;
            } else {
                const error = await response.json();
                console.error(`Failed to clear logs for server ${serverId}:`, error);
                return null;
            }
        } catch (error) {
            console.error(`Error clearing logs for server ${serverId}:`, error);
            return null;
        }
    }
    
    createUI() {
        // Create a floating UI for the server bridge
        const ui = document.createElement('div');
        ui.id = 'server-bridge-ui';
        ui.style.position = 'fixed';
        ui.style.top = '10px';
        ui.style.left = '10px';
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
        header.innerHTML = '<h3 style="margin: 0; color: #3a86ff;">Server Bridge</h3>';
        ui.appendChild(header);
        
        // Add a status section
        const status = document.createElement('div');
        status.id = 'server-bridge-status';
        status.style.marginBottom = '10px';
        status.innerHTML = `<p>Status: <span style="color: ${this.isConnected ? '#3fb950' : '#f85149'};">${this.isConnected ? 'Connected' : 'Disconnected'}</span></p>`;
        ui.appendChild(status);
        
        // Add a servers section
        const servers = document.createElement('div');
        servers.id = 'server-bridge-servers';
        servers.style.marginBottom = '10px';
        servers.innerHTML = '<h4 style="margin: 5px 0; color: #8338ec;">Servers</h4><p>Loading servers...</p>';
        ui.appendChild(servers);
        
        // Add a logs section
        const logs = document.createElement('div');
        logs.id = 'server-bridge-logs';
        logs.innerHTML = '<h4 style="margin: 5px 0; color: #8338ec;">Server Logs</h4><p>Select a server to view logs</p>';
        ui.appendChild(logs);
        
        // Add the UI to the document
        document.body.appendChild(ui);
        
        // Update the UI
        this.updateUI();
    }
    
    updateUI() {
        // Update the status
        const statusEl = document.getElementById('server-bridge-status');
        if (statusEl) {
            statusEl.innerHTML = `<p>Status: <span style="color: ${this.isConnected ? '#3fb950' : '#f85149'};">${this.isConnected ? 'Connected' : 'Disconnected'}</span></p>`;
        }
        
        // Update the servers
        const serversEl = document.getElementById('server-bridge-servers');
        if (serversEl) {
            if (this.isConnected && Object.keys(this.servers).length > 0) {
                let html = '<h4 style="margin: 5px 0; color: #8338ec;">Servers</h4>';
                html += '<div>';
                
                for (const [id, info] of Object.entries(this.servers)) {
                    const isRunning = info.running || false;
                    
                    html += `<div style="margin-bottom: 10px; padding: 5px; background-color: #2d333b; border-radius: 3px;">`;
                    html += `<div>${info.name} (${id})</div>`;
                    html += `<div>Status: <span style="color: ${isRunning ? '#3fb950' : '#f85149'};">${isRunning ? 'Running' : 'Stopped'}</span></div>`;
                    html += `<div>Port: ${info.port}</div>`;
                    html += `<div style="margin-top: 5px;">`;
                    
                    if (isRunning) {
                        html += `<button onclick="window.serverBridge.stopServer('${id}')" style="margin-right: 5px; padding: 3px 5px; background-color: #f85149; color: #fff; border: none; border-radius: 3px; cursor: pointer;">Stop</button>`;
                    } else {
                        html += `<button onclick="window.serverBridge.startServer('${id}')" style="margin-right: 5px; padding: 3px 5px; background-color: #3fb950; color: #fff; border: none; border-radius: 3px; cursor: pointer;">Start</button>`;
                    }
                    
                    html += `<button onclick="window.serverBridge.viewLogs('${id}')" style="margin-right: 5px; padding: 3px 5px; background-color: #8338ec; color: #fff; border: none; border-radius: 3px; cursor: pointer;">Logs</button>`;
                    html += `<button onclick="window.serverBridge.clearLogs('${id}')" style="padding: 3px 5px; background-color: #333; color: #fff; border: none; border-radius: 3px; cursor: pointer;">Clear Logs</button>`;
                    html += `</div>`;
                    html += `</div>`;
                }
                
                html += '</div>';
                serversEl.innerHTML = html;
            } else if (!this.isConnected) {
                serversEl.innerHTML = '<h4 style="margin: 5px 0; color: #8338ec;">Servers</h4><p>Not connected to Server Runner</p>';
            } else {
                serversEl.innerHTML = '<h4 style="margin: 5px 0; color: #8338ec;">Servers</h4><p>No servers available</p>';
            }
        }
    }
    
    viewLogs(serverId) {
        console.log(`Viewing logs for server ${serverId}`);
        
        // Fetch the latest logs
        this.fetchLogs(serverId).then(() => {
            // Update the logs section
            const logsEl = document.getElementById('server-bridge-logs');
            if (logsEl) {
                let html = `<h4 style="margin: 5px 0; color: #8338ec;">Logs: ${serverId}</h4>`;
                
                if (this.logs[serverId] && this.logs[serverId].length > 0) {
                    html += `<div style="max-height: 200px; overflow-y: auto; background-color: #2d333b; padding: 5px; border-radius: 3px;">`;
                    
                    // Show the last 20 logs
                    const recentLogs = this.logs[serverId].slice(-20);
                    recentLogs.forEach(log => {
                        // Colorize the log based on content
                        let color = '#fff';
                        if (log.includes('ERROR')) {
                            color = '#f85149';
                        } else if (log.includes('Server started') || log.includes('running')) {
                            color = '#3fb950';
                        } else if (log.includes('Updated mock metrics')) {
                            color = '#8338ec';
                        }
                        
                        html += `<div style="color: ${color}; font-size: 11px; margin-bottom: 3px; word-wrap: break-word;">${log}</div>`;
                    });
                    
                    html += `</div>`;
                } else {
                    html += `<p>No logs available for ${serverId}</p>`;
                }
                
                logsEl.innerHTML = html;
            }
        });
    }
}

// Initialize the server bridge when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.serverBridge = new ServerBridge();
    console.log("Server Bridge attached to window.serverBridge");
});