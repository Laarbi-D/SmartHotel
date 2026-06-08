"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getProduits, createProduit, updateProduit, deleteProduit, getUser } from "@/services/api";

const CATEGORIES = ["tous", "cocktails", "soft drinks", "wines", "beers"];

const CAT_STYLE = {
  cocktails:     { bg: "#fce7f3", text: "#9d174d" },
  "soft drinks": { bg: "#ecfdf5", text: "#065f46" },
  wines:         { bg: "#ede9fe", text: "#4c1d95" },
  beers:         { bg: "#fef3c7", text: "#92400e" },
};

const EMPTY_FORM = {
  nom: "", bio: "", bio_en: "", bio_es: "",
  prix: "", stock: "", categorie: "cocktails", disponible: 1, image: "",
};

export default function ProductsPage() {
  const t = useTranslations("products");
  const locale = useLocale();
  const [produits, setProduits]   = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [categorie, setCategorie] = useState("tous");
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(null);
  const user = getUser();
  const isAdmin = user?.role === "admin";

  async function load() {
    setLoading(true);
    const data = await getProduits();
    setProduits(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let list = [...produits];
    if (categorie !== "tous") list = list.filter((p) => p.categorie === categorie);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.nom?.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [produits, categorie, search]);

  function openCreate() { setEditId(null); setForm(EMPTY_FORM); setShowForm(true); }

  function openEdit(p) {
    setEditId(p.id);
    setForm({
      nom: p.nom || "", bio: p.bio || "", bio_en: p.bio_en || "", bio_es: p.bio_es || "",
      prix: p.prix || "", stock: p.stock ?? "", categorie: p.categorie || "cocktails",
      disponible: p.disponible ?? 1, image: p.image || "",
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editId) await updateProduit(editId, form);
      else await createProduit(form);
      setShowForm(false);
      await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm(t("confirmDelete"))) return;
    setDeleting(id);
    try { await deleteProduit(id); await load(); }
    finally { setDeleting(null); }
  }

  // Affiche la bonne description selon la langue
  function getBio(p) {
    if (locale === "es" && p.bio_es) return p.bio_es;
    if (locale === "en" && p.bio_en) return p.bio_en;
    return p.bio;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--foreground)" }}>{t("title")}</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {filtered.length} {filtered.length !== 1 ? t("products") : t("product")}
          </p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} style={{
            background: "var(--primary)", color: "#fff", border: "none",
            borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            + {t("newProduct")}
          </button>
        )}
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          style={{
            padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)",
            fontSize: 13, background: "var(--card-bg)", color: "var(--foreground)",
            outline: "none", width: 220,
          }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => {
            const s = CAT_STYLE[c];
            const active = categorie === c;
            return (
              <button key={c} onClick={() => setCategorie(c)} style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: "pointer", border: "1.5px solid transparent",
                background: active ? (s?.bg || "var(--primary-light)") : "var(--card-bg)",
                color: active ? (s?.text || "var(--primary)") : "var(--text-muted)",
                borderColor: active ? (s?.text || "var(--primary)") : "var(--border)",
                textTransform: "capitalize",
              }}>
                {c === "tous" ? t("filter.all") : c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grille */}
      {loading ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>{t("loading")}</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>{t("notFound")}</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {filtered.map((p) => {
            const cs = CAT_STYLE[p.categorie] || { bg: "#f3f4f6", text: "#374151" };
            return (
              <div key={p.id} style={{
                background: "var(--card-bg)", borderRadius: 14, border: "1px solid var(--border)",
                overflow: "hidden", display: "flex", flexDirection: "column",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                opacity: deleting === p.id ? 0.4 : 1,
                transition: "box-shadow 0.15s, opacity 0.2s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"}
              >
                {/* Image carrée */}
                <div style={{ aspectRatio: "1 / 1", background: "#f9fafb", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p.image ? (
                    <img src={p.image} alt={p.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <span style={{ fontSize: 40 }}>🍹</span>
                  )}
                </div>

                {/* Contenu */}
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "var(--foreground)", lineHeight: 1.3 }}>{p.nom}</span>
                    <span style={{ background: cs.bg, color: cs.text, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {p.categorie}
                    </span>
                  </div>

                  {getBio(p) && (
                    <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {getBio(p)}
                    </p>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)" }}>{Number(p.prix).toFixed(2)} €</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: p.disponible ? "#dcfce7" : "#fee2e2", color: p.disponible ? "#166534" : "#991b1b" }}>
                        {p.disponible ? t("available") : t("unavailable")}
                      </span>
                      {p.stock !== undefined && (
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{t("stock")} : {p.stock}</span>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                      <button onClick={() => openEdit(p)} style={{ flex: 1, padding: "7px 0", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--foreground)" }}>
                        {t("edit")}
                      </button>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ flex: 1, padding: "7px 0", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: "#fee2e2", color: "#991b1b" }}>
                        {t("delete")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modale */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{ background: "var(--card-bg)", borderRadius: 14, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>
              {editId ? t("form.editTitle") : t("form.createTitle")}
            </h2>

            {[
              { key: "nom",    label: t("form.name"),       type: "text"   },
              { key: "prix",   label: t("form.price"),      type: "number" },
              { key: "stock",  label: t("form.stock"),      type: "number" },
              { key: "image",  label: t("form.imageUrl"),   type: "text"   },
              { key: "bio",    label: t("form.bioFr"),      type: "text"   },
              { key: "bio_en", label: t("form.bioEn"),      type: "text"   },
              { key: "bio_es", label: t("form.bioEs"),      type: "text"   },
            ].map(({ key, label, type }) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{label}</label>
                <input type={type} value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "var(--background)", color: "var(--foreground)", outline: "none" }}
                />
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{t("form.category")}</label>
              <select value={form.categorie} onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value }))}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "var(--background)", color: "var(--foreground)", outline: "none" }}>
                {["cocktails", "soft drinks", "wines", "beers"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="dispo" checked={!!form.disponible}
                onChange={(e) => setForm((f) => ({ ...f, disponible: e.target.checked ? 1 : 0 }))} />
              <label htmlFor="dispo" style={{ fontSize: 13, fontWeight: 500 }}>{t("available")}</label>
            </div>

            <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "var(--card-bg)", color: "var(--foreground)" }}>
                {t("form.cancel")}
              </button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "var(--primary)", color: "#fff" }}>
                {saving ? t("form.saving") : editId ? t("form.save") : t("form.create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}