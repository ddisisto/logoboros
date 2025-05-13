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

## Play Online

You can play the game online at [https://ddisisto.github.io/logoboros/](https://ddisisto.github.io/logoboros/)

## Installation (Local Development)

1. Clone the repository:
   ```
   git clone https://github.com/ddisisto/logoboros.git
   cd logoboros
   ```

2. Open `index.html` in your web browser to start playing locally.

## How to Play

1. **Select a Character**: Choose a character class that matches your preferred play style.
2. **Generate Resources**: Use action buttons to generate Computing Power, Data, Influence, and Funding.
3. **Purchase Upgrades**: Spend resources to unlock upgrades that improve resource generation and unlock new capabilities.
4. **Progress Through Phases**: Advance through development phases by meeting specific requirements.
5. **Trigger Singularity**: When ready, trigger a singularity event to reset progress with permanent bonuses.
6. **Connect MCP Servers**: Integrate with real MCP servers to unlock additional capabilities.

## MCP Integration

The game integrates with the Model Context Protocol (MCP), a standardized way to connect AI models to different data sources and tools. The MCP Bridge in the game:

- Listens for connection events from the game
- Simulates connections to MCP servers
- Provides capabilities back to the game
- Displays connection status and event logs

In future versions, this will allow for real connections to MCP servers, enabling the game to access external AI capabilities and data sources.

## Development

### Project Structure

The project follows a modular architecture with separated concerns:

```
project/
├── css/
│   └── main.css          # Core styles
├── js/
│   ├── core/
│   │   ├── events.js     # Event bus system
│   │   ├── state.js      # State management
│   │   └── game.js       # Game logic and loop
│   ├── ui/
│   │   ├── renderer.js   # UI rendering
│   │   └── interactions.js # User interactions
│   ├── mcp/
│   │   └── interface.js  # MCP communication
│   └── main.js           # Main entry point
├── index.html            # Main HTML structure
├── mcp-server.js         # MCP server implementation
├── bridge.js             # MCP bridge implementation
├── REFACTORING.md        # Refactoring roadmap
├── IDEA.md               # Game concept and design document
├── MCP.md                # Information about the Model Context Protocol
├── ENVIRONMENT.md        # Environment setup information
├── IDENTITY.md           # Character and narrative information
└── metrics.md            # Game metrics and balancing information
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
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by incremental games and the concept of technological singularity
- MCP (Model Context Protocol) integration based on the standardized protocol for AI applications