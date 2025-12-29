import './assets/main.css'
import Navbar from './components/Navbar.vue'
import { createApp } from 'vue'


import App from './App.vue'
import router from './router'

const app = createApp(App)
app.component('Navbar', Navbar)
app.use(router)
app.mount('#app')


