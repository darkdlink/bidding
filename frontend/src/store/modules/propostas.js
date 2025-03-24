import axios from 'axios'

export default {
  namespaced: true,
  
  state: {
    propostas: [],
    currentProposta: null,
    loading: false
  },
  
  getters: {
    all: state => state.propostas,
    current: state => state.currentProposta,
    isLoading: state => state.loading
  },
  
  mutations: {
    SET_PROPOSTAS(state, propostas) {
      state.propostas = propostas
    },
    SET_CURRENT(state, proposta) {
      state.currentProposta = proposta
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  
  actions: {
    async fetchAll({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get('/propostas')
        commit('SET_PROPOSTAS', response.data)
        commit('SET_LOADING', false)
        return response.data
      } catch (error) {
        commit('SET_LOADING', false)
        throw error
      }
    }
  }
}