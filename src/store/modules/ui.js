import api from '../../api/hello'
import * as actionTypes from '../actionTypes'
import * as getterNames from '../getterNames'
import * as mutationTypes from '../mutationTypes'

const state = {
  loading: {
    active: false,
    text: null
  },
  alert: {
    active: false,
    text: null,
    color: 'primary',
    timeout: 6000,
    mode: 'normal'
  }
}

const actions = {
  loading({commit}, text) {
    commit('START_LOADING', text)
  },
  stopLoading({commit}) {
    commit('STOP_LOADING')
  },
  alert({commit}, payload) {
    commit('START_ALERT', payload)
  },
  closeAlert({commit}) {
    commit('STOP_ALERT')
  }
}

const mutations = {
  START_LOADING(state, text) {
    state.loading.active = true
    state.loading.text = text
  },
  STOP_LOADING(state) {
    state.loading.active = false
    state.loading.text = null
  },
  START_ALERT(state, payload) {
    state.alert.active = true
    state.alert.text = payload.text
    if (payload.color) state.alert.color = payload.color
    if (payload.timeout) state.alert.timeout = payload.timeout
    if (payload.multiline) state.alert.mode = 'multi-line'
  },
  STOP_ALERT(state) {
    state.alert.active = false
    state.alert.text = null
    state.alert.color = 'primary'
    state.alert.timeout = 6000
    state.alert.mode = "normal"
  },
}

export default {
  state,
  // getters,
  actions,
  mutations
}
