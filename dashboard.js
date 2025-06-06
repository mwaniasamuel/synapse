class SynapseDashboard {
    constructor() {
        this.knowledgeGraph = {};
        this.sessionData = {};
        this.selectedConcept = null;
        this.graphNodes = [];
        this.graphEdges = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateStatistics();
        this.renderKnowledgeGraph();
        this.renderRecentActivity();
    }

    async loadData() {
        try {
            const result = await chrome.storage.local.get([
                'knowledgeGraph',
                'sessionData',
                'sessionSummaries',
                'activeSessions'
            ]);

            this.knowledgeGraph = result.knowledgeGraph || {};
            this.sessionData = result.sessionData || {};
            this.sessionSummaries = result.sessionSummaries || [];
            this.activeSessions = result.activeSessions || {};
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    setupEventListeners() {
        // Header actions
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });

        // Graph controls
        document.getElementById('resetZoom').addEventListener('click', () => {
            this.resetGraphView();
        });

        document.getElementById('centerGraph').addEventListener('click', () => {
            this.centerGraph();
        });

        // Activity controls
        document.getElementById('clearActivity').addEventListener('click', () => {
            this.clearActivity();
        });

        // Details panel
        document.getElementById('closePanel').addEventListener('click', () => {
            this.closeDetailsPanel();
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.renderKnowledgeGraph();
        });
    }

    updateStatistics() {
        const totalConcepts = this.calculateTotalConcepts();
        const totalConnections = this.calculateTotalConnections();
        const totalPages = Object.keys(this.knowledgeGraph).length;
        const totalTime = this.calculateTotalTime();

        document.getElementById('totalConcepts').textContent = totalConcepts;
        document.getElementById('totalConnections').textContent = totalConnections;
        document.getElementById('totalPages').textContent = totalPages;
        document.getElementById('totalTime').textContent = this.formatTime(totalTime);
    }

    calculateTotalConcepts() {
        return Object.values(this.knowledgeGraph).reduce((sum, page) => {
            return sum + (page.concepts ? page.concepts.length : 0);
        }, 0);
    }

    calculateTotalConnections() {
        const allConcepts = [];
        Object.values(this.knowledgeGraph).forEach(page => {
            if (page.concepts) {
                allConcepts.push(...page.concepts);
            }
        });

        const conceptCounts = {};
        allConcepts.forEach(concept => {
            conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;
        });

        return Object.values(conceptCounts).filter(count => count > 1).length;
    }

    calculateTotalTime() {
        return this.sessionSummaries.reduce((sum, summary) => {
            return sum + (summary.sessionTime || 0);
        }, 0);
    }

    formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60\
