<template>
  <div class="container mx-auto px-4 py-10" v-if="master">
    <div class="flex flex-col md:flex-row gap-10">
      <div class="w-full md:w-72 flex flex-col items-center text-center">
        <img :src="master.avatar || '/placeholder-user.jpg'" class="w-40 h-40 rounded-full object-cover ring-4 ring-purple-100 shadow" />
        <h1 class="mt-6 text-2xl font-bold">{{ master.name }}</h1>
        <div class="mt-2 flex items-center gap-3 text-sm text-gray-600">
          <span class="flex items-center gap-1">⭐ <strong class="font-semibold">{{ master.rating.toFixed(1) }}</strong></span>
          <span class="text-gray-400">•</span>
          <span>{{ master.total_reviews }} отзывов</span>
        </div>
        <div v-if="master.experience_years" class="mt-2 text-xs uppercase tracking-wide text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          Опыт {{ master.experience_years }} лет
        </div>
        <div class="mt-4 flex flex-wrap gap-2 justify-center">
          <span v-for="s in master.specialties" :key="s" class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{{ s }}</span>
        </div>
      </div>

      <div class="flex-1 space-y-10">
        <!-- Bio -->
        <section>
          <h2 class="text-xl font-semibold mb-3">О мастере</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line" v-if="master.bio">{{ master.bio }}</p>
          <p class="text-gray-400" v-else>Описание пока не добавлено.</p>
        </section>

        <!-- Certificates -->
        <section v-if="master.certificate_file_ids?.length">
          <h2 class="text-xl font-semibold mb-4">Сертификаты</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a v-for="fid in master.certificate_file_ids" :key="fid" :href="fileUrl(fid)" target="_blank" class="group relative block">
              <img :src="filePreview(fid)" class="w-full h-32 object-cover rounded-lg ring-1 ring-black/10 group-hover:brightness-110 transition" />
            </a>
          </div>
        </section>

        <!-- Availability & Booking -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Запись</h2>
            <button v-if="!showBooking" @click="startBooking" class="text-sm px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">Новая запись</button>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
              <h3 class="font-medium mb-2 text-sm uppercase tracking-wide text-gray-500">Доступные слоты</h3>
              <div v-if="slots.length" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 text-sm">
                <button v-for="slot in slots" :key="slot.key" class="px-3 py-2 rounded border hover:bg-purple-50 hover:border-purple-300 flex flex-col items-start" :class="{ 'bg-purple-600 text-white border-purple-600': selectedSlot === slot.key }" @click="selectSlot(slot)">
                  <span>{{ slot.dayLabel }}</span>
                  <span class="text-xs opacity-70">{{ slot.time }}</span>
                </button>
              </div>
              <p v-else class="text-gray-400 text-sm">Расписание не заполнено.</p>
              <div v-if="bookingsLoading" class="mt-4 text-xs text-gray-400">Загрузка бронирований...</div>
            </div>
            <div>
              <div v-if="showBooking" class="border rounded-lg p-4 bg-white shadow-sm">
                <h3 class="font-medium mb-3">Подтверждение</h3>
                <p class="text-xs text-gray-500 mb-3">Вы выбрали: <strong>{{ bookingDateFormatted }}</strong> в <strong>{{ bookingTime }}</strong></p>
                <form @submit.prevent="submitBooking" class="space-y-3">
                  <textarea v-model="bookingNotes" rows="3" placeholder="Пожелания" class="w-full border rounded px-3 py-2 text-sm"></textarea>
                  <div class="flex gap-2">
                    <button :disabled="bookingSubmitting" class="flex-1 px-3 py-2 rounded bg-emerald-600 text-white text-sm disabled:opacity-50">{{ bookingSubmitting ? 'Отправка...' : 'Записаться' }}</button>
                    <button type="button" @click="cancelBooking" class="px-3 py-2 rounded border text-sm">Отмена</button>
                  </div>
                  <p v-if="bookingError" class="text-xs text-red-500">{{ bookingError }}</p>
                  <p v-if="bookingSuccess" class="text-xs text-emerald-600">Бронирование отправлено.</p>
                </form>
              </div>
              <div v-else-if="!isAuthenticated" class="text-sm text-gray-600">
                Для записи необходимо <NuxtLink to="/login" class="text-purple-600 hover:underline">войти</NuxtLink>.
              </div>
            </div>
          </div>
        </section>

        <!-- Reviews -->
        <section>
          <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div class="flex items-center gap-6">
              <h2 class="text-xl font-semibold">Отзывы</h2>
              <div v-if="ratingStats.total" class="flex gap-4 text-xs text-gray-600">
                <div v-for="lvl in [5,4,3,2,1]" :key="lvl" class="flex items-center gap-1">
                  <span class="w-10 text-right">{{ lvl }}★</span>
                  <div class="w-28 h-2 bg-gray-200 rounded overflow-hidden">
                    <div class="h-full bg-purple-500" :style="{ width: ratingStats.percent[lvl] + '%' }"></div>
                  </div>
                  <span class="w-8 text-right">{{ ratingStats.count[lvl] }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <select v-model="reviewsSort" class="border rounded px-2 py-1 text-sm">
                <option value="new">Новые</option>
                <option value="old">Старые</option>
                <option value="high">Высокие оценки</option>
                <option value="low">Низкие оценки</option>
              </select>
              <button v-if="!showReviewForm" @click="startReview" class="text-sm px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700">Отзыв</button>
            </div>
          </div>
          <div v-if="showReviewForm" class="mb-6 border rounded-lg p-4 bg-white shadow-sm">
            <form @submit.prevent="submitReview" class="space-y-3">
              <div>
                <label class="block text-sm font-medium mb-1">Оценка</label>
                <select v-model.number="form.rating" class="w-32 px-2 py-1 border rounded">
                  <option :value="5">5</option>
                  <option :value="4">4</option>
                  <option :value="3">3</option>
                  <option :value="2">2</option>
                  <option :value="1">1</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Комментарий</label>
                <textarea v-model="form.comment" rows="3" class="w-full border rounded px-3 py-2 text-sm" placeholder="Ваши впечатления"></textarea>
              </div>
              <div class="flex gap-3 items-center">
                <button :disabled="reviewSubmitting" class="px-4 py-2 rounded bg-purple-600 text-white text-sm disabled:opacity-50">{{ reviewSubmitting ? 'Отправка...' : 'Отправить' }}</button>
                <button type="button" @click="cancelReview" class="text-sm text-gray-500 hover:underline">Отмена</button>
                <span v-if="reviewError" class="text-sm text-red-500">{{ reviewError }}</span>
              </div>
            </form>
          </div>
          <div class="space-y-4" v-if="pagedReviews.length">
            <div v-for="r in pagedReviews" :key="r.$id" class="bg-white rounded-lg border p-4 shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white flex items-center justify-center font-semibold">{{ (r.user_name || '?').charAt(0) }}</div>
                  <div>
                    <p class="text-sm font-medium">{{ r.user_name || 'Аноним' }}</p>
                    <p class="text-xs text-gray-400">{{ new Date(r.created_at).toLocaleDateString() }}</p>
                  </div>
                </div>
                <span class="text-sm font-semibold">⭐ {{ r.rating }}</span>
              </div>
              <p class="text-sm text-gray-700 whitespace-pre-line">{{ r.comment }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400">Пока нет отзывов.</p>
          <div v-if="reviewsPages > 1" class="mt-4 flex items-center gap-2 justify-center text-sm">
            <button @click="prevPage" :disabled="reviewsPage===1" class="px-2 py-1 border rounded disabled:opacity-40">«</button>
            <span class="px-2">Стр. {{ reviewsPage }} / {{ reviewsPages }}</span>
            <button @click="nextPage" :disabled="reviewsPage===reviewsPages" class="px-2 py-1 border rounded disabled:opacity-40">»</button>
          </div>
          <!-- My bookings -->
          <div v-if="isAuthenticated && myBookings.length" class="mt-8">
            <h3 class="text-sm font-semibold mb-3">Мои записи</h3>
            <div class="space-y-2">
              <div v-for="b in myBookings" :key="b.$id" class="flex items-center justify-between border rounded p-3 text-sm bg-white">
                <div class="flex items-center gap-3">
                  <span class="font-medium">{{ formatDate(b.date) }}</span>
                  <span class="text-gray-500">{{ b.time }}</span>
                  <span class="px-2 py-0.5 rounded text-xs" :class="{
                    'bg-emerald-50 text-emerald-700': b.status==='confirmed',
                    'bg-yellow-50 text-yellow-700': b.status==='pending',
                    'bg-gray-100 text-gray-600': b.status==='cancelled'
                  }">{{ statusLabel(b.status) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <button v-if="b.status!=='cancelled'" @click="cancelMyBooking(b)" class="px-2 py-1 border rounded text-xs hover:bg-gray-50">Отменить</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto px-4 py-24 text-center text-gray-500">Загрузка...</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRuntimeConfig, useRouter } from '#imports'
