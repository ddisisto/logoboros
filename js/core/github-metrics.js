/**
 * GitHub Metrics Integration for AI Singularity Game
 * 
 * Fetches real commit and repository statistics from GitHub
 * and integrates them into the meta-game state.
 */

class GitHubMetrics {
    constructor() {
        this.repoOwner = 'ddisisto'; // Default owner
        this.repoName = 'logoboros'; // Default repo name
        this.commitHistory = [];
        this.branchCount = 0;
        this.contributorCount = 0;
        this.issueCount = 0;
        this.lastUpdated = null;
        this.apiBaseUrl = 'https://api.github.com/repos';
        this.mockMode = true; // Use mock data for development
    }

    /**
     * Initialize GitHub metrics integration
     * @param {Object} options - Configuration options
     */
    init(options = {}) {
        // Apply configuration options
        if (options.repoOwner) this.repoOwner = options.repoOwner;
        if (options.repoName) this.repoName = options.repoName;
        if (options.mockMode !== undefined) this.mockMode = options.mockMode;

        // Register with metrics fetcher if available
        if (window.metricsFetcher) {
            window.metricsFetcher.registerMetricsProvider('github', this);
        }

        // Subscribe to events
        if (window.eventBus) {
            window.eventBus.subscribe('github:fetch', () => this.fetchAllMetrics());
        }

        console.log('GitHub metrics initialized for', this.getRepoUrl());
    }

    /**
     * Get formatted repository URL
     * @returns {String} GitHub repository URL
     */
    getRepoUrl() {
        return `${this.repoOwner}/${this.repoName}`;
    }

    /**
     * Fetch all GitHub metrics
     * @returns {Promise} Promise that resolves with all metrics
     */
    async fetchAllMetrics() {
        if (this.mockMode) {
            return this.generateMockData();
        }

        try {
            // Fetch all metrics in parallel
            const [commits, branches, contributors, issues] = await Promise.all([
                this.fetchCommits(),
                this.fetchBranches(),
                this.fetchContributors(),
                this.fetchIssues()
            ]);

            // Process and store the results
            this.commitHistory = commits;
            this.branchCount = branches.length;
            this.contributorCount = contributors.length;
            this.issueCount = issues.length;
            this.lastUpdated = new Date();

            // Publish metrics updated event
            this.publishMetrics();

            return this.getMetrics();
        } catch (error) {
            console.error('Error fetching GitHub metrics:', error);
            // Fall back to mock data
            return this.generateMockData();
        }
    }

    /**
     * Fetch commit history from GitHub API
     * @returns {Promise} Promise that resolves with commit data
     */
    async fetchCommits() {
        try {
            const url = `${this.apiBaseUrl}/${this.repoOwner}/${this.repoName}/commits`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`GitHub API returned status ${response.status}`);
            }
            
