<template>
    <ul class="nav-menu">
      <li v-for="item in filteredMenuItems" :key="item.label" class="nav-item" :class="{ active: isActiveRoute(item.to) }">
        <router-link :to="item.to" class="nav-link">
          <i class="pi" :class="item.icon"></i>
          <span v-if="!collapsed">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  
  export default {
    name: 'NavMenu',
    props: {
      collapsed: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const store = useStore();
      const route = useRoute();
      
      // Obter o papel do usuário
      const userRole = computed(() => store.getters['auth/userRole']);
      
      // Definir todos os itens do menu
      const menuItems = [
        {
          label: 'Dashboard',
          icon: 'pi-home',
          to: '/',
          roles: ['admin', 'manager', 'analyst', 'viewer']
        },
        {
          label: 'Licitações',
          icon: 'pi-briefcase',
          to: '/biddings',
          roles: ['admin', 'manager', 'analyst', 'viewer']
        },
        {
          label: 'Propostas',
          icon: 'pi-file',
          to: '/proposals',
          roles: ['admin', 'manager', 'analyst', 'viewer']
        },
        {
          label: 'Empresas',
          icon: 'pi-building',
          to: '/companies',
          roles: ['admin', 'manager']
        },
        {
          label: 'Usuários',
          icon: 'pi-users',
          to: '/users',
          roles: ['admin']
        },
        {
          label: 'Fontes de Licitação',
          icon: 'pi-server',
          to: '/scrapers',
          roles: ['admin', 'manager']
        },
        {
          label: 'Notificações',
          icon: 'pi-bell',
          to: '/notifications',
          roles: ['admin', 'manager', 'analyst', 'viewer']
        },
        {
          label: 'Configurações',
          icon: 'pi-cog',
          to: '/settings',
          roles: ['admin', 'manager']
        }
      ];
      
      // Filtrar itens do menu com base no papel do usuário
      const filteredMenuItems = computed(() => {
        return menuItems.filter(item => item.roles.includes(userRole.value));
      });
      
      // Verificar se a rota atual corresponde ao item de menu
      const isActiveRoute = (to) => {
        if (to === '/') {
          return route.path === '/';
        }
        return route.path.startsWith(to);
      };
      
      return {
        filteredMenuItems,
        isActiveRoute
      };
    }
  }
  </script>
  
  <style scoped>
  .nav-menu {
    list-style: none;
    padding: 0;
    margin: 16px 0;
  }
  
  .nav-item {
    margin: 4px 0;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: var(--sidebar-text);
    text-decoration: none;
    border-radius: 4px;
    margin: 0 8px;
    transition: background-color 0.2s;
  }
  
  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .nav-item.active .nav-link {
    background-color: var(--primary-color);
  }
  
  .nav-link i {
    font-size: 1.25rem;
    width: 24px;
    text-align: center;
  }
  </style>