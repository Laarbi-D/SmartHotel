"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getCommandes, getProduits, getEmployes } from "@/services/api";

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "var(--card-bg)", borderRadius: 12,
      border: "1px solid var(--border)", padding: "20px 24px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 700, color: color || "var(--foreground)" }}>{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const [commandes, setCommandes]   = useState([]);
  const [nbProduits, setNbProduits] = useState("—");
  const [nbEmployes, setNbEmployes] = useState("—");
  const [loading, setLoading]       = useState(true);
  const intervalRef = useRef(null);

  const STATUS_STYLE = {
    "en attente":     { label: t("status.pending"),     bg: "#fef9c3", text: "#854d0e" },
    "en preparation": { label: t("status.preparing"),   bg: "#bfdbfe", text: "#1d4ed8" },
    livree:           { label: t("status.delivered"),   bg: "#dcfce7", text: "#166534" },
    annulee:          { label: t("status.cancelled"),   bg: "#fee2e2", text: "#991b1b" },
  };

  async function load() {
    try {
      const [cmds, prods, emps] = await Promise.all([
        getCommandes(), getProduits(), getEmployes(),
      ]);
      setCommandes(Array.isArray(cmds) ? cmds : []);
      setNbProduits(Array.isArray(prods) ? prods.length : "—");
      setNbEmployes(Array.isArray(emps) ? emps.length : "—");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const stats = {
    total:       commandes.length,
    attente:     commandes.filter((c) => c.statut === "en attente").length,
    preparation: commandes.filter((c) => c.statut === "en preparation").length,
    livrees:     commandes.filter((c) => c.statut === "livree").length,
    ca:          commandes.reduce((s, c) => s + (Number(c.total) || 0), 0),
  };

  const recent = [...commandes].sort((a, b) => b.id - a.id).slice(0, 8);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--text-muted)", fontSize: 15 }}>
      {t("loading")}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--foreground)" }}>{t("title")}</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{t("subtitle")}</p>
        </div>
        <Link href={`/${locale}/orders`} style={{
          background: "var(--primary)", color: "#fff", borderRadius: 8,
          padding: "9px 18px", fontSize: 13, fontWeight: 600, textDecoration: "none",
        }}>
          {t("seeOrders")} →
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        <StatCard label={t("stats.total")}       value={stats.total} />
        <StatCard label={t("stats.pending")}     value={stats.attente}     color="#854d0e" />
        <StatCard label={t("stats.preparing")}   value={stats.preparation} color="#1d4ed8" />
        <StatCard label={t("stats.delivered")}   value={stats.livrees}     color="#166534" />
        <StatCard label={t("stats.revenue")}     value={stats.ca.toFixed(2)} color="var(--primary)" />
        <StatCard label={t("stats.products")}    value={nbProduits} />
        <StatCard label={t("stats.employees")}   value={nbEmployes} />
      </div>

      <div style={{ background: "var(--card-bg)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>{t("recentOrders")}</h2>
          <Link href={`/${locale}/orders`} style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>{t("seeAll")}</Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {[t("table.id"), t("table.client"), t("table.location"), t("table.total"), t("table.status")].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>{t("noOrders")}</td></tr>
              ) : recent.map((cmd) => {
                const s = STATUS_STYLE[cmd.statut] || { label: cmd.statut, bg: "#f3f4f6", text: "#374151" };
                return (
                  <tr key={cmd.id} style={{ borderTop: "1px solid var(--border)" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 500 }}>#{cmd.id}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>{cmd.nom} {cmd.prenom}</td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{cmd.emplacement || "—"}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{Number(cmd.total).toFixed(2)} €</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: s.bg, color: s.text, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}