# tarteaucitron.js (vendored)

- **Upstream:** https://github.com/AmauriC/tarteaucitron.js
- **Version:** v1.37.0 (release tag, pinned)
- **License:** MIT — see [`LICENSE`](LICENSE) (Copyright (c) 2014 AmauriC)
- **Fetched from:** https://github.com/AmauriC/tarteaucitron.js/archive/refs/tags/v1.37.0.tar.gz
  (release source tarball; only the runtime assets below are kept, unmodified, unminified)

## Files

| File | Purpose |
|---|---|
| `tarteaucitron.js` | Core consent manager. Auto-loads the other assets relative to its own `<script src>` path. |
| `tarteaucitron.services.js` | Built-in service definitions (we use `adsenseauto`). |
| `css/tarteaucitron.css` | Default banner/panel styling (auto-injected by the core). |
| `lang/tarteaucitron.en.js` | English strings. Only `en` is vendored — `window.tarteaucitronForceLanguage` is pinned to `en` in every page. |
| `advertising.js` | Tiny anti-adblock helper flag loaded unconditionally by the core during init (48 bytes; same-origin). |

## Upgrading

1. Download the new tag's tarball, replace the files above (keep minified variants out).
2. Update the version in this README and in the pages' init comments if needed.
3. Re-verify: consent default fires before any Google script; accepting the ads service
   injects `adsbygoogle.js?client=ca-pub-…` and updates Google Consent Mode v2.

Do not edit these files; treat them as third-party code.
