export interface FoodInsecurityTrend {
  year: number;
  rate: number;
  peopleAffected: number;
  childrenPoverty?: number;
  note: string;
}

export interface CountyData {
  name: string;
  city: string;
  poundsDistributed: number;
  totalClients: number;
  insecurityRate: number;
  hubsCount: number;
  cx: number;
  cy: number;
  textX: number;
  textY: number;
  textAnchor?: "start" | "middle" | "end";
}

export const FOOD_INSECURITY_TRENDS: FoodInsecurityTrend[] = [
  {
    year: 2019,
    rate: 7.1,
    peopleAffected: 540000,
    childrenPoverty: 64000,
    note: "Pre-pandemic baseline. Washington ranked among the lowest in food insecurity nationwide."
  },
  {
    year: 2020,
    rate: 8.4,
    peopleAffected: 650000,
    note: "COVID-19 onset. Emergency food assistance programs and federal relief stabilized the initial shock, but food bank visits doubled in local areas."
  },
  {
    year: 2021,
    rate: 8.2,
    peopleAffected: 630000,
    childrenPoverty: 64000,
    note: "Sustained pandemic relief. Child Tax Credits and emergency SNAP benefits kept hunger rates from skyrocketing."
  },
  {
    year: 2022,
    rate: 10.5,
    peopleAffected: 820000,
    childrenPoverty: 186500,
    note: "The 'Hunger Cliff'. Pandemic protections expired, and record inflation hit grocery stores. Child poverty nearly tripled."
  },
  {
    year: 2023,
    rate: 11.2,
    peopleAffected: 880000,
    note: "Continued struggle. Families forced to choose between rent and groceries as living costs rose dramatically."
  },
  {
    year: 2024,
    rate: 11.0,
    peopleAffected: 890000,
    note: "The new normal. Groceries became the #1 hardest expense to afford in Washington. 1 in 10 households remain food insecure."
  }
];

// Geographically precise coordinates on our 1542.27 x 922.49 Washington State SVG map
export const WASHINGTON_COUNTIES_DATA: CountyData[] = [
  { 
    name: "Ferry", 
    city: "Republic", 
    poundsDistributed: 1460 * 12, 
    totalClients: 1460, 
    insecurityRate: 19.4, 
    hubsCount: 1,
    cx: 1020, 
    cy: 220, 
    textX: 1020, 
    textY: 175,
    textAnchor: "middle"
  },
  { 
    name: "Okanogan", 
    city: "Omak", 
    poundsDistributed: 6450 * 12, 
    totalClients: 6450, 
    insecurityRate: 17.3, 
    hubsCount: 2,
    cx: 840, 
    cy: 230, 
    textX: 840, 
    textY: 185,
    textAnchor: "middle"
  },
  { 
    name: "Grays Harbor", 
    city: "Aberdeen", 
    poundsDistributed: 12020 * 12, 
    totalClients: 12020, 
    insecurityRate: 16.7, 
    hubsCount: 4,
    cx: 245, 
    cy: 565, 
    textX: 245, 
    textY: 510,
    textAnchor: "middle"
  },
  { 
    name: "Pend Oreille", 
    city: "Newport", 
    poundsDistributed: 1870 * 12, 
    totalClients: 1870, 
    insecurityRate: 16.5, 
    hubsCount: 1,
    cx: 1160, 
    cy: 220, 
    textX: 1160, 
    textY: 275,
    textAnchor: "middle"
  },
  { 
    name: "Yakima", 
    city: "Yakima", 
    poundsDistributed: 41690 * 12, 
    totalClients: 41690, 
    insecurityRate: 16.2, 
    hubsCount: 12,
    cx: 700, 
    cy: 670, 
    textX: 700, 
    textY: 725,
    textAnchor: "middle"
  },
  { 
    name: "Cowlitz", 
    city: "Longview", 
    poundsDistributed: 17700 * 12, 
    totalClients: 17700, 
    insecurityRate: 16.0, 
    hubsCount: 5,
    cx: 360, 
    cy: 740, 
    textX: 360, 
    textY: 795,
    textAnchor: "middle"
  },
  { 
    name: "Adams", 
    city: "Othello", 
    poundsDistributed: 2610 * 12, 
    totalClients: 2610, 
    insecurityRate: 16.0, 
    hubsCount: 2,
    cx: 950, 
    cy: 580, 
    textX: 950, 
    textY: 635,
    textAnchor: "middle"
  },
  { 
    name: "Pacific", 
    city: "South Bend", 
    poundsDistributed: 3310 * 12, 
    totalClients: 3310, 
    insecurityRate: 15.9, 
    hubsCount: 1,
    cx: 190, 
    cy: 640, 
    textX: 190, 
    textY: 695,
    textAnchor: "middle"
  },
  { 
    name: "Grant", 
    city: "Moses Lake", 
    poundsDistributed: 11510 * 12, 
    totalClients: 11510, 
    insecurityRate: 15.8, 
    hubsCount: 3,
    cx: 860, 
    cy: 510, 
    textX: 860, 
    textY: 465,
    textAnchor: "middle"
  },
  { 
    name: "Lewis", 
    city: "Centralia", 
    poundsDistributed: 10600 * 12, 
    totalClients: 10600, 
    insecurityRate: 15.6, 
    hubsCount: 3,
    cx: 350, 
    cy: 670, 
    textX: 350, 
    textY: 625,
    textAnchor: "middle"
  }
];

export const COMMUNITY_LOAVES_STATS = {
  sandwichLoaves: 244966,
  energyCookies: 296180,
  bakers: 1167,
  foodBankPartners: 60,
  neighborhoodHubs: 74,
  missionStatement: "To nurture strong communities through the connection, training, and empowerment of home-based bakers to reduce hunger and promote wellness."
};

export const OFFICIAL_LOGO_URL =
  "https://communityloaves.org/wp-content/uploads/2021/04/cropped-AnniversaryArt-1-2-2.png";

export const COOKIE_NAME = "community_loaves_session";
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
