/**
 * TODO-Commit Integration System for AI Singularity Game
 * 
 * Creates a recursive loop between todo tasks and git commits,
 * enhancing the self-improving system by connecting planning
 * directly to implementation.
 */

class TodoCommitSystem {
    constructor() {
        this.todos = [];
        this.commits = [];
        this.completedTodos = [];
        this.initialized = false;
        this.mockMode = true;
        this.syncInterval = null;
    }

    /**
     * Initialize the TODO-Commit integration system
     */
    init() {
        if (this.initialized) {
            console.warn('TODO-Commit system already initialized');
            return;
        }

        // Register event handlers
        if (window.eventBus) {
            window.eventBus.subscribe('todos:updated', (data) => this.handleTodosUpdated(data));
            window.eventBus.subscribe('github:metrics:updated', (data) => this.handleCommitsUpdated(data));
            window.eventBus.subscribe('singularity:triggered', (data) => this.handleSingularityEvent(data));
        }

        // Set up periodic sync
        this.syncInterval = setInterval(() => this.synchronizeState(), 2 * 60 * 1000);

        // Initial sync
        this.synchronizeState();

        this.initialized = true;
        console.log('TODO-Commit system initialized');
    }

    /**
     * Handle todos being updated in the system
     * @param {Array} todos - Updated todo list
     */
    handleTodosUpdated(todos) {
        this.todos = todos || [];

        // Find newly completed todos
        const newlyCompleted = this.todos.filter(todo => 
            todo.status === 'completed' && 
            !this.completedTodos.some(ct => ct.id === todo.id)
        );

        // Update completed todos list
        if (newlyCompleted.length > 0) {
            this.completedTodos = [...this.completedTodos, ...newlyCompleted];
            
            // Generate suggested commit message from completed todos
            const commitSuggestion = this.generateCommitSuggestion(newlyCompleted);
            
            // Publish commit suggestion event
            if (window.eventBus) {
                window.eventBus.publish('commit:suggested', {
                    todos: newlyCompleted,
                    commitMessage: commitSuggestion
                });
            }

            console.log('Completed todos detected, commit suggestion:', commitSuggestion);
            
            // Update meta-state progress
            this.updateMetaStateProgress(newlyCompleted);
        }
    }

    /**
     * Handle commits being updated from GitHub
     * @param {Object} gitData - GitHub metrics data
     */
    handleCommitsUpdated(gitData) {
        if (!gitData || !gitData.commitCount) return;
        
        // Store the commits
        this.commits = gitData.commitHistory || [];
        
        if (this.commits.length > 0) {
            // Analyze commit messages for todo correlations
            this.analyzeCommitMessages();
        }
    }

    /**
     * Generate a commit message suggestion from completed todos
     * @param {Array} completedTodos - Recently completed todos
     * @returns {String} Suggested commit message
     */
    generateCommitSuggestion(completedTodos) {
        if (!completedTodos || completedTodos.length === 0) {
            return '';
        }

        // Group todos by priority
        const byPriority = completedTodos.reduce((acc, todo) => {
            if (!acc[todo.priority]) acc[todo.priority] = [];
            acc[todo.priority].push(todo);
            return acc;
        }, {});

        // Focus on high priority items first, then medium, then low
        const focusTodos = byPriority.high || byPriority.medium || byPriority.low || [];
        
        if (focusTodos.length === 0) return '';
        
        // If there's just one todo, use its content as the basis for the commit message
        if (focusTodos.length === 1) {
            const todoText = focusTodos[0].content.trim();
            // Convert to imperative mood for commit message
            const firstWord = todoText.split(' ')[0];
            if (/ed$/.test(firstWord)) {
                // If the first word ends in 'ed', convert to imperative
                return todoText.replace(/^\w+ed/, match => match.slice(0, -2));
            } else if (/ing$/.test(firstWord)) {
                // If the first word ends in 'ing', convert to imperative
                return todoText.replace(/^\w+ing/, match => match.slice(0, -3));
            } else if (/s$/.test(firstWord) && !/ss$/.test(firstWord)) {
                // If the first word ends in 's' but not 'ss', convert to singular
                return todoText.replace(/^\w+s/, match => match.slice(0, -1));
            }
            return todoText;
        }
        
        // For multiple todos, create a summary based on their common theme
        const category = this.identifyCategory(focusTodos);
        
        // Format: "Category: summary of changes"
        return `${category}: ${this.summarizeTodos(focusTodos)}`;
    }

