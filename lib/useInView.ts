"use client";
import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...opts },
    );
    o.observe(el);
    return () => o.disconnect();
  }, [opts]);
  return { ref, inView };
}
