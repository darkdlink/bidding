<template>
    <div class="auth-layout">
      <div class="auth-container">
        <div class="auth-logo">
          <img src="@/assets/images/logo.png" alt="Bidding" />
        </div>
        
        <div class="auth-card">
          <router-view />
        </div>
        
        <div class="auth-footer">
          <p>Bidding &copy; {{ currentYear }} - Sistema de Capitalização de Licitações</p>
        </div>
      </div>
      
      <div class="auth-background">
        <div class="background-image"></div>
        <div class="overlay"></div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  
  export default {
    name: 'AuthLayout',
    setup() {
      const currentYear = computed(() => new Date().getFullYear());
      
      return {
        currentYear
      };
    }
  }
  </script>
  
  <style scoped>
  .auth-layout {
    display: flex;
    min-height: 100vh;
    position: relative;
  }
  
  .auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 480px;
    padding: 24px;
    background-color: var(--card-bg);
    position: relative;
    z-index: 1;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  
  .auth-logo {
    margin-bottom: 24px;
  }
  
  .auth-logo img {
    height: 60px;
  }
  
  .auth-card {
    width: 100%;
    margin-bottom: 24px;
  }
  
  .auth-footer {
    margin-top: auto;
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-color);
    opacity: 0.7;
  }
  
  .auth-background {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  
  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('@/assets/images/auth-background.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .auth-layout {
      flex-direction: column;
    }
    
    .auth-container {
      max-width: 100%;
      min-height: 100vh;
    }
    
    .auth-background {
      display: none;
    }
  }
  </style>