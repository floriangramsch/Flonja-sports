// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  plugins: ["~/plugins/vue-query"],
  css: ["~/assets/global.css"],
  app: {
    head: {
      title: "Flonja Sports",
      meta: [
        // { name: "theme-color", content: "#97918e" },
        { name: "msapplication-TileColor", content: "#da532c" },
        { name: "description", content: "Fitness App für Se Bebis." },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
      ],
      script: [
        {
          src: "https://kit.fontawesome.com/1b387810f3.js",
          crossorigin: "anonymous",
        },
      ],
    },
  },
});