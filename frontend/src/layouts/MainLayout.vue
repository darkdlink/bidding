<template>
  <div class="layout-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <img src="@/assets/images/logo.png" alt="Bidding" v-if="!sidebarCollapsed" />
          <img src="@/assets/images/logo-small.png" alt="B" v-else />
        </div>
        <button class="sidebar-toggle" @click="toggleSidebar">
          <i class="pi" :class="sidebarCollapsed ? 'pi-angle-right' : 'pi-angle-left'"></i>
        </button>
      </div>
      
      <div class="sidebar-content">
        <div class="sidebar-menu">
          <nav-menu :collapsed="sidebarCollapsed" />
        </div>
      </div>
      
      <div class="sidebar-footer">
        <div class="theme-toggle" @click="toggleTheme">
          <i class="pi" :class="isDarkTheme ? 'pi-sun' : 'pi-moon'"></i>
          <span v-if="!sidebarCollapsed">{{ isDarkTheme ? 'Modo Claro' : 'Modo Escuro' }}</span>
        </div>
      </div>
    </aside>
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>
        
        <div class="header-right">
          <!-- Notificações -->
          <div class="notifications-dropdown">
            <Button icon="pi pi-bell" class="p-button-rounded p-button-text p-button-lg" @click="toggleNotifications">
              <Badge v-if="unreadNotifications > 0" :value="unreadNotifications" severity="danger"></Badge>
            </Button>
            <div class="notifications-menu" v-if="showNotifications">
              <div class="notifications-header">
                <h3>Notificações</h3>
                <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-sm" @click="toggleNotifications" />
              </div>
              <div class="notifications-list">
                <div v-if="notifications.length === 0" class="no-notifications">
                  <p>Sem notificações</p>
                </div>
                <div v-else class="notification-item" v-for="notification in notifications" :key="notification.id" :class="{ 'unread': !notification.is_read }">
                  <div class="notification-icon" :class="notification.type">
                    <i class="pi" :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <h4>{{ notification.title }}</h4>
                    <p>{{ notification.message }}</p>
                    <span class="notification-time">{{ $filters.formatDateTime(notification.created_at) }}</span>
                  </div>
                </div>
              </div>
              <div class="notifications-footer">
                <Button label="Ver Todas" class="p-button-text" @click="viewAllNotifications" />
                <Button v-if="unreadNotifications > 0" label="Marcar Lidas" class="p-button-text" @click="markAllAsRead" />
              </div>
            </div>
          </div>
          
          <!-- Perfil do Usuário -->
          <div class="user-dropdown">
            <Button class="p-button-text p-button-lg user-button" @click="toggleUserMenu">
              <div class="user-avatar">
                <i class="pi pi-user"></i>
              </div>
              <span class="user-name" v-if="!isSmallScreen">{{ userName }}</span>
              <i class="pi pi-angle-down" v-if="!isSmallScreen"></i>
            </Button>
            <div class="user-menu" v-if="showUserMenu">
              <div class="user-menu-header">
                <div class="user-info">
                  <h3>{{ userName }}</h3>
                  <p>{{ userEmail }}</p>
                </div>
              </div>
              <div class="user-menu-options">
                <router-link to="/profile" class="user-menu-item" @click="showUserMenu = false">
                  <i class="pi pi-user"></i>
                  <span>Meu Perfil</span>
                </router-link>
                <div class="user-menu-item" @click="logout">
                  <i class="pi pi-sign-out"></i>
                  <span>Sair</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Content Area -->
      <main class="content-area">
        <router-view />
      </main>
      
      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <p>Bidding &copy; {{ currentYear }} - Sistema de Capitalização de Licitações</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import NavMenu from '@/components/NavMenu.vue';

