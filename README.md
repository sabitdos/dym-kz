# Dym.kz - Hookah Rental Service

Сервис аренды кальянов с доставкой на базе Nuxt.js и Appwrite.

## 🚀 Возможности

- **Каталог кальянов** с фильтрацией и поиском
- **Корзина покупок** с персистентностью
- **Система заказов** с отслеживанием статуса
- **Уведомления** через SMS, Email и Push
- **Мобильная версия** с PWA поддержкой
- **Интеграция с Appwrite** для бэкенда
- **Множественные провайдеры** SMS и Email

## 🛠 Технологии

- **Nuxt.js 3** - Vue.js фреймворк
- **Appwrite** - Backend-as-a-Service
- **Pinia** - Управление состоянием
- **Tailwind CSS** - Стилизация
- **TypeScript** - Типизация
- **Capacitor** - Мобильные возможности
- **Vitest / Playwright** - Тестирование (unit + e2e)

## 🧱 Архитектура (Overview)

```
app/            Nuxt application entry (layouts, root config)
components/     UI и бизнес-компоненты (атомы, молекулы, организмы)
composables/    Переиспользуемая логика (например useAsyncResource)
stores/         Pinia stores (тонкие слои над Appwrite / локальным состоянием)
utils/          Утилиты: logger, notification-service, providers, helpers
plugins/        Nuxt плагины (error handling, appwrite client и т.д.)
server/         Nitro server routes (api/*)
types/          Общие TS типы доменной модели
tests/          Unit и e2e тесты (Vitest + Playwright)
```

Основная идея — минимальная бизнес-логика в компонентах, перенос в stores + утилиты. Повторяемые async паттерны унифицированы через `useAsyncResource`.

## 🔄 Потоки данных

1. Компонент вызывает Pinia store (`orders`, `hookahs`, `auth`).
2. Store использует `useAsyncResource` или прямой вызов Appwrite SDK.
3. Результат кэшируется в реактивном состоянии; ошибки логируются через `logger`.
4. UI реактивно обновляется; глобальные ошибки перехватываются плагинами.

## 🧩 Паттерн stores

Каждый store:

- Имеет четко типизированные state / actions.
- Не содержит DOM-зависимой логики.
- Может использовать общий `useAsyncResource(loader)` для загрузки коллекций.
- Логирование вместо `console.*` через `logger`.

Пример (упрощенно):

```ts
const resource = useAsyncResource(fetchHookahs)
await resource.load()
```

## 🛡 Error Handling

Глобальные плагины:

- `plugins/error.client.ts` — ловит `window.error` и `unhandledrejection`.
- `plugins/error.server.ts` — ловит `app:error`, `unhandledRejection`, `uncaughtException`.

Все отправляется в `logger` (можно расширить на внешний сервис — Sentry / Logtail).

Рекомендация: создать адаптер для внешнего провайдера в будущем (`utils/logger-adapter.ts`).

## 🔔 Notification Layer

Разделено на:

- `utils/notification-service.ts` — низкоуровневые провайдеры (SMS/Email) + retry + fallback.
- `utils/notifications.ts` — шаблоны, helper'ы (подстановка переменных, фабрика сервисов).
- `stores/notifications.ts` — состояние, история, настройки, вызов high-level функции `prepareAndSendNotifications`.

Преимущества: легко заменить провайдера или внедрить push/WebSocket слой.

## 🧪 Тестирование

Запуск unit тестов:

```bash
npm run test
```

Запуск e2e (Playwright):

```bash
npm run dev &
npm run e2e
```

Просмотр HTML отчета покрытия:

```bash
npm run test:cov
```

Структура тестов:

```
tests/
   unit/    // Vitest
   e2e/     // Playwright
```

## 📈 Performance

Планируемые оптимизации:

- Динамический импорт тяжелых админских компонентов.
- Ленивая инициализация неиспользуемых stores до захода на страницу.
- Prefetch критичных данных при навигации (Nuxt route middleware).

## 📊 Observability / Metrics (Planned)

Идея — обертка `withTiming(label, fn)` + интеграция в `useAsyncResource` для сбора latency.

### Поддержка в `useAsyncResource`

Теперь можно включить метрики:

```ts
const res = useAsyncResource(loadHookahs, { label: 'load-hookahs', metrics: true })
await res.load()
```

Логи (debug) будут содержать строки вида:

```
[metric] load-hookahs 123ms
```

```ts
async function withTiming<T>(label: string, fn: () => Promise<T>): Promise<T> {
   const start = performance.now()
   try { return await fn() } finally {
      const ms = Math.round(performance.now() - start)
      logger.debug(`[metric] ${label} ${ms}ms`)
   }
}
```

## 🧪 Quality Gates

Перед merge:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. (опц.) `npm run e2e`

## 🔐 Безопасность

- Никогда не коммитим чувствительные ключи.
- Runtime config через `.env` -> Nuxt runtimeConfig.
- Ограничиваем доступ к admin маршрутам через middleware `admin`.

## 🗺 Roadmap

- Metrics + внешний логгер
- UI skeleton loading улучшения
- Progressive image loading
- Web Push реальная интеграция
- Sentry / Logtail интеграция

## 🤝 Contributing

PR приветствуются. Перед отправкой убедитесь что прошли quality gates.

## ❓ FAQ

Q: Как добавить новый SMS провайдер?
A: Реализуйте интерфейс в `utils/sms-providers.ts` и зарегистрируйте в фабрике.

Q: Как локально проверить уведомления?
A: Включите нужные каналы в store настроек и используйте тестовый заказ.

Q: Что делать если падает отправка СМС?
A: Проверьте баланс / ключи. Fallback провайдер активируется автоматически после retry.

---

Если нужна дополнительная документация — расширим по запросу.

## 📦 Установка

1. Клонируйте репозиторий:
\`\`\`bash
git clone https://github.com/your-username/dym-kz.git
cd dym-kz
\`\`\`

2. Установите зависимости:
\`\`\`bash
npm install
\`\`\`

3. Скопируйте файл окружения:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Настройте переменные окружения в `.env`

5. Запустите проект:
\`\`\`bash
npm run dev
\`\`\`

## 🔧 Настройка Appwrite

1. Создайте проект в [Appwrite Cloud](https://cloud.appwrite.io)
2. Создайте базу данных с коллекциями:
   - `hookahs` - каталог кальянов
   - `tobaccos` - виды табака
   - `orders` - заказы
   - `users` - пользователи

3. Настройте аутентификацию и разрешения

## 📱 Мобильная версия

Для сборки мобильного приложения:

\`\`\`bash
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios
npx cap open android
\`\`\`

## 🔔 Настройка уведомлений

### SMS провайдеры:
- **SMS.RU** - для России/СНГ
- **Beeline KZ** - для Казахстана
- **Twilio** - международный

### Email провайдеры:
- **Resend** - рекомендуется
- **SendGrid** - с шаблонами
- **Mailgun** - для разработчиков
- **SMTP** - универсальный

## 📄 Лицензия

MIT License
