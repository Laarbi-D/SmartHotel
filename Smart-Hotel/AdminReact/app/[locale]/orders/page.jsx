"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { getCommandes, updateStatut } from "@/services/api";

const STATUTS_FILTRE = ["tous", "en attente", "en preparation", "livree", "annulee"];

const TRANSITIONS = {
  "en attente":     ["en preparation", "annulee"],
  "en preparation": ["livree", "annulee"],
  livree:           [],
  annulee:          [],
};

export default function OrdersPage() {
  const t = useTranslations("orders");

  const STATUS_STYLE = {
    "en attente":     { label: t("status.pending"),    bg: "#fef9c3", text: "#854d0e" },
    "en preparation": { label: t("status.preparing"),  bg: "#bfdbfe", text: "#1d4ed8" },
    livree:           { label: t("status.delivered"),  bg: "#dcfce7", text: "#166534" },
    annulee:          { label: t("status.cancelled"),  bg: "#fee2e2", text: "#991b1b" },
  };

  const [commandes, setCommandes] = useState([]);
  const [filtre, setFiltre]       = useState("tous");
  const [loading, setLoading]     = useState(true);
  const [updating, setUpdating]   = useState(null);
  const intervalRef = useRef(null);

  async function load(showLoader = false) {
    if (showLoader) setLoading(true);
    const data = await getCommandes(filtre === "tous" ? null : filtre);
    setCommandes(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load(true);
    intervalRef.current = setInterval(() => load(false), 20000);
    return () => clearInterval(intervalRef.current);
  }, [filtre]);

  async function handleStatut(id, statut) {
    setUpdating(id);
    try { await updateStatut(id, statut); await load(false); }
    finally { setUpdating(null); }
  }

  const counts = {
    "en attente":     commandes.filter((c) => c.statut === "en attente").length,
    "en preparation": commandes.filter((c) => c.statut === "en preparation").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--foreground)" }}>{t("title")}</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {counts["en attente"] > 0 && <span style={{ color: "#854d0e", fontWeight: 600 }}>{counts["en attente"]} {t("status.pending")}</span>}
            {counts["en attente"] > 0 && counts["en preparation"] > 0 && " · "}
            {counts["en preparation"] > 0 && <span style={{ color: "#1d4ed8", fontWeight: 600 }}>{counts["en preparation"]} {t("status.preparing")}</span>}
            {counts["en attente"] === 0 && counts["en preparation"] === 0 && t("allGood")}
          </p>
        </div>
        <button onClick={() => load(true)} style={{
          background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8,
          padding: "8px 14px", fontSize: 13, cursor: "pointer", color: "var(--text-muted)", fontWeight: 500,
        }}>
          ↻ {t("refresh")}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {STATUTS_FILTRE.map((s) => {
          const style = STATUS_STYLE[s];
          const active = filtre === s;
          return (
            <button key={s} onClick={() => setFiltre(s)} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: "pointer", border: "1.5px solid transparent",
              background: active ? (style?.bg || "#e0f2fe") : "var(--card-bg)",
              color: active ? (style?.text || "var(--primary)") : "var(--text-muted)",
              borderColor: active ? (style?.text || "var(--primary)") : "var(--border)",
            }}>
              {s === "tous" ? t("filter.all") : style?.label || s}
            </button>
          );
        })}
      </div>

      <div style={{ background: "var(--card-bg)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>{t("loading")}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {[t("table.id"), t("table.client"), t("table.room"), t("table.location"), t("table.items"), t("table.total"), t("table.status"), t("table.action")].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commandes.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>{t("noOrders")}</td></tr>
                ) : commandes.map((cmd) => {
                  const s = STATUS_STYLE[cmd.statut] || { label: cmd.statut, bg: "#f3f4f6", text: "#374151" };
                  const nextStatuts = TRANSITIONS[cmd.statut] || [];
                  return (
                    <tr key={cmd.id} style={{ borderTop: "1px solid var(--border)", opacity: updating === cmd.id ? 0.5 : 1 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 500 }}>#{cmd.id}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{cmd.prenom} {cmd.nom}</td>
                      <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{cmd.chambre ?? "—"}</td>
                      <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{cmd.emplacement || "—"}</td>
                      <td style={{ padding: "12px 16px", maxWidth: 200 }}>{cmd.detail || "—"}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700 }}>{Number(cmd.total).toFixed(2)} €</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: s.bg, color: s.text, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {nextStatuts.length > 0 ? (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {nextStatuts.map((ns) => {
                              const ns_style = STATUS_STYLE[ns] || {};
                              return (
                                <button key={ns} disabled={updating === cmd.id} onClick={() => handleStatut(cmd.id, ns)} style={{
                                  background: ns_style.bg || "#f3f4f6", color: ns_style.text || "#374151",
                                  border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11,
                                  fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                                }}>
                                  {ns_style.label || ns}
                                </button>
                              );
                            })}
                          </div>
                        ) : <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}