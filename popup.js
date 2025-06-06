class SynapsePopup {
  constructor() {
    this.cognitiveState = "focused"
    this.isAnalyzing = true
    this.sessionStartTime = Date.now()
    this.init()
  }

  async init() {
    await this.loadStoredData()
    this.setupEventListeners()
    this.startRealTimeUpdates()
    this.updateDisplay()
  }

  async loadStoredData() {
    try {
      const result = await chrome.storage.local.get([
        "cognitiveState",
        "sessionData",
        "isAnalyzing",
        "sessionStartTime",
      ])

      this.cognitiveState = result.cognitiveState || "focused"
      this.isAnalyzing = result.isAnalyzing !== false
      this.sessionStartTime = result.sessionStartTime || Date.now()
      this.sessionData = result.sessionData || {
        attentionLevel: 80,
        learningEfficiency: 75,
        conceptsLearned: 7,
        focusDuration: 0,
      }
    } catch (error) {
      console.error("Error loading stored data:", error)
    }
  }

  setupEventListeners() {
    // Adapt Content button
    document.getElementById("adaptContentBtn").addEventListener("click", () => {
      this.adaptContent()
    })

    // Knowledge Map button
    document.getElementById("viewKnowledgeBtn").addEventListener("click", () => {
      this.openKnowledgeMap()
    })

    // Pause/Resume button
    document.getElementById("pauseBtn").addEventListener("click", () => {
      this.toggleAnalysis()
    })

    // Settings button
    document.getElementById("settingsBtn").addEventListener("click", () => {
      this.openSettings()
    })
  }

  startRealTimeUpdates() {
    // Update every 5 seconds
    setInterval(() => {
      this.updateCognitiveState()
      this.updateSessionTime()
      this.updateDisplay()
    }, 5000)

    // Update session time every second
    setInterval(() => {
      this.updateSessionTime()
      this.updateSessionDisplay()
    }, 1000)
  }

  async updateCognitiveState() {
    if (!this.isAnalyzing) return

    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      // Send message to content script to get interaction data
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "getCognitiveData",
      })

      if (response && response.cognitiveState) {
        this.cognitiveState = response.cognitiveState
        this.sessionData = { ...this.sessionData, ...response.metrics }

        // Store updated data
        await chrome.storage.local.set({
          cognitiveState: this.cognitiveState,
          sessionData: this.sessionData,
        })
      }
    } catch (error) {
      console.log("Content script not available on this page")
    }
  }

  updateSessionTime() {
    const now = Date.now()
    const sessionDuration = now - this.sessionStartTime
    this.sessionData.sessionTime = sessionDuration
  }

  updateDisplay() {
    this.updateStatusIndicator()
    this.updateCognitiveStateDisplay()
    this.updateMetrics()
    this.updateSessionDisplay()
    this.updateControls()
  }

  updateStatusIndicator() {
    const statusText = document.getElementById("statusText")
    const statusDot = document.querySelector(".status-dot")

    if (this.isAnalyzing) {
      statusText.textContent = "Analyzing"
      statusDot.style.background = "#10b981"
    } else {
      statusText.textContent = "Paused"
      statusDot.style.background = "#f59e0b"
    }
  }

  updateCognitiveStateDisplay() {
    const stateElement = document.getElementById("cognitiveState")
    const stateText = document.getElementById("stateText")
    const confidence = document.getElementById("confidence")

    // Remove existing state classes
    stateElement.className = "state-badge"

    // Add current state class
    stateElement.classList.add(this.cognitiveState)

    // Update text
    const stateNames = {
      focused: "Focused",
      fatigued: "Fatigued",
      distracted: "Distracted",
      receptive: "Receptive",
    }

    stateText.textContent = stateNames[this.cognitiveState] || "Unknown"

    // Update confidence (simulate varying confidence)
    const confidenceValue = Math.floor(Math.random() * 20) + 75 // 75-95%
    confidence.textContent = `${confidenceValue}%`
  }

  updateMetrics() {
    // Update attention level
    const attentionFill = document.getElementById("attentionLevel")
    const attentionValue = document.getElementById("attentionValue")
    attentionFill.style.width = `${this.sessionData.attentionLevel}%`
    attentionValue.textContent = `${this.sessionData.attentionLevel}%`

    // Update learning efficiency
    const efficiencyFill = document.getElementById("learningEfficiency")
    const efficiencyValue = document.getElementById("efficiencyValue")
    efficiencyFill.style.width = `${this.sessionData.learningEfficiency}%`
    efficiencyValue.textContent = `${this.sessionData.learningEfficiency}%`

    // Update focus duration
    const focusDuration = document.getElementById("focusDuration")
    focusDuration.textContent = this.formatDuration(this.sessionData.focusDuration || 0)
  }

  updateSessionDisplay() {
    const sessionTime = document.getElementById("sessionTime")
    const conceptsLearned = document.getElementById("conceptsLearned")

    sessionTime.textContent = this.formatDuration(this.sessionData.sessionTime || 0)
    conceptsLearned.textContent = this.sessionData.conceptsLearned || 0
  }

  updateControls() {
    const pauseBtn = document.getElementById("pauseBtn")
    const pauseIcon = pauseBtn.querySelector(".btn-icon")
    const pauseText = pauseBtn.querySelector("span:last-child")

    if (this.isAnalyzing) {
      pauseIcon.textContent = "⏸️"
      pauseText.textContent = "Pause Analysis"
    } else {
      pauseIcon.textContent = "▶️"
      pauseText.textContent = "Resume Analysis"
    }
  }

  async adaptContent() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      await chrome.tabs.sendMessage(tab.id, {
        action: "adaptContent",
        cognitiveState: this.cognitiveState,
      })

      // Show feedback
      this.showNotification("Content adapted for your current cognitive state")
    } catch (error) {
      this.showNotification("Content adaptation not available on this page", "error")
    }
  }

  async openKnowledgeMap() {
    try {
      // Open dashboard in new tab
      await chrome.tabs.create({
        url: chrome.runtime.getURL("dashboard.html"),
      })
    } catch (error) {
      console.error("Error opening knowledge map:", error)
    }
  }

  async toggleAnalysis() {
    this.isAnalyzing = !this.isAnalyzing

    try {
      await chrome.storage.local.set({ isAnalyzing: this.isAnalyzing })

      // Notify content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      await chrome.tabs.sendMessage(tab.id, {
        action: "toggleAnalysis",
        isAnalyzing: this.isAnalyzing,
      })
    } catch (error) {
      console.log("Content script not available")
    }

    this.updateDisplay()
  }

  openSettings() {
    chrome.runtime.openOptionsPage()
  }

  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    } else {
      return `${remainingSeconds}s`
    }
  }

  showNotification(message, type = "success") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message
    notification.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === "error" ? "#ef4444" : "#10b981"};
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `

    document.body.appendChild(notification)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SynapsePopup()
})
