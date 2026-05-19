"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function DemoBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isLocal = typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    /* eslint-disable react-hooks/set-state-in-effect */
    setShow(!isLocal);
    setDismissed(sessionStorage.getItem("demo-banner-dismissed") === "1");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!show || dismissed) return null;

  return (
    <div className="bg-walnut text-text text-xs md:text-sm">
      <div className="mx-auto flex max-w-shell items-start gap-3 px-5 md:px-8 lg:px-12 py-2.5">
        <p className="flex-1 leading-snug">
          <span className="font-medium text-brass">Demonstrație</span> · imaginile sunt mostre pentru
          a ilustra design-ul. Conținutul real va fi adăugat după contractare.
        </p>
        <button
          type="button"
          aria-label="Închide bannerul"
          onClick={() => { sessionStorage.setItem("demo-banner-dismissed", "1"); setDismissed(true); }}
          className="-mr-1 inline-flex h-8 w-8 items-center justify-center text-text-muted hover:text-text"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
