import { createApp } from 'vue'
import './styles/base.css'
import App from './App.vue'
import { vReveal, vMagnetic } from './utils/reveal.js'

const app = createApp(App)
app.directive('reveal', vReveal)
app.directive('magnetic', vMagnetic)
app.mount('#app')
