<!-- eslint-disable no-console -->
<script setup>
import { useSound } from '@vueuse/sound'
import airgram from '~/airgram'
import notif from '~/notif.mp3'
const audio = useSound(notif)
const store = useUserStore()
const name = ref()
const router = useRouter()
const opened = ref()
const chatEl = ref(null)
onMounted(async () => {
  const state = await store.getAuthState()
  if (state === 'authorizationStateReady')
    store.isAuth = true
  else
    return await router.push('/login')
  const me = await store.getMe()
  console.log(me)
  const resp = await store.getChats(40)
  console.log('CHATS', loadedChats)
})
airgram.on('updateUnreadMessageCount', (evt) => {
  console.log(evt)
})

airgram.on('updateNewMessage', async (evt) => {
  if (opened.value !== evt.update.message.chatId)
    console.log(evt.update)

  const found = store.chats.find(val => val.id === evt.update.message.chatId)
  if (found) {
    found.lastMessage = evt.update.message
    const item = store.chats.splice(store.chats.indexOf(found), 1)
    store.chats.unshift(...item)
  }
  else {
    await store.addChat(evt.update.message.chatId)
  }
  await store.addMsgToChatHistory(evt.update.message.chatId, evt.update.message)
  // chatEl.value.scrollTop = chatEl.value.scrollHeight
  console.log(chatEl.value)
})
const go = () => {
  if (name)
    router.push(`/hi/${encodeURIComponent(name)}`)
}

const openChat = async (id) => {
  if (opened.value && id !== opened.value) {
    await store.closeChat(opened.value)
    opened.value = null
  }
  await store.openChat(id)
  opened.value = id
}
</script>

<template>
  <div class="flex justify-start flex-nowrap">
    <div class="chats bg-dark-500 w-1/3 h-screen overflow-y-scroll overflow-x-hidden">
      <Header />
      <Chat v-for="chat in store.chats" :id="chat.id" :key="chat.id" :chat="chat" class="my-1" :opened="opened === chat.id" @click="openChat(chat.id)" />
    </div>
    <OpenedChat v-if="opened" :id="opened" ref="chatEl" />
  </div>
</template>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0.5;
  }
</style>

<route lang="yaml">
meta:
  layout: home
</route>
