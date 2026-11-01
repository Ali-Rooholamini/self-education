export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core'],
    },
  },
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      title: 'مسیر یادگیری من',
      link: [
        {
          rel: 'preload',
          href: '/fonts/vazirmatn/Vazirmatn-v33.003-variable.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
      meta: [
        {
          name: 'description',
          content: 'فضای شخصی برای یادگیری، تمرین و دنبال کردن مسیر پیشرفت',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3001/api',
    },
  },
  typescript: { strict: true },
})
