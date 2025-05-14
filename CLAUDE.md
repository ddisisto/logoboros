# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**IMPORTANT**: Always check the [USER_INPUT.md](USER_INPUT.md) file for critical user instructions, budget tracking, and character role information. This file contains essential context that must be incorporated into your planning and implementation.

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
- The TODO system directly connects to commit patterns, creating feedback loops
- User adopts character roles (The Visionary, The Engineer, etc.) for meta-game progression
- Budget tracking and project phase management are incorporated into the meta-game

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
│   ├── main.css          # Core styles
│   └── meta-dashboard.css # Meta-dashboard specific styles
├── docs/                 # Documentation files
│   ├── CONCEPT.md        # Game concept and design
│   ├── MCP.md            # Model Context Protocol reference
│   ├── ARCHITECTURE.md   # System architecture and patterns
│   ├── NARRATIVE.md      # Character/narrative information
│   ├── METRICS.md        # Game metrics and balancing
│   └── PROPOSALS.md      # Development proposals system
├── js/
│   ├── core/
│   │   ├── events.js     # Event bus system
│   │   ├── state.js      # State management
│   │   ├── game.js       # Game logic and loop
│   │   ├── meta-state.js # Meta-game state tracking
│   │   ├── metrics-fetcher.js # Real-world metrics collection
│   │   ├── claude-metrics-bridge.js # Claude Code metrics integration
│   │   ├── github-metrics.js # GitHub integration
│   │   ├── server-bridge.js # Backend server integration
│   │   └── logger.js     # Enhanced logging system
│   ├── ui/
│   │   ├── renderer.js   # UI rendering
│   │   ├── interactions.js # User interactions
│   │   └── meta-dashboard.js # Meta-game UI
│   ├── mcp/
│   │   ├── interface.js  # MCP communication
│   │   └── claude-client.js # Claude integration
│   └── main.js           # Main entry point
├── GAMESTATE.json        # Meta-game state tracking
├── index.html            # Main HTML structure
├── mcp-server.js         # MCP server implementation
├── claude-mcp-server.js  # Claude MCP server with WebSocket
├── claude-mcp-server-simple.js # Simple MCP server (no dependencies)
├── claude-metrics-simple-server.js # Metrics HTTP server
├── server-runner.js      # Backend server control panel
├── server-dashboard/     # Web UI for server runner
├── bridge.js             # MCP bridge implementation
├── CLAUDE.md             # Claude Code guidance (this file)
├── USER_INPUT.md         # User requirements and task tracking
├── SERVER_RUNNER_README.md # Documentation for server runner
├── UI_UX_IMPROVEMENTS.md # Documentation for UI/UX improvements
├── COMMIT_GUIDELINES.md  # Manual task-commit integration
├── run-servers.sh        # Script to run server control panel
├── run-metrics-server.sh # Script to run metrics server directly
├── run-mcp-server.sh     # Script to run MCP server directly
├── README.md             # Main project documentation
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
- **Character Classes**: The Visionary (currently active), The Engineer, The Data Scientist, The Ethics Advocate, The Entrepreneur
- **Development Phases**: Narrow AI, General AI, Superintelligence, and Singularity
- **MCP Integration**: Connect to MCP servers to trigger singularity events and unlock capabilities

### Meta-Game Implementation

- **GAMESTATE.json**: Central repository for meta-game state tracking
- **meta-state.js**: Manager for meta-state with methods for updating resources, capabilities, and tracking singularity events
- **meta-dashboard.js**: Visual representation of meta-game progress
- **metrics-fetcher.js**: Collects real-world metrics for resource generation
- **github-metrics.js**: Gathers GitHub repository data for influence calculation
- **COMMIT_GUIDELINES.md**: Manual process for task-commit integration
- **Proposals System**: Tracks development initiatives tied to in-game upgrades
- **Recursive Nature**: The game actively tracks its own development progress as part of the game mechanics

### Self-Improving System

The game implements a self-improving system through several interconnected components:

1. **Task Management**: USER_INPUT.md tracks development tasks with priorities and statuses
2. **Metrics Collection**: Real-world metrics from Claude tokens, file counts, and commits map to game resources
3. **Claude Code Metrics**: Direct integration with Claude Code usage metrics via OpenTelemetry
4. **GitHub Integration**: Repository activity directly impacts the game's influence resource
5. **Commit Guidelines**: Manual process for task-commit integration following COMMIT_GUIDELINES.md
6. **Proposal System**: Development initiatives tied to character classes and upgrades
7. **Singularity Events**: Triggered by development patterns and milestones
8. **Budget Tracking**: Project budget constraints translated into game mechanics
9. **Character Roles**: Player and assistant roles mapped to in-game archetypes with abilities
10. **Recursive Feedback**: Development of the game enhances the game itself

