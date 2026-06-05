"use client";

import { loginAdmin } from "@/services/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import "@/styles/login.css";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify({
        nom:    data.nom,
        prenom: data.prenom,
        role:   data.role,
      }));
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      setError(err.message || t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Image src="/logo.png" alt="SmartHotel" width={80} height={80} priority />
          </div>
          <h1>BARCELO</h1>
          <p>{t("subtitle")}</p>
        </div>

        {/* Formulaire */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label className="login-label">{t("password")}</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="login-input"
            />
          </div>

          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="login-submit">
            {loading ? (
              <>
                <div className="login-spinner" />
                {t("loading")}
              </>
            ) : t("submit")}
          </button>
        </form>
      </div>
    </main>
  );
}