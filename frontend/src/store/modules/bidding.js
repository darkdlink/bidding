import axios from 'axios';

const state = {
  biddings: [],
  currentBidding: null,
  pagination: {
    total: 0,
    perPage: 15,
    currentPage: 1,
    lastPage: 0,
  },
  filters: {
    search: '',
    status: null,
    modality: null,
    agency_id: null,
    date_from: null,
    date_to: null,
    tag: null,
  },
  loading: false,
};

const getters = {
  biddings: state => state.biddings,
  currentBidding: state => state.currentBidding,
  pagination: state => state.pagination,
  filters: state => state.filters,
  loading: state => state.loading,
};

const mutations = {
  SET_BIDDINGS(state, biddings) {
    state.biddings = biddings;
  },
  SET_CURRENT_BIDDING(state, bidding) {
    state.currentBidding = bidding;
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = pagination;
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters };
  },
  RESET_FILTERS(state) {
    state.filters = {
      search: '',
      status: null,
      modality: null,
      agency_id: null,
      date_from: null,
      date_to: null,
      tag: null,
    };
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
};

const actions = {
  // Obter lista de licitações
  async fetchBiddings({ commit, state }, page = 1) {
    commit('SET_LOADING', true);
    
    try {
      const params = {
        ...state.filters,
        page,
        per_page: state.pagination.perPage,
      };
      
      const response = await axios.get('/biddings', { params });
      
      commit('SET_BIDDINGS', response.data.data);
      commit('SET_PAGINATION', {
        total: response.data.total,
        perPage: response.data.per_page,
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
      });
      
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Obter detalhes de uma licitação
  async fetchBidding({ commit }, id) {
    commit('SET_LOADING', true);
    
    try {
      const response = await axios.get(`/biddings/${id}`);
      commit('SET_CURRENT_BIDDING', response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Criar nova licitação
  async createBidding({ commit, dispatch }, biddingData) {
    commit('SET_LOADING', true);
    
    try {
      const response = await axios.post('/biddings', biddingData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Atualizar licitação
  async updateBidding({ commit }, biddingData) {
    commit('SET_LOADING', true);
    
    try {
      const response = await axios.put(`/biddings/${biddingData.id}`, biddingData);
      commit('SET_CURRENT_BIDDING', response.data.bidding);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Excluir licitação
  async deleteBidding({ commit, dispatch }, id) {
    commit('SET_LOADING', true);
    
    try {
      const response = await axios.delete(`/biddings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Fazer upload de documento
  async uploadDocument({ commit, state }, { id, document, name, type }) {
    commit('SET_LOADING', true);
    
    try {
      const formData = new FormData();
      formData.append('document', document);
      formData.append('name', name);
      formData.append('type', type);
      
      const response = await axios.post(`/biddings/${id}/upload-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Obter documentos de uma licitação
  async fetchDocuments({ commit }, id) {
    commit('SET_LOADING', true);
    
    try {
      const response = await axios.get(`/biddings/${id}/documents`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Definir filtros e buscar licitações
  setFiltersAndFetch({ commit, dispatch }, filters) {
    commit('SET_FILTERS', filters);
    return dispatch('fetchBiddings', 1);
  },
  
  // Resetar filtros e buscar licitações
  resetFiltersAndFetch({ commit, dispatch }) {
    commit('RESET_FILTERS');
    return dispatch('fetchBiddings', 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};