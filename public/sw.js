// static/sw.js
self.addEventListener("push", (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: "/icon.png",
    badge: "/badge.png",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("install", (event) => {
  console.log("Service Worker installiert.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker aktiviert.");
});

self.addEventListener("fetch", (event) => {
  console.log("Fetch-Event:", event.request.url);
});
