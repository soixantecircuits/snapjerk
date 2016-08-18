import Vue from 'vue'
import Vuex from 'vuex'

import settings from './../lib/settings.js'

// Make vue aware of Vuex
Vue.use(Vuex)

// Create an object to hold the initial state when
// the app starts up
const state = {
  dataUrl: '', // settings.count.default
  free: true
}

// Create an object storing various mutations. We will write the mutation
const mutations = {
  ASK_TAKE_SNAP (state) {
    state.free = false
  },
  ANS_TAKE_SNAP (state, dataUrl) {
    state.dataUrl = dataUrl
    state.free = true
  }
}

// Combine the initial state and the mutations to create a Vuex store.
// This store can be linked to our app.
export default new Vuex.Store({
  state,
  mutations
})
