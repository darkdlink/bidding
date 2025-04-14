<template>
  <div class="dashboard">
    <!-- Cartões de resumo -->
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-3">
        <div class="summary-card">
          <div class="summary-icon">
            <i class="pi pi-briefcase"></i>
          </div>
          <div class="summary-content">
            <h3>Licitações</h3>
            <div class="summary-value">{{ summary.biddings }}</div>
            <div class="summary-label">Total de licitações</div>
          </div>
        </div>
      </div>
      
      <div class="col-12 md:col-6 lg:col-3">
        <div class="summary-card">
          <div class="summary-icon">
            <i class="pi pi-file"></i>
          </div>
          <div class="summary-content">
            <h3>Propostas</h3>
            <div class="summary-value">{{ summary.proposals }}</div>
            <div class="summary-label">Total de propostas</div>
          </div>
        </div>
      </div>
      
      <div class="col-12 md:col-6 lg:col-3">
        <div class="summary-card">
          <div class="summary-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="summary-content">
            <h3>Ganhas</h3>
            <div class="summary-value">{{ summary.wonProposals }}</div>
            <div class="summary-label">Propostas vencedoras</div>
          </div>
        </div>
      </div>
      
      <div class="col-12 md:col-6 lg:col-3">
        <div class="summary-card">
          <div class="summary-icon">
            <i class="pi pi-dollar"></i>
          </div>
          <div class="summary-content">
            <h3>Valor Total</h3>
            <div class="summary-value">{{ $filters.formatCurrency(summary.totalValue) }}</div>
            <div class="summary-label">Licitações ganhas</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Gráficos e tabelas -->
    <div class="grid mt-3">
      <!-- Licitações por Status -->
      <div class="col-12 lg:col-6">
        <Card class="h-full">
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <h3>Licitações por Status</h3>
              <Button icon="pi pi-refresh" class="p-button-text p-button-rounded" @click="refreshData" :disabled="loading" />
            </div>
          </template>
          <template #content>
            <div v-if="loading" class="chart-loading">
              <ProgressSpinner />
            </div>
            <div v-else class="chart-container">
              <Chart type="pie" :data="chartData.biddingsByStatus" :options="chartOptions.pie" />
            </div>
          </template>
        </Card>
      </div>
      
      <!-- Propostas por Status -->
      <div class="col-12 lg:col-6">
        <Card class="h-full">
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <h3>Propostas por Status</h3>
              <Button icon="pi pi-refresh" class="p-button-text p-button-rounded" @click="refreshData" :disabled="loading" />
            </div>
          </template>
          <template #content>
            <div v-if="loading" class="chart-loading">
              <ProgressSpinner />
            </div>
            <div v-else class="chart-container">
              <Chart type="bar" :data="chartData.proposalsByStatus" :options="chartOptions.bar" />
            </div>
          </template>
        </Card>
      </div>
      
      <!-- Próximos Prazos -->
      <div class="col-12 lg:col-6">
        <Card class="h-full">
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <h3>Próximos Prazos</h3>
              <Button icon="pi pi-refresh" class="p-button-text p-button-rounded" @click="refreshData" :disabled="loading" />
            </div>
          </template>
          <template #content>
            <div v-if="loading" class="chart-loading">
              <ProgressSpinner />
            </div>
            <div v-else class="upcoming-deadlines">
              <div v-if="upcomingDeadlines.length === 0" class="no-data">
                <p>Não há prazos próximos</p>
              </div>
              <div v-else class="deadline-list">
                <div v-for="(deadline, index) in upcomingDeadlines" :key="index" class="deadline-item">
                  <div class="deadline-info">
                    <div class="deadline-title">{{ deadline.title }}</div>
                    <div class="deadline-subtitle">{{ deadline.number }} - {{ deadline.agency }}</div>
                  </div>
                  <div class="deadline-date" :class="getDeadlineClass(deadline.days)">
                    <div class="days">{{ deadline.days }}</div>
                    <div class="label">{{ deadline.days === 1 ? 'dia' : 'dias' }}</div>
                  </div>
                </div>
              </div>
              <div class="deadline-footer">
                <router-link to="/biddings" class="view-all">Ver todas licitações</router-link>
              </div>
            </div>
          </template>
        </Card>
      </div>
      
      <!-- Atividades Recentes -->
      <div class="col-12 lg:col-6">
        <Card class="h-full">
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <h3>Atividades Recentes</h3>
              <Button icon="pi pi-refresh" class="p-button-text p-button-rounded" @click="refreshData" :disabled="loading" />
            </div>
          </template>
          <template #content>
            <div v-if="loading" class="chart-loading">
              <ProgressSpinner />
            </div>
            <div v-else class="recent-activities">
              <div v-if="recentActivities.length === 0" class="no-data">
                <p>Não há atividades recentes</p>
              </div>
              <div v-else class="activity-list">
                <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                  <div class="activity-icon" :class="getActivityIconClass(activity.action)">
                    <i class="pi" :class="getActivityIcon(activity.action)"></i>
                  </div>
                  <div class="activity-content">
                    <div class="activity-text">
                      <span class="user">{{ activity.user }}</span>
                      <span class="action">{{ getActivityText(activity) }}</span>
                    </div>
                    <div class="activity-time">{{ $filters.formatDateTime(activity.created_at) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';

export default {
  name: 'Dashboard',
  components: {
    ProgressSpinner
  },
  setup() {
    const store = useStore();
    const toast = useToast();
    
    // Estado
    const loading = ref(false);
    const summary = reactive({
      biddings: 0,
      proposals: 0,
      wonProposals: 0,
      totalValue: 0
    });
    
    const chartData = reactive({
      biddingsByStatus: {
        labels: [],
        datasets: []
      },
      proposalsByStatus: {
        labels: [],
        datasets: []
      }
    });
    
    const chartOptions = reactive({
      pie: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      },
      bar: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    const upcomingDeadlines = ref([]);
    const recentActivities = ref([]);
    
    // Métodos
    const fetchData = async () => {
      loading.value = true;
      
      try {
        // Carregar resumo
        const summaryResponse = await store.dispatch('dashboard/fetchSummary');
        Object.assign(summary, summaryResponse);
        
        // Carregar dados para gráficos
        const biddingsByStatusResponse = await store.dispatch('dashboard/fetchBiddingsByStatus');
        chartData.biddingsByStatus = {
          labels: biddingsByStatusResponse.map(item => item.status_label),
          datasets: [{
            data: biddingsByStatusResponse.map(item => item.count),
            backgroundColor: [
              '#2196F3', // Azul
              '#4CAF50', // Verde
              '#FFC107', // Amarelo
              '#F44336', // Vermelho
              '#9C27B0', // Roxo
              '#607D8B'  // Cinza azulado
            ]
          }]
        };
        
        const proposalsByStatusResponse = await store.dispatch('dashboard/fetchProposalsByStatus');
        chartData.proposalsByStatus = {
          labels: proposalsByStatusResponse.map(item => item.status_label),
          datasets: [{
            label: 'Propostas',
            data: proposalsByStatusResponse.map(item => item.count),
            backgroundColor: '#2196F3'
          }]
        };
        
        // Carregar próximos prazos
        const upcomingDeadlinesResponse = await store.dispatch('dashboard/fetchUpcomingDeadlines');
        upcomingDeadlines.value = upcomingDeadlinesResponse;
        
        // Carregar atividades recentes
        const recentActivitiesResponse = await store.dispatch('dashboard/fetchRecentActivity');
        recentActivities.value = recentActivitiesResponse;
        
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro ao carregar os dados do dashboard',
          life: 5000
        });
      } finally {
        loading.value = false;
      }
    };
    
    const refreshData = () => {
      fetchData();
    };
    
    // Helpers
    const getDeadlineClass = (days) => {
      if (days <= 1) return 'urgent';
      if (days <= 3) return 'warning';
      return 'normal';
    };
    
    const getActivityIcon = (action) => {
      const icons = {
        'create': 'pi-plus-circle',
        'update': 'pi-pencil',
        'delete': 'pi-trash',
        'view': 'pi-eye',
        'login': 'pi-sign-in',
        'logout': 'pi-sign-out',
        'register': 'pi-user-plus',
        'submit': 'pi-send',
        'upload': 'pi-upload',
        'download': 'pi-download',
        'scrape': 'pi-refresh'
      };
      
      return icons[action] || 'pi-circle';
    };
    
    const getActivityIconClass = (action) => {
      const classes = {
        'create': 'create',
        'update': 'update',
        'delete': 'delete',
        'view': 'view',
        'login': 'login',
        'logout': 'logout',
        'register': 'register',
        'submit': 'submit',
        'upload': 'upload',
        'download': 'download',
        'scrape': 'scrape'
      };
      
      return classes[action] || '';
    };
    
    const getActivityText = (activity) => {
      const actions = {
        'create': 'criou',
        'update': 'atualizou',
        'delete': 'excluiu',
        'view': 'visualizou',
        'login': 'fez login',
        'logout': 'fez logout',
        'register': 'se registrou',
        'submit': 'enviou',
        'upload': 'carregou',
        'download': 'baixou',
        'scrape': 'executou scraping'
      };
      
      const entities = {
        'bidding': 'licitação',
        'proposal': 'proposta',
        'company': 'empresa',
        'user': 'usuário',
        'document': 'documento',
        'bidding_source': 'fonte de licitação'
      };
      
      const action = actions[activity.action] || activity.action;
      const entity = entities[activity.entity_type] || activity.entity_type;
      
      return `${action} ${entity}`;
    };
    
    // Ciclo de vida
    onMounted(() => {
      fetchData();
    });
    
    return {
      loading,
      summary,
      chartData,
      chartOptions,
      upcomingDeadlines,
      recentActivities,
      refreshData,
      getDeadlineClass,
      getActivityIcon,
      getActivityIconClass,
      getActivityText
    };
  }
}
</script>

<style scoped>
.dashboard {
  width: 100%;
}

.summary-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.summary-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.summary-content {
  flex: 1;
}

.summary-content h3 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 500;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.chart-container {
  position: relative;
  height: 300px;
}

.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.upcoming-deadlines,
.recent-activities {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color);
  opacity: 0.6;
}

.deadline-list,
.activity-list {
  flex: 1;
  overflow-y: auto;
}

.deadline-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.deadline-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.deadline-subtitle {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.deadline-date {
  min-width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: #e0e0e0;
  color: var(--text-color);
}

.deadline-date.urgent {
  background-color: #ffebee;
  color: #f44336;
}

.deadline-date.warning {
  background-color: #fff8e1;
  color: #ffc107;
}

.deadline-date.normal {
  background-color: #e8f5e9;
  color: #4caf50;
}

.deadline-date .days {
  font-size: 1.25rem;
  font-weight: 600;
}

.deadline-date .label {
  font-size: 0.75rem;
}

.deadline-footer {
  padding-top: 12px;
  text-align: center;
}

.view-all {
  color: var(--primary-color);
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.activity-icon.create {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.activity-icon.update {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.activity-icon.delete {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.activity-icon.view {
  background-color: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

.activity-icon.login,
.activity-icon.logout {
  background-color: rgba(96, 125, 139, 0.1);
  color: #607d8b;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin-bottom: 4px;
}

.activity-text .user {
  font-weight: 500;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
}
</style>