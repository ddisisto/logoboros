/**
 * Server Runner for Logoboros
 * 
 * A utility that can start, stop, and monitor backend servers
 * for the Logoboros project. This allows Claude to have direct
 * access to server outputs and control server execution.
 * 
 * Uses only native Node.js modules (no dependencies).
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

class ServerRunner {
    constructor() {
        this.servers = {}; // Store server processes
        this.logs = {}; // Store server logs
        
        // Create HTTP server for accessing logs and controlling servers
        this.port = 4000;
        this.server = http.createServer(this.handleRequest.bind(this));
        
        // Start control server
        this.server.listen(this.port, () => {
            console.log(`Server Runner control panel available at http://localhost:${this.port}`);
        });
        
        // Initialize available servers info
        this.availableServers = {
            'metrics': {
                name: 'Claude Metrics Server',
                script: 'claude-metrics-simple-server.js',
                running: false,
                port: 3000
            },
            'mcp': {
                name: 'MCP Server',
                script: 'claude-mcp-server-simple.js',
                running: false,
                port: 3001
            }
        };
    }
    
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // Handle OPTIONS request (for CORS preflight)
        if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
        }
        
        // Handle API requests
        if (pathname.startsWith('/api/')) {
            return this.handleApiRequest(pathname, req, res, parsedUrl.query);
        }
        
        // Serve the dashboard HTML
        if (pathname === '/' || pathname === '') {
            // Check if we have a static dashboard file
            const dashboardPath = path.join(__dirname, 'server-dashboard', 'index.html');
            if (fs.existsSync(dashboardPath)) {
                res.setHeader('Content-Type', 'text/html');
                const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
                res.write(dashboardContent);
                res.end();
                return;
            } else {
                // Fall back to generated HTML
                res.setHeader('Content-Type', 'text/html');
                res.write(this.getDashboardHtml());
                res.end();
                return;
            }
        }
        
        // Not found
        res.statusCode = 404;
        res.end('Not found');
    }
    
    handleApiRequest(pathname, req, res, query) {
        // Get list of available servers
        if (pathname === '/api/servers' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(this.availableServers));
            return;
        }
        
        // Start a server
        if (pathname.match(/^\/api\/servers\/[^\/]+\/start$/) && req.method === 'POST') {
            const serverId = pathname.split('/')[3];
            
            if (this.servers[serverId]) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                    error: `Server '${serverId}' is already running` 
                }));
                return;
            }
            
            try {
                this.startServer(serverId);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                    success: true, 
                    message: `Server '${serverId}' started successfully`
                }));
            } catch (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: error.message }));
            }
            return;
        }
        
        // Stop a server
        if (pathname.match(/^\/api\/servers\/[^\/]+\/stop$/) && req.method === 'POST') {
            const serverId = pathname.split('/')[3];
            
            if (!this.servers[serverId]) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                    error: `Server '${serverId}' is not running` 
                }));
                return;
            }
            
            try {
                this.stopServer(serverId);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                    success: true, 
                    message: `Server '${serverId}' stopped successfully`
                }));
            } catch (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: error.message }));
            }
            return;
        }
        
        // Get server logs
        if (pathname.match(/^\/api\/servers\/[^\/]+\/logs$/) && req.method === 'GET') {
            const serverId = pathname.split('/')[3];
            
            if (!this.logs[serverId]) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                    error: `No logs found for server '${serverId}'` 
                }));
                return;
            }
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
                serverId,
                logs: this.logs[serverId]
            }));
            return;
        }
        
        // Clear server logs
        if (pathname.match(/^\/api\/servers\/[^\/]+\/logs\/clear$/) && req.method === 'POST') {
            const serverId = pathname.split('/')[3];
            
            this.logs[serverId] = [];
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
                success: true, 
                message: `Logs for server '${serverId}' cleared`
            }));
            return;
        }
        
        // Get status of all servers
        if (pathname === '/api/status' && req.method === 'GET') {
            const status = {};
            
            for (const [id, server] of Object.entries(this.servers)) {
                status[id] = {
                    running: !!server,
                    pid: server ? server.pid : null,
                    logCount: this.logs[id] ? this.logs[id].length : 0
                };
            }
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(status));
            return;
        }
        
        // Not found
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
    
    getDashboardHtml() {
        return `
            <html>
            <head>
                <title>Logoboros Server Runner</title>
                <style>
                    body { font-family: sans-serif; margin: 20px; }
                    h1 { color: #333; }
                    .server { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 4px; }
                    .controls { margin-top: 10px; }
                    button { padding: 5px 10px; margin-right: 10px; cursor: pointer; }
                    pre { background: #f1f1f1; padding: 10px; max-height: 300px; overflow: auto; }
                </style>
            </head>
            <body>
                <h1>Logoboros Server Runner</h1>
                <div id="servers">Loading servers...</div>
                
                <script>
                    // Simple client-side script to interact with the API
                    async function loadServers() {
                        const response = await fetch('/api/servers');
                        const servers = await response.json();
                        
                        const serversDiv = document.getElementById('servers');
                        serversDiv.innerHTML = '';
                        
                        for (const [id, info] of Object.entries(servers)) {
                            const serverDiv = document.createElement('div');
                            serverDiv.className = 'server';
                            serverDiv.innerHTML = \`
                                <h2>\${info.name} (\${id})</h2>
                                <p>Script: \${info.script}</p>
                                <p>Status: <span id="status-\${id}">\${info.running ? 'Running' : 'Stopped'}</span></p>
                                <p>Port: \${info.port}</p>
                                <div class="controls">
                                    <button onclick="startServer('\${id}')" \${info.running ? 'disabled' : ''}>Start</button>
                                    <button onclick="stopServer('\${id}')" \${!info.running ? 'disabled' : ''}>Stop</button>
                                    <button onclick="viewLogs('\${id}')">View Logs</button>
                                    <button onclick="clearLogs('\${id}')">Clear Logs</button>
                                </div>
                                <div id="logs-\${id}" style="display: none;">
                                    <h3>Logs:</h3>
                                    <pre id="log-content-\${id}"></pre>
                                </div>
                            \`;
                            serversDiv.appendChild(serverDiv);
                        }
                    }
                    
                    async function startServer(id) {
                        await fetch(\`/api/servers/\${id}/start\`, { method: 'POST' });
                        document.getElementById(\`status-\${id}\`).textContent = 'Running';
                        loadServers(); // Refresh UI
                    }
                    
                    async function stopServer(id) {
                        await fetch(\`/api/servers/\${id}/stop\`, { method: 'POST' });
                        document.getElementById(\`status-\${id}\`).textContent = 'Stopped';
                        loadServers(); // Refresh UI
                    }
                    
                    async function viewLogs(id) {
                        const logsDiv = document.getElementById(\`logs-\${id}\`);
                        const logContent = document.getElementById(\`log-content-\${id}\`);
                        
                        if (logsDiv.style.display === 'none') {
                            logsDiv.style.display = 'block';
                            await updateLogs(id);
                            // Start auto-refresh
                            window.logInterval = setInterval(() => updateLogs(id), 2000);
                        } else {
                            logsDiv.style.display = 'none';
                            clearInterval(window.logInterval);
                        }
                    }
                    
                    async function updateLogs(id) {
                        const response = await fetch(\`/api/servers/\${id}/logs\`);
                        const data = await response.json();
                        const logContent = document.getElementById(\`log-content-\${id}\`);
                        logContent.textContent = data.logs.join('\\n');
                        // Auto-scroll to bottom
                        logContent.scrollTop = logContent.scrollHeight;
                    }
                    
                    async function clearLogs(id) {
                        await fetch(\`/api/servers/\${id}/logs/clear\`, { method: 'POST' });
                        const logContent = document.getElementById(\`log-content-\${id}\`);
                        logContent.textContent = '';
                    }
                    
                    // Load servers on page load
                    loadServers();
                    
                    // Refresh status every 5 seconds
                    setInterval(loadServers, 5000);
                </script>
            </body>
            </html>
        `;
    }
    
    startServer(id) {
        if (this.servers[id]) {
            console.log(`Server '${id}' is already running`);
            return;
        }
        
        let scriptPath;
        let args = [];
        let port = 3000;
        
        switch (id) {
            case 'metrics':
                scriptPath = path.join(__dirname, 'claude-metrics-simple-server.js');
                break;
            case 'mcp':
                scriptPath = path.join(__dirname, 'claude-mcp-server-simple.js');
                port = 3001;
                args = ['--port', `${port}`]; // Pass different port to avoid conflict
                break;
            default:
                throw new Error(`Unknown server ID: ${id}`);
        }
        
        // Make sure script exists
        if (!fs.existsSync(scriptPath)) {
            throw new Error(`Script not found: ${scriptPath}`);
        }
        
        // Initialize logs array if it doesn't exist
        if (!this.logs[id]) {
            this.logs[id] = [];
        }
        
        // Spawn server process
        console.log(`Starting server ${id} with script: ${scriptPath}`);
        const serverProcess = spawn('node', [scriptPath, ...args], {
            cwd: __dirname,
            env: { ...process.env, PORT: port }
        });
        
        this.servers[id] = serverProcess;
        this.availableServers[id].running = true;
        
        // Log timestamp when server starts
        this.logs[id].push(`[${new Date().toISOString()}] Server started`);
        
        // Capture stdout
        serverProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            console.log(`[${id}] ${output}`);
            this.logs[id].push(`[${new Date().toISOString()}] ${output}`);
            
            // Limit log size
            if (this.logs[id].length > 1000) {
                this.logs[id] = this.logs[id].slice(-1000);
            }
        });
        
        // Capture stderr
        serverProcess.stderr.on('data', (data) => {
            const output = data.toString().trim();
            console.error(`[${id}] ERROR: ${output}`);
            this.logs[id].push(`[${new Date().toISOString()}] ERROR: ${output}`);
        });
        
        // Handle exit
        serverProcess.on('exit', (code, signal) => {
            console.log(`Server ${id} exited with code ${code} and signal ${signal}`);
            this.logs[id].push(`[${new Date().toISOString()}] Server exited with code ${code}`);
            
            // Remove from active servers
            delete this.servers[id];
            this.availableServers[id].running = false;
        });
        
        console.log(`Server ${id} started with PID ${serverProcess.pid}`);
        
        return serverProcess;
    }
    
    stopServer(id) {
        const serverProcess = this.servers[id];
        
        if (!serverProcess) {
            console.log(`Server ${id} is not running`);
            return;
        }
        
        // Log that server is stopping
        this.logs[id].push(`[${new Date().toISOString()}] Server stopping...`);
        
        // Kill the process
        serverProcess.kill('SIGTERM');
        
        console.log(`Server ${id} stopped`);
    }
    
    stopAll() {
        console.log('Stopping all servers...');
        
        for (const [id, serverProcess] of Object.entries(this.servers)) {
            this.stopServer(id);
        }
    }
}

// Create the server runner instance
const runner = new ServerRunner();

// Handle process exit
process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down all servers...');
    runner.stopAll();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down all servers...');
    runner.stopAll();
    process.exit(0);
});

// Export the runner for programmatic use
module.exports = runner;