    /**
     * Identify the category for a group of todos
     * @param {Array} todos - List of todos to categorize
     * @returns {String} Category name
     */
    identifyCategory(todos) {
        // Extract keywords from todo contents
        const keywords = todos.flatMap(todo => {
            const words = todo.content.toLowerCase().split(/\s+/);
            return words.filter(word => word.length > 3);
        });
        
        // Common development categories and associated keywords
        const categories = {
            'Documentation': ['docs', 'document', 'documentation', 'readme', 'comment', 'manual'],
            'Feature': ['feature', 'implement', 'create', 'add', 'support', 'capability'],
            'Bugfix': ['bug', 'fix', 'issue', 'problem', 'error', 'resolve'],
            'Refactor': ['refactor', 'cleanup', 'clean', 'reorganize', 'restructure', 'improve'],
            'Test': ['test', 'spec', 'coverage', 'validate', 'verify'],
            'UI': ['interface', 'design', 'style', 'layout', 'visual', 'dashboard'],
            'Data': ['data', 'metrics', 'tracking', 'analytics', 'measure'],
            'Performance': ['performance', 'optimize', 'speed', 'efficiency', 'faster'],
            'Integration': ['integrate', 'connect', 'link', 'bridge', 'communication']
        };
        
        // Count keyword matches for each category
        const categoryCounts = Object.entries(categories).reduce((counts, [category, catKeywords]) => {
            counts[category] = keywords.filter(word => catKeywords.some(kw => word.includes(kw))).length;
            return counts;
        }, {});
        
        // Find the category with the most matches
        const topCategory = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .find(([_, count]) => count > 0);
            
        return topCategory ? topCategory[0] : 'Update';
    }

    /**
     * Create a summary of multiple todos
     * @param {Array} todos - List of todos to summarize
     * @returns {String} Summary text
     */
    summarizeTodos(todos) {
        if (todos.length <= 2) {
            // For 2 or fewer todos, just join them with "and"
            return todos.map(t => t.content.toLowerCase()
                .replace(/^(add|create|implement|update|fix|refactor|improve)\s+/i, '')
                .replace(/\.$/, ''))
                .join(' and ');
        }
        
        // For 3 or more, try to find a common subject/object
        const firstTodo = todos[0].content;
        const commonElement = this.findCommonElement(todos.map(t => t.content));
        
        if (commonElement && commonElement.length > 3) {
            return `multiple improvements to ${commonElement}`;
        }
        
        // Fall back to counting
        return `${todos.length} related improvements`;
    }

