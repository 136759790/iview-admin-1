import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import menu from './module/menu'
import tenant from './module/tenant'
import project from './module/project'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    menu,
    project,
    tenant
  }
})
