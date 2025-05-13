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
        
        // Then initialize the UI renderer
        window.uiRenderer.init();
        
        // Set up user interactions
        window.userInteractions.init();
        
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
    mcpInterface: window.mcpInterface
};

console.log('AI Singularity Game loaded');