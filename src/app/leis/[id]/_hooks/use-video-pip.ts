"use client";

import { useEffect, useRef, useState } from "react";

export function useVideoPiP() {
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const [isPiPActive, setIsPiPActive] = useState(false);

  useEffect(() => {
    const videoSection = videoSectionRef.current;
    if (!videoSection) return;

    // Only enable PiP on desktop (≥1024px)
    const checkDesktop = () => window.innerWidth >= 1024;

    if (!checkDesktop()) {
      setIsPiPActive(false);
      return;
    }

    // Intersection Observer to detect when video section leaves viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When video section is not intersecting (scrolled past it)
        // activate PiP mode
        setIsPiPActive(!entry.isIntersecting && checkDesktop());
      },
      {
        root: null, // viewport
        rootMargin: "-100px 0px 0px 0px", // Trigger 100px before fully leaving
        threshold: 0, // Trigger as soon as it starts leaving
      }
    );

    observer.observe(videoSection);

    // Handle window resize
    const handleResize = () => {
      if (!checkDesktop()) {
        setIsPiPActive(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { videoSectionRef, isPiPActive };
}
