import axios from 'axios';

const state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const getters = {
  isAuthenticated: state => !!state.token,
  token: state => state.token,
  user: state => state.user,
  userRole: state => state.user ? state.user.role : null,
  userName: state => state.user ? state.user.name : '',
  userEmail: state => state.user ? state.user.email : '',
  userCompanies: state => state.user && state.user.companies ? state.user.companies : [],
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  SET_USER(state, user) {
    state.user = user;
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },
  UPDATE_USER(state, userData) {
    state.user = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(state.user));
  },
};

const actions = {
  // Login
  async login({ commit, dispatch }, credentials) {
    try {
      const response = await axios.post('/auth/login', credentials);
      const { access_token, user } = response.data;
      
      // Guardar token e usuário
      commit('SET_TOKEN', access_token);
      commit('SET_USER', user);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout
  async logout({ commit }) {
    try {
      // Tentar fazer logout no servidor
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar dados locais mesmo em caso de erro
      commit('SET_TOKEN', null);
      commit('SET_USER', null);
    }
  },
  
  // Refresh token
  async refreshToken({ commit }) {
    try {
      const response = await axios.post('/auth/refresh');
      const { access_token } = response.data;
      
      commit('SET_TOKEN', access_token);
      return access_token;
    } catch (error) {
      commit('SET_TOKEN', null);
      commit('SET_USER', null);
      throw error;
    }
  },
  
  // Obter dados do usuário
  async getUser({ commit }) {
    try {
      const response = await axios.get('/auth/me');
      commit('SET_USER', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Registro de usuário
  async register({ commit }, userData) {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Atualizar perfil
  async updateProfile({ commit }, userData) {
    try {
      const response = await axios.put(`/users/${userData.id}`, userData);
      commit('UPDATE_USER', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Alterar senha
  async changePassword({ commit }, passwordData) {
    try {
      const response = await axios.put(`/users/${passwordData.id}/change-password`, {
        current_password: passwordData.current_password,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Solicitar recuperação de senha
  async forgotPassword({ commit }, email) {
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Resetar senha
  async resetPassword({ commit }, data) {
    try {
      const response = await axios.post('/auth/reset-password', {
        token: data.token,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};