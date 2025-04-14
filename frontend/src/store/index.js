import { createStore } from 'vuex';
import auth from './modules/Auth';
import bidding from './modules/bidding';
import proposal from './modules/proposal';
import company from './modules/company';
import user from './modules/user';
import notification from './modules/notification';
import scraper from './modules/scraper';
import dashboard from './modules/dashboard';

export default createStore({
  state: {
    loading: false,
    sidebarCollapsed: false,
    theme: localStorage.getItem('theme') || 'light',
  },
  getters: {
    loading: state => state.loading,
    sidebarCollapsed: state => state.sidebarCollapsed,
    theme: state => state.theme,
  },
  mutations: {
    SET_LOADING(state, value) {
      state.loading = value;
    },
    TOGGLE_SIDEBAR(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed);
    },
    SET_THEME(state, theme) {
      state.theme = theme;
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  },
  actions: {
    setLoading({ commit }, value) {
      commit('SET_LOADING', value);
    },
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR');
    },
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme);
    }
  },
  modules: {
    auth,
    bidding,
    proposal,
    company,
    user,
    notification,
    scraper,
    dashboard
  }
});