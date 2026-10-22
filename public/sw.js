self.addEventListener("push", (event) => {
  let data = {
    title: "THE PUBLIC SAMACHAR",
    body: "नई खबर पढ़ने के लिए वेबसाइट खोलें।",
    url: "/"
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/logo.png",
      badge: "/logo.png",
      data: { url: data.url || "/" }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const windowClient of windows) {
        if (windowClient.url === targetUrl && "focus" in windowClient) {
          return windowClient.focus();
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});