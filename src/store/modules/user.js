import api from '../../api/hello'
import * as actionTypes from '../actionTypes'
import * as getterNames from '../getterNames'
import * as mutationTypes from '../mutationTypes'

const state = {
  authenticated: false,
  data: {}
}

// const getters = {
//   [getterNames.helloWorld]: (state, getters) => (
//     state.hello
//   )
// }

const actions = {
  authenticateUser({commit}, user) {
    commit('AUTHENTICATE_USER', user)
  }
}

const mutations = {
  AUTHENTICATE_USER(state, user) {
    state.authenticated = true
    state.data = user
  },
}

export default {
  state,
  // getters,
  actions,
  mutations
}