    /**
     * Find common text elements across multiple strings
     * @param {Array} strings - List of strings to analyze
     * @returns {String} Common element, if found
     */
    findCommonElement(strings) {
        if (!strings || strings.length < 2) return '';
        
        // Extract nouns and objects (simplistic approach)
        const words = strings.map(s => s.toLowerCase().split(/\s+/));
        
        // Find words that appear in multiple strings
        const wordCounts = {};
        words.flat().forEach(word => {
            if (word.length > 3) { // Skip short words
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
        });
        
        // Find the most common significant word
        const commonWords = Object.entries(wordCounts)
            .filter(([word, count]) => count >= Math.ceil(strings.length / 2))
            .sort((a, b) => b[1] - a[1]);
            
        return commonWords.length > 0 ? commonWords[0][0] : '';
    }

    /**
     * Analyze commit messages to find correlations with todos
     */
    analyzeCommitMessages() {
        if (!this.commits || this.commits.length === 0) return;
        
        // Examine recent commit messages
        this.commits.slice(0, 5).forEach(commit => {
            const message = commit.commit?.message || '';
            
            // Look for completed todos that match this commit message
            const matchingTodos = this.completedTodos.filter(todo => {
                const todoText = todo.content.toLowerCase();
                const commitText = message.toLowerCase();
                
                // Check for direct keyword matches
                return todoText.split(/\s+/).some(word => 
                    word.length > 4 && commitText.includes(word)
                );
            });
            
            if (matchingTodos.length > 0) {
                // Record the correlation
                console.log(`Found correlation between commit "${message}" and todos:`, 
                    matchingTodos.map(t => t.content));
                    
                // Update meta-state to reflect the correlation
                this.recordCorrelation(commit, matchingTodos);
            }
        });
    }

    /**
     * Record a correlation between commit and todos in the meta-state
     * @param {Object} commit - Commit data
     * @param {Array} todos - Related todo items
     */
    recordCorrelation(commit, todos) {
        if (!window.metaStateManager) return;
        
        const correlationId = `corr-${commit.sha?.substring(0, 6)}`;
        const state = window.metaStateManager.getState();
        
        // Check if this correlation is already recorded
        if (state.correlations && state.correlations.some(c => c.id === correlationId)) {
            return;
        }
        
        // Record the correlation
        const correlation = {
            id: correlationId,
            type: 'commit-todo',
            commitSha: commit.sha,
            commitMessage: commit.commit?.message,
            todos: todos.map(t => ({ id: t.id, content: t.content })),
            timestamp: new Date().toISOString()
        };
        
        // Update meta-state
        window.metaStateManager.updateState({
            correlations: [...(state.correlations || []), correlation]
        });
        
        // Check if this correlation should trigger a singularity event
        this.checkCorrelationSingularity(state.correlations?.length || 0);
    }

    /**
     * Update meta-state progress based on completed todos
     * @param {Array} completedTodos - Recently completed todos
     */
    updateMetaStateProgress(completedTodos) {
        if (!window.metaStateManager || !completedTodos || completedTodos.length === 0) return;
        
        // Calculate progress increments based on todo priority
        const progressIncrements = completedTodos.reduce((total, todo) => {
            switch (todo.priority) {
                case 'high': return total + 5;
                case 'medium': return total + 3;
                case 'low': return total + 1;
                default: return total + 1;
            }
        }, 0);
        
        // Update meta-state
        window.metaStateManager.updateState({
            progress: {
                implementation: { increment: progressIncrements },
                planning: { increment: Math.ceil(progressIncrements / 2) }
            }
        });
    }

    /**
     * Check if a singularity event should be triggered based on correlations
     * @param {Number} correlationCount - Number of recorded correlations
     */
    checkCorrelationSingularity(correlationCount) {
        if (!window.metaStateManager) return;
        
        const state = window.metaStateManager.getState();
        
        // Threshold for systematic development
        if (correlationCount >= 5 && 
            !state.singularityEvents.some(e => e.id === 'systematicDevelopment')) {
            
            window.metaStateManager.triggerSingularity({
                id: 'systematicDevelopment',
                name: 'Systematic Development',
                description: 'Development follows a structured todo → implementation pattern',
                triggers: ['planning', 'implementation', 'structure'],
                bonuses: ['developmentSpeed+20%', 'codeQuality+15%']
            });
        }
    }

    /**
     * Handle singularity events
     * @param {Object} event - Singularity event data
     */
    handleSingularityEvent(event) {
        if (!event || !event.id) return;
        
        // Special handling for relevant singularity events
        if (event.id === 'systematicDevelopment') {
            // Enhance commit suggestion capabilities
            console.log('Singularity event unlocked enhanced commit suggestions');
        }
    }

    /**
     * Synchronize the overall state
     */
    synchronizeState() {
        // Request latest todos if available
        if (window.eventBus) {
            window.eventBus.publish('todos:fetch', true);
        }
        
        // Request latest GitHub metrics
        if (window.eventBus) {
            window.eventBus.publish('github:fetch', true);
        }
        
        // Use mock data in development mode
        if (this.mockMode && (!this.todos || this.todos.length === 0)) {
            this.generateMockData();
        }
    }

    /**
     * Generate mock data for development testing
     */
    generateMockData() {
        // Mock todos
        this.todos = [
            { id: 'mock1', content: 'Implement todo-commit system', status: 'completed', priority: 'high' },
            { id: 'mock2', content: 'Add GitHub metrics integration', status: 'completed', priority: 'high' },
            { id: 'mock3', content: 'Enhance meta-dashboard visualization', status: 'in_progress', priority: 'medium' },
            { id: 'mock4', content: 'Fix resource calculation bug', status: 'pending', priority: 'medium' }
        ];
        
        // Mock commits
        this.commits = [
            { 
                sha: '1234abcd', 
                commit: { 
                    message: 'Implement todo-commit integration system',
                    author: { name: 'Developer', date: new Date().toISOString() }
                }
            },
            { 
                sha: '5678efgh', 
                commit: { 
                    message: 'Add GitHub metrics collection',
                    author: { name: 'Developer', date: new Date(Date.now() - 86400000).toISOString() }
                }
            }
        ];
        
        // Process the mock data
        this.handleTodosUpdated(this.todos);
        
        // Publish mock data events
        if (window.eventBus) {
            window.eventBus.publish('todos:updated', this.todos);
            window.eventBus.publish('github:metrics:updated', { 
                commitHistory: this.commits,
                commitCount: this.commits.length
            });
        }
    }

    /**
     * Clean up resources when component is destroyed
     */
    cleanup() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
}

// Create a singleton instance
window.todoCommitSystem = new TodoCommitSystem();

// Auto-initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    window.todoCommitSystem.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.todoCommitSystem.init();
    });
}