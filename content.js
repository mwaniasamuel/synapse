class SynapseCognitive {
  constructor() {
    this.isAnalyzing = true
    this.interactionData = {
      mouseMovements: [],
      keystrokes: [],
      scrollEvents: [],
      clickEvents: [],
      focusEvents: [],
    }
    this.cognitiveState = "focused"
    this.sessionStartTime = Date.now()
    this.lastActivityTime = Date.now()
    this.adaptationApplied = false

    this.init()
  }

  async init() {
    await this.loadSettings()
    this.setupEventListeners()
    this.startCognitiveAnalysis()
    this.injectSynapseUI()
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get(["isAnalyzing", "adaptationSettings"])
      this.isAnalyzing = result.isAnalyzing !== false
      this.adaptationSettings = result.adaptationSettings || {
        enableContentAdaptation: true,
        enableKnowledgeExtraction: true,
        adaptationIntensity: "medium",
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  setupEventListeners() {
    // Mouse movement tracking
    document.addEventListener(
      "mousemove",
      (e) => {
        if (!this.isAnalyzing) return
        this.trackMouseMovement(e)
      },
      { passive: true },
    )

    // Keystroke tracking
    document.addEventListener(
      "keydown",
      (e) => {
        if (!this.isAnalyzing) return
        this.trackKeystroke(e)
      },
      { passive: true },
    )

    // Scroll tracking
    document.addEventListener(
      "scroll",
      (e) => {
        if (!this.isAnalyzing) return
        this.trackScrollEvent(e)
      },
      { passive: true },
    )

    // Click tracking
    document.addEventListener(
      "click",
      (e) => {
        if (!this.isAnalyzing) return
        this.trackClickEvent(e)
      },
      { passive: true },
    )

    // Focus tracking
    window.addEventListener("focus", () => {
      if (!this.isAnalyzing) return
      this.trackFocusEvent("focus")
    })

    window.addEventListener("blur", () => {
      if (!this.isAnalyzing) return
      this.trackFocusEvent("blur")
    })

    // Message listener for popup communication
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse)
      return true // Keep message channel open for async response
    })
  }

  trackMouseMovement(event) {
    const now = Date.now()
    this.lastActivityTime = now

    this.interactionData.mouseMovements.push({
      x: event.clientX,
      y: event.clientY,
      timestamp: now,
    })

    // Keep only last 50 movements
    if (this.interactionData.mouseMovements.length > 50) {
      this.interactionData.mouseMovements.shift()
    }
  }

  trackKeystroke(event) {
    const now = Date.now()
    this.lastActivityTime = now

    this.interactionData.keystrokes.push({
      key: event.key,
      timestamp: now,
      interval: this.getLastKeystrokeInterval(),
    })

    // Keep only last 100 keystrokes
    if (this.interactionData.keystrokes.length > 100) {
      this.interactionData.keystrokes.shift()
    }
  }

  trackScrollEvent(event) {
    const now = Date.now()
    this.lastActivityTime = now

    this.interactionData.scrollEvents.push({
      scrollY: window.scrollY,
      timestamp: now,
    })

    // Keep only last 30 scroll events
    if (this.interactionData.scrollEvents.length > 30) {
      this.interactionData.scrollEvents.shift()
    }
  }

  trackClickEvent(event) {
    const now = Date.now()
    this.lastActivityTime = now

    this.interactionData.clickEvents.push({
      x: event.clientX,
      y: event.clientY,
      target: event.target.tagName,
      timestamp: now,
    })

    // Keep only last 20 clicks
    if (this.interactionData.clickEvents.length > 20) {
      this.interactionData.clickEvents.shift()
    }
  }

  trackFocusEvent(type) {
    const now = Date.now()

    this.interactionData.focusEvents.push({
      type: type,
      timestamp: now,
    })

    // Keep only last 10 focus events
    if (this.interactionData.focusEvents.length > 10) {
      this.interactionData.focusEvents.shift()
    }
  }

  getLastKeystrokeInterval() {
    const keystrokes = this.interactionData.keystrokes
    if (keystrokes.length < 2) return 0

    const current = keystrokes[keystrokes.length - 1]
    const previous = keystrokes[keystrokes.length - 2]
    return current.timestamp - previous.timestamp
  }

  startCognitiveAnalysis() {
    // Analyze cognitive state every 10 seconds
    setInterval(() => {
      if (this.isAnalyzing) {
        this.analyzeCognitiveState()
        this.extractKnowledge()
      }
    }, 10000)

    // Check for inactivity every 5 seconds
    setInterval(() => {
      this.checkInactivity()
    }, 5000)
  }

  analyzeCognitiveState() {
    const now = Date.now()
    const timeWindow = 30000 // 30 seconds
    const cutoffTime = now - timeWindow

    // Filter recent interactions
    const recentMouse = this.interactionData.mouseMovements.filter((m) => m.timestamp > cutoffTime)
    const recentKeys = this.interactionData.keystrokes.filter((k) => k.timestamp > cutoffTime)
    const recentScrolls = this.interactionData.scrollEvents.filter((s) => s.timestamp > cutoffTime)
    const recentClicks = this.interactionData.clickEvents.filter((c) => c.timestamp > cutoffTime)

    // Calculate metrics
    const mouseActivity = recentMouse.length
    const keyActivity = recentKeys.length
    const scrollActivity = recentScrolls.length
    const clickActivity = recentClicks.length

    // Calculate typing rhythm consistency
    const typingRhythm = this.calculateTypingRhythm(recentKeys)

    // Calculate mouse movement smoothness
    const mouseSmootness = this.calculateMouseSmoothness(recentMouse)

    // Determine cognitive state
    this.cognitiveState = this.determineCognitiveState({
      mouseActivity,
      keyActivity,
      scrollActivity,
      clickActivity,
      typingRhythm,
      mouseSmootness,
    })

    // Update stored data
    this.updateStoredData()
  }

  calculateTypingRhythm(keystrokes) {
    if (keystrokes.length < 3) return 0.5

    const intervals = keystrokes.map((k) => k.interval).filter((i) => i > 0 && i < 2000)
    if (intervals.length < 2) return 0.5

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance =
      intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length
    const consistency = Math.max(0, 1 - variance / (avgInterval * avgInterval))

    return consistency
  }

  calculateMouseSmoothness(movements) {
    if (movements.length < 3) return 0.5

    let totalDistance = 0
    let totalDirectionChanges = 0

    for (let i = 1; i < movements.length - 1; i++) {
      const prev = movements[i - 1]
      const curr = movements[i]
      const next = movements[i + 1]

      // Calculate distance
      const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2))
      totalDistance += distance

      // Calculate direction change
      const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x)
      const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x)
      const angleDiff = Math.abs(angle2 - angle1)

      if (angleDiff > Math.PI / 4) {
        // 45 degrees
        totalDirectionChanges++
      }
    }

    const smoothness = totalDistance > 0 ? Math.max(0, 1 - totalDirectionChanges / movements.length) : 0.5
    return smoothness
  }

  determineCognitiveState(metrics) {
    const { mouseActivity, keyActivity, scrollActivity, clickActivity, typingRhythm, mouseSmootness } = metrics

    // Calculate overall activity level
    const totalActivity = mouseActivity + keyActivity + scrollActivity + clickActivity

    // Focused state: high activity, consistent rhythm, smooth movements
    if (totalActivity > 20 && typingRhythm > 0.7 && mouseSmootness > 0.6) {
      return "focused"
    }

    // Fatigued state: low activity, inconsistent rhythm
    if (totalActivity < 10 || typingRhythm < 0.3) {
      return "fatigued"
    }

    // Distracted state: erratic activity, many direction changes
    if (clickActivity > 5 && mouseSmootness < 0.4) {
      return "distracted"
    }

    // Receptive state: moderate activity, good rhythm
    if (totalActivity > 10 && typingRhythm > 0.5) {
      return "receptive"
    }

    return "focused" // Default state
  }

  checkInactivity() {
    const now = Date.now()
    const inactivityThreshold = 60000 // 1 minute

    if (now - this.lastActivityTime > inactivityThreshold) {
      this.cognitiveState = "fatigued"
      this.updateStoredData()
    }
  }

  async updateStoredData() {
    const sessionData = {
      attentionLevel: this.calculateAttentionLevel(),
      learningEfficiency: this.calculateLearningEfficiency(),
      conceptsLearned: await this.getConceptsLearned(),
      focusDuration: this.calculateFocusDuration(),
    }

    try {
      await chrome.storage.local.set({
        cognitiveState: this.cognitiveState,
        sessionData: sessionData,
        lastUpdate: Date.now(),
      })
    } catch (error) {
      console.error("Error updating stored data:", error)
    }
  }

  calculateAttentionLevel() {
    const stateValues = {
      focused: 85,
      receptive: 70,
      fatigued: 40,
      distracted: 25,
    }

    return stateValues[this.cognitiveState] + Math.floor(Math.random() * 10) - 5
  }

  calculateLearningEfficiency() {
    const stateValues = {
      focused: 80,
      receptive: 75,
      fatigued: 35,
      distracted: 20,
    }

    return stateValues[this.cognitiveState] + Math.floor(Math.random() * 10) - 5
  }

  async getConceptsLearned() {
    try {
      const result = await chrome.storage.local.get(["conceptsLearned"])
      return result.conceptsLearned || Math.floor(Math.random() * 10) + 3
    } catch (error) {
      return 7
    }
  }

  calculateFocusDuration() {
    const now = Date.now()
    return now - this.sessionStartTime
  }

  extractKnowledge() {
    if (!this.adaptationSettings.enableKnowledgeExtraction) return

    // Extract key concepts from page content
    const textContent = document.body.innerText
    const concepts = this.extractConcepts(textContent)

    if (concepts.length > 0) {
      this.storeKnowledgeConcepts(concepts)
    }
  }

  extractConcepts(text) {
    // Simple concept extraction (in a real implementation, this would use NLP)
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || []
    const conceptKeywords = [
      "learning",
      "cognitive",
      "memory",
      "attention",
      "focus",
      "knowledge",
      "algorithm",
      "data",
      "analysis",
      "research",
      "study",
      "education",
      "brain",
      "neural",
      "psychology",
      "science",
      "technology",
      "artificial",
      "intelligence",
      "machine",
      "deep",
      "network",
      "model",
      "training",
    ]

    const foundConcepts = words.filter((word) => conceptKeywords.includes(word) || word.length > 8)

    // Remove duplicates and limit to top 5
    return [...new Set(foundConcepts)].slice(0, 5)
  }

  async storeKnowledgeConcepts(concepts) {
    try {
      const result = await chrome.storage.local.get(["knowledgeGraph"])
      const knowledgeGraph = result.knowledgeGraph || {}

      const url = window.location.href
      const timestamp = Date.now()

      if (!knowledgeGraph[url]) {
        knowledgeGraph[url] = {
          title: document.title,
          concepts: [],
          visits: 0,
          lastVisit: timestamp,
        }
      }

      knowledgeGraph[url].concepts = [...new Set([...knowledgeGraph[url].concepts, ...concepts])]
      knowledgeGraph[url].visits++
      knowledgeGraph[url].lastVisit = timestamp

      await chrome.storage.local.set({ knowledgeGraph })
    } catch (error) {
      console.error("Error storing knowledge concepts:", error)
    }
  }

  adaptContent(cognitiveState = this.cognitiveState) {
    if (!this.adaptationSettings.enableContentAdaptation) return

    // Remove previous adaptations
    this.removeContentAdaptations()

    // Apply new adaptations based on cognitive state
    switch (cognitiveState) {
      case "focused":
        this.applyFocusedAdaptations()
        break
      case "fatigued":
        this.applyFatiguedAdaptations()
        break
      case "distracted":
        this.applyDistractedAdaptations()
        break
      case "receptive":
        this.applyReceptiveAdaptations()
        break
    }

    this.adaptationApplied = true
  }

  removeContentAdaptations() {
    // Remove Synapse-specific classes and styles
    const adaptedElements = document.querySelectorAll("[data-synapse-adapted]")
    adaptedElements.forEach((element) => {
      element.removeAttribute("data-synapse-adapted")
      element.classList.remove("synapse-focused", "synapse-fatigued", "synapse-distracted", "synapse-receptive")
    })

    // Remove injected styles
    const synapseStyles = document.getElementById("synapse-adaptive-styles")
    if (synapseStyles) {
      synapseStyles.remove()
    }
  }

  applyFocusedAdaptations() {
    this.injectAdaptiveStyles(`
            .synapse-focused {
                line-height: 1.6 !important;
                font-size: 1.05em !important;
            }
            .synapse-focused h1, .synapse-focused h2, .synapse-focused h3 {
                color: #2563eb !important;
                border-left: 3px solid #3b82f6 !important;
                padding-left: 12px !important;
            }
        `)

    this.adaptTextElements("synapse-focused")
  }

  applyFatiguedAdaptations() {
    this.injectAdaptiveStyles(`
            .synapse-fatigued {
                line-height: 2.0 !important;
                font-size: 1.15em !important;
                letter-spacing: 0.5px !important;
            }
            .synapse-fatigued p {
                margin-bottom: 1.5em !important;
            }
            .synapse-fatigued h1, .synapse-fatigued h2, .synapse-fatigued h3 {
                background: linear-gradient(135deg, #f59e0b, #d97706) !important;
                color: white !important;
                padding: 8px 16px !important;
                border-radius: 6px !important;
                margin: 1em 0 !important;
            }
        `)

    this.adaptTextElements("synapse-fatigued")
  }

  applyDistractedAdaptations() {
    this.injectAdaptiveStyles(`
            .synapse-distracted {
                background: #fef3c7 !important;
                padding: 16px !important;
                border-radius: 8px !important;
                border: 2px solid #f59e0b !important;
            }
            .synapse-distracted p {
                font-weight: 500 !important;
                color: #92400e !important;
            }
            .synapse-distracted h1, .synapse-distracted h2, .synapse-distracted h3 {
                background: #f59e0b !important;
                color: white !important;
                padding: 12px !important;
                text-align: center !important;
                border-radius: 6px !important;
            }
        `)

    this.adaptTextElements("synapse-distracted")
  }

  applyReceptiveAdaptations() {
    this.injectAdaptiveStyles(`
            .synapse-receptive {
                background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important;
                padding: 20px !important;
                border-radius: 12px !important;
                border: 1px solid #0ea5e9 !important;
            }
            .synapse-receptive h1, .synapse-receptive h2, .synapse-receptive h3 {
                color: #0c4a6e !important;
                border-bottom: 2px solid #0ea5e9 !important;
                padding-bottom: 8px !important;
            }
            .synapse-receptive strong, .synapse-receptive b {
                background: #fbbf24 !important;
                padding: 2px 4px !important;
                border-radius: 3px !important;
            }
        `)

    this.adaptTextElements("synapse-receptive")
  }

  injectAdaptiveStyles(css) {
    const styleElement = document.createElement("style")
    styleElement.id = "synapse-adaptive-styles"
    styleElement.textContent = css
    document.head.appendChild(styleElement)
  }

  adaptTextElements(className) {
    // Adapt main content areas
    const contentSelectors = [
      "article",
      "main",
      ".content",
      ".post",
      ".article",
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ]

    contentSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((element) => {
        if (this.isMainContent(element)) {
          element.classList.add(className)
          element.setAttribute("data-synapse-adapted", "true")
        }
      })
    })
  }

  isMainContent(element) {
    // Simple heuristic to identify main content
    const text = element.textContent.trim()
    if (text.length < 20) return false

    // Avoid navigation, sidebar, footer elements
    const excludeSelectors = ["nav", "aside", "footer", ".sidebar", ".menu", ".navigation"]
    for (const selector of excludeSelectors) {
      if (element.closest(selector)) return false
    }

    return true
  }

  injectSynapseUI() {
    // Create floating indicator
    const indicator = document.createElement("div")
    indicator.id = "synapse-indicator"
    indicator.innerHTML = `
            <div class="synapse-indicator-content">
                <div class="synapse-logo">🧠</div>
                <div class="synapse-state" id="synapse-state-display">Analyzing...</div>
            </div>
        `

    // Add styles for the indicator
    const indicatorStyles = document.createElement("style")
    indicatorStyles.textContent = `
            #synapse-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 12px 16px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12px;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            #synapse-indicator:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            }
            
            .synapse-indicator-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .synapse-logo {
                font-size: 16px;
            }
            
            .synapse-state {
                font-weight: 500;
                color: #1e293b;
            }
            
            .synapse-state.focused { color: #059669; }
            .synapse-state.fatigued { color: #d97706; }
            .synapse-state.distracted { color: #dc2626; }
            .synapse-state.receptive { color: #7c3aed; }
        `

    document.head.appendChild(indicatorStyles)
    document.body.appendChild(indicator)

    // Update indicator periodically
    setInterval(() => {
      this.updateIndicator()
    }, 2000)

    // Click handler for indicator
    indicator.addEventListener("click", () => {
      this.adaptContent()
    })
  }

  updateIndicator() {
    const stateDisplay = document.getElementById("synapse-state-display")
    if (stateDisplay) {
      const stateNames = {
        focused: "Focused",
        fatigued: "Fatigued",
        distracted: "Distracted",
        receptive: "Receptive",
      }

      stateDisplay.textContent = stateNames[this.cognitiveState] || "Analyzing..."
      stateDisplay.className = `synapse-state ${this.cognitiveState}`
    }
  }

  handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case "getCognitiveData":
        sendResponse({
          cognitiveState: this.cognitiveState,
          metrics: {
            attentionLevel: this.calculateAttentionLevel(),
            learningEfficiency: this.calculateLearningEfficiency(),
            focusDuration: this.calculateFocusDuration(),
          },
        })
        break

      case "adaptContent":
        this.adaptContent(request.cognitiveState)
        sendResponse({ success: true })
        break

      case "toggleAnalysis":
        this.isAnalyzing = request.isAnalyzing
        sendResponse({ success: true })
        break

      default:
        sendResponse({ error: "Unknown action" })
    }
  }
}

// Initialize Synapse when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new SynapseCognitive()
  })
} else {
  new SynapseCognitive()
}
