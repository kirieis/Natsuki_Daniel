// Smart Travel Gia Lai - Core App Logic
// Managing SPA Views, State, AI Generation, Chatbot, Voice, Map, AR, Gamification, and Localization

import destinations from "./data.js";

function normalizePlaces(items) {
  return (items || []).map((place, index) => {
    const slug = (place.name || "place")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const ticketPrice = Number(place.ticketPrice) || 0;
    const isFree = ticketPrice === 0;

    return {
      ...place,
      id: slug || `place-${index + 1}`,
      name: place.name || "Địa điểm",
      nameEn: place.name || "Destination",
      desc: place.description || "Một điểm đến đáng khám phá tại Gia Lai.",
      descEn: place.description || "A destination worth exploring in Gia Lai.",
      price: isFree ? "Miễn phí" : `${ticketPrice.toLocaleString("vi-VN")}đ`,
      priceVal: ticketPrice,
      hours: place.openingHours || "06:00 - 18:00",
      address: place.accommodation?.address || "Pleiku, Gia Lai",
      addressEn: place.accommodation?.address || "Pleiku, Gia Lai",
      img: place.image || "image/final_destination/Chu_Dang_Ya_Volcano.jpg",
      x: 20 + (index % 4) * 18,
      y: 18 + (index % 3) * 18,
      routeTime: `${20 + index * 10} phút`,
      green: place.category?.includes("nature") || index % 2 === 0,
      tags: Array.isArray(place.category) ? place.category : ["nature"]
    };
  });
}

const PLACES = normalizePlaces(destinations);

function getPlaceByIdOrAlias(id) {
  if (!id) return null;
  const normalizedId = String(id)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const aliasMap = {
    "bien-ho": "bien-ho-to-nung",
    "chu-dang-ya": "chu-dang-ya-volcano",
    "thac-phu-cuong": "phu-cuong-waterfall",
    "chua-minh-thanh": "chua-minh-thanh",
    "chua-buu-minh": "chua-minh-thanh",
    "vuon-che": "bien-ho-to-nung",
    "phong-nguyen": "bien-ho-to-nung"
  };

  const candidateIds = [normalizedId, aliasMap[normalizedId]].filter(Boolean);
  return PLACES.find(place => candidateIds.includes(place.id)) || PLACES[0] || null;
}

const CHAT_TEMPLATES = {
  vi: {
    welcome: "Xin chào! Tôi là trợ lý AI của Gia Lai Smart Travel. Bạn có thể hỏi về điểm đến, món ăn, hoặc điều chỉnh lịch trình hiện tại.",
    noApiKeyWarning: "Bạn đang dùng chế độ dự phòng. Tôi vẫn có thể gợi ý thay đổi lịch trình cơ bản.",
    fallbackResponse: "Tôi có thể gợi ý thêm điểm check-in, đổi sang ít đi bộ hơn, hoặc đề xuất món ăn ngon ở Gia Lai.",
    responses: [
      { keys: ["ít đi bộ", "không thích trekking", "không muốn đi bộ"], action: "reduce_trekking", reply: "Tôi đã đề xuất thay thế các điểm trekking bằng trải nghiệm văn hóa và nghỉ dưỡng dễ dàng hơn." },
      { keys: ["check-in", "sống ảo", "ảnh đẹp"], action: "add_checkin", reply: "Tôi đã thêm một điểm chụp ảnh đẹp phù hợp cho bạn." },
      { keys: ["ăn", "món ăn", "đồ ăn", "food"], action: "add_food", reply: "Tôi đã gợi ý thêm một điểm thưởng thức ẩm thực Gia Lai cho hành trình." }
    ]
  },
  en: {
    welcome: "Hello! I’m your Gia Lai Smart Travel AI assistant. You can ask about attractions, food, or adjust the current itinerary.",
    noApiKeyWarning: "You are currently using fallback mode. I can still suggest basic itinerary changes.",
    fallbackResponse: "I can suggest more photo spots, lighter walking plans, or local food options in Gia Lai.",
    responses: [
      { keys: ["less walking", "not want trekking", "don't like walking"], action: "reduce_trekking", reply: "I’ve suggested replacing trekking stops with easier cultural and resort-style experiences." },
      { keys: ["check-in", "photo", "instagram", "beautiful view"], action: "add_checkin", reply: "I’ve added a scenic photo spot to your itinerary." },
      { keys: ["eat", "food", "meal", "restaurant"], action: "add_food", reply: "I’ve added a local food stop to enrich your travel plan." }
    ]
  }
};

// ---- GLOBAL STATE ----
const appState = {
  lang: "vi",
  theme: "light",
  preferences: new Set(),
  trip: {
    origin: "Pleiku, Gia Lai",
    guests: 2,
    startDate: "",
    endDate: "",
    budget: "standard",
    ecoMode: false
  },
  itinerary: [], // Active generated itinerary
  chatHistory: [],
  unlockedBadges: new Set(),
  apiKey: ""
};

// ---- LOCALIZATION DICTIONARY ----
const TOUR_BADGES = [
  { id: "nature-lover", name: "Nature Lover", nameEn: "Nature Lover", desc: "Chọn thiên nhiên", descEn: "Choose nature-based experiences" },
  { id: "culture-explorer", name: "Culture Explorer", nameEn: "Culture Explorer", desc: "Chọn văn hóa", descEn: "Choose cultural experiences" },
  { id: "foodie", name: "Foodie", nameEn: "Foodie", desc: "Chọn ẩm thực", descEn: "Choose local food" },
  { id: "trekker", name: "Trekking Fan", nameEn: "Trekking Fan", desc: "Chọn trekking", descEn: "Choose trekking" },
  { id: "eco-traveler", name: "Eco Traveler", nameEn: "Eco Traveler", desc: "Chọn du lịch xanh", descEn: "Enable eco travel" }
];

