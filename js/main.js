/**
 * Main Entry Point for AI Singularity Game
 * 
 * Initializes all game components and starts the game
 */

/**
 * Initialize the game
 */
function initGame() {
    console.log('Initializing AI Singularity Game...');
    
    // Enable debug mode for event bus in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.eventBus.setDebug(true);
        console.log('Event bus debug mode enabled');
    }
    
    // Initialize components in the correct order
    try {
        // First initialize the MCP interface
        window.mcpInterface.init();
        
        // UI initialization is now handled later in the process
        
        // Set up user interactions
        window.userInteractions.init();
        
        // Initialize meta-state components
        if (window.metricsFetcher) {
            window.metricsFetcher.init();
        }
        
        if (window.githubMetrics) {
            window.githubMetrics.init();
        }
        
        // Initialize server bridge if available
        if (window.serverBridge) {
            console.log('Initializing server bridge...');
            // Note: ServerBridge auto-initializes in its constructor
        }
        
        // TODO: Implement a lightweight task tracking system in the future
        // Following COMMIT_GUIDELINES.md for now
        
        // Initialize meta-dashboard
        if (window.metaDashboard) {
            window.metaDashboard.init();
        }
        
        // Initialize unified dashboard if available
        if (window.unifiedDashboard) {
            window.unifiedDashboard.init();
        } else {
            // If unified dashboard is not available, use the original renderer
            window.uiRenderer.init();
        }
        
        // Finally initialize the game
        window.game.init();
        
        console.log('Game initialization complete');
    } catch (error) {
        console.error('Error during game initialization:', error);
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// Export game components for debugging
window.aiSingularity = {
    eventBus: window.eventBus,
    gameState: window.gameState,
    game: window.game,
    uiRenderer: window.uiRenderer,
    userInteractions: window.userInteractions,
    mcpInterface: window.mcpInterface,
    metaState: window.metaStateManager,
    metricsFetcher: window.metricsFetcher,
    githubMetrics: window.githubMetrics,
    // todoCommitSystem removed - using manual process with COMMIT_GUIDELINES.md
    metaDashboard: window.metaDashboard,
    unifiedDashboard: window.unifiedDashboard,
    serverBridge: window.serverBridge
};

console.log('AI Singularity Game loaded');