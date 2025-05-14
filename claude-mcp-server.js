/**
 * Claude MCP Server - Bridge between Claude Code and Browser
 * 
 * A simple Express server that can be controlled by Claude Code
 * and provides a websocket connection to the browser game.
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Store for game state and Claude commands
const state = {
  gameState: null,
  claudeCommands: [],
  metrics: {
    claudeTokenCount: 0,
    claudeCost: 0,
    fileCount: 0,
    commitCount: 0
  }
};

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Browser connected to Claude MCP Server');
  
  // Send initial state to client
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Claude MCP Server',
    claudeCommands: state.claudeCommands
  }));
  
  // Listen for messages from the browser
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message from browser:', data);
      
      if (data.type === 'gameState') {
        // Store game state
        state.gameState = data.data;
        
        // Notify all clients that the state has been updated
        broadcastState();
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // Send any pending Claude commands
  if (state.claudeCommands.length > 0) {
    ws.send(JSON.stringify({
      type: 'commands',
      commands: state.claudeCommands
    }));
  }
});

// Broadcast state to all connected clients
function broadcastState() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'stateUpdate',
        gameState: state.gameState,
        metrics: state.metrics
      }));
    }
  });
}

// API Endpoints for Claude Code to interact with

// Get current game state
app.get('/api/state', (req, res) => {
  res.json({
    gameState: state.gameState,
    metrics: state.metrics
  });
});

// Update metrics
app.post('/api/metrics', (req, res) => {
  const { metrics } = req.body;
  if (metrics) {
    state.metrics = { ...state.metrics, ...metrics };
    broadcastState();
    res.json({ success: true, metrics: state.metrics });
  } else {
    res.status(400).json({ error: 'Invalid metrics data' });
  }
});

// Send command to browser
app.post('/api/command', (req, res) => {
  const { command, params } = req.body;
  
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }
  
  const commandData = {
    id: Date.now(),
    command,
    params: params || {},
    timestamp: new Date().toISOString()
  };
  
  // Store command
  state.claudeCommands.push(commandData);
  
  // Broadcast command to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'command',
        commandData
      }));
    }
  });
  
  res.json({ success: true, commandData });
});

// Clear commands
app.post('/api/clear-commands', (req, res) => {
  state.claudeCommands = [];
  broadcastState();
  res.json({ success: true });
});

// Parse command-line arguments for port
let PORT = process.env.PORT || 3000;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' && i + 1 < args.length) {
    PORT = parseInt(args[i + 1], 10);
    console.log(`Setting port from command line argument: ${PORT}`);
    break;
  }
}

// Start the server
server.listen(PORT, () => {
  console.log(`Claude MCP Server running at http://localhost:${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}`);
});