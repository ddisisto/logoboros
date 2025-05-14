# Server Runner for Logoboros

This is a simple server control panel for the Logoboros project. It allows you to start, stop, and monitor the backend servers used by the game.

## Features

- No external dependencies - uses only native Node.js modules
- Web-based control panel interface
- Start/stop servers individually
- View real-time server logs
- Clear logs as needed
- Automatic tracking of server status

## Available Servers

1. **Claude Metrics Server**
   - Provides mock Claude metrics data
   - Endpoint: http://localhost:3000/claude-metrics
   - Returns mock metrics that simulate Claude Code usage

2. **MCP Server (Simple)**
   - Implements a simplified Model Context Protocol
   - Endpoint: http://localhost:3001
   - Provides capabilities like data analysis, resource generation, etc.

## How to Use

1. **Start the Server Runner:**
   ```bash
   ./run-servers.sh
   ```
   or
   ```bash
   node server-runner.js
   ```

2. **Access the Control Panel:**
   Open your browser to http://localhost:4000

3. **Start/Stop Servers:**
   - Click the "Start" button for the server you want to run
   - The status will update to "Running" when active
   - Click "Stop" to shut down a server

4. **View Logs:**
   - Click "View Logs" to see the real-time output from a server
   - Logs are automatically updated every 2 seconds
   - Click "Clear Logs" to reset the log display

## Technical Details

- The servers run on different ports to avoid conflicts:
  - Server Runner: Port 4000
  - Claude Metrics Server: Port 3000
  - MCP Server: Port 3001

- The Server Runner can be accessed programmatically from the game through the Server Bridge (js/core/server-bridge.js)

- All servers use only native Node.js modules to avoid dependency issues:
  - http
  - url
  - path
  - fs
  - child_process

## Server Endpoints

### Claude Metrics Server
- GET http://localhost:3000/claude-metrics
  - Returns a JSON object with mock Claude metrics

### MCP Server (Simple)
- GET http://localhost:3001/
  - Shows a basic status page with available endpoints
- GET http://localhost:3001/api/state
  - Returns the current game state
- POST http://localhost:3001/api/metrics
  - Updates metrics
- POST http://localhost:3001/api/command
  - Sends a command to the game
- POST http://localhost:3001/api/connect
  - Simulates an MCP connection request
- GET http://localhost:3001/api/resource?uri=<uri>
  - Returns resource data for the specified URI
- POST http://localhost:3001/api/tool
  - Executes a tool with the given parameters

## Troubleshooting

If you encounter any issues:

1. **Port Conflicts**
   - If you get an "EADDRINUSE" error, another process is using the port
   - Change the port in the server files or stop the conflicting process

2. **Server Not Starting**
   - Check the logs in the control panel for error messages
   - Verify that Node.js is properly installed

3. **Logs Not Updating**
   - If logs seem frozen, try clicking "View Logs" again to refresh the connection
   - Check if the server is still running