import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

// Layouts
import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

// Carregamento dinâmico de componentes
const Dashboard = () => import('@/views/Dashboard.vue');
const BiddingList = () => import('@/views/biddings/BiddingList.vue');
const BiddingDetail = () => import('@/views/biddings/BiddingDetail.vue');
const BiddingCreate = () => import('@/views/biddings/BiddingCreate.vue');
const BiddingEdit = () => import('@/views/biddings/BiddingEdit.vue');
const ProposalList = () => import('@/views/proposals/ProposalList.vue');
const ProposalDetail = () => import('@/views/proposals/ProposalDetail.vue');
const ProposalCreate = () => import('@/views/proposals/ProposalCreate.vue');
const ProposalEdit = () => import('@/views/proposals/ProposalEdit.vue');
const CompanyList = () => import('@/views/companies/CompanyList.vue');
const CompanyDetail = () => import('@/views/companies/CompanyDetail.vue');
const CompanyCreate = () => import('@/views/companies/CompanyCreate.vue');
const CompanyEdit = () => import('@/views/companies/CompanyEdit.vue');
const UserList = () => import('@/views/users/UserList.vue');
const UserCreate = () => import('@/views/users/UserCreate.vue');
const UserEdit = () => import('@/views/users/UserEdit.vue');
const Settings = () => import('@/views/Settings.vue');
const ScraperList = () => import('@/views/scrapers/ScraperList.vue');
const ScraperCreate = () => import('@/views/scrapers/ScraperCreate.vue');
const ScraperEdit = () => import('@/views/scrapers/ScraperEdit.vue');
const NotificationList = () => import('@/views/notifications/NotificationList.vue');
const Profile = () => import('@/views/Profile.vue');
const Login = () => import('@/views/Auth/Login.vue');
const Register = () => import('@/views/auth/Register.vue');
const ForgotPassword = () => import('@/views/auth/ForgotPassword.vue');
const ResetPassword = () => import('@/views/auth/ResetPassword.vue');
const PageNotFound = () => import('@/views/errors/PageNotFound.vue');

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard' }
      },
      // Licitações
      {
        path: 'biddings',
        name: 'biddings',
        component: BiddingList,
        meta: { title: 'Licitações' }
      },
      {
        path: 'biddings/create',
        name: 'bidding-create',
        component: BiddingCreate,
        meta: { title: 'Nova Licitação' }
      },
      {
        path: 'biddings/:id',
        name: 'bidding-detail',
        component: BiddingDetail,
        meta: { title: 'Detalhes da Licitação' },
        props: true
      },
      {
        path: 'biddings/:id/edit',
        name: 'bidding-edit',
        component: BiddingEdit,
        meta: { title: 'Editar Licitação' },
        props: true
      },
      // Propostas
      {
        path: 'proposals',
        name: 'proposals',
        component: ProposalList,
        meta: { title: 'Propostas' }
      },
      {
        path: 'proposals/create',
        name: 'proposal-create',
        component: ProposalCreate,
        meta: { title: 'Nova Proposta' }
      },
      {
        path: 'proposals/:id',
        name: 'proposal-detail',
        component: ProposalDetail,
        meta: { title: 'Detalhes da Proposta' },
        props: true
      },
      {
        path: 'proposals/:id/edit',
        name: 'proposal-edit',
        component: ProposalEdit,
        meta: { title: 'Editar Proposta' },
        props: true
      },
      // Empresas
      {
        path: 'companies',
        name: 'companies',
        component: CompanyList,
        meta: { title: 'Empresas', requiresRole: ['admin', 'manager'] }
      },
      {
        path: 'companies/create',
        name: 'company-create',
        component: CompanyCreate,
        meta: { title: 'Nova Empresa', requiresRole: ['admin', 'manager'] }
      },
      {
        path: 'companies/:id',
        name: 'company-detail',
        component: CompanyDetail,
        meta: { title: 'Detalhes da Empresa', requiresRole: ['admin', 'manager'] },
        props: true
      },
      {
        path: 'companies/:id/edit',
        name: 'company-edit',
        component: CompanyEdit,
        meta: { title: 'Editar Empresa', requiresRole: ['admin', 'manager'] },
        props: true
      },
      // Usuários
      {
        path: 'users',
        name: 'users',
        component: UserList,
        meta: { title: 'Usuários', requiresRole: ['admin'] }
      },
      {
        path: 'users/create',
        name: 'user-create',
        component: UserCreate,
        meta: { title: 'Novo Usuário', requiresRole: ['admin'] }
      },
      {
        path: 'users/:id/edit',
        name: 'user-edit',
        component: UserEdit,
        meta: { title: 'Editar Usuário', requiresRole: ['admin'] },
        props: true
      },
      // Scrapers
      {
        path: 'scrapers',
        name: 'scrapers',
        component: ScraperList,
        meta: { title: 'Fontes de Licitação', requiresRole: ['admin', 'manager'] }
      },
      {
        path: 'scrapers/create',
        name: 'scraper-create',
        component: ScraperCreate,
        meta: { title: 'Nova Fonte', requiresRole: ['admin', 'manager'] }
      },
      {
        path: 'scrapers/:id/edit',
        name: 'scraper-edit',
        component: ScraperEdit,
        meta: { title: 'Editar Fonte', requiresRole: ['admin', 'manager'] },
        props: true
      },
      // Notificações
      {
        path: 'notifications',
        name: 'notifications',
        component: NotificationList,
        meta: { title: 'Notificações' }
      },
      // Configurações
      {
        path: 'settings',
        name: 'settings',
        component: Settings,
        meta: { title: 'Configurações', requiresRole: ['admin', 'manager'] }
      },
      // Perfil
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
        meta: { title: 'Meu Perfil' }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { guest: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: { title: 'Login' }
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: { title: 'Cadastro' }
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
        meta: { title: 'Recuperar Senha' }
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPassword,
        meta: { title: 'Redefinir Senha' }
      }
    ]
  },
  {
    path: '/login',
    redirect: '/auth/login'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: PageNotFound,
    meta: { title: 'Página não encontrada' }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navegação guard para verificar autenticação
router.beforeEach((to, from, next) => {
  // Definir título da página
  document.title = to.meta.title ? `${to.meta.title} | Bidding` : 'Bidding';
  
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuestOnly = to.matched.some(record => record.meta.guest);
  
  // Verificar se precisa de autenticação
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } 
  // Verificar se é rota apenas para visitantes
  else if (isGuestOnly && isAuthenticated) {
    next({ name: 'dashboard' });
  } 
  // Verificar permissões de usuário
  else if (requiresAuth && to.meta.requiresRole) {
    const userRole = store.getters['auth/userRole'];
    if (to.meta.requiresRole.includes(userRole)) {
      next();
    } else {
      next({ name: 'dashboard' });
    }
  } 
  // Continuar normalmente
  else {
    next();
  }
});

export default router;