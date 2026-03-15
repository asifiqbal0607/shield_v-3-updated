import { GREEN } from "./colors";

export const NAV_GROUPS = [
  // ── Ungrouped (flat tabs for all roles) ──────────────────────────────────
  {
    group: null,
    items: [
      {
        key: "overview",
        label: "Dashboard",
        icon: "▦",
        roles: ["admin", "partner"],
      },
    ],
  },

  // ── Management — appears first so partner sees Users/Services up front ───
  {
    group: "Management",
    items: [
      {
        key: "users",
        label: "Manage Users",
        icon: "◎",
        roles: ["admin", "partner"],
      },
      {
        key: "services",
        label: "Manage Services",
        icon: "⚙",
        roles: ["admin", "partner"],
      },
      {
        key: "partners",
        label: "Partners",
        icon: "◈",
        roles: ["admin"],
        badge: { n: "12", c: GREEN },
      },
      {
        key: "ip-manager",
        label: "IP Manager",
        icon: "🌐",
        roles: ["admin"],
      },
      {
        key: "audit",
        label: "Audit Log",
        icon: "📋",
        roles: ["admin"],
        badge: { n: "New", c: GREEN },
      },
    ],
  },

  // ── Analytics ────────────────────────────────────────────────────────────
  {
    group: "Analytics",
    items: [
      {
        key: "reporting",
        label: "Reporting",
        icon: "≡",
        roles: ["admin", "partner"],
      },
      {
        key: "block",
        label: "Block Reasons",
        icon: "⊗",
        roles: ["admin", "partner"],
      },
      {
        key: "geo",
        label: "GEO Stats",
        icon: "⊕",
        roles: ["admin", "partner"],
      },
      {
        key: "device",
        label: "Device Stats",
        icon: "⊡",
        roles: ["admin", "partner"],
      },
      {
        key: "apks",
        label: "APK Stats",
        icon: "📦",
        roles: ["admin", "partner"],
      },
      {
        key: "ip-manager",
        label: "IP Manager",
        icon: "🌐",
        roles: ["partner"],
      },
    ],
  },

  // ── Resources ────────────────────────────────────────────────────────────
  {
    group: "Resources",
    items: [
      {
        key: "docs",
        label: "Documentation",
        icon: "📖",
        roles: ["admin", "partner"],
      },
      // {
      //   key: "password-generator",
      //   label: "Password Generator",
      //   icon: "🔑",
      //   roles: ["admin"],
      // },
      {
        key: "fraud-codes",
        label: "Shield Fraud Codes",
        icon: "🛡️",
        roles: ["admin", "partner"],
      },
      {
        key: "sandbox",
        label: "Sandbox Environment",
        icon: "📋",
        roles: ["admin"],
        badge: { n: "New", c: GREEN },
      },
    ],
  },
];

export const ALL_PAGES = NAV_GROUPS.flatMap((g) => g.items);

export function groupsForRole(role) {
  return NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.roles.includes(role)),
  })).filter((g) => g.items.length > 0);
}
