# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Singularity is a web-based incremental game where players guide the evolution of AI systems through various stages of development, unlocking new capabilities, resources, and ultimately reaching singularity events that reset progress but provide powerful permanent bonuses.

The game features integration with the Model Context Protocol (MCP), allowing for real-world connections to AI capabilities through standardized interfaces.

## Meta-Game Concept

The game explores recursive self-improvement through two parallel layers:

1. **Concrete Game**: The actual incremental game with resources, upgrades, and progression
2. **Meta-Game**: A self-referential layer where the game's development itself follows the same principles

This creates a fascinating recursive loop where:
- Development of the game mirrors the in-game AI development process
- Real capabilities (Claude Code) enhance the meta-narrative
- The meta-state system tracks real-world progress as game resources
- Each developer interaction represents a "singularity event" that advances capabilities

The Claude agent should regularly review and update this file to optimize its understanding of both the environment and itself simultaneously, creating a short recursive loop that drives improvement in both the concrete game and the meta-game.

## Build/Test Commands
- Open `index.html` in browser to run the game
- No build or compilation step is required
- Test by opening in browser and checking console for errors

## Project Structure

The project follows a modular architecture with separated concerns:

```
project/
├── css/
│   └── main.css          # Core styles
├── js/
│   ├── core/
│   │   ├── events.js     # Event bus system
│   │   ├── state.js      # State management
│   │   ├── game.js       # Game logic and loop
│   │   └── meta-state.js # Meta-game state tracking
│   ├── ui/
│   │   ├── renderer.js   # UI rendering
│   │   ├── interactions.js # User interactions
│   │   └── meta-dashboard.js # Meta-game UI
│   ├── mcp/
│   │   └── interface.js  # MCP communication
│   └── main.js           # Main entry point
├── GAMESTATE.json        # Meta-game state tracking
├── index.html            # Main HTML structure
├── mcp-server.js         # MCP server implementation
├── bridge.js             # MCP bridge implementation
├── CLAUDE.md             # Claude Code guidance (this file)
├── FILE_STRUCTURE_PROPOSAL.md # Documentation organization plan
└── *.md                  # Additional documentation files
```

## Code Style Guidelines

### JavaScript
- Use vanilla JavaScript (no frameworks)
- Use ES6+ features (classes, arrow functions, etc.)
- Follow camelCase for variables and functions
- Follow PascalCase for class names
- Use JSDoc comments for function documentation
- Handle errors with try/catch blocks
- Use 4 space indentation
- Maintain component separation (core/ui/mcp)

### Architecture
- Follow the modular design pattern in `js/` directory
- Use the event bus system for component communication
- Use the singleton pattern for global instances
- Initialize components in the order specified in main.js
- Update UI through the renderer, not directly

### HTML/CSS
- Follow BEM naming convention for CSS classes
- Use semantic HTML elements
- Maintain responsive design principles

## Key Design Concepts

### Game Mechanics

- **Resource Generation**: Computing Power, Data, Influence, and Funding
- **Character Classes**: The Visionary, The Engineer, The Data Scientist, The Ethics Advocate, The Entrepreneur
- **Development Phases**: Narrow AI, General AI, Superintelligence, and Singularity
- **MCP Integration**: Connect to MCP servers to trigger singularity events and unlock capabilities

### Meta-Game Implementation

- **GAMESTATE.json**: Central repository for meta-game state tracking
- **meta-state.js**: Manager for meta-state with methods for updating resources, capabilities, and tracking singularity events
- **meta-dashboard.js**: Visual representation of meta-game progress
- **Recursive Nature**: The game actively tracks its own development progress as part of the game mechanics

### MCP Integration

The game integrates with the Model Context Protocol (MCP), a standardized way to connect AI models to different data sources and tools. The MCP Bridge in the game:

- Listens for connection events from the game
- Simulates connections to MCP servers
- Provides capabilities back to the game
- Displays connection status and event logs

## Related Documentation

- [README.md](README.md) - Main game documentation and setup instructions
- [CONCEPT.md](docs/CONCEPT.md) - Detailed game concept and design document
- [MCP.md](docs/MCP.md) - Information about the Model Context Protocol
- [NARRATIVE.md](docs/NARRATIVE.md) - Character/narrative meta-information
- [METRICS.md](docs/METRICS.md) - Game metrics and balancing information
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Architecture design and refactoring guidelines
- [FILE_STRUCTURE_PROPOSAL.md](FILE_STRUCTURE_PROPOSAL.md) - Documentation organization plan

## URL Reference

Official game: [https://ddisisto.github.io/logoboros/](https://ddisisto.github.io/logoboros/)

## Important State and Events Flow

1. Game initialization: `main.js` → `events.js` → `state.js` → `game.js`
2. Meta-game initialization: `meta-state.js` loads or creates `GAMESTATE.json`
3. MCP Interface connects via custom events between `interface.js` and `bridge.js`
4. UI updates flow from state changes through the event bus to `renderer.js`
5. User interactions in `interactions.js` modify state through event bus
6. Meta-dashboard visualizes meta-game state in real-time

## Self-Improvement Process

Claude should periodically review this file and suggest updates based on:
1. New understanding of the codebase
2. Changes to the project architecture
3. Enhancements to the meta-game concept
4. Improved ability to assist with development

This creates a feedback loop where Claude's understanding improves along with the game itself, mirroring the recursive self-improvement theme of the game.