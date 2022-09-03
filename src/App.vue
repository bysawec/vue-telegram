<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
const store = useUserStore()
const router = useRouter()
let state: string

useHead({
  title: 'Telegram',
  meta: [
    { name: 'description', content: 'Telegram Client on Vue 3' },
    {
      name: 'theme-color',
      content: '#00aba9',
    },
  ],
})
onBeforeMount(async () => {

})
onMounted(async () => {
  state = await store.getAuthState()
  if (state === 'authorizationStateReady')
    store.isAuth = true
})
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
  ::-webkit-scrollbar {
    width: 10px !important;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.25) !important;
}

/* Handle */
::-webkit-scrollbar-thumb {
  @apply bg-indigo-700
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-indigo-700
}
</style>
