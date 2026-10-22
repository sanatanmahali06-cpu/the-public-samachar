"use client";

import { useEffect } from "react";

export default function ViewTracker({ newsId }: { newsId: number }) {
  useEffect(() => {
    const key = "last-counted-news-id";
    const currentId = String(newsId);

    try {
      const previousId = sessionStorage.getItem(key);
      if (previousId === currentId) return;
      sessionStorage.setItem(key, currentId);
    } catch {
      return;
    }

    fetch(`/api/news/${newsId}/view`, {
      method: "POST",
      keepalive: true,
    }).catch((error) => {
      console.error("View count failed:", error);
    });
  }, [newsId]);

  return null;
}