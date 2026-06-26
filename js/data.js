const destinations = [
    {
        id: 1,
        name: "Bien Ho (To Nung)",
        category: ["nature", "check-in"],

        description:
            "A natural freshwater lake located inside an ancient volcanic crater, famous for its peaceful scenery and the poetic beauty of Pleiku.",

        rating: 4.8,
        ticketPrice: 150000,

        openingHours: "06:00 - 18:00",
        estimatedDuration: "2 - 3 hours",

        suitableFor: [
            "family",
            "couple",
            "photography"
        ],

        tags: [
            "nature",
            "sunrise",
            "relax",
            "check-in"
        ],

        image: "image/final_destination/Bien_Ho_(To Nung).jpg",

        accommodation: {
            name: "Xom House Bien Ho",
            type: "homestay",
            address: "Hem 34 Tan Da, Thon 4, Xa Bien Ho, Pleiku, Gia Lai",
            priceRange: { min: 560000, max: 1000000 },
            phone: "1900 252 209",
            image: "image/location/Xom_House_Bien_Ho.jpg",
            highlights: [
                "Lakeside location right next to Bien Ho",
                "SUP kayaking and cycling activities available",
                "Warm orange-brown-beige design aesthetic",
                "Managed by Xom Studio architecture firm"
            ]
        },

        dining: {
            name: "To Nung Restaurant",
            type: "restaurant",
            address: "220 Ton Duc Thang, Bien Ho, Pleiku, Gia Lai",
            openingHours: "08:00 - 22:00",
            phone: "0906 519 099",
            image: "image/location/To_Nung_Restaurant.jpg",
            highlights: [
                "Traditional lunch with Xoan dance performance",
                "Campfire experience",
                "Local Central Highlands cuisine"
            ]
        },

        cafe: {
            name: "Litaliti Ca Phe",
            type: "cafe",
            address: "P. Yen The, Thanh pho Pleiku, Gia Lai",
            fanpage: "https://www.facebook.com/litaliticaphe/",
            image: "image/location/Litaliti_Coffee.jpg",
            highlights: [
                "Sunset viewpoint cafe",
                "Classic vintage decor style",
                "Panoramic city view",
                "Natural lighting and flower garden"
            ]
        }
    },


    {
        id: 2,
        name: "Chua Minh Thanh",
        category: ["culture", "architecture"],

        description:
            "A unique Buddhist temple featuring impressive Asian-inspired architecture and a peaceful spiritual atmosphere in Pleiku.",

        rating: 4.7,
        ticketPrice: 120000,

        openingHours: "06:00 - 18:00",
        estimatedDuration: "1 - 2 hours",

        suitableFor: [
            "family",
            "culture lovers",
            "photography"
        ],

        tags: [
            "culture",
            "architecture",
            "spiritual"
        ],

        image: "image/final_destination/Chua_Minh_Thanh.jpg",

        accommodation: {
            name: "SORA Homestay",
            type: "homestay",
            address: "206/18 Phu Dong, P. Hoa Lu, Pleiku, Gia Lai",
            priceRange: { min: 320000, max: 480000 },
            phone: "0828 211 222",
            checkIn: "14:00",
            checkOut: "12:00",
            image: "image/location/SORA_Homestay.jpg",
            highlights: [
                "Garden-style with lots of greenery",
                "1–1.6 km from Pleiku city center",
                "24/7 front desk service",
                "Free parking",
                "Some rooms have balcony overlooking garden"
            ]
        },

        dining: {
            name: "Anh Quang Vegan",
            type: "vegetarian restaurant",
            address: "30 Nguyen Viet Xuan, P. Hoi Phu, Pleiku (near Chua Minh Thanh)",
            priceRange: "budget-friendly",
            image: "image/location/Anh_Quang-Vegan.jpg",
            highlights: [
                "Popular vegetarian restaurant near the temple",
                "Affordable local vegetarian dishes",
                "Frequented by visitors after temple visit"
            ]
        },

        cafe: {
            name: "Pagoda Tea & Coffee",
            type: "cafe",
            address: "277A Su Van Hanh, P. Hoi Phu, TP. Pleiku",
            image: "image/location/Pagoda_Tea_&_Coffee.jpg",
            highlights: [
                "Direct view of Chua Minh Thanh",
                "Perfect spot on full moon evenings when temple is lit up",
                "Great for photography and relaxing"
            ]
        }
    },


    {
        id: 3,
        name: "Chu Dang Ya Volcano",
        category: ["nature", "trekking"],

        description:
            "A famous volcanic mountain known for its wild beauty, golden wildflowers, and breathtaking landscapes of the Central Highlands.",

        rating: 4.8,
        ticketPrice: 150000,

        openingHours: "Open all day",
        estimatedDuration: "3 - 4 hours",

        suitableFor: [
            "adventure",
            "young travelers",
            "photography"
        ],

        tags: [
            "trekking",
            "nature",
            "camping",
            "photography"
        ],

        image: "image/final_destination/Chu_Dang_Ya_Volcano.jpg",

        accommodation: {
            name: "Hoang Anh Gia Lai Hotel",
            type: "hotel",
            address: "Pleiku City Center, Gia Lai",
            priceRange: { min: 450000, max: 850000 },
            phone: "0943 333 333",
            image: "image/location/Hoang_Anh_Gia_Lai_Hotel.jpg",
            highlights: [
                "Modern hotel with 117 rooms in city center",
                "On-site restaurant serving local Central Highlands cuisine",
                "Entertainment: karaoke, billiards",
                "Convenient base for Chu Dang Ya day trips"
            ]
        }
    },


    {
        id: 4,
        name: "Ky Co",
        category: ["nature", "beach", "check-in"],

        description:
            "A famous beach destination with crystal-clear water, beautiful sandy beaches, and various outdoor activities for visitors.",

        rating: 4.6,
        ticketPrice: 170000,

        openingHours: "07:00 - 18:00",
        estimatedDuration: "4 - 5 hours",

        suitableFor: [
            "family",
            "couple",
            "friends"
        ],

        tags: [
            "beach",
            "swimming",
            "photography"
        ],

        image: "image/final_destination/Ky_Co.jpg",

        accommodation: {
            name: "Moc Homestay",
            type: "homestay",
            address: "Thon Ly Chanh, Xa Nhon Ly, Quy Nhon, Binh Dinh",
            priceRange: { min: 612000, max: 1200000 },
            phone: "1900 252 209",
            image: "image/location/Moc_Homestay.jpg",
            highlights: [
                "Koi fish pond at the entrance",
                "Asian nature style with wood and bamboo",
                "Room types: single, double, dorm, special, VIP",
                "20 km from Quy Nhon city center, near Phu Cat Airport"
            ]
        },

        dining: {
            name: "Coco Jambo Restaurant",
            type: "seafood restaurant",
            address: "Thon Ly Hung, Xa Nhon Ly, TP. Quy Nhon, Binh Dinh",
            image: "image/location/Coco_Jambo_Restaurant.jpg",
            highlights: [
                "Beachfront location at Bai Bac",
                "Capacity for 500 guests",
                "10 fresh seafood dishes",
                "Coral viewing raft available",
                "Free SUP and flycam photography service",
                "BBQ setup service available"
            ]
        }
    },


    {
        id: 5,
        name: "Eo Gio",
        category: ["check-in", "nature"],

        description:
            "A stunning coastal viewpoint famous for sunrise watching, surrounded by unique rocky mountains and the beautiful sea.",

        rating: 4.7,
        ticketPrice: 165000,

        openingHours: "06:00 - 18:00",
        estimatedDuration: "1 - 2 hours",

        suitableFor: [
            "couple",
            "photography"
        ],

        tags: [
            "sunrise",
            "sea",
            "check-in"
        ],

        image: "image/final_destination/Eo_Gio.jpg",

        accommodation: {
            name: "Eo Gio Co Homestay",
            type: "homestay",
            address: "Thon Ly Luong, Xa Nhon Ly, Quy Nhon, Binh Dinh",
            priceRange: { min: 550000, max: 975000 },
            phone: "1900 252 209",
            image: "image/location/Eo_Gio_Co_Homestay.jpg",
            highlights: [
                "Only 150m from Eo Gio viewpoint",
                "500m from Trung Luong Beach",
                "Unique bungalow design with sunflower windows",
                "Yellow and bamboo decor",
                "Cycling, walking tours, water sports available",
                "Free extra bed for children 0–5 years old"
            ]
        },

        cafe: {
            name: "Con Duong Da Xanh Cafe",
            type: "cafe",
            address: "About 30m from Eo Gio entrance, Nhon Ly, Quy Nhon",
            image: "image/location/Con_Duong_Da_Xanh_Cafe.jpg",
            highlights: [
                "Santorini-inspired blue stone path design",
                "Indoor air-conditioned and outdoor garden seating",
                "Best sunrise viewpoint in Vietnam",
                "Costume rental for photos available"
            ]
        }
    },


    {
        id: 6,
        name: "Thap Doi",
        category: ["culture", "history"],

        description:
            "An ancient Cham tower complex located in the city center, featuring unique architecture and historical cultural values.",

        rating: 4.4,
        ticketPrice: 100000,

        openingHours: "07:00 - 17:00",
        estimatedDuration: "1 hour",

        suitableFor: [
            "culture lovers",
            "family"
        ],

        tags: [
            "history",
            "architecture",
            "culture"
        ],

        image: "image/final_destination/Thap_Doi.jpg",

        accommodation: {
            name: "Melody Homestay Quy Nhon",
            type: "homestay",
            address: "169 Dong Da, Phuong Thi Nai, TP. Quy Nhon, Binh Dinh",
            priceRange: { min: 300000, max: 390000 },
            image: "image/location/Melody_Homestay_Quy_Nhon.jpg",
            highlights: [
                "1.8 km from Thap Doi",
                "1.6 km from Quy Nhon city center",
                "Budget-friendly for independent travelers",
                "Private, quiet space"
            ]
        },

        dining: {
            name: "San Vuon 4Q Restaurant",
            type: "restaurant",
            address: "107 Phan Dinh Phung, Quy Nhon",
            image: "image/location/San_Vuon_4Q_Restaurant.jpg",
            highlights: [
                "Garden restaurant atmosphere",
                "Vietnamese and European fusion cuisine",
                "Suitable for family and group gatherings",
                "Private and airy setting"
            ]
        }
    },


    {
        id: 7,
        name: "Quang Trung Museum",
        category: ["culture", "history"],

        description:
            "A museum preserving important historical memories and stories about the legendary Vietnamese hero Quang Trung.",

        rating: 4.5,
        ticketPrice: 125000,

        openingHours: "07:00 - 17:00",
        estimatedDuration: "2 hours",

        suitableFor: [
            "family",
            "history lovers"
        ],

        tags: [
            "history",
            "culture",
            "education"
        ],

        image: "image/final_destination/Quang_Trung_Museum.jpg",

        accommodation: {
            name: "Homestay MyTran - HauLoan",
            type: "homestay",
            address: "Khu biet thu Dai Phu Gia, TP. Quy Nhon, Binh Dinh",
            priceRange: { min: 334000, max: 550000 },
            image: "image/location/Homestay_MyTran-HauLoan.jpg",
            highlights: [
                "Quiet villa complex with good security",
                "Budget-friendly with full amenities",
                "Suitable for backpackers and families"
            ]
        }
    },


    {
        id: 8,
        name: "Phu Cuong Waterfall",
        category: ["nature", "trekking"],

        description:
            "A spectacular waterfall located on a basalt foundation, offering an exciting nature exploration experience.",

        rating: 4.6,
        ticketPrice: 135000,

        openingHours: "07:00 - 17:30",
        estimatedDuration: "2 - 3 hours",

        suitableFor: [
            "adventure",
            "young travelers"
        ],

        tags: [
            "waterfall",
            "nature",
            "trekking"
        ],

        image: "image/final_destination/Phu_Cuong_Waterfall.jpg",

        accommodation: {
            name: "Moc Homestay",
            type: "homestay",
            address: "Thon Ly Chanh, Xa Nhon Ly, Quy Nhon, Binh Dinh",
            priceRange: { min: 612000, max: 1200000 },
            phone: "1900 252 209",
            image: "image/location/Moc_Homestay.jpg",
            highlights: [
                "Koi fish pond at the entrance",
                "Asian nature style with wood and bamboo",
                "Room types: single, double, dorm, special, VIP",
                "Convenient base for waterfall excursions"
            ]
        }
    },


    {
        id: 9,
        name: "Ghenh Rang Tien Sa",
        category: ["check-in", "culture"],

        description:
            "A famous tourist attraction featuring Hoang Hau Beach and the tomb of poet Han Mac Tu, combining natural beauty and cultural heritage.",

        rating: 4.5,
        ticketPrice: 0,

        openingHours: "07:00 - 18:00",
        estimatedDuration: "2 hours",

        suitableFor: [
            "family",
            "couple",
            "photography"
        ],

        tags: [
            "sea",
            "culture",
            "check-in"
        ],

        image: "image/final_destination/Ghenh_Rang_Tien_Sa.jpg",

        accommodation: {
            name: "Ghenh Rang Resort",
            type: "resort",
            address: "To 3, Phuong Ghenh Rang, TP. Quy Nhon, Binh Dinh",
            priceRange: { min: 650000, max: 1200000 },
            image: "image/location/Ghenh_Rang_Resort.jpg",
            highlights: [
                "Opened in 2018, directly by the sea and mountain",
                "Lush green grounds with coconut palms and flowers",
                "Popular with international visitors",
                "Pristine Central Vietnamese coastal scenery"
            ]
        },

        dining: {
            name: "Four Seasons Restaurant",
            type: "restaurant",
            address: "Quy Nhon beachfront, Binh Dinh",
            image: "image/location/Four_Seasons_Restaurant.jpg",
            highlights: [
                "Breakfast cafe and morning set menus",
                "Birthday and wedding banquet venue",
                "Group meals starting from 150,000 VND/person",
                "360-degree sea view outdoor gala space",
                "100-inch 4K LED screen for events",
                "Acoustic music every evening"
            ]
        }
    },


    {
        id: 10,
        name: "Gia Lai Museum",
        category: ["culture", "history"],

        description:
            "A comprehensive museum showcasing the rich cultural heritage and history of Gia Lai province, featuring artifacts from various ethnic minorities.",

        rating: 4.5,
        ticketPrice: 80000,

        openingHours: "07:00 - 17:00",
        estimatedDuration: "2 hours",

        suitableFor: [
            "family",
            "culture lovers",
            "history lovers"
        ],

        tags: [
            "history",
            "culture",
            "museum",
            "education"
        ],

        image: "image/final_destination/bao-tang-gia-lai.jpg",

        accommodation: {
            name: "Hoang Anh Gia Lai Hotel",
            type: "hotel",
            address: "Pleiku City Center, Gia Lai",
            priceRange: { min: 450000, max: 850000 },
            phone: "0943 333 333",
            image: "image/location/Hoang_Anh_Gia_Lai_Hotel.jpg",
            highlights: [
                "Modern hotel with 117 rooms in city center",
                "On-site restaurant serving local Central Highlands cuisine",
                "Entertainment: karaoke, billiards",
                "Walking distance to Gia Lai Museum"
            ]
        }
    },


    {
        id: 11,
        name: "Tea Hill at Bien Ho",
        category: ["nature", "check-in", "agriculture"],

        description:
            "A picturesque tea plantation on a hillside overlooking Bien Ho lake, offering scenic views and insight into Gia Lai's tea cultivation heritage.",

        rating: 4.7,
        ticketPrice: 120000,

        openingHours: "06:00 - 18:00",
        estimatedDuration: "2 hours",

        suitableFor: [
            "family",
            "photography",
            "nature lovers"
        ],

        tags: [
            "tea plantation",
            "agriculture",
            "scenic view",
            "check-in"
        ],

        image: "image/final_destination/doi-che-o-bien-ho.jpg",

        accommodation: {
            name: "Xom House Bien Ho",
            type: "homestay",
            address: "Hem 34 Tan Da, Thon 4, Xa Bien Ho, Pleiku, Gia Lai",
            priceRange: { min: 560000, max: 1000000 },
            phone: "1900 252 209",
            image: "image/location/Xom_House_Bien_Ho.jpg",
            highlights: [
                "Lakeside location right next to Bien Ho",
                "SUP kayaking and cycling activities available",
                "Warm orange-brown-beige design aesthetic",
                "Direct access to tea hill trekking trails"
            ]
        }
    },


    {
        id: 12,
        name: "Pleiku Prison Historical Site",
        category: ["history", "culture"],

        description:
            "A historical landmark preserving the memories of Pleiku Prison, offering insight into Vietnam's wartime history and cultural heritage.",

        rating: 4.3,
        ticketPrice: 75000,

        openingHours: "07:00 - 17:00",
        estimatedDuration: "1.5 hours",

        suitableFor: [
            "family",
            "history lovers",
            "culture lovers"
        ],

        tags: [
            "history",
            "culture",
            "heritage",
            "education"
        ],

        image: "image/final_destination/nha-lao-pleiku.jpg",

        accommodation: {
            name: "SORA Homestay",
            type: "homestay",
            address: "206/18 Phu Dong, P. Hoa Lu, Pleiku, Gia Lai",
            priceRange: { min: 320000, max: 480000 },
            phone: "0828 211 222",
            checkIn: "14:00",
            checkOut: "12:00",
            image: "image/location/SORA_Homestay.jpg",
            highlights: [
                "Garden-style with lots of greenery",
                "1–1.6 km from Pleiku city center and historical sites",
                "24/7 front desk service",
                "Free parking",
                "Some rooms have balcony overlooking garden"
            ]
        }
    }
];


export default destinations;
