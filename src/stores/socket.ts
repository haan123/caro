import { defineStore } from 'pinia'

export const useSocketStore = defineStore('socket', () => {
  const url = import.meta.env.DEV ? 'http://localhost:4000' : 'https://caro4fun.netlify.app/'

  return { url }
})
