<script setup lang="ts">
// Use authorization middleware
import airgram from '~/airgram'

const store = useUserStore()
const router = useRouter()
const step = ref(0)
const number = ref()
const password = ref()
const code = ref('')
const codeError = ref(false)
const options = reactive({
  button: ['Get code', 'Confirm Code', 'Sign in'],
})
const signIn = async () => {
  if (step.value === 0)
    await store.getCode(number.value)
  if (step.value === 1) {
    const resp = await store.confirmCode(code.value)
    if (resp.response._ === 'error') {
      code.value = ''
      step.value--
      codeError.value = true
    }
    console.log(resp)
  }
  if (step.value === 2) {
    await store.signIn(password.value)
    const state = await store.getAuthState()
    if (state === 'authorizationStateReady') {
      store.isAuth = true
      return router.push('/')
    }
    else {
      step.value--
    }
  }
  step.value++
}

onMounted(async () => {
  const state = await store.getAuthState()
  if (state === 'authorizationStateReady') {
    store.isAuth = true
    return router.push('/')
  }
})
airgram.on('updateAuthorizationState', (event) => {
  if (event.update.authorizationState._ === 'authorizationStateReady')
    router.push('/')
})
</script>

<template>
  <div class="h-full flex gap-2 flex-col justify-center items-center">
    <FormInput v-model="number" placeholder="Number" :disabled="step > 0" @keyup.enter="signIn" />
    <FormInput
      v-show="step > 0"
      v-model="code" type="text" :placeholder="codeError ? 'Invalid Code' : 'Сode'" :disabled="step > 1" @keyup.enter="signIn"
    />
    <FormInput v-show="step > 1" v-model="password" if type="password" placeholder="Password" :disabled="step > 2" @keyup.enter="signIn" />
    <FormButton @click="signIn">
      {{ options.button[step] }}
    </FormButton>
  </div>
</template>

<style lang="scss" scoped>

</style>
