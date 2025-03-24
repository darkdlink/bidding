<template>
    <div class="licitacao-detail">
      <div v-if="loading">Carregando...</div>
      <div v-else-if="licitacao">
        <h1>{{ licitacao.titulo }}</h1>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Detalhes da Licitação</h5>
            <p><strong>Número do Edital:</strong> {{ licitacao.numero_edital }}</p>
            <p><strong>Descrição:</strong> {{ licitacao.descricao }}</p>
            <p><strong>Data de Abertura:</strong> {{ licitacao.data_abertura }}</p>
            <p><strong>Status:</strong> {{ licitacao.status }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        Licitação não encontrada
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LicitacaoDetail',
    data() {
      return {
        licitacao: null,
        loading: true
      }
    },
    async created() {
      try {
        const id = this.$route.params.id
        this.licitacao = await this.$store.dispatch('licitacoes/fetchById', id)
        this.loading = false
      } catch (error) {
        console.error('Erro ao carregar detalhes da licitação:', error)
        this.loading = false
      }
    }
  }
  </script>