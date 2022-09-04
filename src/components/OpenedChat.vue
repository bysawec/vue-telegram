<script setup>
import airgram from '~/airgram'
const props = defineProps({
  id: [Number],
})
const store = useUserStore()
const historyEl = ref()
const messages = ref([])
const messageInput = ref('')
const attachment = ref()
const blobToImage = (blob) => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.src = url
  })
}
const sendMessage = async () => {
  let resp
  if (attachment.value)
    resp = await store.sendPhoto(props.id, messageInput.value, attachment.value)
  else resp = await store.sendMessage(props.id, messageInput.value)

  console.log(resp)
  if (resp.response?.sendingState)
    messageInput.value = ''
}
const attach = async (file) => {
  attachment.value = file
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
      <MessageInput v-model="messageInput" placeholder="Написать сообщение..." @keydown.enter="sendMessage" @input-file="attach" />
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
