<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" v-if="show">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div v-if="stage==='confirm'" class="space-y-4">
        <h2 class="text-2xl font-bold text-center">Вам уже есть 21 год?</h2>
        <p class="text-sm text-gray-600 text-center">Доступ к сайту возможен только совершеннолетним (21+).</p>
        <div class="flex gap-4 pt-4">
          <button @click="yes()" class="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">Да</button>
          <button @click="no()" class="flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition">Нет</button>
        </div>
      </div>
      <div v-else-if="stage==='dob'" class="space-y-5">
        <h2 class="text-xl font-semibold text-center">Введите дату рождения</h2>
        <div class="flex gap-3">
          <select v-model="day" class="flex-1 border rounded-lg px-2 py-2 focus:ring-2 focus:ring-sky-400">
            <option value="" disabled>День</option>
            <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
          </select>
          <select v-model="month" class="flex-1 border rounded-lg px-2 py-2 focus:ring-2 focus:ring-sky-400">
            <option value="" disabled>Месяц</option>
            <option v-for="(m,i) in months" :key="i" :value="i+1">{{ m }}</option>
          </select>
          <select v-model="year" class="flex-1 border rounded-lg px-2 py-2 focus:ring-2 focus:ring-sky-400">
            <option value="" disabled>Год</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <div class="flex gap-4 pt-2">
          <button @click="submitDob" class="flex-1 py-3 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition">Продолжить</button>
          <button @click="back()" class="px-4 text-sm text-gray-500 hover:text-gray-700">Назад</button>
        </div>
      </div>
      <div v-else-if="stage==='denied'" class="space-y-5 text-center">
        <h2 class="text-2xl font-bold text-red-600">Доступ запрещён</h2>
        <p class="text-gray-600">К сожалению, вы не достигли 21 года.</p>
        <button @click="reset()" class="mt-2 text-sm text-sky-600 hover:underline">Указать другую дату</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAgeGateStore } from '~/stores/ageGate'

const store = useAgeGateStore()
const stage = ref<'confirm' | 'dob' | 'denied'>('confirm')

const day = ref<number | ''>('')
const month = ref<number | ''>('')
const year = ref<number | ''>('')
const error = ref('')

const months = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 100 }, (_,i) => currentYear - i)

const show = computed(() => !store.isAllowed)

function yes() {
  stage.value = 'dob'
}
function no() {
  stage.value = 'denied'
  store.reject()
}
function back() {
  stage.value = 'confirm'
}
function submitDob() {
  error.value = ''
  if (!day.value || !month.value || !year.value) {
    error.value = 'Заполните все поля'
    return
  }
  const iso = `${year.value.toString().padStart(4,'0')}-${month.value.toString().padStart(2,'0')}-${day.value.toString().padStart(2,'0')}`
  const valid = store.evaluate(iso)
  store.setBirthDate(iso)
  if (valid) {
    stage.value = 'confirm' // hidden (show becomes false)
  } else {
    stage.value = 'denied'
  }
}
function reset() {
  stage.value = 'confirm'
  day.value = month.value = year.value = ''
  store.reject()
}

onMounted(() => {
  if (store.birthDate && !store.isAllowed) {
    // existing birth date but invalid (e.g., age < 21)
    stage.value = 'denied'
  }
})
</script>
