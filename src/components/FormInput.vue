<script>
export default {
  name: 'MyInput',
  props: {
    modelValue: [String, Number],
    placeholder: [String],
    disabled: [Boolean],
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:modelValue'],
  methods: {
    updateInput(event) {
      this.$emit('update:modelValue', event.target.value)
    },
  },
}
</script>

<template>
  <div>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      :class="{
        disabled,
      }"
      w-full
      p="x4 y4"
      bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
      @input="updateInput"
    >
  </div>
</template>

  <style scoped>
    .disabled {
      @apply text-gray-700
    }
</style>

