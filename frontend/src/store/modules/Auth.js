import axios from 'axios'

export default {
  namespaced: true,
  
  state: {
    user: null,
    token: localStorage.getItem('token') || null
  },
  
  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.user
  },
  
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER(state, user) {
      state.user = user
    },
    LOGOUT(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/login', credentials)
        const { token, user } = response.data
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
        return user
      } catch (error) {
        throw error
      }
    },
    
    async fetchUser({ commit }) {
      try {
        const response = await axios.get('/user')
        const user = response.data
        commit('SET_USER', user)
        return user
      } catch (error) {
        commit('LOGOUT')
        throw error
      }
    },
    
    async logout({ commit }) {
      try {
        await axios.post('/logout')
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      }
      commit('LOGOUT')
    }
  }
}