const TRANSLATIONS = {
  vi: {
    brandTitle: "Gia Lai Smart",
    brandSubtitle: "AI Travel Planner",
    navOnboarding: "Trang chủ",
    navPlanner: "Lên kế hoạch",
    navItinerary: "Lịch trình AI",
    navBadges: "Huy hiệu du lịch",
    langLabel: "Ngôn ngữ",
    themeLabel: "Chế độ tối",
    settingsLabel: "Cài đặt API AI",
    
    onboardingBadge: "Trí Tuệ Nhân Tạo Lập Lịch Trình",
    onboardingTitle: "Lập lịch trình du lịch<br><span>Gia Lai thông minh</span>",
    onboardingDesc: "Ứng dụng trí tuệ nhân tạo đề xuất lộ trình tối ưu cá nhân hóa. Trò chuyện với Chatbot AI đồng hành để tùy chỉnh điểm đến tức thì qua giọng nói.",
    onboardingCta: "Bắt đầu ngay",
    floatChat: '"Mình gợi ý đi đồi chè..."',
    floatReviews: "Trải nghiệm tuyệt hảo",
    
    surveyTitle: "Sở thích du lịch",
    surveyDesc: "Chọn phong cách trải nghiệm bạn yêu thích để AI phân tích lộ trình phù hợp.",
    btnBack: "Quay lại",
    btnNext: "Tiếp tục",
    
    tripTitle: "Thông tin chuyến đi",
    tripDesc: "Cung cấp các thông tin cơ bản để AI tối ưu hóa chi phí và khoảng cách di chuyển.",
    lblTripOrigin: "Điểm xuất phát",
    lblTripGuests: "Số lượng người",
    lblTripStart: "Ngày đi",
    lblTripEnd: "Ngày về",
    lblTripBudget: "Mức ngân sách dự kiến",
    budgetStd: "Tiêu chuẩn",
    budgetStdDesc: "Cân bằng chi phí",
    budgetEco: "Tiết kiệm",
    budgetEcoDesc: "Ưu tiên điểm miễn phí",
    budgetLux: "Nghỉ dưỡng",
    budgetLuxDesc: "Trải nghiệm cao cấp",
    btnGenerate: "AI Lập Lịch Trình",
    
    loadingTitle: "AI Đang Thiết Kế Lịch Trình...",
    loadingStep1: "Đang phân tích sở thích của bạn...",
    loadingStep2: "Đang tính toán khoảng cách di chuyển tối ưu...",
    loadingStep3: "Đang lập dự toán chi tiêu...",
    loadingStep4: "Đang tải bản đồ lộ trình...",
    
    ribbonDestLbl: "Chuyến đi",
    ribbonCostLbl: "Tổng chi phí",
    ribbonMatchLbl: "Mức phù hợp",
    ribbonMatchDesc: "Độ tương thích cao",
    ecoLabel: "Du lịch xanh",
    btnShare: "Chia sẻ",
    
    mapTitle: "Bản đồ lộ trình di chuyển",
    chatTitle: "Trợ lý AI đồng hành",
    promptTrek: "🏃‍♂️ Ít đi bộ",
    promptPhoto: "📸 Điểm sống ảo",
    promptFood: "🍜 Món ăn ngon",
    chatPlaceholder: "Yêu cầu AI điều chỉnh lịch trình...",
    
    badgesTitle: "Hệ thống Nhiệm vụ du lịch",
    badgesDesc: "Tùy biến lịch trình và hoàn thành các check-in giả lập để mở khóa các huy hiệu quý giá của Gia Lai.",
    
    detailAddr: "Địa chỉ",
    detailHours: "Giờ mở cửa",
    detailTicket: "Giá vé",
    detailRoute: "Chỉ đường di chuyển",
    
    settingsTitle: "Cấu hình Gemini API",
    settingsDesc: "Nhập Gemini API Key từ Google AI Studio để chatbot trò chuyện thông minh thời gian thực (đổi điểm, gợi ý ăn uống). Dữ liệu chỉ được lưu trên trình duyệt của bạn (localStorage).",
    btnSaveApi: "Lưu cấu hình",
    
    shareTitle: "Chia sẻ lộ trình",
    shareDesc: "Hành trình du lịch Gia Lai của bạn đã được xuất thành công!",
    shareCardTitle: "Hành trình Gia Lai 3 ngày 2 đêm",
    shareCardDesc: "Lộ trình xanh bảo vệ môi trường, chi phí ước tính ~2.450.000đ cho 2 người.",
    copyLinkSuccess: "Đã sao chép link chia sẻ vào clipboard!",
    
    badgeUnlockMsg: "🎉 Chúc mừng! Bạn đã mở khóa huy hiệu: ",
    aiVoiceLoading: "Đang lắng nghe...",
    arHudMode: "AR LENS DISCOVERY: GIA LAI",
    arHudHelp: "Nhấp vào các địa điểm nổi để xem chi tiết",
    badgeLockedDesc: "Nhiệm vụ chưa hoàn thành. Hãy tạo lịch trình phù hợp để mở khóa.",
    
    tagNature: "Thiên nhiên",
    tagCulture: "Văn hóa bản địa",
    tagFood: "Ẩm thực phố núi",
    tagCoffee: "Cà phê Gia Lai",
    tagTrekking: "Trekking / Phượt",
    tagFamily: "Gia đình có trẻ nhỏ",
    tagCheckIn: "Góc chụp ảnh sống ảo",
    tagCamping: "Cắm trại",
    tagResort: "Nghỉ dưỡng"
  },
  en: {
    brandTitle: "Gia Lai Smart",
    brandSubtitle: "AI Travel Planner",
    navOnboarding: "Home",
    navPlanner: "Plan Trip",
    navItinerary: "AI Itinerary",
    navBadges: "Travel Badges",
    langLabel: "Language",
    themeLabel: "Dark Mode",
    settingsLabel: "AI API Settings",
    
    onboardingBadge: "AI-Powered Itinerary Planner",
    onboardingTitle: "Smart Travel Planner<br><span>for Gia Lai Province</span>",
    onboardingDesc: "Artificial intelligence suggests personalized, optimized itineraries. Chat with our companion AI to adjust your trip instantly via text or voice.",
    onboardingCta: "Start Planning",
    floatChat: '"I suggest ancient tea hills..."',
    floatReviews: "Outstanding experience",
    
    surveyTitle: "Travel Interests",
    surveyDesc: "Select your favorite experience styles so AI can customize the route.",
    btnBack: "Back",
    btnNext: "Continue",
    
    tripTitle: "Trip Details",
    tripDesc: "Provide essential details for AI to optimize travel times and budget.",
    lblTripOrigin: "Origin location",
    lblTripGuests: "Number of guests",
    lblTripStart: "Departure Date",
    lblTripEnd: "Return Date",
    lblTripBudget: "Budget preference",
    budgetStd: "Standard",
    budgetStdDesc: "Balanced expense",
    budgetEco: "Budget",
    budgetEcoDesc: "Free spots priority",
    budgetLux: "Premium",
    budgetLuxDesc: "Resort & luxury",
    btnGenerate: "Generate AI Plan",
    
    loadingTitle: "AI Generating Itinerary...",
    loadingStep1: "Analyzing your preferences...",
    loadingStep2: "Calculating optimal transport routes...",
    loadingStep3: "Estimating budget expenses...",
    loadingStep4: "Loading path routes...",
    
    ribbonDestLbl: "Destination",
    ribbonCostLbl: "Total Cost",
    ribbonMatchLbl: "Matching Score",
    ribbonMatchDesc: "Highly compatible",
    ecoLabel: "Eco-Travel",
    btnShare: "Share",
    
    mapTitle: "Transit Routing Map",
    chatTitle: "Companion AI Assistant",
    promptTrek: "🏃‍♂️ Less walking",
    promptPhoto: "📸 Photo spots",
    promptFood: "🍜 Delicacies",
    chatPlaceholder: "Ask AI to change itinerary...",
    
    badgesTitle: "Travel Quests & Badges",
    badgesDesc: "Customize your route and check-in to unlock valuable Gia Lai trophies.",
    
    detailAddr: "Address",
    detailHours: "Opening hours",
    detailTicket: "Ticket price",
    detailRoute: "Get Navigation",
    
    settingsTitle: "Configure Gemini API",
    settingsDesc: "Enter your Gemini API Key from Google AI Studio for smart real-time discussions. The key is only saved on your browser (localStorage).",
    btnSaveApi: "Save Configuration",
    
    shareTitle: "Share Itinerary",
    shareDesc: "Your Gia Lai itinerary has been exported successfully!",
    shareCardTitle: "Gia Lai Journey - 3 Days 2 Nights",
    shareCardDesc: "Eco-friendly route with optimized CO2, estimated ~2,450,000đ for 2 guests.",
    copyLinkSuccess: "Shareable link copied to clipboard!",
    
    badgeUnlockMsg: "🎉 Congratulations! You unlocked badge: ",
    aiVoiceLoading: "Listening...",
    arHudMode: "AR LENS DISCOVERY: GIA LAI",
    arHudHelp: "Tap on floating destinations to view details",
    badgeLockedDesc: "Quest not completed yet. Generate a matching itinerary to unlock.",
    
    tagNature: "Nature",
    tagCulture: "Local Culture",
    tagFood: "Mountain Cuisine",
    tagCoffee: "Gia Lai Coffee",
    tagTrekking: "Trekking / Adventure",
    tagFamily: "Family Friendly",
    tagCheckIn: "Instagram Spots",
    tagCamping: "Camping",
    tagResort: "Resort & Spa"
  }
};

