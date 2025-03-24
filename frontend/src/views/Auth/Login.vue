<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="text-center mb-4">Login no Sistema Bidding</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Digite seu email"
          >
        </div>
        
        <div class="mb-3">
          <label for="password" class="form-label">Senha</label>
          <input 
            type="password" 
            class="form-control" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Digite sua senha"
          >
        </div>
        
        <div class="mb-3 form-check">
          <input 
            type="checkbox" 
            class="form-check-input" 
            id="remember-me"
            v-model="rememberMe"
          >
          <label class="form-check-label" for="remember-me">
            Manter conectado
          </label>
        </div>
        
        <div v-if="error" class="alert alert-danger mb-3">
          {{ error }}
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'Carregando...' : 'Entrar' }}
        </button>
      </form>
      
      <div class="text-center mt-3">
        <a href="#" @click.prevent="forgotPassword" class="text-muted">
          Esqueceu sua senha?
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      error: null,
      isLoading: false
    }
  },
  methods: {
    async handleLogin() {
      this.error = null
      this.isLoading = true
      
      try {
        await this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password,
          remember: this.rememberMe
        })
        
        // Redireciona para a página inicial após login
        this.$router.push('/')
      } catch (error) {
        // Trata erros de autenticação
        this.error = error.response?.data?.message || 'Erro ao fazer login'
      } finally {
        this.isLoading = false
      }
    },
    
    forgotPassword() {
      // Lógica para recuperação de senha
      // Pode ser um modal ou redirecionar para outra página
      console.log('Recuperar senha')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f6f9;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>