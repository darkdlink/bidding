<template>
  <div class="login-view">
    <h2 class="title">Login</h2>
    <p class="subtitle">Faça login para acessar o sistema</p>
    
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">E-mail</label>
        <span class="p-input-icon-left w-full">
          <i class="pi pi-envelope"></i>
          <InputText
            id="email"
            v-model="form.email"
            type="email"
            class="w-full"
            placeholder="Digite seu e-mail"
            :class="{ 'p-invalid': validationErrors.email }"
          />
        </span>
        <small v-if="validationErrors.email" class="p-error">{{ validationErrors.email }}</small>
      </div>
      
      <div class="form-group">
        <label for="password">Senha</label>
        <span class="p-input-icon-left w-full">
          <i class="pi pi-lock"></i>
          <Password
            id="password"
            v-model="form.password"
            class="w-full"
            inputClass="w-full"
            placeholder="Digite sua senha"
            :feedback="false"
            :class="{ 'p-invalid': validationErrors.password }"
            :toggleMask="true"
          />
        </span>
        <small v-if="validationErrors.password" class="p-error">{{ validationErrors.password }}</small>
      </div>
      
      <div class="form-options">
        <div class="p-field-checkbox">
          <Checkbox v-model="form.remember" id="remember" :binary="true" />
          <label for="remember">Lembrar-me</label>
        </div>
        
        <router-link to="/auth/forgot-password" class="forgot-password">
          Esqueceu a senha?
        </router-link>
      </div>
      
      <div class="form-actions">
        <Button
          type="submit"
          label="Entrar"
          icon="pi pi-sign-in"
          class="p-button-primary w-full"
          :loading="loading"
        />
      </div>
    </form>
    
    <div class="login-footer">
      <p>Não tem uma conta? <router-link to="/auth/register">Cadastre-se</router-link></p>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Password from 'primevue/password';

export default {
  name: 'LoginView',
  components: {
    Password
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    
    // Estado do formulário
    const form = reactive({
      email: '',
      password: '',
      remember: false
    });
    
    // Estado de carregamento
    const loading = ref(false);
    
    // Erros de validação
    const validationErrors = reactive({
      email: '',
      password: ''
    });
    
    // Limpar erros de validação
    const clearValidationErrors = () => {
      validationErrors.email = '';
      validationErrors.password = '';
    };
    
    // Validar formulário
    const validateForm = () => {
      clearValidationErrors();
      let isValid = true;
      
      if (!form.email) {
        validationErrors.email = 'O e-mail é obrigatório';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        validationErrors.email = 'Digite um e-mail válido';
        isValid = false;
      }
      
      if (!form.password) {
        validationErrors.password = 'A senha é obrigatória';
        isValid = false;
      } else if (form.password.length < 8) {
        validationErrors.password = 'A senha deve ter pelo menos 8 caracteres';
        isValid = false;
      }
      
      return isValid;
    };
    
    // Manipular login
    const handleLogin = async () => {
      if (!validateForm()) {
        return;
      }
      
      loading.value = true;
      
      try {
        await store.dispatch('auth/login', form);
        
        toast.add({
          severity: 'success',
          summary: 'Login realizado',
          detail: 'Você foi autenticado com sucesso!',
          life: 3000
        });
        
        router.push('/');
      } catch (error) {
        console.error('Erro no login:', error);
        
        if (error.response && error.response.data && error.response.data.errors) {
          // Erros de validação do backend
          const backendErrors = error.response.data.errors;
          
          if (backendErrors.email) {
            validationErrors.email = backendErrors.email[0];
          }
          
          if (backendErrors.password) {
            validationErrors.password = backendErrors.password[0];
          }
        } else if (error.response && error.response.status === 401) {
          // Credenciais inválidas
          toast.add({
            severity: 'error',
            summary: 'Erro de autenticação',
            detail: 'E-mail ou senha inválidos',
            life: 5000
          });
        } else {
          // Erro genérico
          toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Ocorreu um erro ao tentar fazer login',
            life: 5000
          });
        }
      } finally {
        loading.value = false;
      }
    };
    
    return {
      form,
      loading,
      validationErrors,
      handleLogin
    };
  }
}
</script>

<style scoped>
.login-view {
  padding: 24px;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 24px;
  text-align: center;
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.form-actions {
  margin-bottom: 24px;
}

.login-footer {
  text-align: center;
}

.login-footer a {
  color: var(--primary-color);
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>