<template>
  <div>
    <h1>Dashboard</h1>
    
    <div class="row mt-4">
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h5 class="card-title">Licitações Ativas</h5>
            <h2 class="card-text">{{ stats.licitacoesAtivas || 0 }}</h2>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h5 class="card-title">Propostas Enviadas</h5>
            <h2 class="card-text">{{ stats.propostasEnviadas || 0 }}</h2>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <h5 class="card-title">Propostas Pendentes</h5>
            <h2 class="card-text">{{ stats.propostasPendentes || 0 }}</h2>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h5 class="card-title">Taxa de Sucesso</h5>
            <h2 class="card-text">{{ stats.taxaSucesso || 0 }}%</h2>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-8 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Últimas Licitações</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Carregando...</span>
              </div>
            </div>
            <table v-else class="table table-striped">
              <thead>
                <tr>
                  <th>Edital</th>
                  <th>Título</th>
                  <th>Data Abertura</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="licitacao in recentLicitacoes" :key="licitacao.id">
                  <td>{{ licitacao.numero_edital }}</td>
                  <td>{{ licitacao.titulo }}</td>
                  <td>{{ formatDate(licitacao.data_abertura) }}</td>
                  <td>
                    <span :class="getStatusClass(licitacao.status)">
                      {{ licitacao.status }}
                    </span>
                  </td>
                  <td>
                    <router-link :to="`/licitacoes/${licitacao.id}`" class="btn btn-sm btn-primary">
                      Detalhes
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Próximos Prazos</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Carregando...</span>
              </div>
            </div>
            <ul v-else class="list-group">
              <li v-for="prazo in nextDeadlines" :key="prazo.id" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <p class="mb-0 fw-bold">{{ prazo.titulo }}</p>
                    <small>{{ prazo.numero_edital }}</small>
                  </div>
                  <span class="badge bg-danger">{{ formatDate(prazo.data_encerramento) }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      stats: {
        licitacoesAtivas: 0,
        propostasEnviadas: 0,
        propostasPendentes: 0,
        taxaSucesso: 0
      },
      recentLicitacoes: [],
      nextDeadlines: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  created() {
    this.fetchDashboardData()
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true
      try {
        const response = await this.$axios.get('/dashboard')
        this.stats = response.data.stats
        this.recentLicitacoes = response.data.recentLicitacoes
        this.nextDeadlines = response.data.nextDeadlines
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pt-BR')
    },
    getStatusClass(status) {
      const classes = {
        'ativa': 'badge bg-success',
        'finalizada': 'badge bg-secondary',
        'cancelada': 'badge bg-danger',
        'suspensa': 'badge bg-warning text-dark'
      }
      return classes[status] || 'badge bg-secondary'
    }
  }
}
</script>