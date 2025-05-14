/**
 * Simple Claude Metrics Server
 * 
 * A minimal HTTP server that provides mock Claude metrics
 * without requiring any external dependencies.
 */

const http = require('http');
const url = require('url');

// Mock metrics data for development
let mockMetrics = {
  tokens: { input: 0, output: 0, total: 0 },
  session: { id: 'dev-session', duration: 0, cost: 0 },
  code: { linesModified: 0, filesModified: 0, commitCount: 0, prCount: 0 },
  lastUpdate: new Date()
};

// Simulate metrics changing over time
function updateMockMetrics() {
  mockMetrics.tokens.input += Math.floor(Math.random() * 50);
  mockMetrics.tokens.output += Math.floor(Math.random() * 200);
  mockMetrics.tokens.total = mockMetrics.tokens.input + mockMetrics.tokens.output;
  
  mockMetrics.code.linesModified += Math.floor(Math.random() * 5);
  mockMetrics.code.filesModified = Math.min(30, mockMetrics.code.filesModified + (Math.random() > 0.8 ? 1 : 0));
  mockMetrics.code.commitCount = Math.min(15, mockMetrics.code.commitCount + (Math.random() > 0.9 ? 1 : 0));
  
  // Calculate cost (approximate Claude pricing)
  mockMetrics.session.cost = 
    (mockMetrics.tokens.input * 0.000015) + 
    (mockMetrics.tokens.output * 0.000075);
    
  mockMetrics.session.duration += 1; // 1 minute
  mockMetrics.lastUpdate = new Date();
  
  console.log('Updated mock metrics:', mockMetrics);
}

// Update metrics every minute
setInterval(updateMockMetrics, 60000);

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Set CORS headers to allow browser access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  // Only respond to GET requests to /claude-metrics
  if (req.method === 'GET' && parsedUrl.pathname === '/claude-metrics') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(mockMetrics));
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

// Set port
const port = 3000;

// Start server
server.listen(port, () => {
  console.log(`Claude metrics simple server running at http://localhost:${port}`);
  console.log('Access metrics at: http://localhost:3000/claude-metrics');
  console.log('Press Ctrl+C to stop');
});

// Initial metrics update
updateMockMetrics();