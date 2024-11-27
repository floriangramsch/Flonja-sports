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

self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "startTimer") {
    const delay = event.data.delay || 120000; // Verzögerung in ms (Standard: 2 Minuten)

    setTimeout(() => {
      // Benachrichtigung anzeigen
      self.registration.showNotification("Pause vorbei!", {
        body: "2 Minuten sind vorbei!",
        vibrate: [200, 100, 200], // Optional: Vibrationsmuster
      });
    }, delay);
  }
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
});
