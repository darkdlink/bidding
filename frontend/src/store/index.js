import { createStore } from 'vuex'
import auth from './modules/Auth'
import licitacoes from './modules/licitacoes'
import propostas from './modules/propostas'

export default createStore({
  modules: {
    auth,
    licitacoes,
    propostas
  }
})