import { Databases } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections, getBuckets } from '~/utils/appwrite'
import type { Master, MasterReview, MasterBooking } from '~/types/index'
import { ID } from 'appwrite'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const isAuthenticated = computed(() => auth.isAuthenticated)
const id = route.params.id as string
const master = ref<Master | null>(null)
const reviews = ref<MasterReview[]>([])
const showReviewForm = ref(false)
const form = ref({ rating: 5, comment: '' })
const reviewSubmitting = ref(false)
const reviewError = ref('')
const selectedSlot = ref<string | null>(null)
const showBooking = ref(false)
const bookingNotes = ref('')
const bookingSubmitting = ref(false)
const bookingError = ref('')
const bookingSuccess = ref(false)
const bookings = ref<MasterBooking[]>([])
const bookingsLoading = ref(false)

function fileBase(fid: string, path = 'view') {
  const cfg: any = useRuntimeConfig().public
  const bucket = getBuckets().DATA
  return `${cfg.appwriteEndpoint}/storage/buckets/${bucket}/files/${fid}/${path}?project=${cfg.appwriteProjectId}`
}
const filePreview = (fid: string) => fileBase(fid, 'preview') + '&width=400&height=400&quality=70'
const fileUrl = (fid: string) => fileBase(fid, 'view')

