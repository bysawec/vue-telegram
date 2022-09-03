<script setup>
const router = useRouter()
const store = useUserStore()
const logout = async () => {
  const resp = await store.logout()
  router.push('/login')
  await store.getAuthState()
  console.log(resp)
}
</script>

<template>
  <div outline class="py-2 outline-dark-2 mb-4 flex items-center">
    <span class="font-bold ml-auto">@{{ store.me.username }}</span>
    <FormButton class="ml-auto mx-2" @click="logout">
      Выйти
    </FormButton>
  </div>
</template>

<style scoped>

</style>
