# Meta-Game Tracking and Claude Integration

## Overview

This PR adds a meta-game tracking system and integrates Claude Code's capabilities directly into the game, creating a recursive self-improvement loop between development and gameplay.

## Features

### 1. Meta-Game Tracking System
- **GAMESTATE.json**: Central repository for meta-state with resources and capabilities
- **meta-state.js**: Manager for meta-game state with singularity events
- **meta-dashboard.js**: UI visualization of meta-game progress
- **Singularity event tracking**: Captures real development milestones

### 2. Real-World Metrics Integration
- Metrics collected from Claude Code (tokens, cost)
- Integrated with in-game resource system
- Dynamic visualization of metrics

### 3. Enhanced Logging
- Comprehensive logger system with console integration
- Structured metadata and log level support
- Unified view between console and game UI

### 4. Claude-Browser Communication
- WebSocket server for Claude-Browser communication
- In-game client for Claude Code commands
- Bidirectional state sharing

### 5. Documentation Updates
- Updated CLAUDE.md with meta-game concept
- Added FILE_STRUCTURE_PROPOSAL.md for documentation organization
- Enhanced documentation of the recursive self-improvement concept

## Implementation Notes

The implementation creates a recursive loop where:
- Development activities are tracked as in-game resources
- Real token usage influences in-game computing power
- Code commits increase in-game influence
- Each development milestone triggers singularity events

This directly connects the game's theme (AI self-improvement) to its own development process, making the development experience part of the gameplay.

## Testing

- Tested in browser with local server
- Verified meta-dashboard functionality
- Confirmed metrics tracking and singularity events
- Tested logging integration

## Dependencies

- No new runtime dependencies for the base game
- Optional Node.js dependencies for enhanced Claude integration:
  - express
  - ws
  - body-parser
  - cors

## Screenshots

(Meta-dashboard shows real-time development metrics and singularity events)