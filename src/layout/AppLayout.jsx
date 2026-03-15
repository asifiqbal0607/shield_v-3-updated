import React, { useState } from "react";
import TopNav from "./TopNav";
import FilterSidebar from "./FilterSidebar";
import { ALL_PAGES } from "../components/constants/nav";
import { SLATE } from "../components/constants/colors";

/**
 * AppLayout
 * ➜ Page padding responds to screen size via .page-main CSS class (global.css)
 * ➜ TopNav height synced to theme.js → topNav.height (--topnav-h CSS var)
 */
export default function AppLayout({
  role,
  setRole,
  page,
  setPage,
  onLogout,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const curPage = ALL_PAGES.find((p) => p.key === page);
  const curLabel = curPage?.label ?? "Dashboard";
  const isAdminOnly =
    curPage?.roles?.includes("admin") && !curPage?.roles?.includes("partner");

  return (
    <div className="app-root-shell">
      {/* TopNav — always visible, height = var(--topnav-h) */}
      <TopNav
        role={role}
        setRole={setRole}
        page={page}
        setPage={setPage}
        onLogout={onLogout}
      />

      {/* Body */}
      <div className="app-body">
        {/* Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="app-sidebar-bd"
          />
        )}

        {/* Slide-in drawer */}
        <div
          className="app-drawer"
          style={{
            "--drawer-tx": sidebarOpen ? "translateX(0)" : "translateX(-260px)",
            "--drawer-shadow": sidebarOpen ? "var(--shadow-md)" : "none",
          }}
        >
          <FilterSidebar role={role} setRole={setRole} setPage={setPage} />
        </div>

        {/* Close button — outside drawer, only when open */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="app-drawer-close"
          >
            ×
          </button>
        )}

        {/* Main content — uses .page-main for responsive padding */}
        <main className="page-main">
          {/* Breadcrumb + filter toggle */}
          <div className="app-breadcrumb-row">
            <div className="app-breadcrumb-left">
              <span className="app-bc-sep">Shield</span>
              <span className="app-bc-trail">›</span>
              <span className="app-bc-current">{curLabel}</span>
              {isAdminOnly && <span className="app-env-badge">Admin only</span>}
            </div>

            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="app-filter-btn"
              style={{
                "--fb-bdr": sidebarOpen
                  ? "1px solid #bfdbfe"
                  : "1px solid var(--border)",
                "--fb-bg": sidebarOpen ? "#eff6ff" : "var(--bg-card)",
                "--fb-clr": sidebarOpen ? "#1d4ed8" : "var(--text-3)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <line x1="2" y1="4" x2="14" y2="4" />
                <line x1="4" y1="8" x2="12" y2="8" />
                <line x1="6" y1="12" x2="10" y2="12" />
              </svg>
              Filters
            </button>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
