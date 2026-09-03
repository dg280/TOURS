import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

/**
 * Vercel Web Analytics, gated on what the visitor actually agreed to.
 *
 * The cookie banner offers an "analytics" switch that visitors can turn off,
 * so loading the beacon unconditionally would contradict the choice we offer
 * them. We read the stored preference instead, and re-read it whenever consent
 * changes: App remounts this component with a new `key` when the banner is
 * answered in this tab, and the `storage` event covers the other tabs.
 *
 * Vercel Web Analytics is cookieless and collects no personal data, but the
 * banner promises a choice, so the choice is honoured.
 */

const CONSENT_KEY = "cookie-consent";
const PREFERENCES_KEY = "cookie-preferences";

/** True only when the visitor accepted and left analytics enabled. */
function analyticsAllowed(): boolean {
  try {
    if (localStorage.getItem(CONSENT_KEY) !== "accepted") return false;
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return false;
    return JSON.parse(raw).analytics !== false;
  } catch {
    // Private mode, blocked storage, corrupted JSON: measuring is never worth
    // guessing at consent.
    return false;
  }
}

export function ConsentedAnalytics() {
  const [allowed, setAllowed] = useState(analyticsAllowed);

  useEffect(() => {
    // Another tab changing its mind should be honoured here too. setState from
    // an event handler is fine — inside the effect body it would cascade.
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY || e.key === PREFERENCES_KEY) {
        setAllowed(analyticsAllowed());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return allowed ? <Analytics /> : null;
}
