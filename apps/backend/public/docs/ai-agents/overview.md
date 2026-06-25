# AI Agents — Overview

Fitur AI Agents menyediakan antarmuka untuk berinteraksi dengan agen kecerdasan buatan yang terintegrasi dalam ekosistem Creative Universe.

---

## Agen yang Tersedia

### 1. Content Agent
Menghasilkan deskripsi produk secara otomatis berdasarkan data SKU.

### 2. Pricing Agent
Memberikan rekomendasi harga berdasarkan data historis dan kompetitor.

### 3. QA Agent
Memvalidasi konsistensi data pricetag sebelum dicetak.

---

## Arsitektur

```
Frontend (Next.js)
    │
    ▼
Laravel API (/api/v1/agents/*)
    │
    ▼
Google AI Studio / Gemini API
```

---

## Status

| Agen | Status | Tersedia Sejak |
|---|---|---|
| Content Agent | ✅ Aktif | v1.1.0 |
| Pricing Agent | 🚧 Beta | v1.2.0 |
| QA Agent | 📋 Planned | — |
