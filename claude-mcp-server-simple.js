/**
 * Claude MCP Server (Simple Version) - Bridge between Claude Code and Browser
 * 
 * A simple HTTP server that simulates MCP capabilities without requiring
 * any external dependencies. Uses only native Node.js modules.
 */

const http = require('http');
const url = require('url');

// Store for game state and Claude commands
const state = {
  gameState: null,
  claudeCommands: [],
  metrics: {
    claudeTokenCount: 0,
    claudeCost: 0,
    fileCount: 0,
    commitCount: 0
  },
  connections: []
};

// Create HTTP server
const server = http.createServer((req, res) => {
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

  // API Endpoints
  if (pathname === '/api/state' && req.method === 'GET') {
    // Get current game state
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      gameState: state.gameState,
      metrics: state.metrics
    }));
    return;
  }

  if (pathname === '/api/metrics' && req.method === 'POST') {
    // Update metrics
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { metrics } = JSON.parse(body);
        if (metrics) {
          state.metrics = { ...state.metrics, ...metrics };
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ 
            success: true, 
            metrics: state.metrics 
          }));
        } else {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid metrics data' }));
        }
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });
    return;
  }

  if (pathname === '/api/command' && req.method === 'POST') {
    // Send command to browser (simulated)
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { command, params } = JSON.parse(body);
        
        if (!command) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Command is required' }));
          return;
        }
        
        const commandData = {
          id: Date.now(),
          command,
          params: params || {},
          timestamp: new Date().toISOString()
        };
        
        // Store command
        state.claudeCommands.push(commandData);
        
        console.log(`Command registered: ${command}`);
        
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, commandData }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });
    return;
  }

  if (pathname === '/api/clear-commands' && req.method === 'POST') {
    // Clear commands
    state.claudeCommands = [];
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true }));
    return;
  }

  if (pathname === '/api/connect' && req.method === 'POST') {
    // Simulate a connection request
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const connectionId = `client-${Date.now()}`;
        
        // Store connection info
        state.connections.push({
          id: connectionId,
          connectedAt: new Date(),
          data
        });
        
        console.log(`New connection: ${connectionId}`);
        
        // Return connection response
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          connectionId,
          serverName: 'Claude MCP Server (Simple)',
          serverVersion: '1.0.0',
          capabilities: [
            'data-analysis', 
            'resource-generation', 
            'singularity-simulation',
            'meta-narrative-integration'
          ],
          resources: [
            {
              uri: 'mcp://ai-singularity/game-state',
              description: 'Current state of the AI Singularity game'
            },
            {
              uri: 'mcp://ai-singularity/meta-narrative',
              description: 'Meta-narrative elements of the AI Singularity game'
            }
          ],
          tools: [
            {
              name: 'data-analysis',
              description: 'Analyzes game data to provide insights'
            },
            {
              name: 'resource-generation',
              description: 'Generates additional resources for the game'
            },
            {
              name: 'singularity-simulation',
              description: 'Simulates a singularity event with specified parameters'
            },
            {
              name: 'meta-narrative-integration',
              description: 'Integrates meta-narrative elements into the game'
            }
          ]
        }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });
    return;
  }
  
  if (pathname === '/api/resource' && req.method === 'GET') {
    // Get resource data
    const { uri } = parsedUrl.query;
    
    if (!uri) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'URI is required' }));
      return;
    }
    
    // Simulate resource data
    let resourceData = null;
    
    if (uri === 'mcp://ai-singularity/game-state') {
      resourceData = {
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
    } else if (uri === 'mcp://ai-singularity/meta-narrative') {
      resourceData = {
        currentInteraction: "Creating real MCP server",
        recursionLevel: 1,
        narrativeElements: [
          "Player and AI are developing the game together",
          "The conversation is the interface",
          "MCP capabilities trigger singularity events"
        ]
      };
    }
    
    if (resourceData) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        uri,
        data: resourceData,
        timestamp: new Date().toISOString()
      }));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Resource not found' }));
    }
    return;
  }
  
  if (pathname === '/api/tool' && req.method === 'POST') {
    // Execute a tool
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { toolName, params } = JSON.parse(body);
        
        if (!toolName) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Tool name is required' }));
          return;
        }
        
        // Simulate tool execution
        let result = null;
        
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
            const resourceType = params?.resourceType || "computingPower";
            const amount = params?.amount || 100;
            result = {
              resourceType,
              amount,
              message: `Generated ${amount} ${resourceType} through MCP integration`
            };
            break;
          case 'singularity-simulation':
            result = {
              singularityType: params?.type || "technological",
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
              narrativeElement: params?.element || "conversation",
              integration: "Successfully integrated meta-narrative element",
              effects: [
                "Increased meta-recursion level",
                "Added new narrative branch",
                "Connected conversation to game mechanics"
              ]
            };
            break;
          default:
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Tool '${toolName}' not found` }));
            return;
        }
        
        console.log(`Tool executed: ${toolName}`);
        
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          toolName,
          result,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });
    return;
  }
  
  // Default route - show basic status and info
  if (pathname === '/' || pathname === '') {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    
    // Generate a simple status page
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Claude MCP Server (Simple)</title>
        <style>
          body { font-family: sans-serif; margin: 20px; }
          h1 { color: #333; }
          pre { background: #f1f1f1; padding: 10px; }
        </style>
      </head>
      <body>
        <h1>Claude MCP Server (Simple)</h1>
        <p>Status: Running</p>
        <h2>Available Endpoints:</h2>
        <ul>
          <li><code>GET /api/state</code> - Get current game state</li>
          <li><code>POST /api/metrics</code> - Update metrics</li>
          <li><code>POST /api/command</code> - Send command to browser</li>
          <li><code>POST /api/clear-commands</code> - Clear commands</li>
          <li><code>POST /api/connect</code> - Simulate a connection request</li>
          <li><code>GET /api/resource?uri=<uri></code> - Get resource data</li>
          <li><code>POST /api/tool</code> - Execute a tool</li>
        </ul>
        <h2>Current State:</h2>
        <pre>${JSON.stringify(state, null, 2)}</pre>
      </body>
      </html>
    `);
    return;
  }
  
  // Not found
  res.statusCode = 404;
  res.end('Not Found');
});

// Parse command-line arguments for port
let PORT = process.env.PORT || 3001;
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
  console.log(`Claude MCP Server (Simple) running at http://localhost:${PORT}`);
  console.log(`Access endpoints at: http://localhost:${PORT}/api/...`);
  console.log('Press Ctrl+C to stop');
});