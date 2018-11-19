import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import advertiser from './modules/advertiser'
import ui from './modules/ui'

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV === 'development'

export default new Vuex.Store({
  modules: {
    user,
    advertiser,
    ui
  },
  strict: DEBUG
})
