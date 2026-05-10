import type {
  DonationCampaign,
  NewsItem,
  NotificationItem,
  QuizCard,
  RegionStatus,
  Statistic,
  VerificationSubmission,
  WeatherInfo,
} from "../types";

export const landingStats: Statistic[] = [
  { label: "Monitored Regions", value: 124 },
  { label: "Early Alerts Sent", value: 18430 },
  { label: "Verified Action Posts", value: 9870 },
  { label: "Total Donations", value: 128000000 },
];

export const regionStatuses: RegionStatus[] = [
  {
    id: "r-1",
    name: "Bandung Barat",
    level: "warning",
    disasterType: "Flood",
    residents: 15800,
    updatedAt: "3 min ago",
    polygon: [
      [-6.894, 107.58],
      [-6.885, 107.6],
      [-6.905, 107.612],
      [-6.913, 107.59],
    ],
  },
  {
    id: "r-2",
    name: "Sleman",
    level: "safe",
    disasterType: "Volcano",
    residents: 9400,
    updatedAt: "5 min ago",
    polygon: [
      [-7.72, 110.35],
      [-7.705, 110.37],
      [-7.735, 110.388],
      [-7.75, 110.36],
    ],
  },
  {
    id: "r-3",
    name: "Pesisir Selatan",
    level: "danger",
    disasterType: "Storm",
    residents: 21100,
    updatedAt: "1 min ago",
    polygon: [
      [-1.42, 100.31],
      [-1.405, 100.35],
      [-1.44, 100.38],
      [-1.465, 100.335],
    ],
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "n-1",
    title: "High Rainfall Warning",
    body: "Potential flooding in lowland areas. Prepare emergency kit and monitor updates.",
    level: "warning",
    time: "10m ago",
  },
  {
    id: "n-2",
    title: "Evacuation Advisory",
    body: "Strong storm activity detected near coast line. Follow nearest shelter route.",
    level: "danger",
    time: "4m ago",
  },
  {
    id: "n-3",
    title: "Area Stabilized",
    body: "Water level normalized in district C after drainage intervention.",
    level: "safe",
    time: "25m ago",
  },
];

export const weatherInfo: WeatherInfo = {
  city: "Bandung",
  condition: "Light Rain",
  temperature: 24,
  humidity: 78,
  windSpeed: 14,
};

export const campaigns: DonationCampaign[] = [
  {
    id: "c-1",
    title: "Emergency Flood Relief - Cianjur",
    description: "Food, blankets, and emergency medicine for displaced families.",
    raised: 420000000,
    target: 600000000,
    donors: 3241,
    location: "Cianjur",
  },
  {
    id: "c-2",
    title: "Storm Recovery - Pesisir Selatan",
    description: "Temporary shelters and rebuilding damaged schools.",
    raised: 185000000,
    target: 400000000,
    donors: 1702,
    location: "West Sumatra",
  },
  {
    id: "c-3",
    title: "Volcano Preparedness Kits",
    description: "Distribute masks, radios, and evacuation supplies.",
    raised: 268000000,
    target: 300000000,
    donors: 2810,
    location: "Yogyakarta",
  },
];

export const newsList: NewsItem[] = [
  {
    id: "news-1",
    title: "Rapid Response Team Prevents Major Flood Impact",
    excerpt:
      "Coordinated alerts and evacuation support reduced affected households by 43%.",
    category: "Monitoring",
    likes: 1200,
    comments: 142,
    publishedAt: "2 hours ago",
    featured: true,
  },
  {
    id: "news-2",
    title: "Community Preparedness Training Reaches 20K Residents",
    excerpt: "Education program increases emergency readiness in high-risk regions.",
    category: "Education",
    likes: 632,
    comments: 48,
    publishedAt: "6 hours ago",
  },
  {
    id: "news-3",
    title: "Weather Anomaly Alert: Elevated Wind Speeds in Coastal Zone",
    excerpt: "Authorities advise fishermen to postpone departures for 24 hours.",
    category: "Weather",
    likes: 455,
    comments: 37,
    publishedAt: "1 day ago",
  },
];

export const verificationQueue: VerificationSubmission[] = [
  {
    id: "v-1",
    user: "Nadia Putri",
    action: "Drainage Cleaning",
    region: "Bandung Barat",
    points: 80,
    status: "pending",
  },
  {
    id: "v-2",
    user: "Rafi Hakim",
    action: "Shelter Logistics Support",
    region: "Sleman",
    points: 120,
    status: "approved",
  },
  {
    id: "v-3",
    user: "Maya Lestari",
    action: "Emergency Broadcast Volunteer",
    region: "Pesisir Selatan",
    points: 60,
    status: "pending",
  },
];

export const quizCards: QuizCard[] = [
  {
    id: "q-1",
    title: "Flood Evacuation Basics",
    difficulty: "easy",
    points: 40,
    completion: 100,
  },
  {
    id: "q-2",
    title: "Storm Risk Decision Drill",
    difficulty: "medium",
    points: 80,
    completion: 60,
  },
  {
    id: "q-3",
    title: "Volcano Response Scenario",
    difficulty: "hard",
    points: 120,
    completion: 20,
  },
];

export const analyticsSeries = [
  { name: "Mon", alerts: 120, verifiedActions: 52, donations: 40 },
  { name: "Tue", alerts: 98, verifiedActions: 65, donations: 54 },
  { name: "Wed", alerts: 150, verifiedActions: 73, donations: 51 },
  { name: "Thu", alerts: 130, verifiedActions: 61, donations: 64 },
  { name: "Fri", alerts: 170, verifiedActions: 88, donations: 80 },
];
