// ─── Histogram (visits / clicks / subs over 25 periods) ─────────────────────
const VISITS_RAW = [
  0, 420, 700, 1180, 820, 310, 200, 180, 140, 120, 110, 90, 85, 80, 75, 70, 65,
  60, 55, 50, 45, 42, 40, 38, 35, 30,
];
const CLICKS_RAW = [
  0, 180, 340, 260, 90, 60, 45, 38, 30, 25, 22, 18, 16, 14, 12, 11, 10, 9, 8, 7,
  6, 6, 5, 5, 4, 4,
];
const SUBS_RAW = [
  0, 60, 110, 80, 30, 18, 12, 10, 8, 6, 5, 4, 4, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1,
  1, 1, 1,
];

export const histogramData = Array.from({ length: 26 }, (_, i) => ({
  x: i,
  visits: VISITS_RAW[i] ?? 30,
  clicks: CLICKS_RAW[i] ?? 4,
  subs: SUBS_RAW[i] ?? 1,
}));

// ─── Blocking reasons (radar chart — by weekday) ─────────────────────────────
export const blockLegend = [
  { key: "Shield Bypassing", color: "#4a6fa5" },
  { key: "Desktop Traffic", color: "#c0392b" },
  { key: "Failed Interaction", color: "#e91e8c" },
  { key: "Bot Detected", color: "#f1c40f" },
  { key: "Remotely Controlled", color: "#8bc34a" },
  { key: "Spoofing", color: "#b0bec5" },
  { key: "APK Fraud", color: "#00bcd4" },
  { key: "Excessive IP", color: "#9c27b0" },
];

export const blockReasons = [
  {
    subject: "Sun",
    "Shield Bypassing": 4200,
    "Desktop Traffic": 2100,
    "Failed Interaction": 1600,
    "Bot Detected": 700,
    "Remotely Controlled": 2400,
    Spoofing: 1200,
    "APK Fraud": 600,
    "Excessive IP": 600,
  },
  {
    subject: "Mon",
    "Shield Bypassing": 3600,
    "Desktop Traffic": 2600,
    "Failed Interaction": 2200,
    "Bot Detected": 1400,
    "Remotely Controlled": 1700,
    Spoofing: 700,
    "APK Fraud": 1100,
    "Excessive IP": 750,
  },
  {
    subject: "Tue",
    "Shield Bypassing": 5100,
    "Desktop Traffic": 1700,
    "Failed Interaction": 1500,
    "Bot Detected": 2000,
    "Remotely Controlled": 2600,
    Spoofing: 1500,
    "APK Fraud": 600,
    "Excessive IP": 400,
  },
  {
    subject: "Wed",
    "Shield Bypassing": 3200,
    "Desktop Traffic": 3200,
    "Failed Interaction": 2600,
    "Bot Detected": 1100,
    "Remotely Controlled": 2100,
    Spoofing: 700,
    "APK Fraud": 1300,
    "Excessive IP": 880,
  },
  {
    subject: "Thu",
    "Shield Bypassing": 4500,
    "Desktop Traffic": 2400,
    "Failed Interaction": 1200,
    "Bot Detected": 1600,
    "Remotely Controlled": 3200,
    Spoofing: 1600,
    "APK Fraud": 700,
    "Excessive IP": 520,
  },
  {
    subject: "Fri",
    "Shield Bypassing": 3700,
    "Desktop Traffic": 2700,
    "Failed Interaction": 2000,
    "Bot Detected": 1300,
    "Remotely Controlled": 2500,
    Spoofing: 1100,
    "APK Fraud": 700,
    "Excessive IP": 640,
  },
  {
    subject: "Sat",
    "Shield Bypassing": 2600,
    "Desktop Traffic": 1600,
    "Failed Interaction": 1400,
    "Bot Detected": 600,
    "Remotely Controlled": 1600,
    Spoofing: 600,
    "APK Fraud": 500,
    "Excessive IP": 320,
  },
];

// ─── 30-day reporting trend ───────────────────────────────────────────────────
export const repTrend = Array.from({ length: 30 }, (_, i) => ({
  d: `Sep ${i + 1}`,
  visits: Math.floor(Math.sin(i / 4) * 200 + 600 + Math.random() * 80),
  clicks: Math.floor(Math.sin(i / 4) * 80 + 220 + Math.random() * 30),
  blocked: Math.floor(Math.sin(i / 3) * 40 + 100 + Math.random() * 20),
}));