export default {
  name: 'MainLayout',
  components: {
    NavMenu
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    // Estado local
    const showNotifications = ref(false);
    const showUserMenu = ref(false);
    const isSmallScreen = ref(window.innerWidth < 768);
    
    // Estado global
    const sidebarCollapsed = computed(() => store.getters.sidebarCollapsed);
    const theme = computed(() => store.getters.theme);
    const isDarkTheme = computed(() => theme.value === 'dark');
    const userName = computed(() => store.getters['auth/userName']);
    const userEmail = computed(() => store.getters['auth/userEmail']);
    const notifications = computed(() => store.getters['notification/notifications']);
    const unreadNotifications = computed(() => store.getters['notification/unreadCount']);
    const currentPageTitle = computed(() => route.meta.title || 'Dashboard');
    const currentYear = computed(() => new Date().getFullYear());
    
    // Métodos
    const toggleSidebar = () => {
      store.dispatch('toggleSidebar');
    };
    
    const toggleTheme = () => {
      const newTheme = isDarkTheme.value ? 'light' : 'dark';
      store.dispatch('setTheme', newTheme);
    };
    
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value) {
        // Fechar menu de usuário se estiver aberto
        showUserMenu.value = false;
        // Carregar notificações
        store.dispatch('notification/fetchNotifications');
      }
    };
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      if (showUserMenu.value) {
        // Fechar notificações se estiver aberto
        showNotifications.value = false;
      }
    };
    
    const getNotificationIcon = (type) => {
      const icons = {
        'info': 'pi-info-circle',
        'warning': 'pi-exclamation-triangle',
        'alert': 'pi-bell',
        'success': 'pi-check-circle'
      };
      return icons[type] || 'pi-info-circle';
    };
    
    const viewAllNotifications = () => {
      showNotifications.value = false;
      router.push('/notifications');
    };
    
    const markAllAsRead = () => {
      store.dispatch('notification/markAllAsRead');
    };
    
    const logout = async () => {
      await store.dispatch('auth/logout');
      router.push('/auth/login');
    };
    
    // Detectar cliques fora dos menus dropdown
    const handleClickOutside = (event) => {
      const notificationsDropdown = document.querySelector('.notifications-dropdown');
      const userDropdown = document.querySelector('.user-dropdown');
      
      if (notificationsDropdown && !notificationsDropdown.contains(event.target)) {
        showNotifications.value = false;
      }
      
      if (userDropdown && !userDropdown.contains(event.target)) {
        showUserMenu.value = false;
      }
    };
    
    // Detectar redimensionamento da janela
    const handleResize = () => {
      isSmallScreen.value = window.innerWidth < 768;
      
      // Colapsar sidebar automaticamente em telas pequenas
      if (isSmallScreen.value && !sidebarCollapsed.value) {
        store.dispatch('toggleSidebar');
      }
    };
    
    // Ciclo de vida do componente
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('resize', handleResize);
      
      // Carregar notificações iniciais
      store.dispatch('notification/fetchNotifications');
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    });
    
    return {
      sidebarCollapsed,
      isDarkTheme,
      userName,
      userEmail,
      notifications,
      unreadNotifications,
      currentPageTitle,
      currentYear,
      showNotifications,
      showUserMenu,
      isSmallScreen,
      toggleSidebar,
      toggleTheme,
      toggleNotifications,
      toggleUserMenu,
      getNotificationIcon,
      viewAllNotifications,
      markAllAsRead,
      logout
    };
  }
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: var(--sidebar-bg);
  color: var(--sidebar-text);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  max-height: 40px;
}

.sidebar-toggle {
  background: transparent;
  border: none;
  color: var(--sidebar-text);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.sidebar-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
}

.theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* Header */
.header {
  height: 64px;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Notifications Dropdown */
.notifications-dropdown, .user-dropdown {
  position: relative;
}

.notifications-menu, .user-menu {
  position: absolute;
  top: 48px;
  right: 0;
  width: 320px;
  background-color: var(--card-bg);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.notifications-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.notification-item.unread {
  background-color: rgba(33, 150, 243, 0.05);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-icon.info {
  background-color: rgba(0, 188, 212, 0.2);
  color: #00BCD4;
}

.notification-icon.warning {
  background-color: rgba(255, 193, 7, 0.2);
  color: #FFC107;
}

.notification-icon.alert {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.notification-icon.success {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  margin: 0;
  font-weight: 500;
}

.notification-content p {
  margin: 4px 0;
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.8;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
}

.notifications-footer {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
}

.no-notifications {
  padding: 24px;
  text-align: center;
  color: var(--text-color);
  opacity: 0.6;
}

/* User Dropdown */
.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-weight: 500;
}

.user-menu-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.user-info h3 {
  margin: 0;
  font-weight: 500;
}

.user-info p {
  margin: 4px 0 0;
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.user-menu-options {
  padding: 8px 0;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: var(--text-color);
  text-decoration: none;
  cursor: pointer;
}

.user-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--bg-color);
}

/* Footer */
.footer {
  height: 50px;
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
}

.footer-content {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    height: 100vh;
    transform: translateX(-100%);
  }
  
  .sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
  }
  
  .sidebar-collapsed {
    transform: translateX(-100%);
  }
  
  .content-area {
    padding: 16px;
  }
}
</style>