// ---- DOM ELEMENTS ----
const elements = {
  navButtons: document.querySelectorAll(".nav-btn, .mobile-nav-btn"),
  views: document.querySelectorAll(".view-section"),
  btnLangToggle: document.getElementById("btn-lang-toggle"),
  btnLangToggleFloat: document.getElementById("btn-lang-toggle-float"),
  chkDarkMode: document.getElementById("chk-dark-mode"),
  btnThemeToggleFloat: document.getElementById("btn-theme-toggle-float"),
  btnOpenSettings: document.getElementById("btn-open-settings"),
  btnSettingsToggleFloat: document.getElementById("btn-settings-toggle-float"),
  btnCloseSettings: document.getElementById("btn-close-settings"),
  btnSaveSettings: document.getElementById("btn-save-settings"),
  inpApiKey: document.getElementById("inp-api-key"),
  modalSettings: document.getElementById("modal-settings"),
  
  // Onboarding
  btnStartTrip: document.getElementById("btn-start-trip"),
  
  // Survey
  prefChips: document.querySelectorAll(".pref-card"),
  btnSurveyBack: document.getElementById("btn-survey-back"),
  btnSurveyNext: document.getElementById("btn-survey-next"),
  
  // Trip Details
  inpOrigin: document.getElementById("inp-origin"),
  inpGuests: document.getElementById("inp-guests"),
  inpStartDate: document.getElementById("inp-start-date"),
  inpEndDate: document.getElementById("inp-end-date"),
  budgetBtns: document.querySelectorAll(".budget-btn"),
  btnTripBack: document.getElementById("btn-trip-back"),
  btnGenerateItinerary: document.getElementById("btn-generate-itinerary"),
  
  // Dashboard Itinerary
  txtRibbonDest: document.getElementById("txt-ribbon-dest-val"),
  txtRibbonCost: document.getElementById("txt-ribbon-cost-val"),
  txtRibbonMatch: document.getElementById("txt-ribbon-match-val"),
  progressMatch: document.getElementById("progress-match"),
  chkEcoMode: document.getElementById("chk-eco-mode"),
  wdgWeather: document.getElementById("wdg-weather"),
  txtWeatherIcon: document.getElementById("txt-weather-icon"),
  txtWeatherTemp: document.getElementById("txt-weather-temp"),
  txtWeatherStatus: document.getElementById("txt-weather-status"),
  txtWeatherAdvice: document.getElementById("txt-weather-advice"),
  btnLaunchAr: document.getElementById("btn-launch-ar"),
  btnShareItinerary: document.getElementById("btn-share-itinerary"),
  timelineContainer: document.getElementById("timeline-container"),
  
  // Map
  svgRoutePath: document.getElementById("svg-route-path"),
  mapSvg: document.getElementById("map-svg-element"),
  
  // Chatbot
  chatMessagesBox: document.getElementById("chat-messages-box"),
  inpChatMessage: document.getElementById("inp-chat-message"),
  btnVoiceInput: document.getElementById("btn-voice-input"),
  btnSendMessage: document.getElementById("btn-send-message"),
  badgeChatStatus: document.getElementById("badge-chat-status"),
  quickPromptButtons: document.querySelectorAll("#quick-prompts-row .prompt-btn"),
  
  // Detail modal
  modalDetail: document.getElementById("modal-detail"),
  imgDetailPhoto: document.getElementById("img-detail-photo"),
  txtDetailName: document.getElementById("txt-detail-name"),
  txtDetailRating: document.getElementById("txt-detail-rating"),
  txtDetailTag: document.getElementById("txt-detail-tag"),
  txtDetailDesc: document.getElementById("txt-detail-desc"),
  txtDetailAddr: document.getElementById("txt-detail-addr"),
  txtDetailHours: document.getElementById("txt-detail-hours"),
  txtDetailTicket: document.getElementById("txt-detail-ticket"),
  btnCloseDetail: document.getElementById("btn-close-detail"),
  btnDetailDirections: document.getElementById("btn-detail-directions"),
  
  // Badges
  badgesGrid: document.getElementById("badges-grid-container"),
  
  // Share modal
  modalShare: document.getElementById("modal-share"),
  btnCloseShare: document.getElementById("btn-close-share"),
  btnCopyShareLink: document.getElementById("btn-copy-share-link"),
  
  // AR HUD
  viewArHud: document.getElementById("view-ar-hud"),
  btnExitAr: document.getElementById("btn-exit-ar"),
  arPoiCards: document.querySelectorAll(".ar-poi-card")
};

// ---- INITIAL SETUP ----
document.addEventListener("DOMContentLoaded", () => {
  // Load API Key
  const savedKey = localStorage.getItem("gemini_api_key");
  if (savedKey) {
    appState.apiKey = savedKey;
    elements.inpApiKey.value = savedKey;
    updateChatbotStatus(true);
  }
  
  // Default dates: Today and 3 days later
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + 2);
  
  elements.inpStartDate.value = today.toISOString().split("T")[0];
  elements.inpEndDate.value = future.toISOString().split("T")[0];
  
  // Initial page translation
  translateUI();
  
  // Initial gamification load
  renderBadges();
});

// ---- VIEW CONTROLLER (SPA TRANSITIONS) ----
function switchView(targetViewId) {
  elements.views.forEach(view => {
    view.classList.remove("active");
  });
  const activeView = document.getElementById("view-" + targetViewId);
  if (activeView) activeView.classList.add("active");
  
  // Update nav highlight
  elements.navButtons.forEach(btn => {
    if (btn.dataset.target === targetViewId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Special hooks on entering view
  if (targetViewId === "itinerary") {
    if (appState.itinerary.length === 0) {
      generateItineraryLogic();
    } else {
      renderItinerary();
    }
  } else if (targetViewId === "badges") {
    renderBadges();
  }
}

elements.navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    switchView(btn.dataset.target);
  });
});

window.switchView = switchView;
window.openPlaceDetail = openPlaceDetail;

// Handle onboarding navbar anchor links (Địa điểm, Khách sạn)
document.addEventListener("click", (e) => {
  const link = e.target.closest("a.nav-item-link");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || !href.startsWith("#") || href === "#") return;

  const targetId = href.slice(1); // e.g. "section-destinations"
  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  e.preventDefault();

  // If the onboarding view is not active, switch to it first, then scroll
  const onboardingView = document.getElementById("view-onboarding");
  if (onboardingView && !onboardingView.classList.contains("active")) {
    switchView("onboarding");
    // Wait for display change then scroll
    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  } else {
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Update active state on navbar links
  document.querySelectorAll("a.nav-item-link").forEach(a => a.classList.remove("active"));
  link.classList.add("active");
});

elements.btnStartTrip.addEventListener("click", () => switchView("survey"));
elements.btnSurveyBack.addEventListener("click", () => switchView("onboarding"));
elements.btnSurveyNext.addEventListener("click", () => switchView("trip-details"));
elements.btnTripBack.addEventListener("click", () => switchView("survey"));

// ---- THEME AND LANGUAGE CONTROLS ----
const toggleLanguage = () => {
  appState.lang = appState.lang === "vi" ? "en" : "vi";
  const label = appState.lang === "vi" ? "EN" : "VI";
  if (elements.btnLangToggle) elements.btnLangToggle.textContent = label;
  if (elements.btnLangToggleFloat) elements.btnLangToggleFloat.textContent = label;
  translateUI();
  
  // Re-render chat boxes or alerts if needed
  if (appState.itinerary.length > 0) {
    renderItinerary();
  }
  
  // Add message about language change in chatbot
  const welcomeMsg = CHAT_TEMPLATES[appState.lang].welcome;
  elements.chatMessagesBox.innerHTML = "";
  addChatBubble(welcomeMsg, "ai");
};

if (elements.btnLangToggle) elements.btnLangToggle.addEventListener("click", toggleLanguage);
if (elements.btnLangToggleFloat) elements.btnLangToggleFloat.addEventListener("click", toggleLanguage);

const toggleTheme = (isDark) => {
  appState.theme = isDark ? "dark" : "light";
  document.body.classList.toggle("dark-mode", isDark);
  if (elements.chkDarkMode) elements.chkDarkMode.checked = isDark;
};

