<template>
    <div class="bidding-list">
      <!-- Filtros e cabeçalho -->
      <div class="filters-header">
        <div class="filter-controls">
          <div class="search-box">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters.search" placeholder="Buscar licitações..." @keyup.enter="applyFilters" />
            </span>
          </div>
          
          <div class="filter-buttons">
            <Button icon="pi pi-filter" label="Filtros" @click="showFiltersDialog = true" class="p-button-outlined" />
            <Button icon="pi pi-refresh" @click="resetFilters" class="p-button-outlined" :disabled="loading" />
          </div>
        </div>
        
        <div class="action-buttons">
          <Button icon="pi pi-plus" label="Nova Licitação" @click="navigateToCreate" class="p-button-primary" />
        </div>
      </div>
      
      <!-- Chips de filtros ativos -->
      <div v-if="hasActiveFilters" class="active-filters">
        <div class="filter-chips">
          <div v-if="filters.status" class="filter-chip">
            Status: {{ getStatusLabel(filters.status) }}
            <i class="pi pi-times" @click="removeFilter('status')" />
          </div>
          
          <div v-if="filters.modality" class="filter-chip">
            Modalidade: {{ getModalityLabel(filters.modality) }}
            <i class="pi pi-times" @click="removeFilter('modality')" />
          </div>
          
          <div v-if="filters.date_from" class="filter-chip">
            Data de: {{ $filters.formatDate(filters.date_from) }}
            <i class="pi pi-times" @click="removeFilter('date_from')" />
          </div>
          
          <div v-if="filters.date_to" class="filter-chip">
            Data até: {{ $filters.formatDate(filters.date_to) }}
            <i class="pi pi-times" @click="removeFilter('date_to')" />
          </div>
        </div>
        
        <Button label="Limpar Filtros" class="p-button-text" @click="resetFilters" />
      </div>
      
      <!-- Tabela de licitações -->
      <div class="data-table-container">
        <DataTable
          :value="biddings"
          :loading="loading"
          stripedRows
          responsiveLayout="scroll"
          :paginator="true"
          :rows="pagination.perPage"
          :totalRecords="pagination.total"
          :rowsPerPageOptions="[10, 15, 25, 50]"
          v-model:first="firstRecord"
          class="p-datatable-sm"
          :sortField="sortField"
          :sortOrder="sortOrder"
          @sort="onSort"
          @page="onPage"
          emptyMessage="Nenhuma licitação encontrada"
        >
          <Column field="number" header="Número" :sortable="true">
            <template #body="{ data }">
              <router-link :to="`/biddings/${data.id}`" class="bidding-link">{{ data.number }}</router-link>
            </template>
          </Column>
          
          <Column field="title" header="Título" :sortable="true">
            <template #body="{ data }">
              <div class="title-cell">
                <span class="title">{{ data.title }}</span>
                <div class="tags" v-if="data.tags && data.tags.length">
                  <span v-for="tag in data.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
                </div>
              </div>
            </template>
          </Column>
          
          <Column field="agency.name" header="Órgão" :sortable="true">
            <template #body="{ data }">
              {{ data.agency?.name || '' }}
            </template>
          </Column>
          
          <Column field="modality" header="Modalidade" :sortable="true">
            <template #body="{ data }">
              {{ getModalityLabel(data.modality) }}
            </template>
          </Column>
          
          <Column field="opening_date" header="Abertura" :sortable="true">
            <template #body="{ data }">
              {{ $filters.formatDateTime(data.opening_date) }}
            </template>
          </Column>
          
          <Column field="estimated_value" header="Valor Estimado" :sortable="true">
            <template #body="{ data }">
              {{ $filters.formatCurrency(data.estimated_value) }}
            </template>
          </Column>
          
          <Column field="status" header="Status" :sortable="true">
            <template #body="{ data }">
              <span class="status-badge" :class="data.status">{{ getStatusLabel(data.status) }}</span>
            </template>
          </Column>
          
          <Column header="Ações" styleClass="action-column">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm" @click="navigateToDetail(data.id)" tooltip="Visualizar" tooltipOptions="{ position: 'top' }" />
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" @click="navigateToEdit(data.id)" tooltip="Editar" tooltipOptions="{ position: 'top' }" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm p-button-danger" @click="confirmDelete(data)" tooltip="Excluir" tooltipOptions="{ position: 'top' }" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
      
      <!-- Modal de filtros -->
      <Dialog v-model:visible="showFiltersDialog" header="Filtros" :style="{ width: '450px' }">
        <div class="filter-form">
          <div class="field">
            <label for="status">Status</label>
            <Dropdown id="status" v-model="filtersTemp.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Selecione um status" class="w-full" />
          </div>
          
          <div class="field">
            <label for="modality">Modalidade</label>
            <Dropdown id="modality" v-model="filtersTemp.modality" :options="modalityOptions" optionLabel="label" optionValue="value" placeholder="Selecione uma modalidade" class="w-full" />
          </div>
          
          <div class="field">
            <label for="date_from">Data de Abertura (De)</label>
            <Calendar id="date_from" v-model="filtersTemp.date_from" dateFormat="dd/mm/yy" class="w-full" />
          </div>
          
          <div class="field">
            <label for="date_to">Data de Abertura (Até)</label>
            <Calendar id="date_to" v-model="filtersTemp.date_to" dateFormat="dd/mm/yy" class="w-full" />
          </div>
          
          <div class="filter-actions">
            <Button label="Limpar" @click="resetTempFilters" class="p-button-text" />
            <Button label="Aplicar" @click="applyFiltersDialog" class="p-button-primary" />
          </div>
        </div>
      </Dialog>
      
      <!-- Diálogo de confirmação de exclusão -->
      <ConfirmDialog></ConfirmDialog>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, watch, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { useConfirm } from 'primevue/useconfirm';
  import { useToast } from 'primevue/usetoast';
  
  export default {
    name: 'BiddingList',
    setup() {
      const store = useStore();
      const router = useRouter();
      const confirm = useConfirm();
      const toast = useToast();
      
      // Estado
      const loading = ref(false);
      const showFiltersDialog = ref(false);
      const biddings = computed(() => store.getters['bidding/biddings']);
      const pagination = computed(() => store.getters['bidding/pagination']);
      const firstRecord = ref(0);
      const sortField = ref('created_at');
      const sortOrder = ref(-1);
      
      // Filtros
      const filters = reactive({
        search: '',
        status: null,
        modality: null,
        date_from: null,
        date_to: null,
      });
      
      // Filtros temporários (para o diálogo)
      const filtersTemp = reactive({ ...filters });
      
      // Opções para dropdowns
      const statusOptions = [
        { label: 'Todos', value: null },
        { label: 'Rascunho', value: 'draft' },
        { label: 'Publicada', value: 'published' },
        { label: 'Em Andamento', value: 'in_progress' },
        { label: 'Concluída', value: 'completed' },
        { label: 'Cancelada', value: 'canceled' },
        { label: 'Suspensa', value: 'suspended' }
      ];
      
      const modalityOptions = [
        { label: 'Todas', value: null },
        { label: 'Pregão Eletrônico', value: 'pregao_eletronico' },
        { label: 'Concorrência', value: 'concorrencia' },
        { label: 'Tomada de Preço', value: 'tomada_preco' },
        { label: 'Convite', value: 'convite' },
        { label: 'Leilão', value: 'leilao' },
        { label: 'Concurso', value: 'concurso' },
        { label: 'Outros', value: 'outros' }
      ];
      
      // Verificar se há filtros ativos
      const hasActiveFilters = computed(() => {
        return filters.status !== null ||
          filters.modality !== null ||
          filters.date_from !== null ||
          filters.date_to !== null ||
          filters.search !== '';
      });
      
      // Métodos
      const fetchBiddings = async (page = 1) => {
        try {
          await store.dispatch('bidding/fetchBiddings', page);
        } catch (error) {
          console.error('Erro ao buscar licitações:', error);
          
          toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Ocorreu um erro ao carregar as licitações',
            life: 5000
          });
        }
      };
      
      const applyFilters = async () => {
        firstRecord.value = 0;
        await store.dispatch('bidding/setFiltersAndFetch', filters);
      };
      
      const resetFilters = async () => {
        Object.keys(filters).forEach(key => {
          filters[key] = null;
        });
        filters.search = '';
        
        firstRecord.value = 0;
        await store.dispatch('bidding/resetFiltersAndFetch');
      };
      
      const applyFiltersDialog = () => {
        // Copiar filtros temporários para os filtros reais
        Object.assign(filters, filtersTemp);
        
        // Aplicar filtros
        applyFilters();
        
        // Fechar diálogo
        showFiltersDialog.value = false;
      };
      
      const resetTempFilters = () => {
        Object.keys(filtersTemp).forEach(key => {
          filtersTemp[key] = null;
        });
      };
      
      const removeFilter = (filterName) => {
        filters[filterName] = null;
        applyFilters();
      };
      
      const onPage = (event) => {
        firstRecord.value = event.first;
        const page = event.page + 1;
        fetchBiddings(page);
      };
      
      const onSort = (event) => {
        sortField.value = event.sortField;
        sortOrder.value = event.sortOrder;
        
        // Atualizar filtros de ordenação
        store.commit('bidding/SET_FILTERS', {
          sort_field: event.sortField,
          sort_direction: event.sortOrder
        });
        
        // Buscar dados ordenados
        fetchBiddings(1);
      };
      
      const navigateToDetail = (id) => {
        router.push(`/biddings/${id}`);
      };
      
      const navigateToEdit = (id) => {
        router.push(`/biddings/${id}/edit`);
      };
      
      const navigateToCreate = () => {
        router.push('/biddings/create');
      };
      
      const confirmDelete = (bidding) => {
        confirm.require({
          message: `Tem certeza que deseja excluir a licitação "${bidding.number} - ${bidding.title}"?`,
          header: 'Confirmar Exclusão',
          icon: 'pi pi-exclamation-triangle',
          acceptClass: 'p-button-danger',
          accept: async () => {
            try {
              await store.dispatch('bidding/deleteBidding', bidding.id);
              
              toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Licitação excluída com sucesso!',
                life: 3000
              });
              
              // Recarregar dados
              fetchBiddings();
            } catch (error) {
              console.error('Erro ao excluir licitação:', error);
              
              const errorMessage = error.response?.data?.error || 'Ocorreu um erro ao excluir a licitação';
              
              toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: errorMessage,
                life: 5000
              });
            }
          }
        });
      };
      
      // Helpers
      const getStatusLabel = (status) => {
        const statusMap = {
          'draft': 'Rascunho',
          'published': 'Publicada',
          'in_progress': 'Em Andamento',
          'completed': 'Concluída',
          'canceled': 'Cancelada',
          'suspended': 'Suspensa'
        };
        
        return statusMap[status] || status;
      };
      
      const getModalityLabel = (modality) => {
        const modalityMap = {
          'pregao_eletronico': 'Pregão Eletrônico',
          'concorrencia': 'Concorrência',
          'tomada_preco': 'Tomada de Preço',
          'convite': 'Convite',
          'leilao': 'Leilão',
          'concurso': 'Concurso',
          'outros': 'Outros'
        };
        
        return modalityMap[modality] || modality;
      };
      
      // Quando os filtros temporários do diálogo são abertos, sincronizar com os filtros atuais
      watch(showFiltersDialog, (newVal) => {
        if (newVal) {
          // Copiar filtros atuais para os temporários
          Object.assign(filtersTemp, filters);
        }
      });
      
      // Ciclo de vida
      onMounted(() => {
        // Definir loading
        loading.value = true;
        
        // Buscar licitações iniciais
        fetchBiddings().finally(() => {
          loading.value = false;
        });
      });
      
      return {
        loading,
        biddings,
        pagination,
        firstRecord,
        sortField,
        sortOrder,
        filters,
        filtersTemp,
        showFiltersDialog,
        statusOptions,
        modalityOptions,
        hasActiveFilters,
        fetchBiddings,
        applyFilters,
        resetFilters,
        applyFiltersDialog,
        resetTempFilters,
        removeFilter,
        onPage,
        onSort,
        navigateToDetail,
        navigateToEdit,
        navigateToCreate,
        confirmDelete,
        getStatusLabel,
        getModalityLabel
      };
    }
  }
  </script>
  
  <style scoped>
  .bidding-list {
    width: 100%;
  }
  
  .filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .filter-controls {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .search-box {
    width: 300px;
  }
  
  .filter-buttons {
    display: flex;
    gap: 8px;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .active-filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 8px 16px;
    background-color: #f8f9fa;
    border-radius: 4px;
  }
  
  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .filter-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    background-color: #e0e0e0;
    border-radius: 16px;
    font-size: 0.875rem;
  }
  
  .filter-chip i {
    cursor: pointer;
  }
  
  .filter-chip i:hover {
    color: #f44336;
  }
  
  .data-table-container {
    margin-bottom: 24px;
  }
  
  .bidding-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
  }
  
  .bidding-link:hover {
    text-decoration: underline;
  }
  
  .title-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .title {
    font-weight: 500;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .tag {
    padding: 2px 6px;
    background-color: #e0e0e0;
    border-radius: 4px;
    font-size: 0.75rem;
    color: var(--text-color);
  }
  
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  
  .status-badge.draft {
    background-color: #e0e0e0;
    color: #424242;
  }
  
  .status-badge.published {
    background-color: #bbdefb;
    color: #0d47a1;
  }
  
  .status-badge.in_progress {
    background-color: #fff9c4;
    color: #fbc02d;
  }
  
  .status-badge.completed {
    background-color: #c8e6c9;
    color: #2e7d32;
  }
  
  .status-badge.canceled {
    background-color: #ffcdd2;
    color: #c62828;
  }
  
  .status-badge.suspended {
    background-color: #e1bee7;
    color: #6a1b9a;
  }
  
  .action-column {
    width: 120px;
  }
  
  .filter-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  }
  
  @media (max-width: 768px) {
    .filters-header {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
    
    .filter-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
    }
    
    .search-box {
      width: 100%;
    }
    
    .action-buttons {
      justify-content: flex-end;
    }
  }
  </style>