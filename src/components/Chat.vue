<script setup>
import dayjs from '~/composables/dayjs'
import airgram from '~/airgram'
const props = defineProps({
  id: [Number],
  chat: [Object],
  opened: [Boolean],
})
defineEmits(['click'])
const store = useUserStore()
const loaded = ref(false)
const photo = ref()

onBeforeMount(async () => {
  console.log(props.chat)
  if (props.chat?.photo?.small?.id) {
    const image = await airgram.api.downloadFile({
      fileId: props.chat?.photo?.small?.id,
      priority: 1,
      synchronous: true,
    })
    const { response } = await airgram.api.readFilePart({
      fileId: props.chat?.photo?.small?.id,
    })
    photo.value = URL.createObjectURL(response.data)
    console.log(photo.value)
  }
  loaded.value = true
})
</script>

<template>
  <div
    v-if="!chat.blank" :class="{
      opened,
    }" class="chat w-full flex p-4 gap-2 rounded-xl items-center justify-start hover:bg-indigo-6 hover:cursor-pointer"
    @click="$emit('click')"
  >
    <div class="img flex-shrink-0">
      <img v-if="photo" :src="photo" class="rounded-full w-12 h-12">
      <div v-else class="rounded-full w-12 h-12 text-center text-2xl flex justify-center items-center">
        <div class="flex items-center justify-center ">
          <div class="w-10 h-10 border-l-5 border-indigo-600 rounded-full animate-spin" />
        </div>
      </div>
    </div>
    <div class="w-full chat-info flex flex-nowrap flex-col items-start justify-center">
      <div class="flex flex-nowrap justify-between w-full">
        <div class="title font-bold">
          {{ chat.title }}
        </div>
        <div v-if="chat?.lastMessage" class="date text-sm text-gray-500">
          {{ dayjs(chat?.lastMessage?.date * 1000).calendar() }}
        </div>
      </div>
      <div class="w-full flex justify-between items-center gap-1">
        <div>
          <div v-if="chat.lastMessage?.content?.text?.text" class="max-w-23vw last-message">
            {{ chat.lastMessage?.content?.text?.text }}
          </div>
          <div v-else class="flex">
            <img v-show="chat.lastMessage?.content?.video" class="rounded-sm w-6 h-6" :src="`data:image/jpeg;base64,${chat.lastMessage?.content?.video?.minithumbnail.data}`" alt="thumb" srcset="">
            <span class="max-w-23vw last-message">{{ chat.lastMessage?.content.video ? chat.lastMessage?.content?.video?.caption?.text : chat.lastMessage?.content?.videoNote ? 'Видеосообщение' : chat.lastMessage?.content?.animation ? chat.lastMessage?.content?.caption?.text : chat.lastMessage?.content?.caption?.text }}</span>
          </div>
        </div>
        <span v-show="chat.unreadCount > 0" class="unread bg-dark-200 px-2 rounded-xl text-sm flex-shrink-0 self-start justify-start">
          {{ chat.unreadCount }}
        </span>
      </div>
    </div>
  </div>
  <div v-if="chat.blank" class="w-full h-20 animate-pulse bg-dark-200 my-2 flex p-4 gap-2 rounded-xl items-center justify-start" />
</template>

<style lang="scss" scoped>
  .opened {
  @apply bg-indigo-6
  }
  .last-message {
      position: relative;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
  }
  </style>
