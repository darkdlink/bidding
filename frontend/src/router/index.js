import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Páginas
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Auth/Login.vue'
import LicitacoesList from '../views/Licitacoes/List.vue'
import LicitacaoDetail from '../views/Licitacoes/Detail.vue'
import PropostaForm from '../views/Propostas/Form.vue'
import RelatoriosPage from '../views/Relatorios/Index.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/licitacoes',
    name: 'licitacoes',
    component: LicitacoesList,
    meta: { requiresAuth: true }
  },
  {
    path: '/licitacoes/:id',
    name: 'licitacao-detail',
    component: LicitacaoDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/propostas/create',
    name: 'proposta-create',
    component: PropostaForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/relatorios',
    name: 'relatorios',
    component: RelatoriosPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navegação guard para autenticação
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      next({ name: 'login' })
      return
    }
  }
  
  if (to.matched.some(record => record.meta.guest)) {
    if (store.getters['auth/isAuthenticated']) {
      next({ name: 'dashboard' })
      return
    }
  }
  
  next()
})

export default router