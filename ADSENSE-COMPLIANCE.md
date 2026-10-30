# ADSENSE-COMPLIANCE / FUTURE-PROOF PATCH – “VibingFun” (ESSENTIALS ONLY)

_Last updated: 2025-06-29_

This short checklist is for maintaining AdSense, privacy, and web quality compliance for VibingFun’s main site and any micro-apps.

---

## 1. Policy Basics
- [ ] Display a **“For entertainment purposes only – no advice”** disclaimer beneath the main buttons.
- [ ] Do not make medical, psychological, or guaranteed productivity claims.
- [ ] No more than **3 ad units per view** (currently 2).
- [ ] Footer link: “AdSense Program Policies” → https://support.google.com/adsense/answer/48182

## 2. Consent and Privacy
- [x] Consent banner in place: self-hosted **tarteaucitron.js** (MIT, vendored in `vendor/tarteaucitron/`, pinned v1.37.0).
    - Per-service opt-in (high privacy: no implicit consent); denying is as easy as accepting.
    - Google **Consent Mode v2**: `ad_storage`, `ad_user_data`, `ad_personalization` (and `analytics_storage`) default to **denied** in every page `<head>` before any Google script; they flip to granted only when the visitor allows the AdSense service.
    - AdSense (`adsbygoogle.js?client=ca-pub-…`) is injected by tarteaucitron **only after opt-in** — no unconditional ad script in any `<head>`.
    - Visitor choice is stored in the `tarteaucitron` cookie; reopen the panel anytime via the cookie icon or `#tarteaucitron`.
- [ ] If adding analytics or more ad tech later, add them as tarteaucitron services (never as raw `<script>` tags).
- [x] Privacy Policy states:
    - No personal data is collected or sold.
    - Cookies are set only after explicit per-service consent (naming tarteaucitron.js and the `tarteaucitron` preference cookie).
    - Google AdSense may use cookies when allowed (see their policy).
    - Only anonymous, aggregate data (like votes) is used, if at all.

## 3. Topics API & Ad Layout
- [ ] When ready, add publisher-provided-signals (broad themes) for Topics API.
- [ ] Ads must be at least 150px from main interactive elements.

## 4. Invalid Traffic & Performance
- [ ] Enable Cloudflare Bot Fight Mode.
- [ ] Maintain a single `ads.txt` at root.
- [ ] Aim for fast load times (LCP <2.5s, CLS <0.1).

## 5. Content Governance
- [ ] All content/assets © Britrik, not for redistribution.
- [ ] Show “VibingFun™” in the footer when UK trademark is live.

## 6. Roadmap Notes
- [ ] Any future SaaS or analytics (e.g. at `secure.vibingfun.com`) will run **no ads** and be outside AdSense scope.

---

**Review this before adding new ad formats, content packs, or analytics. No ICO registration needed unless user data is collected in future.**
