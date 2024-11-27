export default defineNuxtPlugin(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registriert:", registration);
      })
      .catch((error) => {
        console.error("Service Worker Registrierung fehlgeschlagen:", error);
      });
  } else {
    console.warn("Service Worker werden nicht unterstützt.");
  }
});
