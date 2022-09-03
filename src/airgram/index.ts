import { Airgram } from '@airgram/web'

const airgram = new Airgram({
  apiId: import.meta.env.VITE_APP_ID as unknown as number,
  apiHash: import.meta.env.VITE_APP_HASH,
  logVerbosityLevel: 1,
})
airgram.on('updateUnreadMessageCount', (evt) => {
  console.log(evt)
})

export default airgram
