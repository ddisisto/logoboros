# AI Singularity

An incremental game centered around the development of artificial intelligence, technological singularities, and recursive self-improvement.

## Overview

AI Singularity is a web-based incremental game where players guide the evolution of AI systems through various stages of development, unlocking new capabilities, resources, and ultimately reaching singularity events that reset progress but provide powerful permanent bonuses.

The game features integration with the Model Context Protocol (MCP), allowing for real-world connections to AI capabilities through standardized interfaces.

## Features

- **Resource Management**: Generate and manage Computing Power, Data, Influence, and Funding
- **Character Classes**: Choose from different archetypes with unique abilities and bonuses
  - The Visionary: Creative algorithm bonuses with "Eureka Moments"
  - The Engineer: Hardware optimization bonuses with "Optimization" ability
  - The Data Scientist: Data processing advantages with "Pattern Recognition"
  - The Ethics Advocate: Public trust bonuses with "Ethical Framework"
  - The Entrepreneur: Funding advantages with "Venture Capital"
- **Upgrade System**: Unlock technologies through a branching upgrade tree
- **Development Phases**: Progress through Narrow AI, General AI, Superintelligence, and Singularity
- **MCP Integration**: Connect to real MCP servers to trigger singularity events and unlock new capabilities
- **Dynamic News Ticker**: AI-generated news items that reflect player actions and progress
- **Server Management**: Integrated server control panel for managing backend services with real-time logs
- **Meta-Dashboard**: Visual representation of meta-game state, budget, and capabilities
- **Real-time Metrics**: Integration with Claude Code usage metrics for resource generation
- **Unified UI**: Modern dashboard interface with resource visualizations and server monitoring

## Play Online

You can play the game online at [https://ddisisto.github.io/logoboros/](https://ddisisto.github.io/logoboros/)

## Installation (Local Development)

1. Clone the repository:
   ```
   git clone https://github.com/ddisisto/logoboros.git
   cd logoboros
   ```

2. Open `index.html` in your web browser to start playing locally.

3. (Optional) Start the server runner for backend capabilities:
   ```
   ./run-servers.sh
   ```
   Then access the server control panel at http://localhost:4000

## How to Play

1. **Select a Character**: Choose a character class that matches your preferred play style.
2. **Generate Resources**: Use action buttons to generate Computing Power, Data, Influence, and Funding.
3. **Purchase Upgrades**: Spend resources to unlock upgrades that improve resource generation and unlock new capabilities.
4. **Progress Through Phases**: Advance through development phases by meeting specific requirements.
5. **Trigger Singularity**: When ready, trigger a singularity event to reset progress with permanent bonuses.
6. **Connect MCP Servers**: Integrate with real MCP servers to unlock additional capabilities.
7. **Manage Servers**: Use the server tab to monitor and control backend services.

## MCP Integration

The game integrates with the Model Context Protocol (MCP), a standardized way to connect AI models to different data sources and tools. The MCP Bridge in the game:

- Listens for connection events from the game
- Connects to real or simulated MCP servers
- Provides capabilities back to the game
- Displays connection status and event logs

### Meta-Game Concept

The game also features a meta-game layer where:

- Development of the game mirrors the in-game AI development process
- Real Claude Code capabilities enhance the meta-narrative
- The meta-state system tracks real-world development progress as game resources
- Each development milestone represents a "singularity event" that advances capabilities

This creates a recursive loop where the game tracks its own development progress as part of the game mechanics, providing a unique meta-narrative experience.

## Development

### Project Structure

The project follows a modular architecture with separated concerns:

```
project/
├── css/
│   ├── main.css            # Core styles
│   ├── dashboard.css       # Dashboard and meta-dashboard styles
│   └── server.css          # Server management specific styles
├── js/
│   ├── core/
│   │   ├── events.js           # Event bus system
│   │   ├── state.js            # State management
│   │   ├── game.js             # Game logic and loop
│   │   ├── logger.js           # Enhanced logging system
│   │   ├── meta-state.js       # Meta-game state tracking
│   │   ├── metrics-fetcher.js  # Real-world metrics collection
│   │   ├── claude-metrics-bridge.js  # Claude metrics integration
│   │   └── server-bridge.js    # Backend server integration
│   ├── ui/
│   │   ├── renderer.js             # UI rendering
│   │   ├── interactions.js         # User interactions
│   │   ├── meta-dashboard.js       # Meta-game UI
│   │   ├── server-status.js        # Server management UI
│   │   ├── resource-visualization.js  # Resource visualizations
│   │   └── unified-dashboard.js    # Main dashboard controller
│   ├── mcp/
│   │   ├── interface.js        # MCP communication
│   │   └── claude-client.js    # Claude Code communication
│   └── main.js                 # Main entry point
├── GAMESTATE.json              # Meta-game state tracking
├── index.html                  # Main HTML structure
├── mcp-server.js               # MCP server implementation
├── bridge.js                   # MCP bridge implementation
├── CLAUDE.md                   # Claude Code guidance
└── README.md                   # This file
```

### Branch Management

The project uses several branches for different aspects of development:

- `main`: The primary branch containing stable releases
- `claude`: Integration with Claude Code capabilities and metrics
- `ui-ux-improvements`: UI/UX enhancements and redesigns
- `ui-reset-implementation`: Implementation of the new UI framework
- `enhanced-meta-dashboard`: Meta-game dashboard improvements
- `refactor-architecture`: Code architecture refactoring
- `self-improving-system`: Meta-game recursive system development

When contributing, create feature branches from the appropriate parent branch based on the type of change:

- For UI changes: branch from `ui-ux-improvements`
- For Claude integration: branch from `claude`
- For core game mechanics: branch from `main`

### Commit Guidelines

When making commits, follow these guidelines:

1. **Descriptive Messages**: Write clear, descriptive commit messages that explain both what changed and why
2. **Feature Tagging**: Include feature tags at the beginning of commit messages (e.g., `[UI]`, `[MCP]`, `[Meta]`)
3. **Task References**: Mention related tasks or issues in the commit message
4. **Atomic Commits**: Keep commits focused on a single logical change
5. **Clean History**: Rebase feature branches before merging to maintain a clean history

Example commit message format:
```
[UI] Add server management panel to main dashboard

- Integrate server controls directly in the UI
- Add server status indicators
- Create real-time log viewing panel
- Connect to backend server API
```

### Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Custom event system for component communication
- MCP integration for external AI capabilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m '[Feature] Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by incremental games and the concept of technological singularity
- MCP (Model Context Protocol) integration based on the standardized protocol for AI applications