if (elements.chkDarkMode) elements.chkDarkMode.addEventListener("change", (e) => toggleTheme(e.target.checked));
if (elements.btnThemeToggleFloat) {
  elements.btnThemeToggleFloat.addEventListener("click", () => toggleTheme(appState.theme !== "dark"));
}

// Settings Modal Controls
const openSettings = () => elements.modalSettings.classList.add("active");
if (elements.btnOpenSettings) elements.btnOpenSettings.addEventListener("click", openSettings);
if (elements.btnSettingsToggleFloat) elements.btnSettingsToggleFloat.addEventListener("click", openSettings);
elements.btnCloseSettings.addEventListener("click", () => {
  elements.modalSettings.classList.remove("active");
});
elements.modalSettings.addEventListener("click", (e) => {
  if (e.target === elements.modalSettings) elements.modalSettings.classList.remove("active");
});

elements.btnSaveSettings.addEventListener("click", () => {
  const key = elements.inpApiKey.value.trim();
  appState.apiKey = key;
  // Try a lightweight validation call to Gemini when user saves key
  if (key) {
    addChatBubble(appState.lang === 'vi' ? '⚙️ Đang xác thực API Key...' : '⚙️ Validating API Key...', 'ai');
    callGeminiAPI('Xin chào. Kiểm tra kết nối. (validation)').then(() => {
      localStorage.setItem("gemini_api_key", key);
      updateChatbotStatus(true);
      addChatBubble(appState.lang === 'vi' ? '✅ Gemini API đã hoạt động.' : '✅ Gemini API is active.', 'ai');
    }).catch(err => {
      console.warn('API key validation failed', err);
      localStorage.setItem("gemini_api_key", key);
      updateChatbotStatus(false);
      addChatBubble(appState.lang === 'vi' ? '⚠️ Không thể xác thực API Key. Vui lòng kiểm tra lại trong Cài đặt.' : '⚠️ Unable to validate API Key. Please check it in Settings.', 'ai');
    }).finally(() => {
      elements.modalSettings.classList.remove("active");
    });
  } else {
    // No key: clear and update status
    localStorage.removeItem("gemini_api_key");
    updateChatbotStatus(false);
    elements.modalSettings.classList.remove("active");
  }
});

function updateChatbotStatus(isKeySet) {
  if (isKeySet) {
    elements.badgeChatStatus.textContent = appState.lang === "vi" ? "Gemini AI Hoạt động" : "Gemini AI Active";
    elements.badgeChatStatus.style.background = "rgba(39, 174, 96, 0.1)";
    elements.badgeChatStatus.style.color = "#27AE60";
  } else {
    elements.badgeChatStatus.textContent = appState.lang === "vi" ? "Dự phòng Rule-based" : "Rule-based Fallback";
    elements.badgeChatStatus.style.background = "rgba(212, 93, 42, 0.1)";
    elements.badgeChatStatus.style.color = "var(--secondary)";
  }
}

// Translate Labels Dynamically
function translateUI() {
  const t = TRANSLATIONS[appState.lang];
  
  const setTxt = (id, text, isHtml = false) => {
    const el = document.getElementById(id);
    if (el) {
      if (isHtml) el.innerHTML = text;
      else el.textContent = text;
    }
  };
  
  const setPlaceholder = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = text;
  };
  
  // Brand
  setTxt("txt-brand-title", t.brandTitle);
  setTxt("txt-brand-subtitle", t.brandSubtitle);
  
  // Navigation
  setTxt("txt-nav-onboarding", t.navOnboarding);
  setTxt("txt-nav-planner", t.navPlanner);
  setTxt("txt-nav-itinerary", t.navItinerary);
  setTxt("txt-nav-badges", t.navBadges);
  
  setTxt("txt-mob-onboarding", t.navOnboarding);
  setTxt("txt-mob-planner", t.navPlanner);
  setTxt("txt-mob-itinerary", t.navItinerary);
  setTxt("txt-mob-badges", t.navBadges);
  
  // Controls Label
  setTxt("txt-lang-label", `<i class="fa-solid fa-language"></i> ${t.langLabel}`, true);
  setTxt("txt-theme-label", `<i class="fa-solid fa-moon"></i> ${t.themeLabel}`, true);
  setTxt("txt-settings-label", t.settingsLabel);
  
  // Onboarding
  const homeExploreLink = document.getElementById("nav-home-explore");
  const homeDestinationsLink = document.getElementById("nav-home-destinations");
  const homeHotelsLink = document.getElementById("nav-home-hotels");
  if (homeExploreLink) homeExploreLink.textContent = appState.lang === "vi" ? "Khám phá" : "Explore";
  if (homeDestinationsLink) homeDestinationsLink.textContent = appState.lang === "vi" ? "Địa điểm" : "Places";
  if (homeHotelsLink) homeHotelsLink.textContent = appState.lang === "vi" ? "Khách sạn" : "Hotels";
  setTxt("txt-onboarding-badge", `<i class="fa-solid fa-sparkles"></i> ${t.onboardingBadge}`, true);
  setTxt("txt-onboarding-title", t.onboardingTitle, true);
  setTxt("txt-onboarding-desc", t.onboardingDesc);
  setTxt("txt-onboarding-cta", t.onboardingCta);
  setTxt("txt-float-chat", t.floatChat);
  setTxt("txt-float-reviews", t.floatReviews);
  
  // Home sections
  setTxt("txt-destinations-title", appState.lang === "vi" ? "Các địa điểm nổi tiếng" : "Popular Destinations");
  setTxt("txt-destinations-subtitle", appState.lang === "vi" ? "Gợi ý những điểm đến hàng đầu không thể bỏ qua tại mảnh đất Gia Lai hùng vĩ." : "Highlights of the most inspiring places to visit in Gia Lai.");
  setTxt("txt-hotels-title", appState.lang === "vi" ? "Địa điểm nghỉ ngơi" : "Stay Options");
  setTxt("txt-hotels-subtitle", appState.lang === "vi" ? "Lựa chọn điểm dừng chân lý tưởng, tiện nghi cho chuyến hành trình trọn vẹn." : "Comfortable, convenient overnight stays for a complete travel experience.");

  // Survey
  setTxt("txt-survey-title", t.surveyTitle);
  setTxt("txt-survey-desc", t.surveyDesc);
  setTxt("txt-btn-back", t.btnBack);
  setTxt("txt-btn-next", t.btnNext);
  
  // Survey Preference Chips
  setTxt("tag-lbl-nature", t.tagNature);
  setTxt("tag-lbl-culture", t.tagCulture);
  setTxt("tag-lbl-food", t.tagFood);
  setTxt("tag-lbl-coffee", t.tagCoffee);
  setTxt("tag-lbl-trekking", t.tagTrekking);
  setTxt("tag-lbl-family", t.tagFamily);
  setTxt("tag-lbl-check-in", t.tagCheckIn);
  setTxt("tag-lbl-camping", t.tagCamping);
  setTxt("tag-lbl-resort", t.tagResort);
  
  // Trip Details
  setTxt("txt-trip-title", t.tripTitle);
  setTxt("txt-trip-desc", t.tripDesc);
  setTxt("lbl-trip-origin", t.lblTripOrigin);
  setTxt("lbl-trip-guests", t.lblTripGuests);
  setTxt("lbl-trip-start", t.lblTripStart);
  setTxt("lbl-trip-end", t.lblTripEnd);
  setTxt("lbl-trip-budget", t.lblTripBudget);
  
  setTxt("txt-budget-std", t.budgetStd);
  setTxt("txt-budget-std-desc", t.budgetStdDesc);
  setTxt("txt-budget-eco", t.budgetEco);
  setTxt("txt-budget-eco-desc", t.budgetEcoDesc);
  setTxt("txt-budget-lux", t.budgetLux);
  setTxt("txt-budget-lux-desc", t.budgetLuxDesc);
  
  setTxt("txt-btn-back2", t.btnBack);
  setTxt("txt-btn-generate", t.btnGenerate);
  
  // Loading
  setTxt("txt-loading-title", t.loadingTitle);
  
  // Ribbon
  setTxt("txt-ribbon-dest-lbl", t.ribbonDestLbl);
  setTxt("txt-ribbon-cost-lbl", t.ribbonCostLbl);
  setTxt("txt-ribbon-match-lbl", t.ribbonMatchLbl);
  setTxt("txt-eco-label", t.ecoLabel);
  setTxt("txt-btn-share", t.btnShare);
  
  // Map / Chat Cards
  setTxt("txt-map-title", t.mapTitle);
  setTxt("txt-chat-title", t.chatTitle);
  setPlaceholder("inp-chat-message", t.chatPlaceholder);
  
  // Prompts
  setTxt("btn-prompt-trek", appState.lang === "vi" ? "🏃‍♂️ Ít đi bộ" : "🏃‍♂️ Less Walk");
  setTxt("btn-prompt-photo", appState.lang === "vi" ? "📸 Điểm sống ảo" : "📸 Instagram Spots");
  setTxt("btn-prompt-food", appState.lang === "vi" ? "🍜 Món ngon" : "🍜 Food Guide");
  
  // Badges view
  setTxt("txt-badges-title", t.badgesTitle);
  setTxt("txt-badges-desc", t.badgesDesc);
  
  // Details Modal
  setTxt("lbl-detail-addr", t.detailAddr);
  setTxt("lbl-detail-hours", t.detailHours);
  setTxt("lbl-detail-ticket", t.detailTicket);
  setTxt("txt-detail-route", t.detailRoute);
  
  // Settings Modal
  setTxt("txt-settings-title", `<i class="fa-solid fa-gear"></i> ${t.settingsTitle}`, true);
  setTxt("txt-settings-desc", t.settingsDesc);
  setTxt("txt-btn-save-api", t.btnSaveApi);
  
  // Share Modal
  setTxt("txt-share-title", `<i class="fa-solid fa-share-nodes"></i> ${t.shareTitle}`, true);
  setTxt("txt-share-desc", t.shareDesc);
  setTxt("txt-share-card-title", t.shareCardTitle);
  setTxt("txt-share-card-desc", t.shareCardDesc);
  
  updateChatbotStatus(!!appState.apiKey);
}

