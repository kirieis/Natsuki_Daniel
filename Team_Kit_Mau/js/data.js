// Dữ liệu mẫu minh họa - đội thi tự thay bằng dữ liệu thật của mình
const PLACES = [
  {
    id: "bien-ho",
    name: "Biển Hồ",
    img: "images/bien-ho.jpg",
    tag: "Thiên nhiên",
    desc: "Hồ nước ngọt giữa núi lửa, mặt nước trong xanh quanh năm, nơi check-in nổi tiếng nhất Pleiku.",
    rating: 4.8,
    hours: "06:00 - 18:00",
    price: "Miễn phí",
  },
  {
    id: "chu-dang-ya",
    name: "Núi lửa Chư Đăng Ya",
    img: "images/chu-dang-ya.jpg",
    tag: "Trekking",
    desc: "Miệng núi lửa đã ngưng hoạt động, mùa hoa dã quỳ nở vàng rực vào tháng 11.",
    rating: 4.7,
    hours: "05:30 - 17:30",
    price: "20.000đ",
  },
  {
    id: "phong-nguyen",
    name: "Phố đêm Pleiku",
    img: "images/phong-nguyen.jpg",
    tag: "Ẩm thực",
    desc: "Khu phố đi bộ về đêm, tập trung các quán ăn đặc sản và cà phê phố núi.",
    rating: 4.5,
    hours: "17:00 - 23:00",
    price: "Miễn phí",
  },
  {
    id: "lang-jrai",
    name: "Làng văn hóa Jrai",
    img: "images/lang-jrai.jpg",
    tag: "Văn hóa",
    desc: "Trải nghiệm nhà rông, cồng chiêng và đời sống văn hóa của người Jrai bản địa.",
    rating: 4.6,
    hours: "08:00 - 17:00",
    price: "50.000đ",
  },
  {
    id: "thac-phu-cuong",
    name: "Thác Phú Cường",
    img: "images/thac-phu-cuong.jpg",
    tag: "Thiên nhiên",
    desc: "Thác nước cao nhất Gia Lai, view ngoạn mục nhìn từ cầu treo phía trên.",
    rating: 4.6,
    hours: "07:00 - 17:00",
    price: "30.000đ",
  },
  {
    id: "vuon-che",
    name: "Vườn chè Biển Hồ",
    img: "images/vuon-che.jpg",
    tag: "Check-in",
    desc: "Đồi chè xanh trải dài, góc chụp ảnh được yêu thích nhất khi đến Gia Lai.",
    rating: 4.7,
    hours: "06:00 - 18:00",
    price: "Miễn phí",
  },
];

// Lịch trình mẫu mặc định (3 ngày 2 đêm)
const SAMPLE_ITINERARY = [
  { day: 1, items: ["Biển Hồ", "Phố đêm Pleiku"] },
  { day: 2, items: ["Núi lửa Chư Đăng Ya", "Làng văn hóa Jrai"] },
  { day: 3, items: ["Thác Phú Cường", "Vườn chè Biển Hồ"] },
];

// Bộ phản hồi mẫu cho chatbot demo (rule-based đơn giản, đội thi nên thay bằng gọi API AI thật)
const CHATBOT_RESPONSES = [
  {
    match: ["trekking", "không thích trekking"],
    reply: "Mình sẽ thay Núi lửa Chư Đăng Ya bằng Chùa Bửu Minh và vườn chè Biển Hồ, nhẹ nhàng hơn cho lịch trình của bạn.",
  },
  {
    match: ["chụp ảnh", "check-in", "đẹp"],
    reply: "Gợi ý thêm cho bạn: hàng thông trăm tuổi và quảng trường Đại Đoàn Kết \u2013 đều là hai điểm check-in được yêu thích nhất.",
  },
  {
    match: ["ẩm thực", "ăn", "món"],
    reply: "Đừng quên thử cơm lam gà nướng và phở khô Gia Lai khi ghé Phố đêm Pleiku nhé!",
  },
];

const DEFAULT_REPLY = "Mình ghi nhận yêu cầu này. Trong bản đầy đủ, phần này sẽ gọi API AI thật để xử lý linh hoạt mọi câu hỏi, đây chỉ là bản minh họa rule-based.";
