import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Настройки разработчика
  devtools: { enabled: true },
 features: {
    devLogs: false
  },

  // Модули
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  '@nuxt/image', // Оптимизация изображений
  '@vite-pwa/nuxt' // PWA
  ],

  // CSS
  css: ['~/assets/css/main.css'],

  // Конфигурация времени выполнения
  runtimeConfig: {
    secretKey: process.env.NUXT_SECRET_KEY || 'dev-secret-key',
    smsRuApiKey: process.env.SMS_RU_API_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL || 'noreply@dym.kz',

    public: {
  appwriteEndpoint: process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
  appwriteProjectId: process.env.APPWRITE_PROJECT_ID || '685d28fa0033702aeefa',
  appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID || '687d3860003be1c71aa2',
  // Кома-сепарированный список admin email (обязательно задать для доступа к /admin)
  adminEmails: process.env.ADMIN_EMAILS || process.env.NUXT_PUBLIC_ADMIN_EMAILS || '',
      appwriteCollectionId: process.env.APPWRITE_COLLECTION_ID || 'default', // Добавлено для полноты
      // Collection IDs (override via env). Keep generic defaults for local dev.
      appwriteCollections: {
  hookahs: process.env.APPWRITE_COLLECTION_HOOKAHS || '689a7b6a0007a938db93',
  tobacco: process.env.APPWRITE_COLLECTION_TOBACCO || '687d38a300355a18035e',
  coals: process.env.APPWRITE_COLLECTION_COALS || '687d38ae00320fb72761',
  orders: process.env.APPWRITE_COLLECTION_ORDERS || '689a65d60034af3e1819',
  users: process.env.APPWRITE_COLLECTION_USERS || '689a64cb002344e8c748',
  masters: process.env.APPWRITE_COLLECTION_MASTERS || '689a7b6a0007a938db93',
  masterReviews: process.env.APPWRITE_COLLECTION_MASTER_REVIEWS || '689a7c24000a7a3e4f89',
        bookings: process.env.APPWRITE_COLLECTION_MASTER_BOOKINGS || 'masterBookings'
      } as any
      ,appwriteBuckets: {
        data: process.env.APPWRITE_BUCKET_DATA || ''
      } as any
    }
  },

  // Настройки Nitro
  nitro: {
    preset: 'vercel-edge',
    esbuild: {
      options: {
        target: 'esnext' // Для лучшей производительности
      }
    }
  },

  // Настройки сборки
  build: {
    transpile: [
      'appwrite',
      '@vue/composition-api' // Важно для совместимости
    ]
  },

  // SSR
  ssr: true,

  // Настройки приложения
  app: {
    head: {
      title: 'Dym.kz - Аренда кальянов',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Премиум кальяны с доставкой по Алматы' 
        },
        // Добавьте OG-теги для соцсетей
        { property: 'og:title', content: 'Dym.kz - Аренда кальянов' },
  { property: 'og:description', content: 'Премиум кальяны с доставкой по Алматы' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Добавьте preconnect для внешних ресурсов
        { rel: 'preconnect', href: 'https://cloud.appwrite.io' }
      ]
    }
  },

  // Дополнительные настройки для TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Настройки Vite
  vite: {
    resolve: {
      alias: {
        'cross-fetch': new URL('./shims/cross-fetch.ts', import.meta.url).pathname
      }
    },
    optimizeDeps: {
      include: [
        'vue',
        'pinia',
        'appwrite'
      ],
      exclude: [
        '@vue/composition-api'
      ]
    }
  },

  // PWA configuration (@vite-pwa/nuxt)
  // @ts-expect-error pwa provided by module
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Dym.kz - Аренда кальянов',
      short_name: 'Dym.kz',
  description: 'Премиум кальяны с доставкой по Алматы',
      theme_color: '#5b21b6',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      lang: 'ru',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' }
      ]
    },
    workbox: {
      navigateFallback: '/offline',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fra\.cloud\.appwrite\.io\/v1\/storage\/buckets\/.*/,
          handler: 'CacheFirst',
          options: { cacheName: 'appwrite-storage', expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 } }
        },
        {
          urlPattern: /^https:\/\/fra\.cloud\.appwrite\.io\/v1\/databases\/.*/,
          handler: 'NetworkFirst',
          options: { cacheName: 'appwrite-api', networkTimeoutSeconds: 10 }
        }
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 24 * 60 * 60 // daily
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/]
    }
  }
})
