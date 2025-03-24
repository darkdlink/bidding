<template>
    <div>
      <h1>Licitações</h1>
      <div v-if="loading">Carregando...</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Título</th>
            <th>Data de Abertura</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="licitacao in licitacoes" :key="licitacao.id">
            <td>{{ licitacao.numero_edital }}</td>
            <td>{{ licitacao.titulo }}</td>
            <td>{{ licitacao.data_abertura }}</td>
            <td>{{ licitacao.status }}</td>
            <td>
              <router-link 
                :to="{ name: 'licitacao-detail', params: { id: licitacao.id } }"
                class="btn btn-sm btn-info"
              >
                Detalhes
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex'
  
  export default {
    name: 'LicitacoesList',
    computed: {
      ...mapState('licitacoes', ['licitacoes', 'loading'])
    },
    methods: {
      ...mapActions('licitacoes', ['fetchAll'])
    },
    created() {
      this.fetchAll()
    }
  }
  </script>