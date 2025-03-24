import axios from 'axios'

export default {
  namespaced: true,
  
  state: {
    licitacoes: [],
    currentLicitacao: null,
    loading: false
  },
  
  getters: {
    all: state => state.licitacoes,
    current: state => state.currentLicitacao,
    isLoading: state => state.loading
  },
  
  mutations: {
    SET_LICITACOES(state, licitacoes) {
      state.licitacoes = licitacoes
    },
    SET_CURRENT(state, licitacao) {
      state.currentLicitacao = licitacao
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  
  actions: {
    async fetchAll({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get('/licitacoes')
        commit('SET_LICITACOES', response.data)
        commit('SET_LOADING', false)
        return response.data
      } catch (error) {
        commit('SET_LOADING', false)
        throw error
      }
    },
    
    async fetchById({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`/licitacoes/${id}`)
        commit('SET_CURRENT', response.data)
        commit('SET_LOADING', false)
        return response.data
      } catch (error) {
        commit('SET_LOADING', false)
        throw error
      }
    },
    
    async create({ commit }, licitacao) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.post('/licitacoes', licitacao)
        commit('SET_LOADING', false)
        return response.data
      } catch (error) {
        commit('SET_LOADING', false)
        throw error
      }
    }
  }
}