const today = new Date()
const slots = computed(() => {
  if (!master.value?.availability) return []
  const out: { key: string; day: string; dayLabel: string; date: string; time: string }[] = []
  const next14 = Array.from({ length: 14 }).map((_, i) => new Date(today.getTime() + i * 86400000))
  next14.forEach(d => {
    const weekday = String(d.getDay())
    const dayAvail = master.value!.availability![weekday]
    if (dayAvail) {
      dayAvail.forEach((time: string) => {
        const dateStr = d.toISOString().slice(0, 10)
        // Skip if already booked
        const booked = bookings.value.some(b => b.date === dateStr && b.time === time && b.status !== 'cancelled')
        if (!booked) {
          out.push({
            key: `${dateStr}-${time}`,
            day: weekday,
            dayLabel: dateStr,
            date: dateStr,
            time
          })
        }
      })
    }
  })
  return out
})

function dayLabel(d: string) {
  const map: Record<string,string> = { '0':'Пн','1':'Вт','2':'Ср','3':'Чт','4':'Пт','5':'Сб','6':'Вс' }
  return map[d] || d
}

async function load() {
  try {
    const client = useAppwriteClient()
    const db = new Databases(client)
    const dbId = getDatabaseId()
    const cols = getCollections() as any
    const m = await db.getDocument(dbId, cols.MASTERS, id)
    master.value = m as any
    const revs = await db.listDocuments(dbId, cols.MASTER_REVIEWS, [])
    reviews.value = revs.documents
      .filter((r: any) => r.master_id === id)
      .map((r: any): MasterReview => ({
        $id: r.$id,
        master_id: r.master_id,
        user_id: r.user_id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at || r.$createdAt,
        user_name: r.user_name
      }))
    // bookings
    bookingsLoading.value = true
    try {
      const bookingDocs = await db.listDocuments(dbId, cols.BOOKINGS, [])
      bookings.value = bookingDocs.documents
        .filter((b: any) => b.master_id === id)
        .map((b: any): MasterBooking => ({
          $id: b.$id,
          master_id: b.master_id,
            user_id: b.user_id || '',
          date: b.date,
          time: b.time,
          created_at: b.created_at || b.$createdAt,
          status: b.status || 'pending',
          notes: b.notes
        }))
    } finally {
      bookingsLoading.value = false
    }
  } catch (e) {
    // silent
  }
}

async function submitReview() {
  if (!form.value.comment.trim()) { reviewError.value = 'Введите текст'; return }
  reviewError.value = ''
  reviewSubmitting.value = true
  try {
    const client = useAppwriteClient()
    const db = new Databases(client)
    const dbId = getDatabaseId()
    const cols = getCollections() as any
    const doc: any = await db.createDocument(dbId, cols.MASTER_REVIEWS, ID.unique(), {
      master_id: id,
      user_id: auth.user?.$id,
      user_name: (auth.user as any)?.name,
      rating: form.value.rating,
      comment: form.value.comment.trim(),
      created_at: new Date().toISOString(),
    })
    reviews.value.unshift(doc)
    showReviewForm.value = false
    form.value = { rating: 5, comment: '' }
  } catch (e: any) {
    reviewError.value = e?.message || 'Ошибка'
  } finally {
    reviewSubmitting.value = false
  }
}

