<script setup>
import airgram from '~/airgram'
const props = defineProps({
  id: [Number],
})
const store = useUserStore()
const historyEl = ref()
const messages = ref([])
const messageInput = ref('')
const sendMessage = async () => {
  const resp = await store.sendMessage(props.id, messageInput.value)
  if (resp.response?.sendingState)
    messageInput.value = ''
}

onMounted(async () => {
  console.log(historyEl.value)
  console.log('openedChat mounted')
  console.log(props.id)
  await store.updateChatHistory(props.id)
  // historyEl.value.scrollTop = historyEl.value.scrollHeight
  historyEl.value.scrollTo(0, historyEl.value.scrollHeight)
})
onBeforeUpdate(() => {
  historyEl.value.scrollTo(0, historyEl.value.scrollHeight)
  historyEl.value.scrollTop = historyEl.value.scrollHeight
})
</script>

<template>
  <div class="flex w-70vw h-100vh flex-col">
    <div ref="historyEl" class="history overflow-y-auto flex flex-col max-h-90vh w-full">
      <transition-group name="fade">
        <Message v-for="message of store.chatsHistory[id]" :key="message.id" class="msg" :message="message" :content="message.content" />
      </transition-group>
    </div>
    <div class="input w-full mt-auto">
      <FormInput v-model="messageInput" placeholder="Написать сообщение..." @keydown.enter="sendMessage" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.history {
   overscroll-behavior-y: contain;
  scroll-snap-type: y proximity;
}
.history > .msg > .msg:last-child {
    scroll-snap-align: end;
}
</style>
