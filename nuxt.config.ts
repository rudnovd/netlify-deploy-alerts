import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/supabase', '@nuxt/eslint', '@vueuse/nuxt'],
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
  },
  typescript: {
    strict: true,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  nitro: {
    plugins: ['plugins/telegraf.ts'],
  },
  runtimeConfig: {
    public: {
      telegramBotLink: process.env.NUXT_TELEGRAM_BOT_LINK,
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Netlify Deploy Alerts',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'application-name',
          content: 'Netlify Deploy Alerts',
        },
        {
          name: 'description',
          content: 'Get notifications when your Netlify projects are deployed',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm',
    },
  },
})
