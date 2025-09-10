<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Настройка провайдеров уведомлений</h1>
        <p class="text-gray-600">Конфигурация SMS и Email провайдеров для отправки уведомлений</p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- SMS Providers -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center">
              <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              SMS Провайдеры
            </h2>

            <!-- Provider Selection -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Основной провайдер</label>
              <select 
                v-model="smsConfig.primary"
                @change="updateSMSProvider"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="sms.ru">SMS.RU (Россия/СНГ)</option>
                <option value="beeline">Beeline KZ</option>
                <option value="twilio">Twilio (Международный)</option>
              </select>
            </div>

            <!-- SMS.RU Configuration -->
            <div v-if="smsConfig.primary === 'sms.ru'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input 
                  v-model="smsConfig.config.apiKey"
                  type="password"
                  placeholder="Введите API ключ SMS.RU"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Получить API ключ можно в <a href="https://sms.ru/panel" target="_blank" class="text-purple-600">личном кабинете SMS.RU</a>
                </p>
              </div>
            </div>

            <!-- Beeline KZ Configuration -->
            <div v-if="smsConfig.primary === 'beeline'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  v-model="smsConfig.config.username"
                  type="text"
                  placeholder="Логин Beeline"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  v-model="smsConfig.config.password"
                  type="password"
                  placeholder="Пароль Beeline"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <!-- Twilio Configuration -->
            <div v-if="smsConfig.primary === 'twilio'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Account SID</label>
                <input 
                  v-model="smsConfig.config.accountSid"
                  type="text"
                  placeholder="Twilio Account SID"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
                <input 
                  v-model="smsConfig.config.authToken"
                  type="password"
                  placeholder="Twilio Auth Token"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">From Number</label>
                <input 
                  v-model="smsConfig.config.fromNumber"
                  type="text"
                  placeholder="+1234567890"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <!-- Fallback Provider -->
            <div class="mt-6 pt-4 border-t">
              <label class="block text-sm font-medium text-gray-700 mb-2">Резервный провайдер</label>
              <select 
                v-model="smsConfig.fallback"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Не использовать</option>
                <option value="sms.ru" :disabled="smsConfig.primary === 'sms.ru'">SMS.RU</option>
                <option value="beeline" :disabled="smsConfig.primary === 'beeline'">Beeline KZ</option>
                <option value="twilio" :disabled="smsConfig.primary === 'twilio'">Twilio</option>
              </select>
            </div>

            <!-- Test SMS -->
            <div class="mt-6 pt-4 border-t">
              <h4 class="font-medium mb-2">Тестовая отправка</h4>
              <div class="flex gap-2">
                <input 
                  v-model="testPhone"
                  type="tel"
                  placeholder="+7 777 123 45 67"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  @click="testSMS"
                  :disabled="!testPhone || isTestingSMS"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {{ isTestingSMS ? 'Отправка...' : 'Тест' }}
                </button>
              </div>
            </div>

            <!-- SMS Balance -->
            <div v-if="smsBalance !== null" class="mt-4 p-3 bg-blue-50 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-blue-900">Баланс SMS:</span>
                <span class="text-sm font-bold text-blue-900">{{ smsBalance }} ₽</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Providers -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center">
              <svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Email Провайдеры
            </h2>

            <!-- Provider Selection -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Основной провайдер</label>
              <select 
                v-model="emailConfig.primary"
                @change="updateEmailProvider"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="resend">Resend (Рекомендуется)</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
                <option value="smtp">SMTP (Универсальный)</option>
              </select>
            </div>

            <!-- Resend Configuration -->
            <div v-if="emailConfig.primary === 'resend'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input 
                  v-model="emailConfig.config.apiKey"
                  type="password"
                  placeholder="re_xxxxxxxxxx"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Получить API ключ: <a href="https://resend.com/api-keys" target="_blank" class="text-purple-600">resend.com/api-keys</a>
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input 
                  v-model="emailConfig.config.fromEmail"
                  type="email"
                  placeholder="noreply@dym.kz"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <!-- SendGrid Configuration -->
            <div v-if="emailConfig.primary === 'sendgrid'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input 
                  v-model="emailConfig.config.apiKey"
                  type="password"
                  placeholder="SG.xxxxxxxxxx"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input 
                  v-model="emailConfig.config.fromEmail"
                  type="email"
                  placeholder="noreply@dym.kz"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <!-- Mailgun Configuration -->
            <div v-if="emailConfig.primary === 'mailgun'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input 
                  v-model="emailConfig.config.apiKey"
                  type="password"
                  placeholder="key-xxxxxxxxxx"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <input 
                  v-model="emailConfig.config.domain"
                  type="text"
                  placeholder="mg.dym.kz"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input 
                  v-model="emailConfig.config.fromEmail"
                  type="email"
                  placeholder="noreply@dym.kz"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <!-- SMTP Configuration -->
            <div v-if="emailConfig.primary === 'smtp'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                <input 
                  v-model="emailConfig.config.host"
                  type="text"
                  placeholder="smtp.gmail.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Port</label>
                  <input 
                    v-model="emailConfig.config.port"
                    type="number"
                    placeholder="587"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label class="flex items-center mt-6">
                    <input 
                      v-model="emailConfig.config.secure"
                      type="checkbox"
                      class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span class="ml-2 text-sm">SSL/TLS</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  v-model="emailConfig.config.username"
                  type="text"
                  placeholder="your@email.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  v-model="emailConfig.config.password"
                  type="password"
                  placeholder="Пароль или App Password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input 
                  v-model="emailConfig.config.fromEmail"
                  type="email"
                  placeholder="noreply@dym.kz"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <!-- Common Email Settings -->
            <div class="space-y-4 mt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                <input 
                  v-model="emailConfig.config.fromName"
                  type="text"
                  placeholder="Dym.kz"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <!-- Fallback Provider -->
            <div class="mt-6 pt-4 border-t">
              <label class="block text-sm font-medium text-gray-700 mb-2">Резервный провайдер</label>
              <select 
                v-model="emailConfig.fallback"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Не использовать</option>
                <option value="resend" :disabled="emailConfig.primary === 'resend'">Resend</option>
                <option value="sendgrid" :disabled="emailConfig.primary === 'sendgrid'">SendGrid</option>
                <option value="mailgun" :disabled="emailConfig.primary === 'mailgun'">Mailgun</option>
                <option value="smtp" :disabled="emailConfig.primary === 'smtp'">SMTP</option>
              </select>
            </div>

            <!-- Test Email -->
            <div class="mt-6 pt-4 border-t">
              <h4 class="font-medium mb-2">Тестовая отправка</h4>
              <div class="flex gap-2">
                <input 
                  v-model="testEmail"
                  type="email"
                  placeholder="test@example.com"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  @click="testEmailSend"
                  :disabled="!testEmail || isTestingEmail"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ isTestingEmail ? 'Отправка...' : 'Тест' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Global Settings -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Глобальные настройки</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Количество попыток</label>
            <input 
              v-model.number="globalSettings.retryAttempts"
              type="number"
              min="1"
              max="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <p class="text-xs text-gray-500 mt-1">Количество попыток отправки при ошибке</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Задержка между попытками (мс)</label>
            <input 
              v-model.number="globalSettings.retryDelay"
              type="number"
              min="500"
              max="10000"
              step="500"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <p class="text-xs text-gray-500 mt-1">Задержка между повторными попытками</p>
          </div>
        </div>
      </div>

      <!-- Provider Status -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Статус провайдеров</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium mb-2">SMS</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span class="text-sm">Основной:</span>
                <span class="text-sm font-medium">{{ smsProviderInfo.primary }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span class="text-sm">Резервный:</span>
                <span class="text-sm font-medium">{{ smsProviderInfo.fallback }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span class="text-sm">Статус:</span>
                <span 
                  class="text-sm font-medium"
                  :class="smsProviderInfo.enabled ? 'text-green-600' : 'text-red-600'"
                >
                  {{ smsProviderInfo.enabled ? 'Активен' : 'Отключен' }}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">Email</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span class="text-sm">Основной:</span>
                <span class="text-sm font-medium">{{ emailProviderInfo.primary }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span class="text-sm">Резервный:</span>
                <span class="text-sm font-medium">{{ emailProviderInfo.fallback }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span class="text-sm">Статус:</span>
                <span 
                  class="text-sm font-medium"
                  :class="emailProviderInfo.enabled ? 'text-green-600' : 'text-red-600'"
                >
                  {{ emailProviderInfo.enabled ? 'Активен' : 'Отключен' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-8 flex justify-end">
        <button 
          @click="saveConfiguration"
          :disabled="isSaving"
          class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
        >
          {{ isSaving ? 'Сохранение...' : 'Сохранить настройки' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '~/stores/notifications'
// useHead is globally available in Nuxt; removed '@vueuse/head' import

// Meta
useHead({
  title: 'Настройка провайдеров - Dym.kz Admin',
  meta: [
    { name: 'description', content: 'Настройка SMS и Email провайдеров для уведомлений' }
  ]
})

const notificationsStore = useNotificationsStore()

// State
const smsConfig = ref({
  primary: 'sms.ru',
  fallback: '',
  config: {
    apiKey: '',
    username: '',
    password: '',
    accountSid: '',
    authToken: '',
    fromNumber: ''
  }
})

const emailConfig = ref({
  primary: 'resend',
  fallback: '',
  config: {
    apiKey: '',
    fromEmail: 'noreply@dym.kz',
    fromName: 'Dym.kz',
    domain: '',
    host: '',
    port: 587,
    secure: true,
    username: '',
    password: ''
  }
})

const globalSettings = ref({
  retryAttempts: 3,
  retryDelay: 1000
})

const testPhone = ref('')
const testEmail = ref('')
const isTestingSMS = ref(false)
const isTestingEmail = ref(false)
const isSaving = ref(false)
const smsBalance = ref(null)

// Computed
const smsProviderInfo = computed(() => notificationsStore.getSMSProviderInfo())
const emailProviderInfo = computed(() => notificationsStore.getEmailProviderInfo())

// Methods
const updateSMSProvider = () => {
  // Reset config when changing provider
  smsConfig.value.config = {
    apiKey: '',
    username: '',
    password: '',
    accountSid: '',
    authToken: '',
    fromNumber: ''
  }
}

const updateEmailProvider = () => {
  // Reset config when changing provider
  emailConfig.value.config = {
    apiKey: '',
    fromEmail: 'noreply@dym.kz',
    fromName: 'Dym.kz',
    domain: '',
    host: '',
    port: 587,
    secure: true,
    username: '',
    password: ''
  }
}

const testSMS = async () => {
  if (!testPhone.value) return
  
  isTestingSMS.value = true
  
  try {
    // Update store with current config
    await updateStoreConfig()
    
    // Send test SMS
    await notificationsStore.sendNotification('TEST', 'confirmed', {
      orderNumber: 'TEST' + Date.now().toString().slice(-4),
      total: 5500,
      address: 'Тестовый адрес',
      deliveryTime: '14:00-16:00'
    }, {
      phone: testPhone.value
    })
    
    alert('Тестовое SMS отправлено!')
  } catch (error) {
    alert('Ошибка отправки SMS: ' + error.message)
  } finally {
    isTestingSMS.value = false
  }
}

const testEmailSend = async () => {
  if (!testEmail.value) return
  
  isTestingEmail.value = true
  
  try {
    // Update store with current config
    await updateStoreConfig()
    
    // Send test email
    await notificationsStore.sendNotification('TEST', 'confirmed', {
      orderNumber: 'TEST' + Date.now().toString().slice(-4),
      total: 5500,
      address: 'Тестовый адрес',
      deliveryTime: '14:00-16:00'
    }, {
      email: testEmail.value
    })
    
    alert('Тестовое email отправлено!')
  } catch (error) {
    alert('Ошибка отправки email: ' + error.message)
  } finally {
    isTestingEmail.value = false
  }
}

const updateStoreConfig = async () => {
  const newSettings = {
    providers: {
      sms: {
        primary: smsConfig.value.primary,
        fallback: smsConfig.value.fallback,
        config: smsConfig.value.config,
        fallbackConfig: {}
      },
      email: {
        primary: emailConfig.value.primary,
        fallback: emailConfig.value.fallback,
        config: emailConfig.value.config,
        fallbackConfig: {}
      }
    },
    retryAttempts: globalSettings.value.retryAttempts,
    retryDelay: globalSettings.value.retryDelay
  }
  
  notificationsStore.updateSettings(newSettings)
}

const saveConfiguration = async () => {
  isSaving.value = true
  
  try {
    await updateStoreConfig()
    
    // Simulate API call to save configuration
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Настройки сохранены!')
  } catch (error) {
    alert('Ошибка сохранения: ' + error.message)
  } finally {
    isSaving.value = false
  }
}

const loadSMSBalance = async () => {
  try {
    smsBalance.value = await notificationsStore.getSMSBalance()
  } catch (error) {
    console.error('Error loading SMS balance:', error)
  }
}

// Load current settings
onMounted(() => {
  const currentSettings = notificationsStore.settings
  
  if (currentSettings.providers) {
    smsConfig.value = {
      primary: currentSettings.providers.sms.primary,
      fallback: currentSettings.providers.sms.fallback || '',
      config: { ...currentSettings.providers.sms.config }
    }
    
    emailConfig.value = {
      primary: currentSettings.providers.email.primary,
      fallback: currentSettings.providers.email.fallback || '',
      config: { ...currentSettings.providers.email.config }
    }
  }
  
  globalSettings.value = {
    retryAttempts: currentSettings.retryAttempts || 3,
    retryDelay: currentSettings.retryDelay || 1000
  }
  
  // Load SMS balance
  loadSMSBalance()
})
</script>
