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
  event.waitUntil(
    caches.open("app-cache").then((cache) => {
      return cache.addAll(["/", "/about", "/styles.css"]);
    })
  );
  console.log("Service Worker installiert und Ressourcen zwischengespeichert.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker aktiviert.");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
  console.log("Fetch-Event:", event.request.url);
});
