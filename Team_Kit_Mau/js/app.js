// Team kit mẫu - minh họa các tương tác cơ bản: điều hướng, chip chọn, lịch trình, chatbot, chi tiết địa điểm
// Đội thi tham khảo cấu trúc, không cần giữ nguyên logic này khi làm bài thi thật.

const state = {
  selectedChips: new Set(),
};

// ---- Điều hướng giữa các view ----
document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

function switchView(view) {
  document.querySelectorAll(".view").forEach((v) => (v.style.display = "none"));
  document.getElementById("view-" + view).style.display = "block";
  document.querySelectorAll(".nav-link").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === view);
  });
  if (view === "itinerary") renderItinerary();
}

// ---- Chip chọn sở thích ----
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    chip.classList.toggle("selected");
    const key = chip.dataset.chip;
    if (state.selectedChips.has(key)) {
      state.selectedChips.delete(key);
    } else {
      state.selectedChips.add(key);
    }
  });
});

// ---- Lưới địa điểm ----
function renderPlaceGrid() {
  const grid = document.getElementById("place-grid");
  grid.innerHTML = PLACES.map(
    (p) => `
    <div class="place-card" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}">
      <div class="pc-body">
        <h3>${p.name}</h3>
        <p>${p.desc.slice(0, 60)}...</p>
        <span class="tag">${p.tag}</span>
      </div>
    </div>
  `
  ).join("");

  grid.querySelectorAll(".place-card").forEach((card) => {
    card.addEventListener("click", () => openPlaceDetail(card.dataset.id));
  });
}

// ---- Chi tiết địa điểm (overlay) ----
function openPlaceDetail(id) {
  const place = PLACES.find((p) => p.id === id);
  if (!place) return;
  const overlay = document.getElementById("place-overlay");
  const card = document.getElementById("place-detail-card");
  card.innerHTML = `
    <img src="${place.img}" alt="${place.name}">
    <div class="pd-body">
      <h3>${place.name}</h3>
      <p>${place.desc}</p>
      <div class="pd-row"><span>Đánh giá</span><span>\u2b50 ${place.rating}</span></div>
      <div class="pd-row"><span>Giờ mở cửa</span><span>${place.hours}</span></div>
      <div class="pd-row"><span>Giá vé</span><span>${place.price}</span></div>
      <button class="pd-close" id="pd-close-btn">Đóng</button>
    </div>
  `;
  overlay.classList.add("open");
  document.getElementById("pd-close-btn").addEventListener("click", closePlaceDetail);
}
function closePlaceDetail() {
  document.getElementById("place-overlay").classList.remove("open");
}
document.getElementById("place-overlay").addEventListener("click", (e) => {
  if (e.target.id === "place-overlay") closePlaceDetail();
});

// ---- Lịch trình ----
function renderItinerary() {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = SAMPLE_ITINERARY.map(
    (d) => `
    <div class="timeline-day">
      <h4>Ngày ${d.day}</h4>
      <ul>${d.items.map((i) => `<li>${i}</li>`).join("")}</ul>
    </div>
  `
  ).join("");

  const matchPercent = state.selectedChips.size > 0 ? 86 : 72;
  document.getElementById("cost-summary").innerHTML = `
    <div>
      <div class="amount">~ 2.450.000đ</div>
      <div class="match">Tổng chi phí ước tính cho 2 người</div>
    </div>
    <div class="match">Mức độ phù hợp: ${matchPercent}%</div>
  `;
}

// ---- Chatbot ----
const chatWindow = document.getElementById("chat-window");
function addBubble(text, who) {
  const div = document.createElement("div");
  div.className = "bubble " + who;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
addBubble("Chào bạn! Mình là trợ lý AI của Smart Travel Gia Lai. Bạn muốn điều chỉnh gì trong lịch trình?", "ai");

document.getElementById("chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;
  addBubble(text, "user");
  input.value = "";

  const lower = text.toLowerCase();
  const found = CHATBOT_RESPONSES.find((r) => r.match.some((m) => lower.includes(m)));
  setTimeout(() => addBubble(found ? found.reply : DEFAULT_REPLY, "ai"), 350);
});

// ---- Khởi tạo ----
renderPlaceGrid();
