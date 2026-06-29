import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './style.css'

const app = createApp(App)

// Hier wird das Live-Backend für das gesamte Frontend bekannt gemacht!
app.config.globalProperties.$apiUrl = 'https://sonicbackend-production.up.railway.app/api'

app.use(router).mount('#app')
