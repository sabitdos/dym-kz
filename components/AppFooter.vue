<template>
  <footer class="bg-gray-800 text-white py-10 mt-16">
    <div class="container mx-auto px-4 text-center space-y-8">
      <BrandCarousel />
      <div>
        <h3 class="text-2xl font-bold mb-2 tracking-tight">Dym.kz</h3>
		<p class="text-gray-400">Премиум кальяны с доставкой</p>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-5 text-gray-300">
        <!-- Instagram -->
        <a href="#" aria-label="Instagram" class="hover:text-white transition" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <circle cx="12" cy="12" r="3.5" />
            <circle cx="16.5" cy="7.5" r="1" />
          </svg>
        </a>
        <!-- TikTok -->
        <a href="#" aria-label="TikTok" class="hover:text-white transition" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 3c.2 2.1 1.4 5 4.6 5.2v2.2c-1.6.2-3-.3-4.3-1.1l.1 6.3c0 3.9-2.6 5.4-5.1 5.4A5.4 5.4 0 0 1 3.5 15c0-3.6 3-5 5.2-5 .4 0 .8 0 1.2.1v2.5a3 3 0 0 0-1.2-.2c-1.1 0-2.6.7-2.6 2.6 0 1.6 1.2 2.6 2.5 2.6 1.2 0 2.6-.7 2.6-2.6L11.1 3h2.4Z" />
          </svg>
        </a>
        <!-- X / Twitter -->
        <a href="#" aria-label="X" class="hover:text-white transition" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.53 3h3.202l-7.01 8.01L22.5 21h-6.137l-4.81-6.273L5.898 21H2.697l7.49-8.556L1.8 3h6.274l4.35 5.748L17.53 3Zm-1.123 15.525h1.774L7.66 4.39H5.769l10.638 14.135Z" />
          </svg>
        </a>
        <!-- Facebook -->
        <a href="#" aria-label="Facebook" class="hover:text-white transition" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 9H17l-.5 3h-3v9h-3v-9H8V9h2.5V7.25C10.5 5.18 11.41 3 14.53 3c1.24 0 2.02.12 2.02.12l-.2 2.94s-.88-.01-1.85-.01C13.5 6.05 13.5 7 13.5 7V9Z" />
          </svg>
        </a>
        <!-- YouTube -->
        <a href="#" aria-label="YouTube" class="hover:text-white transition" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.6 7.2s-.2-1.4-.8-2c-.8-.9-1.7-.9-2.1-1C15.7 4 12 4 12 4h0s-3.7 0-6.7.2c-.4.1-1.3.1-2.1 1-.6.6-.8 2-.8 2S2 8.8 2 10.5v1c0 1.7.2 3.3.2 3.3s.2 1.4.8 2c.8.9 1.9.9 2.4 1 1.8.2 6.6.2 6.6.2s3.7 0 6.7-.2c.4-.1 1.3-.1 2.1-1 .6-.6.8-2 .8-2s.2-1.7.2-3.3v-1c0-1.7-.2-3.3-.2-3.3ZM10 14.7V8.3l5.6 3.2L10 14.7Z" />
          </svg>
        </a>
        <!-- Threads -->
        <a href="#" aria-label="Threads" class="hover:text-white transition" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.07 2c-5.27 0-9.55 3.86-9.55 10.06 0 6.18 4.42 9.94 9.72 9.94 4.37 0 6.52-1.11 8.25-2.94l-1.9-1.86c-1.3 1.31-3.02 2.15-6.25 2.15-4.02 0-6.94-2.78-6.98-6.87h17.16c.05-.42.08-.83.08-1.25C22.6 4.82 17.73 2 12.07 2Zm-6.4 8.42c.5-3.24 2.98-5.3 6.4-5.3 3.37 0 5.86 2 6.32 5.3H5.67Z" />
          </svg>
        </a>
        <!-- Telegram -->
        <a href="#" aria-label="Telegram" class="hover:text-white transition" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.04 16.87 9.3 21c.43 0 .62-.19.85-.41l2.04-1.96 4.24 3.1c.78.43 1.34.2 1.55-.72l2.8-13.18v-.01c.25-1.18-.43-1.64-1.18-1.35L2.74 11.22c-1.15.45-1.13 1.09-.21 1.38l4.37 1.37L18.7 7.03c.57-.38 1.09-.17.66.21L9.04 16.87Z" />
          </svg>
        </a>
      </div>
      <div class="pt-2 text-sm text-gray-400">
        © 2024 Dym.kz. Все права защищены.
      </div>
    </div>
  </footer>
</template>

<script setup>
import BrandCarousel from '~/components/BrandCarousel.vue'
</script>
