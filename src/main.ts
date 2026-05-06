import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/config/rem'
import '@/style/common.css'
import '@/style/app.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
