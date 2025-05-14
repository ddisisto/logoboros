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

## Git Workflow and Branch Management

### Branch Structure

The project uses a multi-branch structure to organize different aspects of development:

- `main`: The primary branch containing stable releases
- `claude`: Integration with Claude Code capabilities and metrics
- `ui-ux-improvements`: UI/UX enhancements and redesigns
- `ui-reset-implementation`: Implementation of the new UI framework
- `enhanced-meta-dashboard`: Meta-game dashboard improvements
- `refactor-architecture`: Code architecture refactoring
- `self-improving-system`: Meta-game recursive system development

### Branch Selection Guidelines

When working on a task, follow these guidelines for branch selection:

1. **Always start** by identifying the current branch with `git status` or `git branch`
2. **Determine relevance**: Assess if the current branch is appropriate for the work:
   - UI/UX changes → `ui-ux-improvements` or `ui-reset-implementation`
   - Claude integration → `claude`
   - Meta-game features → `enhanced-meta-dashboard` or `self-improving-system`
   - Core refactoring → `refactor-architecture`
   - Core game features → `main`
3. **Branch switching**: If the current branch isn't appropriate, recommend switching with:
   ```
   git checkout <appropriate-branch>
   ```
4. **New branches**: For significant new features, recommend creating a new branch:
   ```
   git checkout -b feature/descriptive-name <parent-branch>
   ```

### Commit Guidelines

All work should generally culminate in commits. Follow these guidelines for effective commits:

1. **Commit Frequency**:
   - Each completed TodoWrite task should typically result in a commit
   - Large changes may require multiple focused commits
   - Changes spanning multiple files should be committed together when they form a cohesive unit

2. **Commit Message Structure**:
   - Start with a feature tag in brackets: `[UI]`, `[MCP]`, `[Meta]`, `[Core]`, etc.
   - Use a clear, concise title (50-60 chars) summarizing the change
   - Add 2-4 bullet points explaining key changes and rationale
   - End with metadata if appropriate (related tasks, references)

3. **Example Commit Messages**:
   ```
   [UI] Integrate server bridge into main dashboard layout
   
   - Move server controls from flyout panel to dedicated tab
   - Add real-time status indicators in resource panel
   - Improve connection visualization with animated status icons
   - Standardize server action buttons with dashboard style
   ```

   ```
   [Meta] Enhance resource visualization with real metrics
   
   - Connect resource displays to real-world metrics
   - Add animated growth indicators based on Claude usage
   - Implement threshold notifications for resource milestones
   - Create visual feedback loop between game state and meta state
   ```

4. **When to Commit**:
   - After completing a TodoWrite task that modifies code
   - When a logical unit of work is completed
   - Before switching to a different feature or task area
   - At the end of a session working on code

### Pull Request Process

When completing major features, follow these steps for creating a pull request:

1. **Ensure all relevant work is committed** on your feature branch
2. **Verify tests pass** if applicable
3. **Recommend creating a PR** to merge back to the parent branch
4. **Provide a detailed PR description** explaining:
   - What changes were made
   - Why they were made
   - How to test them
   - Any potential issues or follow-ups

## Build/Test Commands
- Open `index.html` in browser to run the game
- No build or compilation step is required
- Test by opening in browser and checking console for errors

## Project Structure

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
├── CLAUDE.md                   # Claude Code guidance (this file)
└── README.md                   # Main documentation file
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
- [MCP.md](MCP.md) - Information about the Model Context Protocol
- [IDENTITY.md](IDENTITY.md) - Character/narrative meta-information
- [metrics.md](metrics.md) - Game metrics and balancing information
- [REFACTORING.md](REFACTORING.md) - Refactoring roadmap and architecture guidelines
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

## File Management Guidelines

### Avoiding Temporary Files

1. **Use `mv` Instead of `cp`**: When replacing files or moving files to their final location, always use `mv` instead of `cp` to avoid leaving unnecessary temporary files behind.
   ```
   # GOOD: Replace old file with new version
   mv new_file.html index.html
   
   # BAD: Creates duplicate files
   cp new_file.html index.html  # Leaves new_file.html behind as junk
   ```

2. **Temporary File Naming**: When creating temporary versions of files, use consistent naming:
   - Use `.new` extension for files that will replace existing files
   - Use temporary directories only when necessary
   - Clean up all temporary files after operations are complete

3. **Immediate Cleanup**: After creating any temporary file that won't be used to replace an existing file, clean it up immediately

4. **Development Artifacts**: Never commit temporary files, backup files, or development artifacts to the repository

### File Operations Best Practices

1. **Atomic File Operations**: Use atomic operations where possible to avoid partial updates
2. **Leverage Version Control**: Git is the primary backup system - commit changes frequently and meaningfully to maintain history rather than creating separate backups
3. **Preview Changes**: Always preview changes before making them permanent
4. **Validate File Contents**: Validate file contents after operations to ensure they were completed successfully
5. **Commit Before Complex Changes**: Make a commit before starting complex, multi-file changes to ensure you have a clean reversion point

## Self-Improvement Process

Claude should periodically review this file and suggest updates based on:
1. New understanding of the codebase
2. Changes to the project architecture
3. Enhancements to the meta-game concept
4. Improved ability to assist with development

This creates a feedback loop where Claude's understanding improves along with the game itself, mirroring the recursive self-improvement theme of the game.