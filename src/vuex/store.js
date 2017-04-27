'use strict'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  camready: false,
  recording: false
}

const mutations = {
  camready (state, ready) {
    state.camready = ready
  },
  recording (state, status) {
    state.recording = status
  }
}

const store = new Vuex.Store({
  state,
  mutations
})

export default store
