# UI/UX Improvements and Backend Integration

This branch (`ui-ux-improvements-integrated`) focuses on enhancing the UI/UX of the Logoboros project while also enabling direct access to backend servers.

## Server Runner

A new server runner has been added that allows Claude to directly run and monitor backend servers:

- `server-runner.js`: A Node.js script that can start, stop, and monitor backend servers (uses only native Node.js modules)
- `js/core/server-bridge.js`: A bridge between the game and the server runner
- `claude-metrics-simple-server.js`: A simple metrics server using only native Node.js modules
- `claude-mcp-server-simple.js`: A simplified MCP server using only native Node.js modules

### How to Use the Server Runner

1. Start the server runner:
   ```bash
   node server-runner.js
   ```

2. Access the control panel:
   - Open http://localhost:4000 in your browser
   - Start/stop servers using the UI
   - View server logs directly in the browser

3. Use the server bridge in the game:
   - The server bridge connects to the server runner
   - It provides a UI for starting/stopping servers and viewing logs
   - It dispatches events that can be used by other game components

### Available Servers

1. **Claude Metrics Server** (ID: `metrics`)
   - Runs on port 3000
   - Provides mock Claude metrics data
   - Endpoint: http://localhost:3000/claude-metrics

2. **MCP Server** (ID: `mcp`)
   - Runs on port 3001
   - Provides Model Context Protocol capabilities
   - WebSocket server available at ws://localhost:3001

## Benefits of the Server Runner

1. **Direct Access to Servers**
   - Claude can now start and stop backend servers
   - Server logs are accessible directly from the game
   - Status indicators show if servers are running or not

2. **Improved Debugging**
   - View real-time logs from servers
   - Detect connection issues immediately
   - Monitor metrics updates as they happen

3. **Better Integration**
   - Game can dynamically react to server status
   - Resources can be generated based on real metrics
   - Capabilities can be unlocked based on server availability

## UI/UX Improvements

The server runner introduces several UI/UX improvements:

1. **Server Status UI**
   - Shows if servers are running or stopped
   - Provides buttons to start/stop servers
   - Displays real-time server logs

2. **Server Bridge UI**
   - Floats on top of the game UI
   - Shows connection status to server runner
   - Provides access to server logs and controls

3. **Responsive Controls**
   - Start/stop buttons change based on server status
   - Log viewer updates automatically with new logs
   - Clear logs functionality for better visibility

## Integration with Meta-Game

The server runner integrates with the meta-game concept:

1. **Real-World Connections**
   - Backend servers represent real AI capabilities
   - Starting a server is like unlocking a capability
   - Server logs provide "data" for the meta-game

2. **Resource Generation**
   - Claude metrics from the server can generate game resources
   - Server status affects resource rates
   - Connections to servers unlock new upgrade paths

## Next Steps

1. Enhance the UI with more visual elements
2. Improve integration with meta-dashboard
3. Add more server types for different capabilities
4. Create dynamic resource generation based on server metrics
5. Implement meta-recursion based on server integration