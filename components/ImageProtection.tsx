"use client";

import { useEffect } from "react";

export function ImageProtection() {
  useEffect(() => {
    const preventImageAction = (event: Event) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventImageAction, true);
    document.addEventListener("dragstart", preventImageAction, true);

    return () => {
      document.removeEventListener("contextmenu", preventImageAction, true);
      document.removeEventListener("dragstart", preventImageAction, true);
    };
  }, []);

  return null;
}
