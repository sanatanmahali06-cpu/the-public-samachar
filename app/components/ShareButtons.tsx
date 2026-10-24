"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

export default function ShareButtons({
  slug,
  compact = false,
  mobileButtonOnly = false,
}: {
  slug: string;
  compact?: boolean;
  mobileButtonOnly?: boolean;
}) {
  const shareUrl = `https://the-public-samachar.vercel.app/news/${slug}`;

  const shareText = "The Public Samachar की यह खबर पढ़ें";

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: shareText,
          url: shareUrl,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("News link copy हो गया है");
      } catch {
        alert(shareUrl);
      }
    }
  };

  const iconClass = compact
    ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
    : "flex h-8 w-8 items-center justify-center rounded-full text-white";

  return (
    <div
      className={
        compact
          ? "flex w-max max-w-full min-w-0 flex-nowrap items-center gap-1"
          : "mx-auto mt-6 flex w-full max-w-full -translate-x-2 flex-wrap items-center justify-center gap-1.5 border-y border-slate-200 px-1 py-4 sm:mt-8 sm:gap-2 sm:px-0 sm:py-5"
      }
    >
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className={`${iconClass} bg-[#1877F2]`}
      >
        <FaFacebookF />
      </a>

      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className={`${iconClass} bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600`}
      >
        <FaInstagram />
      </a>

      <a
        href="https://www.youtube.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
        className={`${iconClass} bg-red-600`}
      >
        <FaYoutube />
      </a>

      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className={`${iconClass} bg-sky-500`}
      >
        <FaTelegramPlane />
      </a>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          `${shareText} ${shareUrl}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className={`${iconClass} bg-green-500`}
      >
        <FaWhatsapp />
      </a>

      <button
        type="button"
        onClick={share}
        className={
          compact
            ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 p-0 text-white shadow-sm hover:bg-slate-700"
            : "flex h-8 items-center gap-1.5 rounded-full bg-slate-900 px-3 text-xs font-bold text-white shadow-sm hover:bg-slate-700"
        }
      >
        <FiShare2 className="text-sm" />
        
      </button>
    </div>
  );
}
