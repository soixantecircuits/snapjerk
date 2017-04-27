'use strict'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  camready: false
}

const mutations = {
  camready (state, ready) {
    state.camready = ready
  }
}

const store = new Vuex.Store({
  state,
  mutations
})

export default store