// ---- CHIP CHOOSE INTERACTION ----
elements.prefChips.forEach(chip => {
  chip.addEventListener("click", () => {
    const tag = chip.dataset.tag;
    chip.classList.toggle("selected");
    if (appState.preferences.has(tag)) {
      appState.preferences.delete(tag);
    } else {
      appState.preferences.add(tag);
    }
  });
});

// ---- BUDGET BUTTONS INTERACTION ----
elements.budgetBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    elements.budgetBtns.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    appState.trip.budget = btn.dataset.budget;
  });
});

// ---- SCREEN 4: AI PLAN GENERATION ANIMATION ----
elements.btnGenerateItinerary.addEventListener("click", () => {
  // Capture trip inputs
  appState.trip.origin = elements.inpOrigin.value.trim() || "Pleiku";
  appState.trip.guests = parseInt(elements.inpGuests.value) || 2;
  appState.trip.startDate = elements.inpStartDate.value;
  appState.trip.endDate = elements.inpEndDate.value;
  
  switchView("loading");
  
  // Simulate load phase text updates
  const steps = [
    TRANSLATIONS[appState.lang].loadingStep1,
    TRANSLATIONS[appState.lang].loadingStep2,
    TRANSLATIONS[appState.lang].loadingStep3,
    TRANSLATIONS[appState.lang].loadingStep4
  ];
  
  let currentStepIndex = 0;
  const interval = setInterval(() => {
    if (currentStepIndex < steps.length) {
      document.getElementById("txt-loading-step").textContent = steps[currentStepIndex];
      currentStepIndex++;
    } else {
      clearInterval(interval);
      // Execute the generation algorithm
      generateItineraryLogic();
      switchView("itinerary");
    }
  }, 800);
});

// ---- SCHEDULER LOGIC (CÁ NHÂN HÓA LỊCH TRÌNH) ----
function generateItineraryLogic() {
  const chosenTags = Array.from(appState.preferences);
  const ecoMode = appState.trip.ecoMode;
  
  // Filter places based on chosen preferences
  let filtered = PLACES.filter(place => {
    // If eco mode, prioritize eco friendliness
    if (ecoMode && !place.green) return false;
    
    // Check tags matching
    if (chosenTags.length === 0) return true; // match all
    return place.tags.some(tag => chosenTags.includes(tag));
  });
  
  // If too few places found, backfill with default places
  if (filtered.length < 3) {
    filtered = PLACES.filter(place => ecoMode ? place.green : true);
  }
  
  // Create 3 days schedule
  const itinerary = [
    { day: 1, items: [] },
    { day: 2, items: [] },
    { day: 3, items: [] }
  ];
  
  // Distribute places across 3 days
  filtered.forEach((place, index) => {
    const dayIndex = index % 3;
    itinerary[dayIndex].items.push(place);
  });
  
  // Ensure every day has at least one place
  itinerary.forEach((day, index) => {
    if (day.items.length === 0) {
      // Find a placeholder place not already in that day
      const fallbackPlace = PLACES[index % PLACES.length];
      day.items.push(fallbackPlace);
    }
  });
  
  appState.itinerary = itinerary;
  
  // Recalculate cost & matching score
  calculateCostAndMatch(chosenTags);
}

function calculateCostAndMatch(chosenTags) {
  const guests = appState.trip.guests;
  const budgetTier = appState.trip.budget;
  const ecoMode = appState.trip.ecoMode;
  
  // Cost Calculation
  let baseExpense = 0;
  let foodExpensePerDay = 250000; // Standard
  
  if (budgetTier === "economy") {
    foodExpensePerDay = 120000;
  } else if (budgetTier === "luxury") {
    foodExpensePerDay = 600000;
  }
  
  appState.itinerary.forEach(day => {
    day.items.forEach(place => {
      baseExpense += place.priceVal;
    });
  });
  
  // Total cost = (place tickets + food) * guests
  const totalCost = (baseExpense + (foodExpensePerDay * 3)) * guests;
  
  // Format total cost
  const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
  let formattedCost = formatter.format(totalCost).replace("₫", "đ");
  if (appState.lang === "en") {
    // Show USD equivalent
    const costInUsd = Math.round(totalCost / 25000);
    formattedCost = `$${costInUsd} (~ ${formattedCost})`;
  }
  
  elements.txtRibbonCost.textContent = formattedCost;
  elements.txtRibbonDest.textContent = `${appState.trip.origin} → Pleiku`;
  
  // Matching Score Calculation
  let totalMatches = 0;
  let totalPlacesCount = 0;
  
  appState.itinerary.forEach(day => {
    day.items.forEach(place => {
      totalPlacesCount++;
      const hasMatch = place.tags.some(tag => chosenTags.includes(tag));
      if (hasMatch) totalMatches++;
    });
  });
  
  let score = 70; // baseline
  if (totalPlacesCount > 0 && chosenTags.length > 0) {
    score = Math.round((totalMatches / totalPlacesCount) * 30) + 70;
  }
  if (ecoMode) score = Math.min(100, score + 5); // eco bonus matching
  
  elements.txtRibbonMatch.textContent = `${score}%`;
  
  // Progress Circle representation
  const deg = Math.round((score / 100) * 360);
  elements.progressMatch.style.setProperty("--percent-val", `${deg}deg`);
  
  // Trigger gamification unlock checks
  checkBadgeUnlocks(score);
}

