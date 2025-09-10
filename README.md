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
