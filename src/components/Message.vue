<script setup>
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import airgram from '~/airgram'
import dayjs from '~/composables/dayjs'
const props = defineProps({
  message: [Object],
  content: [Object],
  date: [String],
})
const store = useUserStore()
const photo = ref()
const src = ref({})
onMounted(async () => {
  console.log(props.content)
  if (!props.content)
    return
  if (props.content._ === 'messagePhoto') {
    console.log(props.content.photo.sizes)
    if (!props.content.photo.sizes.length)
      return
    const image = await airgram.api.downloadFile({
      fileId: props.content?.photo?.sizes[2]?.photo?.id || props.content?.photo?.sizes[1]?.photo?.id || props.content?.photo?.sizes[0]?.photo?.id,
      priority: 1,
      synchronous: true,
    })

    const { response } = await airgram.api.readFilePart({
      fileId: props.content?.photo?.sizes[2]?.photo?.id || props.content?.photo?.sizes[1]?.photo?.id || props.content?.photo?.sizes[0]?.photo?.id,
    })
    photo.value = URL.createObjectURL(response.data)
  }
  if (props.content._ === 'messageVideo') {
    const image = await airgram.api.downloadFile({
      fileId: props.content?.video.video.id,
      priority: 1,
      synchronous: true,
    })

    const { response } = await airgram.api.readFilePart({
      fileId: props.content?.video.video.id,
    })
    photo.value = URL.createObjectURL(response.data)
    src.value = { type: 'video/mp4', src: photo.value }
  }
  if (props.content._ === 'messageVideoNote') {
    const image = await airgram.api.downloadFile({
      fileId: props.content?.videoNote.video.id,
      priority: 1,
      synchronous: true,
    })

    const { response } = await airgram.api.readFilePart({
      fileId: props.content?.videoNote.video.id,
    })
    photo.value = URL.createObjectURL(response.data)
    src.value = { type: 'video/mp4', src: photo.value }
  }
})
</script>

<template>
  <div
    class="lg:min-w-35% lg:max-w-45% md:w-100% m-4 rounded-xl relative  p-6 flex" :class="{
      'lg:ml-auto bg-indigo-8': message.senderId.userId === store.me.id,
      'bg-dark-6': message.senderId.userId !== store.me.id,
    }"
  >
    <div v-if="content._ === 'messageText'" class="text overflow-hidden">
      {{ content?.text?.text }}
    </div>
    <div v-if="content._ === 'messagePhoto'" class="text">
      <img :src="photo" alt="" srcset="">
      <div my-4>
        {{ content?.caption?.text }}
      </div>
    </div>
    <div v-if="content._ === 'messageVideo' || content._ === 'messageVideoNote'" class="flex flex-col text w-full min-h-40">
      <VideoPlayer
        v-if="photo"
        class="vjs-big-play-centered"
        :src="src"
        fluid
        controls
        :loop="true"
        :volume="0.6"
      />
      <div my-4>
        {{ content?.caption?.text }}
      </div>
    </div>
    <span class="text-xs text-gray-500 absolute right-0 bottom-0  pb-5px px-2">{{ dayjs(message.date * 1000).fromNow() }}</span>
  </div>
</template>

<style lang="scss" scoped>

</style>