// ---- RENDERING THE ITINERARY ----
function renderItinerary() {
  elements.timelineContainer.innerHTML = "";
  const isEn = appState.lang === "en";
  
  appState.itinerary.forEach(day => {
    const dayCard = document.createElement("div");
    dayCard.className = "day-card";
    
    const dateStr = getOffsetDateString(appState.trip.startDate, day.day - 1);
    
    dayCard.innerHTML = `
      <div class="day-card-header">
        <h3 class="day-title">${isEn ? 'Day' : 'Ngày'} ${day.day}</h3>
        <span class="day-meta">${dateStr}</span>
      </div>
      <div class="activity-list">
        ${day.items.map((place, idx) => `
          <div class="activity-item" data-id="${place.id}">
            <div class="activity-bullet">${idx + 1}</div>
            <div class="activity-details">
              <div class="activity-header">
                <span class="activity-name">${isEn ? place.nameEn : place.name}</span>
                <span class="activity-tag">${place.tags[0].toUpperCase()}</span>
              </div>
              <p class="activity-desc">${isEn ? place.descEn : place.desc.slice(0, 100)}...</p>
              <div class="activity-bottom">
                <span><i class="fa-solid fa-clock"></i> ${place.hours}</span>
                <span><i class="fa-solid fa-ticket"></i> ${isEn && place.price === "Miễn phí" ? "Free" : place.price}</span>
                ${place.green ? `<span class="green-badge eco-friendly"><i class="fa-solid fa-leaf"></i> Eco</span>` : ""}
              </div>
            </div>
          </div>
          ${idx < day.items.length - 1 ? `
            <div class="transit-leg">
              <i class="fa-solid fa-arrow-down-long"></i>
              <span>${place.routeTime} (${place.x} km)</span>
            </div>
          ` : ""}
        `).join("")}
      </div>
    `;
    
    elements.timelineContainer.appendChild(dayCard);
  });
  
  // Attach detail triggers
  document.querySelectorAll(".activity-item").forEach(item => {
    item.addEventListener("click", () => {
      openPlaceDetail(item.dataset.id);
    });
  });
  
  // Draw route on map
  drawRouteMap();
}

function getOffsetDateString(baseDateStr, offsetDays) {
  if (!baseDateStr) return "";
  const d = new Date(baseDateStr);
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString(appState.lang === "vi" ? "vi-VN" : "en-US", { weekday: 'long', day: 'numeric', month: 'short' });
}

// Eco Mode trigger
elements.chkEcoMode.addEventListener("change", (e) => {
  appState.trip.ecoMode = e.target.checked;
  generateItineraryLogic();
  renderItinerary();
});

// ---- INTERACTIVE SVG MAP ROUTING ----
function drawRouteMap() {
  // Clear previous path/pins
  elements.mapSvg.innerHTML = `<path d="" class="route-path" id="svg-route-path"></path>`;
  const newSvgRoutePath = document.getElementById("svg-route-path");
  
  // Collect all places coordinates in timeline order
  const orderedPlaces = [];
  appState.itinerary.forEach(day => {
    day.items.forEach(place => {
      orderedPlaces.push(place);
    });
  });
  
  if (orderedPlaces.length === 0) return;
  
  // Build SVG Path string
  let pathD = `M ${orderedPlaces[0].x} ${orderedPlaces[0].y}`;
  for (let i = 1; i < orderedPlaces.length; i++) {
    pathD += ` L ${orderedPlaces[i].x} ${orderedPlaces[i].y}`;
  }
  newSvgRoutePath.setAttribute("d", pathD);
  
  // Draw circles for each point
  orderedPlaces.forEach((place, index) => {
    const pinG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    pinG.setAttribute("class", "map-pin");
    pinG.setAttribute("transform", `translate(${place.x}, ${place.y})`);
    pinG.dataset.id = place.id;
    
    // Circle
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", "4");
    circle.setAttribute("cx", "0");
    circle.setAttribute("cy", "0");
    
    // Label text
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", "6");
    label.setAttribute("y", "3");
    label.setAttribute("class", "map-label");
    label.textContent = `${index + 1}. ${appState.lang === 'vi' ? place.name : place.nameEn}`;
    
    pinG.appendChild(circle);
    pinG.appendChild(label);
    
    // Tooltip trigger on hover/click
    pinG.addEventListener("click", () => {
      openPlaceDetail(place.id);
    });
    
    elements.mapSvg.appendChild(pinG);
  });
}

// ---- SCREEN 6: PLACE DETAILS MODAL ----
function openPlaceDetail(placeId) {
  const place = PLACES.find(p => p.id === placeId);
  if (!place) return;
  
  const isEn = appState.lang === "en";
  elements.imgDetailPhoto.src = place.img;
  elements.txtDetailName.textContent = isEn ? place.nameEn : place.name;
  elements.txtDetailRating.textContent = `⭐ ${place.rating}`;
  elements.txtDetailTag.textContent = place.tags[0].toUpperCase();
  elements.txtDetailDesc.textContent = isEn ? place.descEn : place.desc;
  elements.txtDetailAddr.textContent = isEn ? place.addressEn : place.address;
  elements.txtDetailHours.textContent = place.hours;
  elements.txtDetailTicket.textContent = isEn && place.price === "Miễn phí" ? "Free" : place.price;
  
  elements.modalDetail.classList.add("active");
}

elements.btnCloseDetail.addEventListener("click", () => {
  elements.modalDetail.classList.remove("active");
});
elements.modalDetail.addEventListener("click", (e) => {
  if (e.target === elements.modalDetail) elements.modalDetail.classList.remove("active");
});

elements.btnDetailDirections.addEventListener("click", () => {
  alert(appState.lang === "vi" ? "🗺️ Đang chuyển hướng đến Google Maps cho địa điểm này..." : "🗺️ Redirecting to Google Maps navigation...");
});

// ---- SCREEN 5: AI CHATBOT EXPERIENCE & REAL GEMINI CALL ----
const localChatHistory = [];

function addChatBubble(text, sender) {
  // Normalize and deduplicate warning lines
  const parts = String(text).split(/\n+/).map(p => p.trim()).filter(Boolean);
  const seenWarnings = [];
  const outParts = [];
  let hasConnectionWarn = false;
  parts.forEach(p => {
    if (p.startsWith('⚠️')) {
      const key = p.replace(/⚠️/g, '').trim().toLowerCase();
      const isConnection = key.includes('kết nối') || key.includes('connection') || key.includes('lỗi kết nối');
      const isFallback = key.includes('dự phòng') || key.includes('fallback') || key.includes('Bạn đang dùng'.toLowerCase());

      if (isConnection) hasConnectionWarn = true;

      // If we already have a connection warning, skip adding a generic fallback warning
      if (hasConnectionWarn && isFallback) return;

      if (!seenWarnings.some(s => key.includes(s) || s.includes(key))) {
        seenWarnings.push(key);
        outParts.push(p);
      }
    } else {
      outParts.push(p);
    }
  });

  let finalText = outParts.join('\n\n');

  // If multiple warnings got concatenated (no separators), extract and normalize them
  const warnMatches = finalText.match(/⚠️[^⚠️]*/g) || [];
  if (warnMatches.length > 1) {
    const uniqueWarns = [];
    let hasConn = false;
    warnMatches.forEach(w => {
      const key = w.replace(/⚠️/g, '').trim().toLowerCase();
      const isConn = key.includes('kết nối') || key.includes('connection') || key.includes('lỗi kết nối');
      if (isConn) {
        hasConn = true;
        if (!uniqueWarns.some(u => u.toLowerCase().includes('kết nối') || u.toLowerCase().includes('connection'))) {
          uniqueWarns.push(w.trim());
        }
      } else {
        if (hasConn) return; // prefer connection warnings over generic fallback
        if (!uniqueWarns.some(u => u.trim().toLowerCase() === w.trim().toLowerCase())) {
          uniqueWarns.push(w.trim());
        }
      }
    });

    // Remove all warning parts from original text and rebuild
    const rest = finalText.replace(/⚠️[^⚠️]*/g, '').trim();
    finalText = uniqueWarns.join('\n\n') + (rest ? '\n\n' + rest : '');
  }

  // Avoid adding exact duplicate consecutive bubbles
  const lastBubble = elements.chatMessagesBox.lastElementChild;
  if (lastBubble && lastBubble.textContent && lastBubble.textContent.trim() === finalText.trim()) return;

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  if (sender === "ai" && finalText.startsWith("⚠️")) {
    bubble.style.borderLeft = "4px solid #E0A93B";
  }
  bubble.innerHTML = finalText.replace(/\n/g, "<br>");
  elements.chatMessagesBox.appendChild(bubble);
  
  // Speak the AI response if speech is toggled or voice response available (Bonus 1)
  if (sender === "ai" && 'speechSynthesis' in window) {
    // Only speak short summary or the text to avoid spamming
    const cleanSpeech = text.replace(/⚠️/g, "").replace(/<br>/g, " ");
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = appState.lang === "vi" ? "vi-VN" : "en-US";
    // window.speechSynthesis.speak(utterance); // Auto speak on response (Optional)
  }
  
  elements.chatMessagesBox.scrollTop = elements.chatMessagesBox.scrollHeight;
}

