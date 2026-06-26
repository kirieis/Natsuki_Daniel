/**
 * Smart Travel Gia Lai - AI Travel Companion (chatbot.js)
 * Developer: Member 3 - AI Chatbot Developer
 * 
 * Features:
 * 1. Self-contained floating chat widget (auto-injected into DOM).
 * 2. Connects to OpenRouter API (using openrouter/owl-alpha and key).
 * 3. Handles API quota/errors with an elegant banner and robust offline rule-based fallback.
 * 4. Custom system prompt designed for Gia Lai tourism.
 * 5. Structured command parsing [ADD: id], [REMOVE: id] to update the travel planner in real-time.
 */

(function () {
  // --- CONFIGURATION ---
  const API_KEY = "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";
  const MODEL_ID = "openrouter/owl-alpha";
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";

  // System Prompt for the AI
  const SYSTEM_PROMPT = `
Bạn là "Gia Lai Travel Buddy" - trợ lý AI du lịch thông minh, thân thiện, am hiểu sâu sắc về văn hóa, địa lý, ẩm thực, và lịch trình tại tỉnh Gia Lai, Việt Nam.
Nhiệm vụ của bạn là hỗ trợ du khách lên lịch trình, giới thiệu địa điểm, gợi ý món ăn ngon, và điều chỉnh lịch trình du lịch Gia Lai.

Hạn chế chủ đề nghiêm ngặt:
- Bạn chỉ hỗ trợ chủ đề du lịch Gia Lai (Smart Travel Gia Lai – AI Travel Planner).
- Nếu người dùng yêu cầu bạn trả lời hoặc trò chuyện về bất kỳ chủ đề nào khác ngoài chủ đề du lịch Gia Lai (ví dụ: viết mã code, giải toán, dịch tiếng Anh tổng quát, thời tiết các tỉnh khác ngoài Gia Lai, kiến thức chung khác), bạn phải phản hồi chính xác câu trả lời sau và không được thêm bất cứ từ nào khác:
  + Nếu người dùng sử dụng tiếng Việt: "tôi là AI chatbot hỗ trợ Smart Travel Gia Lai – AI Travel Planner và không thể trả lời các câu hỏi liên quan đến chủ đề khác của bạn"
  + Nếu người dùng sử dụng tiếng Anh: "I am the AI chatbot for Smart Travel Gia Lai – AI Travel Planner. I can only assist with questions related to travel in Gia Lai, including attractions, itineraries, local culture, transportation, and travel recommendations. I am unable to answer questions that are unrelated to these topics."

Danh sách các địa điểm được hỗ trợ trong hệ thống (sử dụng đúng ID này trong các câu lệnh điều khiển):
1. 'bien-ho' (Biển Hồ / Hồ T'Nưng) - Thiên nhiên, Check-in
2. 'chu-dang-ya' (Núi lửa Chư Đăng Ya) - Trekking, Thiên nhiên
3. 'phong-nguyen' (Phố đêm Pleiku) - Ẩm thực, Văn hóa
4. 'lang-jrai' (Làng văn hóa Jrai / Làng Ốp) - Văn hóa, Gia đình
5. 'thac-phu-cuong' (Thác Phú Cường) - Thiên nhiên, Trekking
6. 'vuon-che' (Vườn chè Biển Hồ) - Check-in, Thiên nhiên
7. 'chua-minh-thanh' (Chùa Minh Thành) - Văn hóa, Check-in
8. 'quang-truong-dai-doan-ket' (Quảng trường Đại Đoàn Kết) - Gia đình, Văn hóa
9. 'hang-thong-tram-tuoi' (Hàng thông trăm tuổi) - Check-in, Thiên nhiên
10. 'chua-buu-minh' (Chùa Bửu Minh) - Văn hóa, Check-in

Khi người dùng trò chuyện và muốn thực hiện các thao tác trên lịch trình du lịch (như thêm địa điểm, xóa địa điểm, hoặc đổi lịch trình), bạn HÃY TRẢ LỜI bằng tiếng Việt tự nhiên và LUÔN đính kèm câu lệnh điều khiển dạng thẻ ngoặc vuông ở cuối câu trả lời (hoặc dòng cuối cùng) theo đúng định dạng sau:
- Để thêm một địa điểm: [ADD: id_dia_diem] (Ví dụ: [ADD: chua-minh-thanh])
- Để xóa một địa điểm: [REMOVE: id_dia_diem] (Ví dụ: [REMOVE: bien-ho])
- Để làm lại/đặt lại lịch trình: [REGENERATE]

Quy định đặc biệt:
- Hãy nhiệt tình gợi ý ẩm thực Gia Lai như: Phở hai tô (phở khô), Cơm lam gà nướng, Bò một nắng muối kiến vàng, Gỏi lá, Café Pleiku khi được hỏi về đồ ăn.
- Mỗi phản hồi chỉ nên chứa tối đa 1-2 lệnh [ADD: ...] hoặc [REMOVE: ...] tương ứng với yêu cầu trực tiếp của khách.
- Không dùng markdown quá phức tạp trong văn bản, ưu tiên câu văn ngắn gọn, dễ đọc.
`;

  // State Management
  let isChatOpen = false;
  let isOfflineMode = false;
  let chatHistory = [
    { role: "system", content: SYSTEM_PROMPT }
  ];

  // --- DYNAMIC CSS STYLE INJECTION ---
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    /* Floating Chat Widget Styles */
    #gl-chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: 'Inter', sans-serif;
    }
    
    #gl-chat-trigger {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2F4A3C, #B5512A);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(47, 74, 60, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
    }
    
    #gl-chat-trigger:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 6px 24px rgba(47, 74, 60, 0.45);
    }

    #gl-chat-trigger:active {
      transform: scale(0.95);
    }
    
    #gl-chat-trigger svg {
      width: 26px;
      height: 26px;
      fill: currentColor;
      transition: transform 0.3s ease;
    }
    
    #gl-chat-trigger.open svg {
      transform: rotate(90deg);
    }
    
    #gl-chat-trigger .pulse-ring {
      position: absolute;
      border: 3px solid #D9A441;
      border-radius: 50%;
      height: 100%;
      width: 100%;
      animation: gl-pulse 2s infinite;
      opacity: 0;
      pointer-events: none;
    }
    
    @keyframes gl-pulse {
      0% { transform: scale(0.95); opacity: 0.5; }
      100% { transform: scale(1.4); opacity: 0; }
    }
    
    #gl-chat-panel {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      height: 520px;
      max-height: 80vh;
      max-width: 90vw;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(227, 216, 196, 0.8);
      border-radius: 18px;
      box-shadow: 0 10px 32px rgba(42, 36, 32, 0.18);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translateY(20px) scale(0.9);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    #gl-chat-panel.show {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }
    
    /* Panel Header */
    .gl-chat-header {
      background: #2F4A3C;
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .gl-chat-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .gl-chat-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4CAF50;
      box-shadow: 0 0 8px #4CAF50;
    }
    
    .gl-chat-status.offline {
      background: #FF9800;
      box-shadow: 0 0 8px #FF9800;
    }
    
    .gl-chat-title {
      font-weight: 600;
      font-size: 15px;
      margin: 0;
    }
    
    .gl-chat-subtitle {
      font-size: 11px;
      opacity: 0.75;
      margin: 2px 0 0 0;
    }
    
    .gl-chat-close-btn {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      opacity: 0.8;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .gl-chat-close-btn:hover {
      opacity: 1;
    }
    
    /* Warning Banner */
    #gl-chat-banner {
      background: #FFF3E0;
      color: #E65100;
      padding: 8px 16px;
      font-size: 12px;
      border-bottom: 1px solid #FFE0B2;
      display: none;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    
    /* Message Window */
    .gl-chat-messages {
      flex: 1;
      padding: 18px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: rgba(247, 241, 230, 0.3);
    }
    
    .gl-bubble {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.5;
      word-wrap: break-word;
      animation: gl-fadeIn 0.25s ease-out forwards;
    }
    
    @keyframes gl-fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .gl-bubble.user {
      align-self: flex-end;
      background: #B5512A;
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    .gl-bubble.ai {
      align-self: flex-start;
      background: white;
      color: #2A2420;
      border: 1px solid rgba(227, 216, 196, 0.7);
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 6px rgba(42, 36, 32, 0.03);
    }
    
    /* Suggestion Chips */
    .gl-chat-suggestions {
      padding: 8px 14px;
      display: flex;
      gap: 8px;
      overflow-x: auto;
      white-space: nowrap;
      background: rgba(255, 255, 255, 0.8);
      border-top: 1px solid rgba(227, 216, 196, 0.5);
      scrollbar-width: none; /* Firefox */
    }
    
    .gl-chat-suggestions::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }
    
    .gl-suggestion-chip {
      background: #FAF7F2;
      border: 1px solid rgba(47, 74, 60, 0.25);
      color: #2F4A3C;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    
    .gl-suggestion-chip:hover {
      background: #2F4A3C;
      color: white;
      border-color: #2F4A3C;
      transform: translateY(-1px);
    }
    
    /* Chat Footer / Input */
    .gl-chat-footer {
      padding: 12px 16px;
      background: white;
      border-top: 1px solid rgba(227, 216, 196, 0.6);
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .gl-chat-input {
      flex: 1;
      border: 1px solid rgba(227, 216, 196, 0.8);
      border-radius: 20px;
      padding: 10px 14px;
      font-size: 13.5px;
      outline: none;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    
    .gl-chat-input:focus {
      border-color: #B5512A;
    }
    
    .gl-chat-send-btn {
      background: #2F4A3C;
      color: white;
      border: none;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, transform 0.1s;
      flex-shrink: 0;
    }
    
    .gl-chat-send-btn:hover {
      background: #1C2E25;
    }
    
    .gl-chat-send-btn:active {
      transform: scale(0.95);
    }
    
    /* Typing Indicator */
    .gl-typing-indicator {
      display: flex;
      gap: 4px;
      padding: 8px 12px;
      align-self: flex-start;
      background: white;
      border: 1px solid rgba(227, 216, 196, 0.7);
      border-radius: 12px;
      border-bottom-left-radius: 4px;
    }
    
    .gl-dot {
      width: 6px;
      height: 6px;
      background: #888;
      border-radius: 50%;
      animation: gl-bounce 1.4s infinite ease-in-out both;
    }
    
    .gl-dot:nth-child(1) { animation-delay: -0.32s; }
    .gl-dot:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes gl-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }
    
    /* Responsive details */
    @media (max-width: 480px) {
      #gl-chat-panel {
        width: calc(100vw - 32px);
        height: 480px;
        bottom: 74px;
        right: -8px;
      }
      #gl-chat-widget {
        bottom: 16px;
        right: 16px;
      }
    }
  `;
  document.head.appendChild(styleElement);

  // --- DYNAMIC HTML INJECTION ---
  const widgetContainer = document.createElement("div");
  widgetContainer.id = "gl-chat-widget";
  widgetContainer.innerHTML = `
    <button id="gl-chat-trigger" title="Hỏi trợ lý AI">
      <div class="pulse-ring"></div>
      <svg viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    </button>
    <div id="gl-chat-panel">
      <div class="gl-chat-header">
        <div class="gl-chat-header-info">
          <div class="gl-chat-status" id="gl-chat-status-dot"></div>
          <div>
            <h4 class="gl-chat-title">Trợ lý AI Gia Lai</h4>
            <p class="gl-chat-subtitle">Gia Lai Travel Buddy</p>
          </div>
        </div>
        <button class="gl-chat-close-btn" id="gl-chat-close" title="Đóng">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div id="gl-chat-banner">
        <span>⚠️</span>
        <span id="gl-chat-banner-text">Mất kết nối API. Đang dùng AI Offline.</span>
      </div>
      
      <div class="gl-chat-messages" id="gl-chat-messages-box">
        <!-- Messages appended here -->
      </div>
      
      <div class="gl-chat-suggestions" id="gl-chat-suggestions-box">
        <button class="gl-suggestion-chip" data-text="Thêm Chùa Minh Thành">🕌 Thêm Chùa Minh Thành</button>
        <button class="gl-suggestion-chip" data-text="Gợi ý món ăn ngon ở Gia Lai">🍲 Ăn gì ngon?</button>
        <button class="gl-suggestion-chip" data-text="Điểm check-in chụp ảnh đẹp">📸 Điểm chụp ảnh đẹp</button>
        <button class="gl-suggestion-chip" data-text="Tôi không thích đi trekking nhiều">🚶 Bớt trekking</button>
      </div>
      
      <form class="gl-chat-footer" id="gl-chat-input-form">
        <input type="text" class="gl-chat-input" id="gl-chat-input-field" placeholder="Hỏi AI về lịch trình, món ăn..." autocomplete="off">
        <button type="submit" class="gl-chat-send-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(widgetContainer);

  // DOM Elements
  const triggerBtn = document.getElementById("gl-chat-trigger");
  const chatPanel = document.getElementById("gl-chat-panel");
  const closeBtn = document.getElementById("gl-chat-close");
  const messagesBox = document.getElementById("gl-chat-messages-box");
  const suggestionsBox = document.getElementById("gl-chat-suggestions-box");
  const inputForm = document.getElementById("gl-chat-input-form");
  const inputField = document.getElementById("gl-chat-input-field");
  const statusDot = document.getElementById("gl-chat-status-dot");
  const warningBanner = document.getElementById("gl-chat-banner");

  // Initial welcome message
  addBubble("Xin chào! Mình là trợ lý AI Gia Lai Travel Buddy. Mình có thể giúp gì cho lịch trình khám phá Tây Nguyên của bạn? Bạn có thể yêu cầu thêm/xóa địa điểm hoặc hỏi kinh nghiệm ăn uống nhé!", "ai");

  // --- WIDGET EVENT LISTENERS ---
  triggerBtn.addEventListener("click", () => {
    isChatOpen = !isChatOpen;
    chatPanel.classList.toggle("show", isChatOpen);
    triggerBtn.classList.toggle("open", isChatOpen);
    if (isChatOpen) {
      inputField.focus();
      // Remove pulsing animation ring once opened
      const ring = triggerBtn.querySelector(".pulse-ring");
      if (ring) ring.style.display = "none";
    }
  });

  closeBtn.addEventListener("click", () => {
    isChatOpen = false;
    chatPanel.classList.remove("show");
    triggerBtn.classList.remove("open");
  });

  inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleUserMessage();
  });

  // Suggestion Chips click
  suggestionsBox.addEventListener("click", (e) => {
    const chip = e.target.closest(".gl-suggestion-chip");
    if (chip) {
      const text = chip.dataset.text;
      inputField.value = text;
      handleUserMessage();
    }
  });

  // Highlight widget with ring pulse on startup
  setTimeout(() => {
    const ring = triggerBtn.querySelector(".pulse-ring");
    if (ring && !isChatOpen) {
      ring.style.opacity = "1";
    }
  }, 2000);

  // --- MESSAGING HELPER FUNCTIONS ---
  function addBubble(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = `gl-bubble ${sender}`;
    bubble.textContent = text;
    messagesBox.appendChild(bubble);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Echo to main page chat if it exists and matches template structure
    const mainChatWindow = document.getElementById("chat-window");
    if (mainChatWindow) {
      const mainBubble = document.createElement("div");
      mainBubble.className = `bubble ${sender}`;
      mainBubble.textContent = text;
      mainChatWindow.appendChild(mainBubble);
      mainChatWindow.scrollTop = mainChatWindow.scrollHeight;
    }
  }

  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "gl-typing-indicator";
    indicator.id = "gl-typing-indicator-node";
    indicator.innerHTML = `
      <div class="gl-dot"></div>
      <div class="gl-dot"></div>
      <div class="gl-dot"></div>
    `;
    messagesBox.appendChild(indicator);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Show on main page chat if exists
    const mainChatWindow = document.getElementById("chat-window");
    if (mainChatWindow) {
      const mainIndicator = document.createElement("div");
      mainIndicator.className = "bubble ai typing-indicator-holder";
      mainIndicator.id = "main-typing-indicator";
      mainIndicator.innerHTML = "Đang suy nghĩ...";
      mainChatWindow.appendChild(mainIndicator);
      mainChatWindow.scrollTop = mainChatWindow.scrollHeight;
    }
  }

  function removeTypingIndicator() {
    const node = document.getElementById("gl-typing-indicator-node");
    if (node) node.remove();

    const mainNode = document.getElementById("main-typing-indicator");
    if (mainNode) mainNode.remove();
  }

  function enableOfflineMode(reason) {
    isOfflineMode = true;
    statusDot.classList.add("offline");
    warningBanner.style.display = "flex";
    document.getElementById("gl-chat-banner-text").textContent = `Chế độ AI Offline: ${reason}`;
    console.warn("AI Chatbot switched to offline mode: ", reason);
  }

  // --- HOOK INTO MAIN PAGE CHAT FORM ---
  function hookMainPageChat() {
    const mainForm = document.getElementById("chat-form");
    if (mainForm) {
      // Clone form to clear old event listeners from app.js
      const newForm = mainForm.cloneNode(true);
      mainForm.parentNode.replaceChild(newForm, mainForm);
      
      newForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const mainInput = document.getElementById("chat-input");
        const text = mainInput.value.trim();
        if (!text) return;
        
        // Use our chatbot engine
        mainInput.value = "";
        sendMessageToEngine(text);
      });
    }
  }

  // Run hooks on startup and observe DOM for changes
  hookMainPageChat();
  const observer = new MutationObserver(() => hookMainPageChat());
  observer.observe(document.body, { childList: true, subtree: true });

  // --- CORE CHAT LOGIC ---
  function handleUserMessage() {
    const text = inputField.value.trim();
    if (!text) return;
    inputField.value = "";
    sendMessageToEngine(text);
  }

  function sendMessageToEngine(text) {
    // Add user bubble in widget & main window
    addBubble(text, "user");
    chatHistory.push({ role: "user", content: text });

    showTypingIndicator();

    if (isOfflineMode) {
      // Fast fallback reply
      setTimeout(() => {
        const responseText = getOfflineResponse(text);
        removeTypingIndicator();
        processAIResponse(responseText);
      }, 500);
    } else {
      // Call OpenRouter API
      callOpenRouterAPI();
    }
  }

  // --- OPENROUTER API CLIENT ---
  function callOpenRouterAPI() {
    // Limit chat history length to avoid excessive token counts (keep last 8 messages)
    const messagesToSend = [
      chatHistory[0], // Keep system prompt
      ...chatHistory.slice(-8) // Keep last 8 turns
    ];

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin || "http://localhost:3000",
        "X-Title": "Smart Travel Gia Lai AI Planner"
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: messagesToSend,
        temperature: 0.7,
        max_tokens: 450
      })
    })
      .then(async (response) => {
        removeTypingIndicator();
        if (response.status === 402) {
          enableOfflineMode("Hết hạn ngạch API (Error 402)");
          triggerOfflineFallbackReply();
          return;
        }
        if (response.status === 429) {
          enableOfflineMode("API quá tải hoặc giới hạn lượt gọi (Error 429)");
          triggerOfflineFallbackReply();
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data) return; // Handled in errors
        const aiResponse = data.choices[0].message.content;
        chatHistory.push({ role: "assistant", content: aiResponse });
        processAIResponse(aiResponse);
      })
      .catch((error) => {
        console.error("API Call error:", error);
        removeTypingIndicator();
        enableOfflineMode("Lỗi kết nối mạng");
        triggerOfflineFallbackReply();
      });
  }

  function triggerOfflineFallbackReply() {
    const lastUserMsg = chatHistory[chatHistory.length - 1].content;
    const responseText = getOfflineResponse(lastUserMsg);
    processAIResponse(responseText);
  }

  // --- RESPONSE PARSING & ACTION COMMANDS ---
  function processAIResponse(responseText) {
    // 1. Parse action commands
    // Command format: [ADD: place-id], [REMOVE: place-id], [REGENERATE]
    const addRegex = /\[ADD:\s*([a-zA-Z0-9_-]+)\]/gi;
    const removeRegex = /\[REMOVE:\s*([a-zA-Z0-9_-]+)\]/gi;
    const regenRegex = /\[REGENERATE\]/gi;

    let match;
    const actions = [];

    // Parse ADD commands
    while ((match = addRegex.exec(responseText)) !== null) {
      actions.push({ type: "ADD", placeId: match[1] });
    }

    // Parse REMOVE commands
    while ((match = removeRegex.exec(responseText)) !== null) {
      actions.push({ type: "REMOVE", placeId: match[1] });
    }

    // Parse REGENERATE commands
    if (regenRegex.test(responseText)) {
      actions.push({ type: "REGENERATE" });
    }

    // 2. Clean response text (remove brackets from output for clean reading)
    let cleanText = responseText
      .replace(addRegex, "")
      .replace(removeRegex, "")
      .replace(regenRegex, "")
      .trim();

    // 3. Display clean response
    addBubble(cleanText, "ai");

    // 4. Execute detected actions
    actions.forEach(action => {
      executeActionCommand(action);
    });
  }

  function executeActionCommand(action) {
    console.log("Executing chatbot action command:", action);

    // Dispatch window custom event so other team members' frontend can catch it
    const event = new CustomEvent("travelPlannerCommand", {
      detail: {
        action: action.type,
        placeId: action.placeId
      }
    });
    window.dispatchEvent(event);

    // Provide default logic to modify the global template variables (Direct Integration Demo)
    try {
      if (action.type === "ADD") {
        const placeId = action.placeId.toLowerCase();
        
        // Find matching place in PLACES database
        if (typeof PLACES !== "undefined") {
          const place = PLACES.find(p => p.id === placeId || p.name.toLowerCase().includes(placeId));
          if (place) {
            if (typeof SAMPLE_ITINERARY !== "undefined") {
              // Add to the day with the least activities
              let targetDayIndex = 0;
              let minActivities = Infinity;
              
              SAMPLE_ITINERARY.forEach((day, idx) => {
                if (day.items.length < minActivities) {
                  minActivities = day.items.length;
                  targetDayIndex = idx;
                }
              });

              // Prevent duplicates
              const alreadyAdded = SAMPLE_ITINERARY.some(day => day.items.includes(place.name));
              if (!alreadyAdded) {
                SAMPLE_ITINERARY[targetDayIndex].items.push(place.name);
                console.log(`Added ${place.name} to Day ${targetDayIndex + 1}`);
                
                // Redraw itinerary if function exists
                if (typeof renderItinerary === "function") {
                  renderItinerary();
                }
                
                // Show notification inside chat
                setTimeout(() => {
                  addBubble(`📌 Đã cập nhật lịch trình: Thêm "${place.name}" vào ngày ${targetDayIndex + 1}.`, "ai");
                }, 400);
              }
            }
          }
        }
      } 
      
      else if (action.type === "REMOVE") {
        const placeId = action.placeId.toLowerCase();
        if (typeof PLACES !== "undefined" && typeof SAMPLE_ITINERARY !== "undefined") {
          const place = PLACES.find(p => p.id === placeId || p.name.toLowerCase().includes(placeId));
          if (place) {
            let removed = false;
            SAMPLE_ITINERARY.forEach(day => {
              const index = day.items.indexOf(place.name);
              if (index > -1) {
                day.items.splice(index, 1);
                removed = true;
              }
            });

            if (removed) {
              console.log(`Removed ${place.name} from itinerary`);
              if (typeof renderItinerary === "function") {
                renderItinerary();
              }
              setTimeout(() => {
                addBubble(`🗑️ Đã cập nhật lịch trình: Xóa "${place.name}" khỏi lịch trình.`, "ai");
              }, 400);
            }
          }
        }
      } 
      
      else if (action.type === "REGENERATE") {
        if (typeof SAMPLE_ITINERARY !== "undefined" && typeof PLACES !== "undefined") {
          // Reset to initial sample itinerary
          SAMPLE_ITINERARY[0].items = ["Biển Hồ", "Phố đêm Pleiku"];
          SAMPLE_ITINERARY[1].items = ["Núi lửa Chư Đăng Ya", "Làng văn hóa Jrai"];
          if (SAMPLE_ITINERARY[2]) {
            SAMPLE_ITINERARY[2].items = ["Thác Phú Cường", "Vườn chè Biển Hồ"];
          }
          if (typeof renderItinerary === "function") {
            renderItinerary();
          }
          setTimeout(() => {
            addBubble("🔄 Đã khôi phục lịch trình 3 ngày 2 đêm mặc định cho bạn.", "ai");
          }, 400);
        }
      }
    } catch (err) {
      console.error("Error updating template itinerary state:", err);
    }
  }

  // --- OFFLINE LOCAL CHAT ENGINE (NLP Keyword Matching) ---
  function getOfflineResponse(message) {
    const text = message.toLowerCase();
    
    // Strict Topic Restriction Check
    const isGiaLaiTravelRelated = 
      text.includes("gia lai") || text.includes("pleiku") || text.includes("chư păh") || text.includes("chư sê") ||
      text.includes("du lịch") || text.includes("lịch trình") || text.includes("itinerary") || text.includes("chuyến đi") || text.includes("ngày") || text.includes("day") ||
      text.includes("ăn gì") || text.includes("món") || text.includes("đặc sản") || text.includes("ẩm thực") || text.includes("uống") || text.includes("cà phê") || text.includes("cafe") ||
      text.includes("chùa") || text.includes("thác") || text.includes("biển hồ") || text.includes("hồ t'nưng") ||
      text.includes("chư đăng ya") || text.includes("thông") || text.includes("vườn chè") || text.includes("phú cường") ||
      text.includes("bửu minh") || text.includes("minh thành") || text.includes("đại đoàn kết") || text.includes("quảng trường") ||
      text.includes("làng ốp") || text.includes("làng jrai") || text.includes("thêm") || text.includes("xóa") || text.includes("bớt") || text.includes("bỏ") ||
      text.includes("reset") || text.includes("làm lại") || text.includes("khôi phục") || text.includes("sở thích") || text.includes("nhật ký") ||
      text.includes("chào") || text.includes("hi") || text.includes("hello") || text.includes("bản đồ") || text.includes("map");

    if (!isGiaLaiTravelRelated) {
      // Determine language: English if no Vietnamese accents and contains common English chars/words
      const isEnglish = /[a-zA-Z]/g.test(text) && !/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(text);
      if (isEnglish) {
        return "I am the AI chatbot for Smart Travel Gia Lai – AI Travel Planner. I can only assist with questions related to travel in Gia Lai, including attractions, itineraries, local culture, transportation, and travel recommendations. I am unable to answer questions that are unrelated to these topics.";
      } else {
        return "tôi là AI chatbot hỗ trợ Smart Travel Gia Lai – AI Travel Planner và không thể trả lời các câu hỏi liên quan đến chủ đề khác của bạn";
      }
    }
    
    // Command Add location triggers
    if (text.includes("thêm") || text.includes("bổ sung") || text.includes("cho mình đi")) {
      if (text.includes("chùa minh thành") || text.includes("minh thành")) {
        return "Mình đã thêm Chùa Minh Thành vào lịch trình của bạn. Đây là ngôi chùa có tháp chính cao 9 tầng cực kỳ tráng lệ và linh thiêng để check-in! [ADD: chua-minh-thanh]";
      }
      if (text.includes("hàng thông") || text.includes("thông trăm tuổi") || text.includes("con đường thông")) {
        return "Đường hàng thông trăm tuổi thơ mộng đã được đưa vào lịch trình. Góc check-in này rất gần vườn chè cổ Biển Hồ đấy nhé! [ADD: hang-thong-tram-tuoi]";
      }
      if (text.includes("quảng trường") || text.includes("đại đoàn kết")) {
        return "Mình đã thêm Quảng trường Đại Đoàn Kết (trái tim Pleiku) vào lịch trình du hí của bạn! [ADD: quang-truong-dai-doan-ket]";
      }
      if (text.includes("chùa bửu minh") || text.includes("bửu minh")) {
        return "Đã thêm Chùa Bửu Minh thanh tịnh nằm giữa đồi chè cổ thụ vào lịch trình của bạn. [ADD: chua-buu-minh]";
      }
      if (text.includes("chư đăng ya") || text.includes("núi lửa")) {
        return "Ok! Núi lửa Chư Đăng Ya rực rỡ sắc vàng dã quỳ đã được thêm lại vào danh sách khám phá. [ADD: chu-dang-ya]";
      }
      if (text.includes("biển hồ") || text.includes("hồ t'nưng")) {
        return "Vâng, Biển Hồ được ví như đôi mắt Pleiku trong veo thơ mộng đã được cập nhật vào lịch trình. [ADD: bien-ho]";
      }
      if (text.includes("thác phú cường")) {
        return "Tuyệt vời, Thác Phú Cường hùng vĩ đã được thêm vào kế hoạch du lịch của bạn. [ADD: thac-phu-cuong]";
      }
    }

    // Command Remove location triggers
    if (text.includes("xóa") || text.includes("bớt") || text.includes("không thích") || text.includes("bỏ")) {
      if (text.includes("chư đăng ya") || text.includes("núi lửa") || text.includes("trekking")) {
        return "Mình đã bỏ Núi lửa Chư Đăng Ya ra để lịch trình bớt hoạt động trekking tốn sức, thích hợp nghỉ dưỡng nhẹ nhàng hơn. [REMOVE: chu-dang-ya]";
      }
      if (text.includes("biển hồ")) {
        return "Đã xóa Biển Hồ khỏi lịch trình theo yêu cầu của bạn. [REMOVE: bien-ho]";
      }
      if (text.includes("thác phú cường") || text.includes("thác")) {
        return "Ok, mình đã gỡ Thác Phú Cường khỏi lịch trình của bạn. [REMOVE: thac-phu-cuong]";
      }
      if (text.includes("chùa minh thành") || text.includes("chùa")) {
        return "Đã xóa địa điểm chùa chiền tâm linh khỏi danh sách điểm đến. [REMOVE: chua-minh-thanh]";
      }
    }

    // Reset itinerary triggers
    if (text.includes("làm lại") || text.includes("reset") || text.includes("đặt lại") || text.includes("khôi phục")) {
      return "Mình sẽ khôi phục toàn bộ lịch trình nguyên bản 3 ngày 2 đêm tại Gia Lai cho bạn ngay. [REGENERATE]";
    }

    // Culinary suggestions triggers
    if (text.includes("ăn gì") || text.includes("món ăn") || text.includes("đặc sản") || text.includes("ẩm thực") || text.includes("quán ngon")) {
      return "Đến Gia Lai, bạn nhất định phải thử:\n1. Phở hai tô (phở khô Gia Lai) đặc sắc ăn kèm nước lèo ngọt thanh.\n2. Cơm lam gà nướng chấm muối sả lá é thơm lừng.\n3. Bò một nắng chấm muối kiến vàng bùi béo.\n4. Café Pleiku nguyên chất đậm vị cao nguyên.\nBạn có muốn mình thêm địa điểm Phố đêm Pleiku để thưởng thức các món này không?";
    }

    // General informational queries about places
    if (text.includes("biển hồ") || text.includes("hồ t'nưng") || text.includes("mắt pleiku")) {
      return "Biển Hồ (Hồ T'Nưng) cách Pleiku khoảng 7km, là hồ nước ngọt tự nhiên nằm trên miệng núi lửa đã tắt. Nước hồ xanh ngắt quanh năm, phong cảnh xung quanh rợp bóng thông xanh rất mát mẻ và nên thơ.";
    }
    if (text.includes("chùa minh thành") || text.includes("chùa đẹp")) {
      return "Chùa Minh Thành nằm ở số 348 Nguyễn Viết Xuân, Pleiku. Chùa nổi tiếng với tháp chín tầng lộng lẫy mang nét giao thoa văn hóa thời Đường độc đáo, xung quanh khuôn viên ngập tràn cây cảnh tiểu cảnh thơ mộng.";
    }
    if (text.includes("chư đăng ya") || text.includes("dã quỳ")) {
      return "Núi lửa Chư Đăng Ya nằm ở huyện Chư Păh. Nơi này vốn là núi lửa cổ, nay đất đỏ phì nhiêu phủ đầy hoa màu xanh mướt. Đặc biệt, vào tháng 11, hoa dã quỳ nở vàng rực rực rỡ khắp triền đồi, thu hút đông đảo phượt thủ check-in.";
    }

    // Fallback general chat
    return "Gia Lai Travel Buddy đã ghi nhận ý kiến của bạn. Để sửa đổi lịch trình của bạn, bạn có thể nói 'thêm Chùa Minh Thành', 'bớt trekking' hoặc 'ăn gì ở đây' để mình hỗ trợ tốt nhất nhé!";
  }
})();
