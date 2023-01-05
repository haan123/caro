import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { VueSvgIconPlugin } from '@yzfe/vue3-svgicon'

import '@/assets/css/app.css'

const app = createApp(App)

app.use(VueSvgIconPlugin, {
  tagName: 'icon'
})
app.use(createPinia())
app.use(router)

app.mount('#app')
