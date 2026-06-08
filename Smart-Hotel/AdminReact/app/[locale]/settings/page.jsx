"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "../../../i18n/navigation";
import { getUser } from "@/services/api"; 

const LANGS = [
  {
    code: "fr", label: "Français",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="20" height="14">
        <rect width="1" height="2" fill="#002395"/>
        <rect x="1" width="1" height="2" fill="#fff"/>
        <rect x="2" width="1" height="2" fill="#ED2939"/>
      </svg>
    ),
  },
  {
    code: "en", label: "English",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="20" height="14">
        <rect width="60" height="30" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
      </svg>
    ),
  },
  {
    code: "es", label: "Español",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="20" height="14">
        <rect width="3" height="2" fill="#c60b1e"/>
        <rect y="0.5" width="3" height="1" fill="#ffc400"/>
      </svg>
    ),
  },
];

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const user = getUser();

  const [lang, setLang]   = useState(locale);
  const [saved, setSaved] = useState(false);

  // Sync if locale changes externally
  useEffect(() => { setLang(locale); }, [locale]);

  function handleSave() {
    // Apply the locale change via next-intl router
    router.replace(pathname, { locale: lang });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 600 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--foreground)" }}>{t("title")}</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{t("subtitle")}</p>
      </div>

      {/* Profil */}
      {user && (
        <section style={{ background: "var(--card-bg)", borderRadius: 12, border: "1px solid var(--border)", padding: "20px 24px" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{t("profile.title")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              [t("profile.firstName"), user.prenom],
              [t("profile.lastName"),  user.nom],
              [t("profile.role"),      user.role],
            ].map(([label, value]) => (
              <div key={label}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {label}
                </span>
                <p style={{ fontSize: 15, fontWeight: 600, marginTop: 4, textTransform: "capitalize" }}>{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Langue */}
      <section style={{ background: "var(--card-bg)", borderRadius: 12, border: "1px solid var(--border)", padding: "20px 24px" }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{t("language.title")}</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>{t("language.description")}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {LANGS.map((l) => (
            <button key={l.code} onClick={() => setLang(l.code)} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer",
              border: lang === l.code ? "2px solid var(--primary)" : "1.5px solid var(--border)",
              background: lang === l.code ? "#eff6ff" : "var(--background)",
              color: lang === l.code ? "var(--primary)" : "var(--foreground)",
            }}>
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </section>

      {/* Save */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={handleSave} style={{
          background: "var(--primary)", color: "#fff", borderRadius: 8,
          padding: "10px 24px", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
        }}>
          {t("save")}
        </button>
        {saved && (
          <span style={{ fontSize: 13, color: "var(--success)", fontWeight: 600 }}>
            ✓ {t("saved")}
          </span>
        )}
      </div>
    </div>
  );
}