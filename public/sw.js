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

let timerId;
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "startTimer") {
    const delay = event.data.delay || 120000; // Verzögerung in ms (Standard: 2 Minuten)
    const minutes = Math.floor(delay / 60000);
    const seconds = ((delay % 60000) / 1000).toFixed(0);
    const timeString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    timerId = setTimeout(() => {
      // Benachrichtigung anzeigen
      self.registration.showNotification("Weitermachen!", {
        body: `${timeString} Minuten sind vorbei!`,
        // vibrate: [200, 100, 200], // Optional: Vibrationsmuster
        vibrate: [
          400, 200, 400, 200, 400, 200, 800, 200, 800, 200, 400, 200, 400, 200,
          200, 200,
        ],
        requireInteraction: true,
      });
    }, delay);
  } else if (event.data.action === "interuptTimer") {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  }
});

self.addEventListener("install", (event) => {
  // event.waitUntil(
  //   caches.open("app-cache").then((cache) => {
  //     return cache.addAll(["/", "/about", "/styles.css"]);
  //   })
  // );
  console.log("Service Worker installiert und Ressourcen zwischengespeichert.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker aktiviert.");
});

self.addEventListener("fetch", (event) => {
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     return response || fetch(event.request);
  //   })
  // );
});
