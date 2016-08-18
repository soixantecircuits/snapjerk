import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/* eslint-disable no-new */
const router = new VueRouter({
  transitionOnLoad: true
})

router.map({
  '/': {
    name: 'App',
    component: App
  }
})

export default router
