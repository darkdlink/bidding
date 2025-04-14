<template>
  <div class="app-container" :class="{ 'dark-theme': isDarkTheme }">
    <!-- Global Toast -->
    <Toast position="top-right" />
    
    <!-- Global Loading -->
    <div v-if="loading" class="global-loading">
      <div class="loading-spinner">
        <ProgressSpinner />
        <span>Carregando...</span>
      </div>
    </div>
    
    <!-- Router View -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ProgressSpinner from 'primevue/progressspinner';

export default {
  name: 'App',
  components: {
    ProgressSpinner
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // Estado global
    const loading = computed(() => store.getters.loading);
    const theme = computed(() => store.getters.theme);
    const isDarkTheme = computed(() => theme.value === 'dark');
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    
    // Inicialização
    onMounted(async () => {
      // Aplicar tema
      document.documentElement.setAttribute('data-theme', theme.value);
      
      // Verificar autenticação
      if (isAuthenticated.value) {
        try {
          // Obter dados do usuário
          await store.dispatch('auth/getUser');
        } catch (error) {
          // Se falhar, fazer logout
          await store.dispatch('auth/logout');
          router.push('/auth/login');
        }
      }
    });
    
    // Observar mudanças no tema
    watch(theme, (newTheme) => {
      document.documentElement.setAttribute('data-theme', newTheme);
    });
    
    return {
      loading,
      isDarkTheme
    };
  }
}
</script>

<style>
/* Estilos globais */
:root {
  --primary-color: #2196F3;
  --secondary-color: #3F51B5;
  --success-color: #4CAF50;
  --warning-color: #FFC107;
  --danger-color: #F44336;
  --info-color: #00BCD4;
  --bg-color: #f8f9fa;
  --text-color: #212529;
  --card-bg: #ffffff;
  --border-color: #e0e0e0;
  --sidebar-bg: #2c3e50;
  --sidebar-text: #ecf0f1;
}

/* Tema escuro */
[data-theme="dark"] {
  --bg-color: #121212;
  --text-color: #ecf0f1;
  --card-bg: #1e1e1e;
  --border-color: #333333;
  --sidebar-bg: #1a1a1a;
  --sidebar-text: #ecf0f1;
}

/* Reset e estilos base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: 'Roboto', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-color);
  background-color: var(--bg-color);
}

.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Animações de transição */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading global */
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.loading-spinner span {
  margin-top: 10px;
}
</style>