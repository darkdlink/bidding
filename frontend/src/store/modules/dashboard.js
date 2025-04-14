import axios from 'axios';

const state = {
  summary: {
    biddings: 0,
    proposals: 0,
    wonProposals: 0,
    totalValue: 0
  },
  biddingsByStatus: [],
  proposalsByStatus: [],
  upcomingDeadlines: [],
  recentActivity: []
};

const getters = {
  summary: state => state.summary,
  biddingsByStatus: state => state.biddingsByStatus,
  proposalsByStatus: state => state.proposalsByStatus,
  upcomingDeadlines: state => state.upcomingDeadlines,
  recentActivity: state => state.recentActivity
};

const mutations = {
  SET_SUMMARY(state, summary) {
    state.summary = summary;
  },
  SET_BIDDINGS_BY_STATUS(state, data) {
    state.biddingsByStatus = data;
  },
  SET_PROPOSALS_BY_STATUS(state, data) {
    state.proposalsByStatus = data;
  },
  SET_UPCOMING_DEADLINES(state, data) {
    state.upcomingDeadlines = data;
  },
  SET_RECENT_ACTIVITY(state, data) {
    state.recentActivity = data;
  }
};

const actions = {
  // Obter resumo do dashboard
  async fetchSummary({ commit }) {
    try {
      const response = await axios.get('/dashboard/summary');
      commit('SET_SUMMARY', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obter licitações por status
  async fetchBiddingsByStatus({ commit }) {
    try {
      const response = await axios.get('/dashboard/biddings-by-status');
      commit('SET_BIDDINGS_BY_STATUS', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obter propostas por status
  async fetchProposalsByStatus({ commit }) {
    try {
      const response = await axios.get('/dashboard/proposals-by-status');
      commit('SET_PROPOSALS_BY_STATUS', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obter próximos prazos
  async fetchUpcomingDeadlines({ commit }) {
    try {
      const response = await axios.get('/dashboard/upcoming-deadlines');
      commit('SET_UPCOMING_DEADLINES', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obter atividades recentes
  async fetchRecentActivity({ commit }) {
    try {
      const response = await axios.get('/dashboard/recent-activity');
      commit('SET_RECENT_ACTIVITY', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};