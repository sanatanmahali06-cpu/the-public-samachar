"use client";

import { useEffect, useState } from "react";

function decodeVapidKey(value: string): Uint8Array {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const bytes = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i);
  }

  return bytes;
}

export default function PushNotificationPrompt() {
  const [busy, setBusy] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function checkSubscription() {
      try {
        const registration = await navigator.serviceWorker.getRegistration("/");
        const subscription = await registration?.pushManager.getSubscription();
        setSubscribed(Boolean(subscription) && Notification.permission === "granted");
      } catch {
        setSubscribed(false);
      }
    }

    if ("serviceWorker" in navigator && "Notification" in window) {
      void checkSubscription();
    }
  }, []);

  useEffect(() => {
    const browserWindow = window as Window & {
      toggleNewsNotifications?: () => void;
    };

    browserWindow.toggleNewsNotifications = () => {
      if (busy) return;
      if (subscribed) {
        void disableNotifications();
      } else {
        void enableNotifications();
      }
    };

    window.dispatchEvent(
      new CustomEvent("news-notification-status", {
        detail: subscribed,
      })
    );
  }, [subscribed, busy]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("news-notification-status", {
        detail: subscribed,
      })
    );
  }, [subscribed]);

  async function enableNotifications() {
    setBusy(true);
    setStatus("");

    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("This browser does not support push notifications.");
      }

      if (!("Notification" in window)) {
        throw new Error("Notifications are not supported by this browser.");
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error("Notification permission was not granted.");
      }

      const keyResponse = await fetch("/api/push/key");
      const keyData = await keyResponse.json();

      if (!keyResponse.ok || !keyData.publicKey) {
        throw new Error("Could not load notification settings.");
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const subscription =
        (await registration.pushManager.getSubscription()) ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: decodeVapidKey(keyData.publicKey).buffer as ArrayBuffer,
        }));

      const saveResponse = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      if (!saveResponse.ok) {
        throw new Error("Could not save your notification subscription.");
      }

      setSubscribed(true);
      setStatus("Notifications are enabled on this device.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Could not enable notifications. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  async function disableNotifications() {
    setBusy(true);
    setStatus("");

    try {
      const registration = await navigator.serviceWorker.getRegistration("/");

      if (registration) {
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          const response = await fetch("/api/push/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });

          if (!response.ok) {
            throw new Error("Could not remove notification subscription.");
          }

          await subscription.unsubscribe();
        }
      }

      setSubscribed(false);
      setStatus("Notifications are turned off on this device.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Could not turn off notifications."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto mt-6 w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-4 text-center text-white">
      <h3 className="text-base font-extrabold">
        News Notifications
      </h3>
      <p className="mt-2 text-sm text-slate-300">
        Get notified when new news is published.
      </p>

      <button
        type="button"
        onClick={subscribed ? disableNotifications : enableNotifications}
        disabled={busy}
        className="mt-4 min-h-11 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy
          ? "Please wait..."
          : subscribed
            ? "Turn Off Notifications"
            : "Enable News Notifications"}
      </button>

      {status && (
        <p className="mt-3 text-sm text-slate-200" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </section>
  );
}