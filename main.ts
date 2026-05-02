import './src/style/common.css'
import './src/config/rem.ts'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ajax from './src/config/ajax'
import App from './src/App.vue'
import router from './src/router'

const app = createApp(App)
app.config.globalProperties.$ajax = ajax
app.use(createPinia())
app.use(router)

app.mount('#app')