// ── Top 20 Partners (admin view bar chart) ────────────────────────────────────
export const top20Partners = [
  { name: "Tiot",                total: 2068656, blocked: 124120, clean: 1944536 },
  { name: "DTAC",                total: 324419,  blocked: 89210,  clean: 235209  },
  { name: "IQ InterCom",         total: 82586,   blocked: 12430,  clean: 70156   },
  { name: "one-plan",            total: 57717,   blocked: 8900,   clean: 48817   },
  { name: "Media World",         total: 46657,   blocked: 7200,   clean: 39457   },
  { name: "IQ Saleno",           total: 34234,   blocked: 5100,   clean: 29134   },
  { name: "IQ Ademmdia",         total: 20348,   blocked: 3800,   clean: 16548   },
  { name: "IQ Mobileker",        total: 17233,   blocked: 2900,   clean: 14333   },
  { name: "Mobimrall ISA",       total: 15444,   blocked: 2600,   clean: 12844   },
  { name: "IQ Beneot",           total: 14162,   blocked: 2400,   clean: 11762   },
  { name: "IQ Stane Media",      total: 13430,   blocked: 2200,   clean: 11230   },
  { name: "IQ Digital Union",    total: 13089,   blocked: 2100,   clean: 10989   },
  { name: "Mobimrall Corp",      total: 11878,   blocked: 1900,   clean: 9978    },
  { name: "IQ Takanda",          total: 11523,   blocked: 1800,   clean: 9723    },
  { name: "IQ TROU2",            total: 6422,    blocked: 1100,   clean: 5322    },
  { name: "IQ Namake",           total: 5615,    blocked: 900,    clean: 4715    },
  { name: "JIOUZ",               total: 5075,    blocked: 820,    clean: 4255    },
  { name: "IQ Grand Technology", total: 4881,    blocked: 790,    clean: 4091    },
  { name: "jtor",                total: 4140,    blocked: 670,    clean: 3470    },
  { name: "IQ Arc",              total: 3710,    blocked: 600,    clean: 3110    },
];

// ── Top 20 Services (partner view bar chart) ──────────────────────────────────
export const top20Services = [
  { name: "Shield Core",         total: 1840000, blocked: 110400, clean: 1729600 },
  { name: "Shield APK",          total: 290000,  blocked: 79750,  clean: 210250  },
  { name: "Shield Browser",      total: 74000,   blocked: 11100,  clean: 62900   },
  { name: "Shield In-App",       total: 51000,   blocked: 7900,   clean: 43100   },
  { name: "Shield Geo",          total: 41000,   blocked: 6400,   clean: 34600   },
  { name: "Shield Verify",       total: 30000,   blocked: 4500,   clean: 25500   },
  { name: "Shield Fraud Log",    total: 18200,   blocked: 3400,   clean: 14800   },
  { name: "Shield Traffic",      total: 15400,   blocked: 2600,   clean: 12800   },
  { name: "Shield Analytics",    total: 13800,   blocked: 2300,   clean: 11500   },
  { name: "Shield Block API",    total: 12600,   blocked: 2100,   clean: 10500   },
  { name: "Shield Click Track",  total: 12000,   blocked: 2000,   clean: 10000   },
  { name: "Shield Device Net",   total: 10600,   blocked: 1700,   clean: 8900    },
  { name: "Shield Onboard",      total: 10500,   blocked: 1650,   clean: 8850    },
  { name: "Shield Radar",        total: 10200,   blocked: 1600,   clean: 8600    },
  { name: "Shield Score",        total: 5700,    blocked: 980,    clean: 4720    },
  { name: "Shield Proxy",        total: 5000,    blocked: 800,    clean: 4200    },
  { name: "Shield Stub",         total: 4500,    blocked: 730,    clean: 3770    },
  { name: "Shield Report",       total: 4300,    blocked: 700,    clean: 3600    },
  { name: "Shield Monitor",      total: 3700,    blocked: 590,    clean: 3110    },
  { name: "Shield Audit",        total: 3300,    blocked: 530,    clean: 2770    },
];
