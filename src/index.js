import Vue from 'vue'
import App from './app.vue'
import './assets/styles/global.styl'

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
  // h 是 vue 中 createApp 参数
  render: (h) => h(App)
}).$mount(root)
