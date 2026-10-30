// Consent bootstrap — loaded with `defer` AFTER the vendored tarteaucitron
// core (deferred scripts execute in document order), so neither blocks
// HTML parsing. The Consent Mode v2 denied-default inline snippet stays
// first in <head> on every page and runs before this file by construction.
//
// Ad serving is opt-in per page via <html data-consent-ads>: the three
// content pages register the adsenseauto service; the privacy-policy page
// deliberately registers none (no ads against legal boilerplate).
(function () {
    'use strict';
    if (typeof window.tarteaucitron === 'undefined') {
        // Core failed to load (e.g. asset unavailable): consent stays at the
        // denied defaults pushed by the inline snippet, and nothing loads.
        return;
    }
    var tac = window.tarteaucitron;

    // Mirror tarteaucitron's adsense decision into Google Consent Mode v2.
    // adsenseauto_allowed fires only on the accept CLICK; adsenseauto_loaded
    // fires when the service actually loads — including return visits where
    // a stored grant authorizes it without any click. Listening to both is
    // what makes the granted update reach Consent Mode on every page view.
    function consentUpdate(state) {
        window.tac_gtag('consent', 'update', {
            ad_storage: state,
            ad_user_data: state,
            ad_personalization: state
        });
    }
    document.addEventListener('adsenseauto_allowed', function () { consentUpdate('granted'); });
    document.addEventListener('adsenseauto_loaded', function () { consentUpdate('granted'); });
    document.addEventListener('adsenseauto_disallowed', function () { consentUpdate('denied'); });

    tac.user.adsensecapub = 'ca-pub-1528631369245825';
    tac.init({
        "privacyUrl": "privacy.html",
        "hashtag": "#tarteaucitron",
        "cookieName": "tarteaucitron",
        "highPrivacy": true,
        "orientation": "bottom",
        "DenyAllCta": true,
        "AcceptAllCta": true,
        "showIcon": true,
        "googleConsentMode": true
    });
    if (document.documentElement.hasAttribute('data-consent-ads')) {
        // No ad service on the privacy-policy page itself: the panel/icon
        // still runs so visitors can manage consent, but ads are never
        // served against legal boilerplate (AdSense valuable-inventory
        // policy). AdSense loads on the content pages once consent is given.
        (tac.job = tac.job || []).push('adsenseauto');
    }
})();
