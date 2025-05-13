/**
 * UI Renderer for AI Singularity Game
 * 
 * Handles updating the DOM based on game state changes
 */

class UIRenderer {
    constructor() {
        this.elements = {};
        this.initialized = false;
    }

    /**
     * Initialize the renderer
     */
    init() {
        if (this.initialized) {
            console.warn('UI Renderer already initialized');
            return;
        }

        // Cache DOM elements
        this.cacheElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial render
        this.render();
        
        this.initialized = true;
        console.log('UI Renderer initialized');
    }

    /**
     * Cache DOM elements for faster access
     */
    cacheElements() {
        // Resource elements
        this.elements.computingPower = document.getElementById('computingPower');
        this.elements.data = document.getElementById('data');
        this.elements.influence = document.getElementById('influence');
        this.elements.funding = document.getElementById('funding');
        
        // Rate elements
        this.elements.computingPowerRate = document.getElementById('computingPowerRate');
        this.elements.dataRate = document.getElementById('dataRate');
        this.elements.influenceRate = document.getElementById('influenceRate');
        this.elements.fundingRate = document.getElementById('fundingRate');
        
        // Progress elements
        this.elements.phase = document.getElementById('phase');
        this.elements.progressBar = document.getElementById('progressBar');
        
        // News ticker
        this.elements.newsTicker = document.getElementById('newsTicker');
        
        // Character selection
        this.elements.characterSelect = document.getElementById('characterSelect');
        
        // Upgrades container
        this.elements.upgradesContainer = document.getElementById('upgradesContainer');
        
        // Singularity button
        this.elements.singularityBtn = document.getElementById('singularity');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for state updates
        window.eventBus.subscribe('state:updated', () => this.render());
        
        // Listen for specific events
        window.eventBus.subscribe('news:added', (newsItem) => this.renderNewsItem(newsItem));
        window.eventBus.subscribe('singularity:available', () => this.enableSingularityButton());
        window.eventBus.subscribe('singularity:triggered', () => this.renderSingularityEffect());
        window.eventBus.subscribe('character:selected', () => this.renderCharacterSelection());
        window.eventBus.subscribe('upgrade:purchased', (upgradeId) => this.renderUpgradePurchased(upgradeId));
        window.eventBus.subscribe('phase:changed', () => this.renderPhase());
    }

    /**
     * Render the UI based on current game state
     */
    render() {
        const state = window.gameState.getState();
        
        // Update resource values
        this.renderResources(state.resources);
        
        // Update resource rates
        this.renderRates(state.rates);
        
        // Update phase and progress
        this.renderPhase();
        this.renderProgress();
    }

    /**
     * Render resource values
     * @param {Object} resources - Resource values
     */
    renderResources(resources) {
        if (this.elements.computingPower) {
            this.elements.computingPower.textContent = Math.floor(resources.computingPower);
        }
        
        if (this.elements.data) {
            this.elements.data.textContent = Math.floor(resources.data);
        }
        
        if (this.elements.influence) {
            this.elements.influence.textContent = Math.floor(resources.influence);
        }
        
        if (this.elements.funding) {
            this.elements.funding.textContent = Math.floor(resources.funding);
        }
    }

    /**
     * Render resource rates
     * @param {Object} rates - Resource rates
     */
    renderRates(rates) {
        if (this.elements.computingPowerRate) {
            this.elements.computingPowerRate.textContent = `(+${rates.computingPower.toFixed(2)}/s)`;
        }
        
        if (this.elements.dataRate) {
            this.elements.dataRate.textContent = `(+${rates.data.toFixed(2)}/s)`;
        }
        
        if (this.elements.influenceRate) {
            this.elements.influenceRate.textContent = `(+${rates.influence.toFixed(2)}/s)`;
        }
        
        if (this.elements.fundingRate) {
            this.elements.fundingRate.textContent = `(+${rates.funding.toFixed(2)}/s)`;
        }
    }

    /**
     * Render the current phase
     */
    renderPhase() {
        const state = window.gameState.getState();
        
        if (this.elements.phase) {
            this.elements.phase.textContent = state.phase;
        }
    }

