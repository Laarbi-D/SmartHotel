"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getUser } from "@/services/api";

const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  orders: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  products: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  employees: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const LOCALES = ["es", "fr", "en"];

export default function DashboardLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const locale   = useLocale();
  const t        = useTranslations("nav");

  const [user, setUser]           = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const NAV_ITEMS = [
    { href: "/dashboard", label: t("dashboard"), icon: "dashboard", adminOnly: true  },
    { href: "/orders",    label: t("orders"),    icon: "orders",    adminOnly: false },
    { href: "/products",  label: t("products"),  icon: "products",  adminOnly: true  },
    { href: "/employees", label: t("employees"), icon: "employees", adminOnly: true  },
    { href: "/settings",  label: t("settings"),  icon: "settings",  adminOnly: false },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const u     = getUser();
    if (!token || !u) { router.replace(`/${locale}/login`); return; }
    setUser(u);

    const current = NAV_ITEMS.find((n) => pathname.includes(n.href));
    if (current?.adminOnly && u.role !== "admin") {
      router.replace(`/${locale}/orders`);
    }
  }, [pathname, locale]);

  function handleLogout() {
    sessionStorage.clear();
    router.replace(`/${locale}/login`);
  }

  function switchLocale(newLocale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  const visibleNav = user
    ? NAV_ITEMS.filter((n) => !n.adminOnly || user.role === "admin")
    : [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>
      <aside style={{
        width: collapsed ? 64 : 220,
        minWidth: collapsed ? 64 : 220,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        transition: "width 0.2s ease, min-width 0.2s ease",
        overflow: "hidden", position: "sticky",
        top: 0, height: "100vh", flexShrink: 0,
      }}>
        {/* Logo + toggle */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "20px 0" : "20px 16px",
          borderBottom: "1px solid var(--border)", gap: 8,
        }}>
          {!collapsed && (
            <img src="/logo.png" alt="Smart Hotel" width={100} height={60} style={{ objectFit: "contain" }} />
          )}
          <button onClick={() => setCollapsed((c) => !c)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", padding: 4, borderRadius: 6,
            display: "flex", alignItems: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed
                ? <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                : <><line x1="18" y1="6" x2="6" y2="6"/><line x1="18" y1="12" x2="6" y2="12"/><line x1="18" y1="18" x2="6" y2="18"/></>
              }
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {visibleNav.map((item) => {
            const active = pathname.includes(item.href);
            return (
              <Link key={item.href} href={`/${locale}${item.href}`}
                title={collapsed ? item.label : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 10px", borderRadius: 8, textDecoration: "none",
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? "var(--primary)" : "var(--text-muted)",
                  background: active ? "#eff6ff" : "transparent",
                  transition: "background 0.15s, color 0.15s",
                  whiteSpace: "nowrap", overflow: "hidden",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.color = "var(--foreground)"; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}}
              >
                <span style={{ flexShrink: 0 }}>{Icons[item.icon]}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sélecteur de langue */}
        {!collapsed && (
          <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 4 }}>
            {LOCALES.map((loc) => (
              <button key={loc} onClick={() => switchLocale(loc)} style={{
                flex: 1, padding: "4px 0", borderRadius: 6, fontSize: 12, fontWeight: 600,
                cursor: "pointer", border: "1px solid var(--border)",
                background: locale === loc ? "var(--primary)" : "var(--card-bg)",
                color: locale === loc ? "#fff" : "var(--text-muted)",
                textTransform: "uppercase",
              }}>
                {loc}
              </button>
            ))}
          </div>
        )}

        {/* User + logout */}
        <div style={{
          padding: collapsed ? "12px 8px" : "12px 16px",
          borderTop: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 10,
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          {!collapsed && user && (
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.prenom} {user.nom}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>{user.role}</div>
            </div>
          )}
          <button onClick={handleLogout} title={t("logout")} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", padding: 6, borderRadius: 6,
            display: "flex", alignItems: "center",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            {Icons.logout}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto", padding: "32px 32px", minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}