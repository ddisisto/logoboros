#!/bin/bash

# Run Claude Metrics Server directly
# This script starts just the metrics server for development

echo "Starting Claude Metrics Server..."
echo "You can access metrics at http://localhost:3000/claude-metrics"
echo "Press Ctrl+C to stop"

# Start the metrics server
node claude-metrics-simple-server.js