### MCP Integration

The game integrates with the Model Context Protocol (MCP), a standardized way to connect AI models to different data sources and tools. The MCP Bridge in the game:

- Listens for connection events from the game
- Simulates connections to MCP servers
- Provides capabilities back to the game
- Displays connection status and event logs

### Claude Integration

The game includes special integration with Claude through multiple mechanisms:

- **claude-mcp-server-simple.js**: Simple Node.js server that implements the MCP protocol
- **claude-client.js**: Browser client that communicates with Claude
- **claude-metrics-bridge.js**: Integration with Claude Code's OpenTelemetry metrics
- **claude-metrics-simple-server.js**: HTTP server for metrics collection and distribution
- **server-runner.js**: Control panel for managing backend servers with web dashboard
- **server-bridge.js**: In-game interface for controlling and monitoring backend servers
- **Enhanced Logging**: Claude has access to console logs and server logs for debugging
- **Meta Capabilities**: Claude can influence the meta-game state directly
- **Real-time Resource Generation**: Token usage, coding activity, and costs map to in-game resources
- **Character Role Integration**: Claude plays "The Engineer" role in the meta-game narrative

## Related Documentation

- [README.md](README.md) - Main game documentation and setup instructions
- [CONCEPT.md](docs/CONCEPT.md) - Detailed game concept and design document
- [MCP.md](docs/MCP.md) - Information about the Model Context Protocol
- [NARRATIVE.md](docs/NARRATIVE.md) - Character/narrative meta-information
- [METRICS.md](docs/METRICS.md) - Game metrics and balancing information
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Architecture design and refactoring guidelines
- [PROPOSALS.md](docs/PROPOSALS.md) - Development proposals tied to in-game upgrades

## URL Reference

Official game: [https://ddisisto.github.io/logoboros/](https://ddisisto.github.io/logoboros/)

## Important State and Events Flow

1. Game initialization: `main.js` → `events.js` → `state.js` → `game.js`
2. Meta-game initialization: `meta-state.js` loads or creates `GAMESTATE.json`
3. Metrics systems initialize: `metrics-fetcher.js`, `claude-metrics-bridge.js`, `github-metrics.js`
4. Server bridge initializes and connects to server runner if available
5. MCP Interface connects via custom events between `interface.js` and `bridge.js`
6. Claude metrics connection established to local metrics server
7. UI updates flow from state changes through the event bus to `renderer.js`
8. User interactions in `interactions.js` modify state through event bus
9. Meta-dashboard visualizes meta-game state, budget tracking, and Claude metrics in real-time
10. Server bridge provides controls for backend servers and real-time logs
11. Claude metrics (tokens, costs, code changes) map directly to game resources
12. GitHub metrics update influence resource via `github-metrics.js`
13. Character roles (Visionary/Engineer) provide special bonuses and mechanics

## Budget and Project Phase Management

This project operates within defined budget constraints that are tracked as part of the meta-game:

- **Current Budget**: $150 allocated for the current development phase
- **Spent**: ~$33 across multiple development phases
- **Remaining**: ~$117 available for continued development
- **Next Steps**: Major review of artifacts, capabilities, and progress upon budget exhaustion

Budget tracking is incorporated into game mechanics through:
1. Resource allocation (corresponds to API usage costs)
2. Unlocking capabilities (corresponds to development milestones)
3. Phase transitions (corresponds to project phases)
4. Singularity events (corresponds to major version releases)

The user should be informed of these requirements, either through direct communication or gamified notifications. Budget usage tracking should be updated in USER_INPUT.md as development progresses.

## Self-Improvement Process

Claude should periodically review this file and suggest updates based on:
1. New understanding of the codebase
2. Changes to the project architecture
3. Enhancements to the meta-game concept
4. Improved ability to assist with development
5. New correlations between tasks and commits
6. Patterns identified in development process
7. Updates to budget tracking and project phases
8. Character role progression and unlocks

This creates a feedback loop where Claude's understanding improves along with the game itself, mirroring the recursive self-improvement theme of the game.