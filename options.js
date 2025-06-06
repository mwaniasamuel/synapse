class SynapseOptions {
  constructor() {
    this.settings = {}
    this.init()
  }

  async init() {
    await this.loadSettings()
    this.setupEventListeners()
    this.updateDisplay()
    this.handleOnboarding()
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get([
        "isAnalyzing",
        "adaptationSettings",
        "userPreferences",
        "knowledgeGraph",
        "sessionSummaries",
      ])

      this.settings = {
        isAnalyzing: result.isAnalyzing !== false,
        adaptationSettings: result.adaptationSettings || {
          enableContentAdaptation: true,
          enableKnowledgeExtraction: true,
          adaptationIntensity: "medium",
          autoAdaptation: true,
        },
        userPreferences: result.userPreferences || {
          showFloatingIndicator: true,
          enableNotifications: true,
          dataRetentionDays: 30,
          autoStartSessions: "educational",
        },
        knowledgeGraph: result.knowledgeGraph || {},
        sessionSummaries: result.sessionSummaries || [],
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.switchSection(e.target.dataset.section)
      })
    })

    // General Settings
    document.getElementById("enableAnalysis").addEventListener("change", (e) => {
      this.updateSetting("isAnalyzing", e.target.checked)
    })

    document.getElementById("showIndicator").addEventListener("change", (e) => {
      this.updateSetting("userPreferences.showFloatingIndicator", e.target.checked)
    })

    document.getElementById("enableNotifications").addEventListener("change", (e) => {
      this.updateSetting("userPreferences.enableNotifications", e.target.checked)
    })

    document.getElementById("autoStartSessions").addEventListener("change", (e) => {
      this.updateSetting("userPreferences.autoStartSessions", e.target.value)
    })

    // Adaptation Settings
    document.getElementById("enableContentAdaptation").addEventListener("change", (e) => {
      this.updateSetting("adaptationSettings.enableContentAdaptation", e.target.checked)
    })

    document.getElementById("autoAdaptation").addEventListener("change", (e) => {
      this.updateSetting("adaptationSettings.autoAdaptation", e.target.checked)
    })

    document.getElementById("adaptationIntensity").addEventListener("change", (e) => {
      this.updateSetting("adaptationSettings.adaptationIntensity", e.target.value)
    })

    // Knowledge Settings
    document.getElementById("enableKnowledgeExtraction").addEventListener("change", (e) => {
      this.updateSetting("adaptationSettings.enableKnowledgeExtraction", e.target.checked)
    })

    document.getElementById("enableConceptHighlighting").addEventListener("change", (e) => {
      this.updateSetting("adaptationSettings.enableConceptHighlighting", e.target.checked)
    })

    // Privacy Settings
    document.getElementById("dataRetention").addEventListener("change", (e) => {
      this.updateSetting("userPreferences.dataRetentionDays", Number.parseInt(e.target.value))
    })

    // Action Buttons
    document.getElementById("viewKnowledgeGraph").addEventListener("click", () => {
      this.openKnowledgeGraph()
    })

    document.getElementById("exportKnowledge").addEventListener("click", () => {
      this.exportKnowledgeData()
    })

    document.getElementById("exportData").addEventListener("click", () => {
      this.exportAllData()
    })

    document.getElementById("importData").addEventListener("click", () => {
      this.importData()
    })

    document.getElementById("clearAllData").addEventListener("click", () => {
      this.clearAllData()
    })

    // About Actions
    document.getElementById("viewChangelog").addEventListener("click", () => {
      this.viewChangelog()
    })

    document.getElementById("reportIssue").addEventListener("click", () => {
      this.reportIssue()
    })

    document.getElementById("rateExtension").addEventListener("click", () => {
      this.rateExtension()
    })
  }

  switchSection(sectionId) {
    // Update navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-section="${sectionId}"]`).classList.add("active")

    // Update content
    document.querySelectorAll(".settings-section").forEach((section) => {
      section.classList.remove("active")
    })
    document.getElementById(sectionId).classList.add("active")
  }

  async updateSetting(path, value) {
    try {
      // Update local settings object
      this.setNestedProperty(this.settings, path, value)

      // Save to storage
      await chrome.storage.local.set(this.settings)

      // Show save indicator
      this.showSaveIndicator()

      // Update display if needed
      this.updateDisplay()
    } catch (error) {
      console.error("Error updating setting:", error)
    }
  }

  setNestedProperty(obj, path, value) {
    const keys = path.split(".")
    let current = obj

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
  }

  updateDisplay() {
    // Update form values
    document.getElementById("enableAnalysis").checked = this.settings.isAnalyzing
    document.getElementById("showIndicator").checked = this.settings.userPreferences.showFloatingIndicator
    document.getElementById("enableNotifications").checked = this.settings.userPreferences.enableNotifications
    document.getElementById("autoStartSessions").value = this.settings.userPreferences.autoStartSessions

    document.getElementById("enableContentAdaptation").checked =
      this.settings.adaptationSettings.enableContentAdaptation
    document.getElementById("autoAdaptation").checked = this.settings.adaptationSettings.autoAdaptation
    document.getElementById("adaptationIntensity").value = this.settings.adaptationSettings.adaptationIntensity

    document.getElementById("enableKnowledgeExtraction").checked =
      this.settings.adaptationSettings.enableKnowledgeExtraction
    document.getElementById("enableConceptHighlighting").checked =
      this.settings.adaptationSettings.enableConceptHighlighting || false

    document.getElementById("dataRetention").value = this.settings.userPreferences.dataRetentionDays

    // Update statistics
    this.updateStatistics()
  }

  updateStatistics() {
    const knowledgeGraph = this.settings.knowledgeGraph

    // Calculate knowledge stats
    const totalConcepts = Object.values(knowledgeGraph).reduce((sum, page) => sum + (page.concepts?.length || 0), 0)
    const totalPages = Object.keys(knowledgeGraph).length
    const totalConnections = this.calculateConnections(knowledgeGraph)

    document.getElementById("totalConcepts").textContent = totalConcepts
    document.getElementById("totalConnections").textContent = totalConnections
    document.getElementById("totalPages").textContent = totalPages

    // Calculate data size
    const dataSize = this.calculateDataSize()
    document.getElementById("dataSize").textContent = this.formatBytes(dataSize)

    // Last backup info
    const lastBackup = localStorage.getItem("lastBackup")
    document.getElementById("lastBackup").textContent = lastBackup ? new Date(lastBackup).toLocaleDateString() : "Never"
  }

  calculateConnections(knowledgeGraph) {
    const allConcepts = []
    Object.values(knowledgeGraph).forEach((page) => {
      if (page.concepts) {
        allConcepts.push(...page.concepts)
      }
    })

    // Count concept overlaps as connections
    const conceptCounts = {}
    allConcepts.forEach((concept) => {
      conceptCounts[concept] = (conceptCounts[concept] || 0) + 1
    })

    return Object.values(conceptCounts).filter((count) => count > 1).length
  }

  calculateDataSize() {
    const dataString = JSON.stringify(this.settings)
    return new Blob([dataString]).size
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  showSaveIndicator() {
    const indicator = document.getElementById("saveIndicator")
    indicator.classList.add("show")

    setTimeout(() => {
      indicator.classList.remove("show")
    }, 2000)
  }

  async openKnowledgeGraph() {
    try {
      await chrome.tabs.create({
        url: chrome.runtime.getURL("dashboard.html"),
      })
    } catch (error) {
      console.error("Error opening knowledge graph:", error)
    }
  }

  async exportKnowledgeData() {
    try {
      const knowledgeData = {
        knowledgeGraph: this.settings.knowledgeGraph,
        exportDate: new Date().toISOString(),
        version: chrome.runtime.getManifest().version,
      }

      this.downloadJSON(knowledgeData, "synapse-knowledge-export.json")
    } catch (error) {
      console.error("Error exporting knowledge data:", error)
    }
  }

  async exportAllData() {
    try {
      const response = await chrome.runtime.sendMessage({ action: "exportData" })

      if (response.success) {
        this.downloadJSON(response.data, "synapse-full-export.json")
        localStorage.setItem("lastBackup", Date.now().toString())
        this.updateStatistics()
      }
    } catch (error) {
      console.error("Error exporting all data:", error)
    }
  }

  importData() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (this.validateImportData(data)) {
          await this.processImportData(data)
          alert("Data imported successfully!")
          location.reload()
        } else {
          alert("Invalid data format. Please check your export file.")
        }
      } catch (error) {
        console.error("Error importing data:", error)
        alert("Error importing data. Please check the file format.")
      }
    }

    input.click()
  }

  validateImportData(data) {
    // Basic validation of import data structure
    return data && (data.knowledgeGraph || data.data)
  }

  async processImportData(data) {
    try {
      let importData = data

      // Handle full export format
      if (data.data) {
        importData = data.data
      }

      // Merge with existing data
      const currentData = await chrome.storage.local.get()
      const mergedData = { ...currentData, ...importData }

      await chrome.storage.local.set(mergedData)
      this.settings = mergedData
    } catch (error) {
      console.error("Error processing import data:", error)
      throw error
    }
  }

  async clearAllData() {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      try {
        await chrome.runtime.sendMessage({ action: "clearData" })
        alert("All data has been cleared.")
        location.reload()
      } catch (error) {
        console.error("Error clearing data:", error)
        alert("Error clearing data. Please try again.")
      }
    }
  }

  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()

    URL.revokeObjectURL(url)
  }

  viewChangelog() {
    const changelogUrl = "https://github.com/synapse-extension/releases"
    chrome.tabs.create({ url: changelogUrl })
  }

  reportIssue() {
    const issueUrl = "https://github.com/synapse-extension/issues"
    chrome.tabs.create({ url: issueUrl })
  }

  rateExtension() {
    const storeUrl = "https://chrome.google.com/webstore/detail/synapse-cognitive-learning/"
    chrome.tabs.create({ url: storeUrl })
  }

  handleOnboarding() {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("onboarding") === "true") {
      this.showOnboardingWelcome()
    }
  }

  showOnboardingWelcome() {
    // Create welcome overlay
    const overlay = document.createElement("div")
    overlay.innerHTML = `
            <div class="onboarding-overlay">
                <div class="onboarding-content">
                    <h2>Welcome to Synapse! 🧠</h2>
                    <p>Your cognitive learning acceleration platform is ready to enhance your digital learning experience.</p>
                    <div class="onboarding-features">
                        <div class="feature-item">
                            <span class="feature-icon">🎯</span>
                            <span>Real-time cognitive state detection</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">📚</span>
                            <span>Adaptive content presentation</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🗺️</span>
                            <span>Personal knowledge mapping</span>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">
                        Get Started
                    </button>
                </div>
            </div>
        `

    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `

    const content = overlay.querySelector(".onboarding-content")
    content.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 16px;
            max-width: 500px;
            text-align: center;
        `

    document.body.appendChild(overlay)
  }
}

// Initialize options page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SynapseOptions()
})
