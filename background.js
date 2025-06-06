class SynapseBackground {
  constructor() {
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.initializeStorage()
    this.setupAlarms()
  }

  setupEventListeners() {
    // Extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details)
    })

    // Tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab)
    })

    // Tab activation
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabActivation(activeInfo)
    })

    // Message handling
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse)
      return true // Keep message channel open
    })

    // Alarm handling
    chrome.alarms.onAlarm.addListener((alarm) => {
      this.handleAlarm(alarm)
    })
  }

  async initializeStorage() {
    try {
      const result = await chrome.storage.local.get([
        "isAnalyzing",
        "sessionData",
        "knowledgeGraph",
        "adaptationSettings",
        "userPreferences",
      ])

      // Set default values if not present
      const defaults = {
        isAnalyzing: true,
        sessionData: {
          attentionLevel: 80,
          learningEfficiency: 75,
          conceptsLearned: 0,
          focusDuration: 0,
          sessionTime: 0,
        },
        knowledgeGraph: {},
        adaptationSettings: {
          enableContentAdaptation: true,
          enableKnowledgeExtraction: true,
          adaptationIntensity: "medium",
          autoAdaptation: true,
        },
        userPreferences: {
          showFloatingIndicator: true,
          enableNotifications: true,
          dataRetentionDays: 30,
        },
      }

      // Merge defaults with existing data
      const mergedData = { ...defaults, ...result }
      await chrome.storage.local.set(mergedData)
    } catch (error) {
      console.error("Error initializing storage:", error)
    }
  }

  setupAlarms() {
    // Create periodic alarms for data cleanup and analysis
    chrome.alarms.create("dataCleanup", { periodInMinutes: 60 }) // Every hour
    chrome.alarms.create("sessionSummary", { periodInMinutes: 30 }) // Every 30 minutes
  }

  async handleInstallation(details) {
    if (details.reason === "install") {
      // First time installation
      await this.showWelcomeNotification()
      await this.openOnboardingPage()
    } else if (details.reason === "update") {
      // Extension update
      await this.handleUpdate(details.previousVersion)
    }
  }

  async showWelcomeNotification() {
    try {
      await chrome.notifications.create("welcome", {
        type: "basic",
        iconUrl: "icons/icon-48.png",
        title: "Welcome to Synapse!",
        message: "Your cognitive learning acceleration is now active. Click the extension icon to get started.",
      })
    } catch (error) {
      console.log("Notifications not available")
    }
  }

  async openOnboardingPage() {
    try {
      await chrome.tabs.create({
        url: chrome.runtime.getURL("options.html?onboarding=true"),
      })
    } catch (error) {
      console.error("Error opening onboarding page:", error)
    }
  }

  async handleUpdate(previousVersion) {
    // Handle extension updates
    console.log(`Updated from version ${previousVersion}`)

    // Migrate data if necessary
    await this.migrateData(previousVersion)
  }

  async migrateData(previousVersion) {
    // Data migration logic for different versions
    try {
      const result = await chrome.storage.local.get()

      // Example migration for version 1.0.0
      if (previousVersion < "1.0.0") {
        // Migrate old data structure
        if (result.oldDataStructure) {
          // Convert old data to new format
          delete result.oldDataStructure
          await chrome.storage.local.set(result)
        }
      }
    } catch (error) {
      console.error("Error migrating data:", error)
    }
  }

  async handleTabUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.url) {
      // Tab finished loading
      await this.initializeTabSession(tabId, tab)
    }
  }

  async handleTabActivation(activeInfo) {
    // User switched to a different tab
    await this.updateActiveSession(activeInfo.tabId)
  }

  async initializeTabSession(tabId, tab) {
    try {
      // Skip non-http(s) pages
      if (!tab.url.startsWith("http")) return

      // Initialize session data for this tab
      const sessionData = {
        tabId: tabId,
        url: tab.url,
        title: tab.title,
        startTime: Date.now(),
        lastActivity: Date.now(),
      }

      // Store session data
      const result = await chrome.storage.local.get(["activeSessions"])
      const activeSessions = result.activeSessions || {}
      activeSessions[tabId] = sessionData

      await chrome.storage.local.set({ activeSessions })
    } catch (error) {
      console.error("Error initializing tab session:", error)
    }
  }

  async updateActiveSession(tabId) {
    try {
      const result = await chrome.storage.local.get(["activeSessions"])
      const activeSessions = result.activeSessions || {}

      if (activeSessions[tabId]) {
        activeSessions[tabId].lastActivity = Date.now()
        await chrome.storage.local.set({ activeSessions })
      }
    } catch (error) {
      console.error("Error updating active session:", error)
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case "getSessionData":
          const sessionData = await this.getSessionData()
          sendResponse({ success: true, data: sessionData })
          break

        case "updateKnowledgeGraph":
          await this.updateKnowledgeGraph(request.data)
          sendResponse({ success: true })
          break

        case "exportData":
          const exportData = await this.exportUserData()
          sendResponse({ success: true, data: exportData })
          break

        case "clearData":
          await this.clearUserData()
          sendResponse({ success: true })
          break

        default:
          sendResponse({ error: "Unknown action" })
      }
    } catch (error) {
      console.error("Error handling message:", error)
      sendResponse({ error: error.message })
    }
  }

  async handleAlarm(alarm) {
    switch (alarm.name) {
      case "dataCleanup":
        await this.performDataCleanup()
        break

      case "sessionSummary":
        await this.generateSessionSummary()
        break
    }
  }

  async getSessionData() {
    try {
      const result = await chrome.storage.local.get(["sessionData", "activeSessions", "knowledgeGraph"])

      return {
        sessionData: result.sessionData || {},
        activeSessions: result.activeSessions || {},
        knowledgeGraph: result.knowledgeGraph || {},
      }
    } catch (error) {
      console.error("Error getting session data:", error)
      return {}
    }
  }

  async updateKnowledgeGraph(data) {
    try {
      const result = await chrome.storage.local.get(["knowledgeGraph"])
      const knowledgeGraph = result.knowledgeGraph || {}

      // Merge new data with existing knowledge graph
      Object.assign(knowledgeGraph, data)

      await chrome.storage.local.set({ knowledgeGraph })
    } catch (error) {
      console.error("Error updating knowledge graph:", error)
    }
  }

  async performDataCleanup() {
    try {
      const result = await chrome.storage.local.get(["userPreferences", "knowledgeGraph", "activeSessions"])
      const retentionDays = result.userPreferences?.dataRetentionDays || 30
      const cutoffTime = Date.now() - retentionDays * 24 * 60 * 60 * 1000

      // Clean old knowledge graph entries
      const knowledgeGraph = result.knowledgeGraph || {}
      Object.keys(knowledgeGraph).forEach((url) => {
        if (knowledgeGraph[url].lastVisit < cutoffTime) {
          delete knowledgeGraph[url]
        }
      })

      // Clean old session data
      const activeSessions = result.activeSessions || {}
      Object.keys(activeSessions).forEach((tabId) => {
        if (activeSessions[tabId].lastActivity < cutoffTime) {
          delete activeSessions[tabId]
        }
      })

      await chrome.storage.local.set({ knowledgeGraph, activeSessions })
      console.log("Data cleanup completed")
    } catch (error) {
      console.error("Error during data cleanup:", error)
    }
  }

  async generateSessionSummary() {
    try {
      const result = await chrome.storage.local.get(["sessionData", "knowledgeGraph"])
      const sessionData = result.sessionData || {}
      const knowledgeGraph = result.knowledgeGraph || {}

      // Generate summary statistics
      const summary = {
        totalConcepts: Object.values(knowledgeGraph).reduce((sum, page) => sum + page.concepts.length, 0),
        totalPages: Object.keys(knowledgeGraph).length,
        sessionTime: sessionData.sessionTime || 0,
        attentionLevel: sessionData.attentionLevel || 0,
        learningEfficiency: sessionData.learningEfficiency || 0,
        timestamp: Date.now(),
      }

      // Store summary for analytics
      const summaries = result.sessionSummaries || []
      summaries.push(summary)

      // Keep only last 30 summaries
      if (summaries.length > 30) {
        summaries.splice(0, summaries.length - 30)
      }

      await chrome.storage.local.set({ sessionSummaries: summaries })
      console.log("Session summary generated:", summary)
    } catch (error) {
      console.error("Error generating session summary:", error)
    }
  }

  async exportUserData() {
    try {
      const result = await chrome.storage.local.get()

      // Remove sensitive or temporary data
      const exportData = { ...result }
      delete exportData.activeSessions

      return {
        exportDate: new Date().toISOString(),
        version: chrome.runtime.getManifest().version,
        data: exportData,
      }
    } catch (error) {
      console.error("Error exporting user data:", error)
      return null
    }
  }

  async clearUserData() {
    try {
      await chrome.storage.local.clear()
      await this.initializeStorage()
      console.log("User data cleared and reinitialized")
    } catch (error) {
      console.error("Error clearing user data:", error)
    }
  }
}

// Initialize background service
new SynapseBackground()
