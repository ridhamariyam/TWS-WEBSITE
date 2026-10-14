"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const COOKIE_NAME = "tws-cookie-consent";
const CHANGE_EVENT = "tws:cookie-consent-change";
const SETTINGS_EVENT = "tws:cookie-settings";
type Consent = "accepted" | "essential";
let sessionChoice: Consent | null = null;

function getSnapshot() {
  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  return value === "accepted" || value === "essential"
    ? value
    : sessionChoice ?? "unset";
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="cursor-pointer transition-colors hover:text-primitive-white"
      onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}
    >
      Cookie settings
    </button>
  );
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, () => "loading");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const openSettings = () => {
      previousFocus.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      setSettingsOpen(true);
    };
    window.addEventListener(SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (settingsOpen) headingRef.current?.focus();
  }, [settingsOpen]);

  const choose = (choice: Consent) => {
    sessionChoice = choice;
    document.cookie = `${COOKIE_NAME}=${choice}; Path=/; Max-Age=15552000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
    window.dispatchEvent(new Event(CHANGE_EVENT));
    setSettingsOpen(false);
    previousFocus.current?.focus();
  };

  if (consent === "loading" || (consent !== "unset" && !settingsOpen)) return null;

  return (
    <section
      data-cookie-consent=""
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-4 bottom-4 z-[950] mx-auto max-w-3xl rounded-2xl border border-black/15 bg-white p-5 text-black shadow-xl bp744:p-6"
    >
      <h2 ref={headingRef} tabIndex={-1} id="cookie-consent-title" className="text-lg font-medium">Your cookie preferences</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        We currently use no analytics or advertising cookies. We save your choice
        in an essential cookie for six months. You can change it anytime in Cookie settings.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="cursor-pointer rounded-full border border-black px-5 py-2.5 text-sm font-medium" onClick={() => choose("essential")}>
          Essential only
        </button>
        <button type="button" className="cursor-pointer rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white" onClick={() => choose("accepted")}>
          Accept all
        </button>
      </div>
    </section>
  );
}
