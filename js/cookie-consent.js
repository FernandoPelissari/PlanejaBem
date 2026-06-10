(function () {
  const consentKey = "planejabem_cookie_consent";
  const acceptedValue = "accepted";
  const rejectedValue = "rejected";
  const googleAnalyticsId = "G-TN02GKW3LQ";

  function getConsent() {
    try {
      return localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(consentKey, value);
    } catch (error) {
      return false;
    }

    return true;
  }

  function loadGoogleAnalytics() {
    if (window.__planejaBemAnalyticsLoaded) return;

    window.__planejaBemAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", googleAnalyticsId);
  }

  function hideBanner(banner) {
    banner.classList.remove("cookie-banner-visible");
    banner.setAttribute("aria-hidden", "true");
  }

  function createBanner() {
    if (document.querySelector("[data-cookie-banner]")) return;

    const banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.dataset.cookieBanner = "";
    banner.setAttribute("aria-label", "Preferencias de cookies");
    banner.setAttribute("aria-hidden", "false");
    banner.innerHTML = `
      <div class="cookie-banner-copy">
        <strong>Cookies de análise</strong>
        <p>Usamos cookies para entender visitas e melhorar o PlanejaBem. Eles só serão ativados se você aceitar.</p>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" class="cookie-button cookie-button-secondary" data-cookie-reject>Recusar</button>
        <button type="button" class="cookie-button cookie-button-primary" data-cookie-accept>Aceitar</button>
      </div>
    `;

    document.body.appendChild(banner);

    banner.querySelector("[data-cookie-accept]").addEventListener("click", () => {
      setConsent(acceptedValue);
      loadGoogleAnalytics();
      hideBanner(banner);
    });

    banner.querySelector("[data-cookie-reject]").addEventListener("click", () => {
      setConsent(rejectedValue);
      hideBanner(banner);
    });

    requestAnimationFrame(() => {
      banner.classList.add("cookie-banner-visible");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const consent = getConsent();

    if (consent === acceptedValue) {
      loadGoogleAnalytics();
      return;
    }

    if (consent !== rejectedValue) {
      createBanner();
    }
  });
})();
