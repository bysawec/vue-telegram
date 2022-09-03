import { acceptHMRUpdate, defineStore } from 'pinia'
import airgram from '~/airgram'
export const useUserStore = defineStore('User', {
  state: () => ({
    isAuth: false,
    me: {},
    chats: [{ blank: true, id: 1 }, { blank: true, id: 2 }, { blank: true, id: 3 }, { blank: true, id: 4 }, { blank: true, id: 5 }, { blank: true, id: 6 }, { blank: true, id: 7 }, { blank: true, id: 8 }, { blank: true, id: 9 }, { blank: true, id: 10 }, { blank: true, id: 11 }],
    chatsHistory: {},
    chatIds: [],
  }),
  actions: {
    async sendMessage(chatId, text, messageThreadId = 0, replyToMessageId = 0) {
      const resp = await airgram.api.sendMessage({
        chatId,
        inputMessageContent: {
          _: 'inputMessageText',
          text: {
            text,
          },
        },
        messageThreadId,
        replyToMessageId,
      })
      return resp
    },
    async loadChats(chatList, limit) {
      const resp = await airgram.api.loadChats({
        chatList,
        limit,
      })
      console.log('LoadChats', resp)
      return resp
    },
    async addMsgToChatHistory(id, msg) {
      if (this.chatsHistory[id])
        this.chatsHistory[id] = [...this.chatsHistory[id], msg]

      else
        this.chatsHistory[id] = [msg]
    },
    async updateChatHistory(id) {
      const history = await this.getChatHistory(id, 1)
      const msg_id = history.response.messages[0].id
      const newHistory = await this.getChatHistory(id, 50, msg_id)
      this.chatsHistory[id] = [history.response.messages[0], ...newHistory.response.messages].reverse()
    },
    async getMe() {
      const resp = await airgram.api.getMe()
      this.me = resp.response
      return resp.response
    },
    async getChatHistory(id, limit, fromMessageId = undefined) {
      const resp = await airgram.api.getChatHistory({
        chatId: id,
        limit,
        fromMessageId,
      })
      return resp
    },
    async closeChat(id) {
      const resp = await airgram.api.closeChat({
        chatId: id,
      })
      return resp
    },
    async openChat(id) {
      const resp = await airgram.api.openChat({
        chatId: id,
      })
      return resp
    },
    async logout() {
      const log = await airgram.api.logOut()
      return log
    },
    async addChat(id) {
      const info = await airgram.api.getChat({
        chatId: id,
      })
      this.chats.unshift(info.response)
    },
    async getChats(count) {
      const resp = await airgram.api.getChats({
        limit: count,
      })
      this.chatIds = resp.response.chatIds
      console.log('getChats', resp)
      const chats = []
      for await (const chatId of this.chatIds) {
        const info = await airgram.api.getChat({
          chatId,
        })
        chats.push(info.response)
      }
      this.chats = chats
      return resp
    },
    async saveSession() {
      const session = await airgram.api.getActiveSessions()
      return session
    },
    async getAuthState() {
      const state = await airgram.api.getAuthorizationState()
      console.log(state.response._)
      return state.response._
    },
    async resendCode() {
      await airgram.api.resendAuthenticationCode()
    },
    async getCode(number) {
      const state = await airgram.api.getAuthorizationState()
      await airgram.api.setAuthenticationPhoneNumber({
        phoneNumber: number,
      })
      console.log(state)
    },
    async confirmCode(code) {
      const resp = await airgram.api.checkAuthenticationCode({
        code,
      })
      return resp
    },
    async signIn(password) {
      await airgram.api.checkAuthenticationPassword({
        password,
      })
      const state = await airgram.api.getAuthorizationState()
      console.log(state)
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
