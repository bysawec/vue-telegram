<script setup>
const props = defineProps({
  modelValue: [String, Number],
  placeholder: [String],
  disabled: [Boolean],
  type: {
    type: String,
    default: 'text',
  },
})
const emit = defineEmits(['update:modelValue', 'inputFile'])
const file = ref(null)
const updateInput = (event) => {
  emit('update:modelValue', event.target.value)
}
const handleFileUpload = async (event) => {
  console.log(event.target.files)
  if (event.target.files.length)
    emit('inputFile', event.target.files.item(0))
}
</script>

<script>
export default {
  name: 'MessageInput',
}
</script>

<template>
  <div class="flex justify-between items-center border-gray-500 border border-rounded">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      :class="{
        disabled,
      }"
      w-full
      h-full
      p="x4 y4"
      bg="transparent"
      outline="none active:none"
      @input="updateInput"
    >
    <input id="file" name="file" type="file" accept="image/png, image/jpeg" class="attachment" @change="handleFileUpload">
    <label for="file" class="px-4 hover:cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-500">
      <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
    </svg>
    </label>
  </div>
</template>

      <style scoped>
        .disabled {
          @apply text-gray-700
        }
        .attachment {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }
</style>

