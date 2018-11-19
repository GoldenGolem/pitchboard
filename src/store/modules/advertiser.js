
const state = {
  cards: [],
  defaultCard: null,
  cardsLoaded: false
}

const actions = {
  saveCards({commit}, object) {
    commit('SAVE_CARDS', object)
  }
}

const mutations = {
  SAVE_CARDS(state, object) {
    state.cardsLoaded = true
    state.cards = object.cards
    state.defaultCard = object.default
  },
}

export default {
  state,
  // getters,
  actions,
  mutations
}