// Initial bot greeting
addChatBubble(CHAT_TEMPLATES[appState.lang].welcome, "ai");

elements.btnSendMessage.addEventListener("click", handleChatSubmit);
elements.inpChatMessage.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleChatSubmit();
});

// Handle Quick Prompt Clicks
elements.quickPromptButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const promptText = btn.dataset.prompt;
    elements.inpChatMessage.value = promptText;
    handleChatSubmit();
  });
});

async function handleChatSubmit() {
  const text = elements.inpChatMessage.value.trim();
  if (!text) return;
  
  elements.inpChatMessage.value = "";
  
  // Render User bubble
  addChatBubble(text, "user");
  localChatHistory.push({ role: "user", text });
  
  // Show AI typing indicator
  const typing = document.createElement("div");
  typing.className = "chat-bubble ai";
  typing.id = "chat-typing-indicator";
  typing.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  elements.chatMessagesBox.appendChild(typing);
  elements.chatMessagesBox.scrollTop = elements.chatMessagesBox.scrollHeight;
  
  try {
    let aiResponse = "";
    if (appState.apiKey) {
      try {
        aiResponse = await callGeminiAPI(text);
      } catch (apiErr) {
        // If Gemini fails, mark status and fallback to rule-based responses
        console.warn('Gemini API error:', apiErr);
        updateChatbotStatus(false);
        // Combine warning + fallback into a single AI bubble to avoid duplicates
        const warn = appState.lang === 'vi' ? '⚠️ Lỗi kết nối với Gemini AI. Đang sử dụng chế độ dự phòng.' : '⚠️ Gemini AI connection error. Using fallback mode.';
        aiResponse = warn + '\n\n' + handleRuleBasedResponse(text);
      }
    } else {
      // No API key configured: show single warning + fallback reply
      const warn = appState.lang === 'vi' ? '⚠️ Bạn đang dùng chế độ dự phòng. Vui lòng cập nhật API Key trong Cài đặt để sử dụng Gemini AI.' : '⚠️ You are using fallback mode. Please configure your API Key in Settings to use Gemini AI.';
      aiResponse = warn + '\n\n' + handleRuleBasedResponse(text);
    }
    
    // Sanitize combined response: avoid duplicate generic fallback warning when connection warning exists
    const genericNoKey = CHAT_TEMPLATES[appState.lang].noApiKeyWarning;
    if (aiResponse && aiResponse.includes('Lỗi kết nối') && genericNoKey && aiResponse.includes(genericNoKey)) {
      aiResponse = aiResponse.replace(genericNoKey, '').replace(/\n{2,}/g, '\n\n').trim();
    }

    // Remove typing indicator and show response
    const currentTyping = document.getElementById("chat-typing-indicator");
    if (currentTyping) currentTyping.remove();
    
    addChatBubble(aiResponse, "ai");
    localChatHistory.push({ role: "model", text: aiResponse });
    
  } catch (err) {
    const currentTyping = document.getElementById("chat-typing-indicator");
    if (currentTyping) currentTyping.remove();

    console.error('Chat submit error:', err);
    // If error looks like network/API issue, show localized guidance and fallback
    const isApiError = err && (String(err).includes('Gemini') || String(err).includes('NetworkError') || String(err).includes('Failed to fetch'));
    if (isApiError) {
      updateChatbotStatus(false);
      const warn = appState.lang === 'vi' ? '⚠️ Lỗi kết nối với Gemini AI. Vui lòng kiểm tra API Key trong Cài đặt hoặc tắt để dùng chế độ dự phòng.' : '⚠️ Gemini AI connection error. Please check your API Key in Settings or continue with fallback mode.';
      const fallback = handleRuleBasedResponse(text);
      addChatBubble(warn + '\n\n' + fallback, 'ai');
    } else {
      addChatBubble(appState.lang === 'vi' ? 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.' : 'Sorry, an error occurred. Please try again later.', 'ai');
    }
  }
}

// Call Real Gemini LLM API (client side)
async function callGeminiAPI(userPrompt) {
  const currentItineraryText = appState.itinerary.map(day => {
    return `Day ${day.day}: ` + day.items.map(p => p.name).join(", ");
  }).join("\n");
  
  const systemContext = `
    You are a smart travel AI Assistant for Gia Lai province, Vietnam. 
    The visitor is viewing this current itinerary:
    ${currentItineraryText}
    
    The budget level is: ${appState.trip.budget}
    The number of guests is: ${appState.trip.guests}
    Eco Mode (Sustainable travel) is: ${appState.trip.ecoMode ? "ENABLED" : "DISABLED"}
    
    Answer in ${appState.lang === "vi" ? "Vietnamese" : "English"} only.
    You can suggest adjustments, describe food options, or answer questions about weather or spots.
    Keep your response concise and structured (under 120 words).
  `;
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${appState.apiKey}`;
  
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemContext + "\nUser question/request: " + userPrompt }] }
        ]
      })
    });
  } catch (networkErr) {
    throw new Error('NetworkError: ' + (networkErr.message || networkErr));
  }

  if (!response.ok) {
    let bodyText = '';
    try { bodyText = await response.text(); } catch (e) { bodyText = ''; }
    const errMsg = `Gemini API Error: ${response.status} ${response.statusText} ${bodyText}`;
    throw new Error(errMsg);
  }

  const data = await response.json();
  // defensive checks
  if (!data || !data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
    throw new Error('Gemini API Error: invalid response shape');
  }
  return data.candidates[0].content.parts[0].text;
}

// Smart Rule-based Response Parser with state mutations (makes the mock chatbot feel functional!)
function handleRuleBasedResponse(inputText) {
  const lower = inputText.toLowerCase();
  const langTemplates = CHAT_TEMPLATES[appState.lang];
  
  // Check matching rules
  const matchedRule = langTemplates.responses.find(r => r.keys.some(k => lower.includes(k)));
  
  if (matchedRule) {
    // Perform state mutations to visually alter the UI (WOW factor!)
    mutateTimelineOnAction(matchedRule.action);
    return matchedRule.reply;
  }
  return langTemplates.fallbackResponse;
}

// Dynamic Timeline Mutation on specific Chat commands (WOW factor)
function mutateTimelineOnAction(action) {
  let changed = false;
  
  if (action === "reduce_trekking") {
    // Replace Chu Dang Ya (trekking) with Chua Buu Minh (culture) in timeline
    appState.itinerary.forEach(day => {
      day.items = day.items.map(place => {
        if (place.id === "chu-dang-ya") {
          changed = true;
          return getPlaceByIdOrAlias("chua-minh-thanh");
        }
        return place;
      });
    });
  } else if (action === "add_checkin") {
    // Add road pine / tea hills if not there
    let alreadyHasPine = false;
    appState.itinerary.forEach(day => {
      if (day.items.some(p => p.id === "vuon-che")) alreadyHasPine = true;
    });
    
    if (!alreadyHasPine) {
      appState.itinerary[0].items.push(getPlaceByIdOrAlias("vuon-che"));
      changed = true;
    }
  } else if (action === "add_food") {
    // Insert Pleiku night market on day 1 evening
    let alreadyHasMarket = false;
    appState.itinerary.forEach(day => {
      if (day.items.some(p => p.id === "phong-nguyen")) alreadyHasMarket = true;
    });
    
    if (!alreadyHasMarket) {
      appState.itinerary[0].items.push(getPlaceByIdOrAlias("phong-nguyen"));
      changed = true;
    }
  }
  
  if (changed) {
    setTimeout(() => {
      renderItinerary();
      calculateCostAndMatch(Array.from(appState.preferences));
    }, 600);
  }
}

// ---- BONUS 1: AI VOICE ASSISTANT (SPEECH TO TEXT & TEXT TO SPEECH) ----
let voiceRecognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceRecognition = new SpeechRec();
  voiceRecognition.continuous = false;
  voiceRecognition.interimResults = false;
  
  voiceRecognition.onstart = () => {
    elements.btnVoiceInput.classList.add("mic-active");
    elements.inpChatMessage.placeholder = TRANSLATIONS[appState.lang].aiVoiceLoading;
  };
  
  voiceRecognition.onend = () => {
    elements.btnVoiceInput.classList.remove("mic-active");
    elements.inpChatMessage.placeholder = TRANSLATIONS[appState.lang].chatPlaceholder;
  };
  
  voiceRecognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    elements.inpChatMessage.value = transcript;
    handleChatSubmit();
  };
} else {
  // Hide mic or disable it if not supported
  elements.btnVoiceInput.style.opacity = "0.3";
  elements.btnVoiceInput.title = "Voice Input not supported in this browser";
}

elements.btnVoiceInput.addEventListener("click", () => {
  if (!voiceRecognition) return;
  
  if (elements.btnVoiceInput.classList.contains("mic-active")) {
    voiceRecognition.stop();
  } else {
    voiceRecognition.lang = appState.lang === "vi" ? "vi-VN" : "en-US";
    voiceRecognition.start();
  }
});

// ---- BONUS 4: MOCK AR VIEW SCREEN ----
elements.btnLaunchAr.addEventListener("click", () => {
  elements.viewArHud.classList.add("active");
  // Toggle body overflow
  document.body.style.overflow = "hidden";
});

elements.btnExitAr.addEventListener("click", () => {
  elements.viewArHud.classList.remove("active");
  document.body.style.overflow = "auto";
});

elements.arPoiCards.forEach(card => {
  card.addEventListener("click", () => {
    const id = card.dataset.id;
    openPlaceDetail(id);
  });
});

// Simulate Camera panning effect by shifting the background image position slightly
elements.viewArHud.addEventListener("mousemove", (e) => {
  if (!elements.viewArHud.classList.contains("active")) return;
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  elements.mapSvg.style.transform = `translate(${(x - 0.5) * 30}px, ${(y - 0.5) * 30}px)`;
});

// ---- BONUS 5: GAMIFICATION / TOUR BADGES ----
function renderBadges() {
  elements.badgesGrid.innerHTML = "";
  const isEn = appState.lang === "en";
  
  TOUR_BADGES.forEach(badge => {
    const isUnlocked = appState.unlockedBadges.has(badge.id);
    const card = document.createElement("div");
    card.className = `badge-card ${isUnlocked ? 'unlocked' : ''}`;
    
    card.innerHTML = `
      <div class="badge-icon">${badge.icon || "🏆"}</div>
      <div class="badge-info">
        <h4>${isEn ? badge.nameEn : badge.name}</h4>
        <p>${isUnlocked ? (isEn ? badge.descEn : badge.desc) : (isEn ? TRANSLATIONS.en.badgeLockedDesc : TRANSLATIONS.vi.badgeLockedDesc)}</p>
      </div>
    `;
    
    elements.badgesGrid.appendChild(card);
  });
}

function checkBadgeUnlocks(matchScore) {
  let unlockedNow = [];
  const chosenTags = Array.from(appState.preferences);
  
  // Rule 1: Nature Lover
  if (chosenTags.includes("nature") && !appState.unlockedBadges.has("nature-lover")) {
    appState.unlockedBadges.add("nature-lover");
    unlockedNow.push("nature-lover");
  }
  
  // Rule 2: Culture Explorer
  if (chosenTags.includes("culture") && !appState.unlockedBadges.has("culture-explorer")) {
    appState.unlockedBadges.add("culture-explorer");
    unlockedNow.push("culture-explorer");
  }
  
  // Rule 3: Foodie
  if (chosenTags.includes("food") && !appState.unlockedBadges.has("foodie")) {
    appState.unlockedBadges.add("foodie");
    unlockedNow.push("foodie");
  }
  
  // Rule 4: Trekker
  if (chosenTags.includes("trekking") && !appState.unlockedBadges.has("trekker")) {
    appState.unlockedBadges.add("trekker");
    unlockedNow.push("trekker");
  }
  
  // Rule 5: Eco traveler
  if (appState.trip.ecoMode && !appState.unlockedBadges.has("eco-traveler")) {
    appState.unlockedBadges.add("eco-traveler");
    unlockedNow.push("eco-traveler");
  }
  
  // Display toast alert for unlocked badges
  if (unlockedNow.length > 0) {
    unlockedNow.forEach(id => {
      const badge = TOUR_BADGES.find(b => b.id === id);
      showUnlockToast(badge);
    });
    renderBadges();
  }
}

function showUnlockToast(badge) {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "24px";
  toast.style.right = "24px";
  toast.style.background = "#09261E";
  toast.style.color = "white";
  toast.style.padding = "16px 24px";
  toast.style.borderRadius = "12px";
  toast.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "12px";
  toast.style.zIndex = "2000";
  toast.style.border = "2px solid var(--accent)";
  toast.style.animation = "slideInRight 0.35s ease-out";
  
  toast.innerHTML = `
    <div style="font-size:24px;">🏆</div>
    <div>
      <div style="font-size:11px; text-transform:uppercase; color:var(--accent); font-weight:800;">Badge Unlocked!</div>
      <strong style="font-size:14px;">${appState.lang === "vi" ? badge.name : badge.nameEn}</strong>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.5s ease-out";
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// Add CSS keyframes dynamically for Toast
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fadeOut {
    to { opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);

// ---- BONUS 6: SHARE ITINERARY ----
elements.btnShareItinerary.addEventListener("click", () => {
  // Update texts in share card
  const title = appState.lang === "vi" 
    ? `Hành trình Gia Lai ${appState.trip.guests} người` 
    : `Gia Lai Trip for ${appState.trip.guests} guests`;
    
  const desc = appState.lang === "vi"
    ? `Ngân sách: ${elements.txtRibbonCost.textContent} - Độ tương thích: ${elements.txtRibbonMatch.textContent}`
    : `Cost: ${elements.txtRibbonCost.textContent} - Matching Score: ${elements.txtRibbonMatch.textContent}`;
    
  document.getElementById("txt-share-card-title").textContent = title;
  document.getElementById("txt-share-card-desc").textContent = desc;
  
  elements.modalShare.classList.add("active");
});

elements.btnCloseShare.addEventListener("click", () => {
  elements.modalShare.classList.remove("active");
});

elements.modalShare.addEventListener("click", (e) => {
  if (e.target === elements.modalShare) elements.modalShare.classList.remove("active");
});

elements.btnCopyShareLink.addEventListener("click", () => {
  const mockUrl = window.location.href + "?tripId=" + Math.floor(Math.random() * 900000 + 100000);
  navigator.clipboard.writeText(mockUrl).then(() => {
    alert(TRANSLATIONS[appState.lang].copyLinkSuccess);
    elements.modalShare.classList.remove("active");
  });
});