    /**
     * Render the progress bar
     */
    renderProgress() {
        const state = window.gameState.getState();
        
        if (this.elements.progressBar) {
            const progressPercent = (state.progress / state.singularityThreshold) * 100;
            this.elements.progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
        }
    }

    /**
     * Render a news item
     * @param {Object} newsItem - News item to render
     */
    renderNewsItem(newsItem) {
        if (!this.elements.newsTicker) return;
        
        // Check if there's an existing item with the same text
        const existingItems = Array.from(this.elements.newsTicker.querySelectorAll('.news-item'));
        const existingItem = existingItems.find(item => {
            const textSpan = item.querySelector('span:not(.timestamp)');
            return textSpan && textSpan.textContent === newsItem.text;
        });
        
        if (existingItem) {
            // If the item exists, move it to the top and highlight it
            this.elements.newsTicker.removeChild(existingItem);
            this.elements.newsTicker.prepend(existingItem);
            
            // Update the timestamp
            const timestampSpan = existingItem.querySelector('.timestamp');
            if (timestampSpan) {
                timestampSpan.textContent = newsItem.timestamp;
            }
            
            // Add highlight animation
            existingItem.classList.add('highlight');
            setTimeout(() => {
                existingItem.classList.remove('highlight');
            }, 1500);
        } else {
            // Create a new item if it doesn't exist
            const newsItemElement = document.createElement('div');
            newsItemElement.className = 'news-item';
            newsItemElement.innerHTML = `<span class="timestamp">${newsItem.timestamp}</span><span>${newsItem.text}</span>`;
            
            this.elements.newsTicker.prepend(newsItemElement);
            
            // Limit news items
            while (this.elements.newsTicker.children.length > 20) {
                this.elements.newsTicker.removeChild(this.elements.newsTicker.lastChild);
            }
        }
    }

    /**
     * Enable the singularity button
     */
    enableSingularityButton() {
        if (this.elements.singularityBtn) {
            this.elements.singularityBtn.disabled = false;
        }
    }

    /**
     * Render the singularity effect
     */
    renderSingularityEffect() {
        document.body.style.transition = "all 2s";
        document.body.style.backgroundColor = "#fff";
        
        setTimeout(() => {
            document.body.style.backgroundColor = "#0d1117"; // Reset to original background color
        }, 2000);
    }

    /**
     * Render character selection
     */
    renderCharacterSelection() {
        if (!this.elements.characterSelect) return;
        
        const state = window.gameState.getState();
        
        // Remove selected class from all characters
        const characters = this.elements.characterSelect.querySelectorAll('.character');
        characters.forEach(el => {
            el.classList.remove('selected');
        });
        
        // Add selected class to chosen character
        if (state.character) {
            const selectedCharacter = this.elements.characterSelect.querySelector(`[data-character="${state.character}"]`);
            if (selectedCharacter) {
                selectedCharacter.classList.add('selected');
            }
        }
    }

    /**
     * Render an upgrade as purchased
     * @param {string} upgradeId - ID of the purchased upgrade
     */
    renderUpgradePurchased(upgradeId) {
        if (!this.elements.upgradesContainer) return;
        
        const upgradeElement = this.elements.upgradesContainer.querySelector(`[data-upgrade="${upgradeId}"]`);
        if (upgradeElement) {
            upgradeElement.classList.add('disabled');
        }
    }

    /**
     * Create and add a new upgrade element
     * @param {Object} upgrade - Upgrade data
     */
    addUpgradeElement(upgrade) {
        if (!this.elements.upgradesContainer) return;
        
        const { id, title, description, cost, benefit } = upgrade;
        
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade';
        upgradeElement.dataset.upgrade = id;
        upgradeElement.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
            <p class="cost">${cost}</p>
            <p class="benefit">${benefit}</p>
        `;
        
        this.elements.upgradesContainer.appendChild(upgradeElement);
    }
}

// Create and export a singleton instance as a global variable
window.uiRenderer = new UIRenderer();