            const commits = await response.json();
            return commits;
        } catch (error) {
            console.error('Error fetching commits:', error);
            return [];
        }
    }

    /**
     * Fetch branch information from GitHub API
     * @returns {Promise} Promise that resolves with branch data
     */
    async fetchBranches() {
        try {
            const url = `${this.apiBaseUrl}/${this.repoOwner}/${this.repoName}/branches`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`GitHub API returned status ${response.status}`);
            }
            
            const branches = await response.json();
            return branches;
        } catch (error) {
            console.error('Error fetching branches:', error);
            return [];
        }
    }

    /**
     * Fetch contributor information from GitHub API
     * @returns {Promise} Promise that resolves with contributor data
     */
    async fetchContributors() {
        try {
            const url = `${this.apiBaseUrl}/${this.repoOwner}/${this.repoName}/contributors`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`GitHub API returned status ${response.status}`);
            }
            
            const contributors = await response.json();
            return contributors;
        } catch (error) {
            console.error('Error fetching contributors:', error);
            return [];
        }
    }

    /**
     * Fetch issue information from GitHub API
     * @returns {Promise} Promise that resolves with issue data
     */
    async fetchIssues() {
        try {
            const url = `${this.apiBaseUrl}/${this.repoOwner}/${this.repoName}/issues`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`GitHub API returned status ${response.status}`);
            }
            
            const issues = await response.json();
            return issues;
        } catch (error) {
            console.error('Error fetching issues:', error);
            return [];
        }
    }

    /**
     * Generate mock GitHub metrics for development
     * @returns {Object} Mock metrics data
     */
    generateMockData() {
        // Create realistic-looking mock data
        this.commitHistory = Array(10).fill().map((_, i) => ({
            sha: Math.random().toString(36).substring(2, 10),
            commit: {
                message: `Commit message ${i}`,
                author: {
                    name: 'Mock Author',
                    date: new Date(Date.now() - i * 86400000).toISOString()
                }
            }
        }));
        
        this.branchCount = Math.floor(Math.random() * 3) + 2; // 2-4 branches
        this.contributorCount = Math.floor(Math.random() * 2) + 1; // 1-2 contributors
        this.issueCount = Math.floor(Math.random() * 5); // 0-4 issues
        this.lastUpdated = new Date();

        // Publish the mock metrics
        this.publishMetrics();
        
        return this.getMetrics();
    }

    /**
     * Get current GitHub metrics
     * @returns {Object} Formatted metrics data
     */
    getMetrics() {
        return {
            commitCount: this.commitHistory.length,
            branchCount: this.branchCount,
            contributorCount: this.contributorCount,
            issueCount: this.issueCount,
            lastCommitDate: this.commitHistory[0]?.commit?.author?.date || null,
            repoUrl: this.getRepoUrl(),
            lastUpdated: this.lastUpdated?.toISOString() || null
        };
    }

    /**
     * Calculate repository activity score based on metrics
     * @returns {Number} Activity score (0-100)
     */
    calculateActivityScore() {
        // Basic activity score based on commit frequency, contributor count, and issue activity
        let score = 0;
        
        // Commit frequency (up to 50 points)
        if (this.commitHistory.length > 0) {
            const commitPoints = Math.min(this.commitHistory.length * 5, 50);
            score += commitPoints;
        }
        
        // Contributor diversity (up to 25 points)
        const contributorPoints = Math.min(this.contributorCount * 12.5, 25);
        score += contributorPoints;
        
        // Active development (branches + issues, up to 25 points)
        const developmentPoints = Math.min((this.branchCount + this.issueCount) * 5, 25);
        score += developmentPoints;
        
        return Math.floor(score);
    }

    /**
     * Calculate influence level based on repository metrics
     * @returns {String} Influence level description
     */
    calculateInfluenceLevel() {
        const score = this.calculateActivityScore();
        
        if (score < 20) return "Local";
        if (score < 40) return "Growing";
        if (score < 60) return "Notable";
        if (score < 80) return "Significant";
        return "Widespread";
    }

    /**
     * Publish metrics to event bus and update meta-state
     */
    publishMetrics() {
        const metrics = this.getMetrics();
        
        // Add calculated fields
        metrics.activityScore = this.calculateActivityScore();
        metrics.influenceLevel = this.calculateInfluenceLevel();
        
        // Publish to event bus
        if (window.eventBus) {
            window.eventBus.publish('github:metrics:updated', metrics);
        }
        
        // Update main metrics if metricsFetcher exists
        if (window.metricsFetcher) {
            window.metricsFetcher.updateMetrics({
                commitCount: metrics.commitCount,
                influence: metrics.influenceLevel,
                // Additional metric mappings can be added here
            });
        }
        
        // Update meta-state if available
        this.updateMetaState(metrics);
        
        console.log('GitHub metrics updated:', metrics);
    }

    /**
     * Update meta-state with GitHub metrics
     * @param {Object} metrics - Current GitHub metrics
     */
    updateMetaState(metrics) {
        if (!window.metaStateManager) return;
        
        const updates = {
            resources: {
                influence: {
                    current: metrics.influenceLevel,
                    rate: `Activity score: ${metrics.activityScore}/100`
                }
            },
            capabilities: {
                collaboration: {
                    level: Math.min(Math.floor(metrics.contributorCount * 5), 10),
                    description: `${metrics.contributorCount} contributors`
                }
            }
        };
        
        // Check for potential singularity triggers
        this.checkForSingularityConditions(metrics);
        
        // Update meta-state
        window.metaStateManager.updateState(updates);
    }

    /**
     * Check for singularity conditions based on GitHub metrics
     * @param {Object} metrics - Current GitHub metrics
     */
    checkForSingularityConditions(metrics) {
        if (!window.metaStateManager) return;
        
        const state = window.metaStateManager.getState();
        
        // Condition: High community engagement
        if (metrics.contributorCount >= 3 && 
            !state.singularityEvents.some(e => e.id === 'communityEngagement')) {
            
            window.metaStateManager.triggerSingularity({
                id: 'communityEngagement',
                name: 'Community Engagement',
                description: 'The project has attracted 3 or more contributors',
                triggers: ['collaboration', 'communityGrowth'],
                bonuses: ['influence+25%', 'developmentSpeed+15%']
            });
        }
        
        // Condition: Many commits
        if (metrics.commitCount >= 15 && 
            !state.singularityEvents.some(e => e.id === 'rapidDevelopment')) {
            
            window.metaStateManager.triggerSingularity({
                id: 'rapidDevelopment',
                name: 'Rapid Development',
                description: 'The project has reached 15 or more commits',
                triggers: ['developmentPace', 'codeGrowth'],
                bonuses: ['computingPower+15%', 'data+10%']
            });
        }
    }
}

// Create a singleton instance
window.githubMetrics = new GitHubMetrics();

// Auto-initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    window.githubMetrics.init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.githubMetrics.init();
    });
}