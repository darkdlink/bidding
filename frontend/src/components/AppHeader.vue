<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">Bidding</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/licitacoes">Licitações</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/propostas">Propostas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/relatorios">Relatórios</router-link>
          </li>
        </ul>
        
        <div class="d-flex">
          <span class="navbar-text me-3">{{ user ? user.name : '' }}</span>
          <button class="btn btn-outline-light" @click="logout">Sair</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppHeader',
  computed: {
    ...mapGetters('auth', ['user'])
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>
