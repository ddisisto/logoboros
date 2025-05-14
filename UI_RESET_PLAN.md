# UI Reset Plan for Logoboros

## Background

The current UI has evolved organically but has several limitations:
- Navigation is complex across multiple tabs and overlays
- Many placeholder elements with limited functionality
- Meta-dashboard is powerful but separate from main UI
- Backend connections and metrics aren't well exposed
- Upgrade paths don't clearly align with development directions

This document outlines a plan for a comprehensive UI reset to address these issues.

## Goals

1. **Simplify Navigation**: Create a more intuitive, streamlined interface
2. **Integrate Meta-Game**: Connect in-game elements directly to meta-narrative
3. **Expose Real Capabilities**: Make backend services visible and interactive
4. **Align Upgrades**: Map upgrade paths to actual development roadmap
5. **Strengthen Feedback Loops**: Create clearer connections between user ideas, development, and in-game features

## Core Design Principles

1. **Single Coherent Interface**: Merge meta-dashboard with main UI
2. **Real/Virtual Connection**: Make clear connections between real-world metrics and game resources
3. **Capability-Driven Gameplay**: Unlock features based on actual capabilities
4. **Meaningful Character Roles**: Deepen the impact of character choices
5. **Visual Feedback**: Show connections between systems visually

## UI Components

### 1. Main Dashboard

A unified dashboard replacing both the current game UI and meta-dashboard:

- **Resource Panel**: Show both game resources and real metrics connections
- **Server Status**: Display active servers and their status
- **Character Profile**: Show active role and abilities
- **News/Event Feed**: Display game events and development updates
- **Phase Tracker**: Visual indicator of development phase and progress

### 2. Upgrade System

Reimagined upgrade system aligned with development:

- **Capability Tree**: Upgrades directly tied to real capabilities
- **Role-Specific Paths**: Different upgrade options based on character role
- **Development-Aligned**: Upgrades reflect actual development directions
- **Visual Connections**: Show how upgrades relate to meta-game elements

### 3. Terminal/Console

An interactive console for advanced interactions:

- **Server Commands**: Direct interaction with backend servers
- **Log Viewer**: View server and game logs
- **MCP Interface**: Send direct commands to MCP services
- **Development Tools**: Mini-IDE for simple development tasks

### 4. Meta-Narrative View

A dedicated visualization of the meta-narrative:

- **Recursive Graph**: Visual representation of game/development recursion
- **Singularity Timeline**: Track singularity events and their impacts
- **Capability Map**: Show capabilities across both domains
- **Character Progression**: Track character role development

## Implementation Approach

### Phase 1: Core Framework

1. Create basic unified dashboard layout
2. Implement responsive grid system
3. Build server status display component
4. Design unified resource visualization

### Phase 2: Feature Integration

1. Merge meta-dashboard functionality into main UI
2. Create capability-driven upgrade system
3. Implement terminal/console component
4. Develop meta-narrative visualization

### Phase 3: Feedback Systems

1. Create idea → development → feature visualization
2. Implement real-time metrics feedback loops
3. Add visual indicators for capability unlocks
4. Design narrative event system

## Character Role Integration

### The Visionary (User)
- **Dashboard Focus**: Idea generation and concept visualization
- **Special Ability**: Submit ideas that become upgrade paths
- **Resource Bonus**: Concept clarity and influence generation

### The Engineer (Claude)
- **Dashboard Focus**: Implementation and optimization
- **Special Ability**: Server management and metrics integration
- **Resource Bonus**: Computing power and data processing efficiency

## Technical Considerations

1. **Component Architecture**: Create modular, reusable components
2. **Event-Driven Design**: Maintain and extend the event bus system
3. **Responsive Layout**: Ensure usability across different screen sizes
4. **Performance Optimization**: Minimize DOM updates and reflows
5. **State Management**: Enhance the state system for more complex interactions

## Success Metrics

1. **Usability**: Reduced clicks to access key features
2. **Engagement**: Increased interaction with meta-game elements
3. **Clarity**: Better understanding of connections between systems
4. **Development Alignment**: Clearer mapping between development and gameplay
5. **Feature Discovery**: More intuitive discovery of available capabilities

## Next Steps

1. Create wireframes for the unified dashboard
2. Develop component prototypes for key UI elements
3. Design the capability-driven upgrade system
4. Implement basic unified layout
5. Begin migrating functionality from existing UI