function cancelReview() { showReviewForm.value = false; reviewError.value=''; }

// Booking logic
function startBooking() {
  if (!isAuthenticated.value) { router.push('/login'); return }
  if (!selectedSlot.value && slots.value.length) selectedSlot.value = slots.value[0].key
  showBooking.value = true
  bookingSuccess.value = false
}
function cancelBooking() { showBooking.value = false; bookingNotes.value=''; bookingError.value=''; bookingSuccess.value=false }
const bookingDate = computed(() => selectedSlot.value ? selectedSlot.value.split('-')[0] : '')
const bookingTime = computed(() => selectedSlot.value ? selectedSlot.value.split('-')[1] : '')
const bookingDateFormatted = computed(() => bookingDate.value ? bookingDate.value.split('-').reverse().join('.') : '')
async function submitBooking() {
  if (!selectedSlot.value) { bookingError.value = 'Выберите слот'; return }
  bookingError.value=''; bookingSubmitting.value=true; bookingSuccess.value=false
  try {
    const client = useAppwriteClient(); const db = new Databases(client); const dbId = getDatabaseId(); const cols = getCollections() as any
    const doc: any = await db.createDocument(dbId, cols.BOOKINGS, ID.unique(), {
      master_id: id,
      user_id: auth.user?.$id || undefined,
      date: bookingDate.value,
      time: bookingTime.value,
      notes: bookingNotes.value.trim() || undefined,
      status: 'pending',
      created_at: new Date().toISOString()
    })
    bookings.value.push(doc)
    bookingSuccess.value = true
    showBooking.value = false
  } catch (e: any) {
    bookingError.value = e?.message || 'Ошибка'
  } finally {
    bookingSubmitting.value=false
  }
}
function selectSlot(slot: any) { selectedSlot.value = slot.key }

// Review pagination & sorting
const reviewsSort = ref<'new'|'old'|'high'|'low'>('new')
const reviewsPage = ref(1)
const pageSize = 5
const sortedReviews = computed(() => {
  const arr = [...reviews.value]
  switch (reviewsSort.value) {
    case 'new': arr.sort((a,b)=> new Date(b.created_at).getTime()-new Date(a.created_at).getTime()); break
    case 'old': arr.sort((a,b)=> new Date(a.created_at).getTime()-new Date(b.created_at).getTime()); break
    case 'high': arr.sort((a,b)=> b.rating - a.rating); break
    case 'low': arr.sort((a,b)=> a.rating - b.rating); break
  }
  return arr
})
const reviewsPages = computed(()=> Math.max(1, Math.ceil(sortedReviews.value.length / pageSize)))
const pagedReviews = computed(()=> sortedReviews.value.slice((reviewsPage.value-1)*pageSize, reviewsPage.value*pageSize))
function nextPage(){ if (reviewsPage.value < reviewsPages.value) reviewsPage.value++ }
function prevPage(){ if (reviewsPage.value > 1) reviewsPage.value-- }
watch([reviewsSort, reviews], () => { reviewsPage.value = 1 })

// Rating stats
const ratingStats = computed(()=>{
  const count: Record<number, number> = {1:0,2:0,3:0,4:0,5:0}
  reviews.value.forEach(r=>{ count[r.rating] = (count[r.rating]||0)+1 })
  const total = reviews.value.length
  const percent: Record<number, number> = {1:0,2:0,3:0,4:0,5:0}
  if (total) for (const k in count) percent[k as any] = +(count[k as any]/total*100).toFixed(1)
  return { count, total, percent }
})

// My bookings & helpers
const myBookings = computed(() => {
  const uid = (auth.user as any)?.$id
  return uid ? bookings.value.filter(b => b.user_id === uid) : []
})
function formatDate(dateStr: string) {
  const [y,m,d] = dateStr.split('-'); return `${d}.${m}.${y}`
}
function statusLabel(s: MasterBooking['status']) {
  return s === 'pending' ? 'Ожидает' : s === 'confirmed' ? 'Подтверждено' : 'Отменено'
}
async function cancelMyBooking(b: MasterBooking) {
  try {
    const db = new Databases(useAppwriteClient())
    await db.updateDocument(getDatabaseId(), (getCollections() as any).BOOKINGS, b.$id, { status: 'cancelled' })
    const i = bookings.value.findIndex(x => x.$id === b.$id)
    if (i !== -1) bookings.value[i].status = 'cancelled'
  } catch (e) { /* ignore */ }
}

function startReview() {
  if (!isAuthenticated) { router.push('/login'); return }
  showReviewForm.value = true
}

onMounted(load)
</script>
