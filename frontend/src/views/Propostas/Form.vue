<template>
    <div class="proposta-form">
      <h1>Nova Proposta</h1>
      <form @submit.prevent="submitProposta">
        <div class="form-group">
          <label>Licitação</label>
          <select v-model="proposta.licitacao_id" class="form-control" required>
            <option 
              v-for="licitacao in licitacoes" 
              :key="licitacao.id" 
              :value="licitacao.id"
            >
              {{ licitacao.titulo }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Valor Proposto</label>
          <input 
            type="number" 
            v-model="proposta.valor_proposto" 
            class="form-control" 
            required
          >
        </div>
        <button type="submit" class="btn btn-primary">Enviar Proposta</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PropostaForm',
    data() {
      return {
        proposta: {
          licitacao_id: null,
          valor_proposto: null
        },
        licitacoes: []
      }
    },
    async created() {
      try {
        this.licitacoes = await this.$store.dispatch('licitacoes/fetchAll')
      } catch (error) {
        console.error('Erro ao carregar licitações:', error)
      }
    },
    methods: {
      async submitProposta() {
        try {
          await this.$store.dispatch('propostas/create', this.proposta)
          this.$router.push('/propostas')
        } catch (error) {
          console.error('Erro ao enviar proposta:', error)
        }
      }
    }
  }
  </script>