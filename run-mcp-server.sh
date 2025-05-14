#!/bin/bash

# Run MCP Server directly
# This script starts just the MCP server for development

echo "Starting Claude MCP Server (Simple)..."
echo "You can access the server at http://localhost:3001"
echo "Press Ctrl+C to stop"

# Start the MCP server
node claude-mcp-server-simple.js