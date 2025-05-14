# Meta-State System Architecture

## Overview

The meta-state system is a core component of the AI Singularity game, providing a self-referential layer where the game tracks its own development progress. This creates a recursive loop where game development mirrors the in-game AI development process, blurring the lines between the game world and real-world development.

## Components

The meta-state system consists of the following components:

### 1. State Management

**MetaStateManager** (`js/core/meta-state.js`)
- Central manager for the meta-game state
- Handles loading/saving state
- Provides methods for state updates
- Manages listeners for state changes
- Implements singularity events
- Tracks development history
- Updates capabilities and upgrades

### 2. Metrics Integration

**MetricsFetcher** (`js/core/metrics-fetcher.js`)
- Collects real-world metrics (token usage, cost, file counts, commits)
- Maps metrics to in-game resources
- Calculates resource rates based on metrics
- Triggers singularity events when thresholds are met
- Updates the meta-state based on real-world progress

### 3. Visualization

**MetaDashboard** (`js/ui/meta-dashboard.js`)
- Provides a UI for viewing the meta-game state
- Displays resource levels and rates
- Shows progress toward next thresholds
- Lists capabilities and their status
- Shows available upgrades
- Tracks development history
- Connects to Claude metrics server

### 4. Event Communication

**EventBus** (`js/core/events.js`)
- Facilitates communication between components
- Allows components to publish and subscribe to events
- Provides a central hub for state updates
- Handles error catching in event handlers

## Data Structure

The meta-state data is stored in `GAMESTATE.json` with the following structure:

```json
{
  "meta": {
    "version": "0.4.0",
    "lastUpdated": "2023-05-14",
    "phase": "General AI"
  },
  "resources": {
    "computingPower": { ... },
    "data": { ... },
    "influence": { ... },
    "funding": { ... }
  },
  "progress": {
    "developmentPhase": { ... },
    "conceptClarity": { ... },
    "implementation": { ... },
    "metaRecursion": { ... }
  },
  "capabilities": {
    "fileCreation": { ... },
    "mcpDocumentation": { ... },
    ...
  },
  "upgrades": {
    "available": [ ... ],
    "completed": [ ... ]
  },
  "singularityEvents": [ ... ],
  "developmentHistory": [ ... ]
}
```

## Resource Mapping

Real-world metrics are mapped to in-game resources:

| Real Metric | Game Resource | Description |
|-------------|---------------|-------------|
| `claudeTokenCount` | `computingPower` | Claude token usage -> computing resources |
| `fileCount` | `data` | Number of files created -> knowledge data |
| `commitCount` | `influence` | Git commits -> system influence |
| `claudeCost` | `funding` | Claude usage cost -> abstract funding |

## Lifecycle

1. **Initialization**
   - `MetaStateManager` loads state from `GAMESTATE.json`
   - `MetaStateManager` registers with `EventBus`
   - `MetricsFetcher` initializes and fetches initial metrics
   - `MetaDashboard` initializes and displays current state

2. **Update Cycle**
   - `MetricsFetcher` periodically fetches new metrics
   - `MetricsFetcher` updates `MetaStateManager` with new values
   - `MetaStateManager` notifies listeners of state changes
   - `MetaDashboard` updates UI based on new state

3. **Singularity Events**
   - Triggered when specific conditions are met
   - Add bonuses to resources and capabilities
   - Record event in development history
   - Notify listeners of singularity completion

4. **User Interactions**
   - Users can complete upgrades through the dashboard
   - Users can trigger certain actions (like fetching metrics)
   - Users can view different aspects of the meta-state

## Event Flow

```
MetricsFetcher                  MetaStateManager                 MetaDashboard
     │                                 │                               │
     │        fetchMetrics()           │                               │
     │─────────────────────────────────┼───────────────────────────────┤
     │                                 │                               │
     │        updateMetrics()          │                               │
     │───────────┐                     │                               │
     │           │                     │                               │
     │           │   updateMetaState() │                               │
     │           └─────────────────────▶                               │
     │                                 │                               │
     │                                 │     updateState()             │
     │                                 │───────────┐                   │
     │                                 │           │                   │
     │                                 │           │                   │
     │                                 │           │                   │
     │                                 │           │ notifyListeners() │
     │                                 │           └───────────────────▶
     │                                 │                               │
     │                                 │                               │
     │                                 │                               │
     │                                 │                               │
     │       'metrics:updated'         │                               │
     │─────────────────────────────────┼───────────────────────────────▶
     │                                 │                               │
     │                                 │    'meta:state:updated'       │
     │                                 │───────────────────────────────▶
     │                                 │                               │
     │                                 │                     updateDashboard()
     │                                 │                               │───────┐
     │                                 │                               │       │
     │                                 │                               │       │
     │                                 │                               │◀──────┘
```

## Usage

### Accessing the Meta-State

```javascript
// Get current state
const state = window.metaStateManager.getState();

// Access specific resources
const computingPower = state.resources.computingPower.current;
const influence = state.resources.influence.current;

// Check capabilities
const fileCreationEfficiency = state.capabilities.fileCreation.efficiency;
```

### Updating the Meta-State

```javascript
// Update specific resource
window.metaStateManager.updateState({
  resources: {
    computingPower: {
      current: 5000
    }
  }
});

// Add development history entry
window.metaStateManager.addDevelopmentHistoryEntry(
  "New Feature Implementation",
  "+1 feature (meta-dashboard.js)"
);

// Trigger a singularity event
window.metaStateManager.triggerSingularity({
  id: 'featureComplete',
  name: 'Feature Complete',
  description: 'All core features implemented',
  triggers: ['implementation', 'testing'],
  bonuses: ['computing+15%', 'implementation+10']
});
```

### Listening for State Changes

```javascript
// Add state change listener
const unsubscribe = window.metaStateManager.addListener(state => {
  console.log('Meta-state updated:', state);
  // Update UI or perform other actions
});

// Unsubscribe when no longer needed
unsubscribe();
```

## Integration with Claude Metrics

The meta-state system can connect to a Claude metrics server to gather real-time metrics from Claude Code sessions:

1. The `MetaDashboard` provides UI controls to connect to the metrics server
2. Upon connection, metrics like tokens, cost, and lines modified are fetched
3. These metrics are integrated into the meta-game state
4. The dashboard displays these metrics in real-time

This creates a feedback loop where the actual development process using Claude Code directly feeds into the game's resource system.

## Future Enhancements

Potential enhancements to the meta-state system:

1. **Persistent Storage**: Save state to local storage or a server
2. **Enhanced Metrics Collection**: Gather more detailed metrics about development
3. **Predictive Analytics**: Use past metrics to predict future development trends
4. **Multiple Timelines**: Support managing different development branches
5. **Deeper MCP Integration**: Connect to more real-world systems and data sources