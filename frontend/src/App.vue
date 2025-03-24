<template>
  <div id="app">
    <app-header v-if="isAuthenticated"></app-header>
    <main class="container mt-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
  created() {
    if (this.isAuthenticated) {
      this.$store.dispatch('auth/fetchUser')
    }
  }
}
</script>