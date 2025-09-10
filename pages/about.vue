<template>
	<div class="container mx-auto px-4 py-12">
		<h1 class="text-3xl md:text-4xl font-bold mb-6">О сервисе Dym.kz</h1>
		<p class="text-gray-600 leading-relaxed max-w-3xl">
			Мы предоставляем профессиональный сервис аренды и обслуживания кальянов в Алматы. 
			Наша миссия — сделать ваш вечер комфортным: качественный инвентарь, свежий табак, 
			опытные мастера и быстрая логистика.
		</p>
		<div class="mt-10 grid md:grid-cols-3 gap-8 max-w-5xl">
			<div class="p-6 rounded-xl bg-white shadow border">
				<h3 class="font-semibold mb-2">Почему мы</h3>
				<p class="text-sm text-gray-600">Проверенное оборудование, стерильная подготовка, прозрачные цены.</p>
			</div>
			<div class="p-6 rounded-xl bg-white shadow border">
				<h3 class="font-semibold mb-2">Скорость</h3>
				<p class="text-sm text-gray-600">Среднее время доставки — около 30 минут в черте города.</p>
			</div>
			<div class="p-6 rounded-xl bg-white shadow border">
				<h3 class="font-semibold mb-2">Поддержка</h3>
				<p class="text-sm text-gray-600">Консультации и сопровождение по телефону и месcенджерам.</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'
useHead({ title: 'О нас - Dym.kz' })
</script>

<style scoped>
</style>
