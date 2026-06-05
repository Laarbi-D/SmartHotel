"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getEmployes, createEmploye, deleteEmploye } from "@/services/api";

const EMPTY_FORM = { nom: "", prenom: "", email: "", password: "", type: 2 };

export default function EmployeesPage() {
  const t = useTranslations("employees");
  const locale = useLocale();
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);

  const ROLE_STYLE = {
    admin:   { bg: "#bfdbfe", text: "#1d4ed8", label: t("roles.admin")    },
    employe: { bg: "#dcfce7", text: "#166534", label: t("roles.employee") },
  };

  async function load() {
    const data = await getEmployes();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createEmploye(form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(u) {
    if (!confirm(`${t("confirmDelete")} ${u.prenom} ${u.nom} ?`)) return;
    await deleteEmploye(u.id);
    load();
  }

  const inp = (field, placeholder, type = "text") => (
    <input type={type} placeholder={placeholder} value={form[field]}
      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
      required
      style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", background: "var(--background)" }}
    />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--foreground)" }}>{t("title")}</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{users.length} {t("members")}</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setShowForm(true); }} style={{
          background: "var(--primary)", color: "#fff", borderRadius: 8,
          padding: "9px 18px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
        }}>
          + {t("newEmployee")}
        </button>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{ background: "var(--card-bg)", borderRadius: 14, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>{t("newEmployee")}</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>{t("form.firstName")} *</label>
                  {inp("prenom", "Jean")}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>{t("form.lastName")} *</label>
                  {inp("nom", "Dupont")}
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Email *</label>
                  {inp("email", "jean@smarthotel.com", "email")}
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>{t("form.password")} *</label>
                  {inp("password", "••••••••", "password")}
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>{t("form.role")}</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: Number(e.target.value) }))}
                    style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 13, background: "var(--background)" }}>
                    <option value={2}>{t("roles.employee")}</option>
                    <option value={1}>{t("roles.admin")}</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: 13 }}>
                  {t("form.cancel")}
                </button>
                <button type="submit" disabled={saving}
                  style={{ padding: "8px 20px", borderRadius: 8, background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                  {saving ? t("form.creating") : t("form.create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ background: "var(--card-bg)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>{t("loading")}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {[t("table.name"), t("table.email"), t("table.role"), t("table.createdAt"), t("table.action")].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>{t("noUsers")}</td></tr>
                ) : users.map((u) => {
                  const role = u.type === 1 ? "admin" : "employe";
                  const rs   = ROLE_STYLE[role];
                  return (
                    <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{u.prenom} {u.nom}</td>
                      <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{u.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: rs.bg, color: rs.text, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{rs.label}</span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString(locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-GB") : "—"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button onClick={() => handleDelete(u)} style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          {t("delete")}
                        </button>
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