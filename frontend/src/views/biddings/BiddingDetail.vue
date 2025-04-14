<template>
    <div class="bidding-detail">
      <!-- Cabeçalho -->
      <div class="detail-header">
        <div class="header-left">
          <Button icon="pi pi-arrow-left" class="p-button-text" @click="goBack" />
          <h2 v-if="bidding">{{ bidding.number }} - {{ bidding.title }}</h2>
          <Skeleton v-else width="300px" height="32px" />
        </div>
        
        <div class="header-actions" v-if="bidding">
          <Button icon="pi pi-pencil" label="Editar" class="p-button-outlined" @click="navigateToEdit" />
          <Button icon="pi pi-plus" label="Nova Proposta" class="p-button-primary" @click="createProposal" />
        </div>
      </div>
      
      <!-- Status e Timeline -->
      <div class="status-timeline" v-if="bidding">
        <div class="status-badge" :class="bidding.status">
          {{ getStatusLabel(bidding.status) }}
        </div>
        
        <Steps :model="statusSteps" :readonly="true" :activeIndex="statusIndex" />
      </div>
      
      <div v-if="loading" class="loading-container">
        <ProgressSpinner />
      </div>
      
      <div v-else-if="!bidding" class="error-container">
        <div class="error-message">
          <i class="pi pi-exclamation-circle"></i>
          <p>Não foi possível carregar os dados da licitação.</p>
          <Button label="Tentar Novamente" @click="fetchBidding" />
        </div>
      </div>
      
      <div v-else class="detail-content">
        <!-- Tabs -->
        <TabView>
          <!-- Informações Gerais -->
          <TabPanel header="Informações Gerais">
            <div class="grid">
              <div class="col-12 md:col-6">
                <Card>
                  <template #title>Dados Básicos</template>
                  <template #content>
                    <div class="info-group">
                      <div class="info-row">
                        <div class="info-label">Número:</div>
                        <div class="info-value">{{ bidding.number }}</div>
                      </div>
                      
                      <div class="info-row">
                        <div class="info-label">Título:</div>
                        <div class="info-value">{{ bidding.title }}</div>
                      </div>
                      
                      <div class="info-row">
                        <div class="info-label">Órgão:</div>
                        <div class="info-value">{{ bidding.agency?.name }}</div>
                      </div>
                      
                      <div class="info-row">
                        <div class="info-label">Modalidade:</div>
                        <div class="info-value">{{ getModalityLabel(bidding.modality) }}</div>
                      </div>
                      
                      <div class="info-row">
                        <div class="info-label">Status:</div>
                        <div class="info-value">{{ getStatusLabel(bidding.status) }}</div>
                      </div>
                      
                      <div class="info-row">
                        <div class="info-label">Valor Estimado:</div>
                        <div class="info-value">{{ $filters.formatCurrency(bidding.estimated_value) }}</div>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
              
              <div class="col-12 md:col-6">
                <Card>
                  <template #title>Prazos</template>
                  <template #content>
                    <div class="info-group">
                      <div class="info-row">
                        <div class="info-label">Data de Publicação:</div>
                        <div class="info-value">{{ $filters.formatDate(bidding.publication_date) }}</div>
                      </div>
                      
                      <div class="info-row">
                        <div class="info-label">Data de Abertura:</div>
                        <div class="info-value">{{ $filters.formatDateTime(bidding.opening_date) }}</div>
                      </div>
                      
                      <div class="info-row">
                        <div class="info-label">Data de Encerramento:</div>
                        <div class="info-value">{{ $filters.formatDateTime(bidding.closing_date) || 'Não definida' }}</div>
                      </div>
                      
                      <div v-if="bidding.opening_date" class="deadline-info">
                        <div class="deadline-label">Prazo:</div>
                        <div class="deadline-countdown" :class="getDeadlineClass(daysUntilOpening)">
                          {{ daysUntilOpening }} {{ daysUntilOpening === 1 ? 'dia' : 'dias' }}
                        </div>
                      </div>
                    </div>
                  </template>
                </Card>
                
                <Card class="mt-3">
                  <template #title>Tags</template>
                  <template #content>
                    <div class="tags-container">
                      <div v-if="bidding.tags && bidding.tags.length > 0" class="tags">
                        <div v-for="tag in bidding.tags" :key="tag.id" class="tag">{{ tag.name }}</div>
                      </div>
                      <div v-else class="no-tags">Nenhuma tag definida</div>
                    </div>
                  </template>
                </Card>
              </div>
              
              <div class="col-12">
                <Card>
                  <template #title>Descrição</template>
                  <template #content>
                    <div class="description">
                      <p v-if="bidding.description">{{ bidding.description }}</p>
                      <p v-else class="no-data">Sem descrição</p>
                    </div>
                  </template>
                </Card>
              </div>
            </div>
          </TabPanel>
          
          <!-- Itens -->
          <TabPanel header="Itens">
            <Card>
              <template #content>
                <DataTable :value="bidding.items" responsiveLayout="scroll" class="p-datatable-sm" v-if="bidding.items && bidding.items.length > 0">
                  <Column field="code" header="Código"></Column>
                  <Column field="description" header="Descrição"></Column>
                  <Column field="quantity" header="Quantidade">
                    <template #body="{ data }">
                      {{ data.quantity }} {{ data.unit }}
                    </template>
                  </Column>
                  <Column field="estimated_unit_value" header="Valor Unitário Estimado">
                    <template #body="{ data }">
                      {{ $filters.formatCurrency(data.estimated_unit_value) }}
                    </template>
                  </Column>
                  <Column header="Valor Total Estimado">
                    <template #body="{ data }">
                      {{ $filters.formatCurrency(data.quantity * data.estimated_unit_value) }}
                    </template>
                  </Column>
                </DataTable>
                
                <div v-else class="no-data">
                  <p>Nenhum item cadastrado para esta licitação</p>
                </div>
              </template>
            </Card>
          </TabPanel>
          
          <!-- Documentos -->
          <TabPanel header="Documentos">
            <Card>
              <template #title>
                <div class="flex align-items-center justify-content-between">
                  <span>Documentos</span>
                  <Button 
                    icon="pi pi-upload" 
                    label="Carregar Documento" 
                    class="p-button-sm" 
                    @click="showUploadDialog = true"
                  />
                </div>
              </template>
              <template #content>
                <DataTable :value="documents" responsiveLayout="scroll" class="p-datatable-sm" v-if="documents && documents.length > 0">
                  <Column field="name" header="Nome"></Column>
                  <Column field="type" header="Tipo">
                    <template #body="{ data }">
                      {{ getDocumentTypeLabel(data.type) }}
                    </template>
                  </Column>
                  <Column field="created_at" header="Data de Upload">
                    <template #body="{ data }">
                      {{ $filters.formatDateTime(data.created_at) }}
                    </template>
                  </Column>
                  <Column header="Ações" styleClass="action-column">
                    <template #body="{ data }">
                      <Button icon="pi pi-download" class="p-button-rounded p-button-text p-button-sm" @click="downloadDocument(data.id)" tooltip="Download" tooltipOptions="{ position: 'top' }" />
                      <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm p-button-danger" @click="confirmDeleteDocument(data)" tooltip="Excluir" tooltipOptions="{ position: 'top' }" />
                    </template>
                  </Column>
                </DataTable>
                
                <div v-else class="no-data">
                  <p>Nenhum documento anexado a esta licitação</p>
                </div>
              </template>
            </Card>
          </TabPanel>
          
          <!-- Propostas -->
          <TabPanel header="Propostas">
            <Card>
              <template #title>
                <div class="flex align-items-center justify-content-between">
                  <span>Propostas</span>
                  <Button 
                    icon="pi pi-plus" 
                    label="Nova Proposta" 
                    class="p-button-sm" 
                    @click="createProposal"
                  />
                </div>
              </template>
              <template #content>
                <DataTable :value="bidding.proposals" responsiveLayout="scroll" class="p-datatable-sm" v-if="bidding.proposals && bidding.proposals.length > 0">
                  <Column field="company.name" header="Empresa"></Column>
                  <Column field="total_value" header="Valor Total">
                    <template #body="{ data }">
                      {{ $filters.formatCurrency(data.total_value) }}
                    </template>
                  </Column>
                  <Column field="profit_margin" header="Margem de Lucro">
                    <template #body="{ data }">
                      {{ data.profit_margin ? data.profit_margin + '%' : '-' }}
                    </template>
                  </Column>
                  <Column field="status" header="Status">
                    <template #body="{ data }">
                      <span class="status-badge" :class="'proposal-' + data.status">{{ getProposalStatusLabel(data.status) }}</span>
                    </template>
                  </Column>
                  <Column field="submission_date" header="Data de Envio">
                    <template #body="{ data }">
                      {{ data.submission_date ? $filters.formatDateTime(data.submission_date) : 'Não enviada' }}
                    </template>
                  </Column>
                  <Column header="Ações" styleClass="action-column">
                    <template #body="{ data }">
                      <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm" @click="viewProposal(data.id)" tooltip="Visualizar" tooltipOptions="{ position: 'top' }" />
                      <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" @click="editProposal(data.id)" tooltip="Editar" tooltipOptions="{ position: 'top' }" />
                      <Button icon="pi pi-file-pdf" class="p-button-rounded p-button-text p-button-sm" @click="generateProposalPdf(data.id)" tooltip="Gerar PDF" tooltipOptions="{ position: 'top' }" />
                    </template>
                  </Column>
                </DataTable>
                
                <div v-else class="no-data">
                  <p>Nenhuma proposta cadastrada para esta licitação</p>
                </div>
              </template>
            </Card>
          </TabPanel>
        </TabView>
      </div>
      
      <!-- Diálogo de Upload de Documento -->
      <Dialog v-model:visible="showUploadDialog" header="Carregar Documento" :style="{ width: '450px' }">
        <div class="upload-form">
          <div class="field">
            <label for="document_name">Nome do Documento</label>
            <InputText id="document_name" v-model="documentUpload.name" class="w-full" />
          </div>
          
          <div class="field">
            <label for="document_type">Tipo do Documento</label>
            <Dropdown id="document_type" v-model="documentUpload.type" :options="documentTypeOptions" optionLabel="label" optionValue="value" class="w-full" />
          </div>
          
          <div class="field">
            <label for="document_file">Arquivo</label>
            <FileUpload
              mode="basic"
              :customUpload="true"
              @uploader="onDocumentSelect"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*"
              :auto="true"
              chooseLabel="Selecionar Arquivo"
              class="w-full"
            />
          </div>
          
          <div class="upload-actions">
            <Button label="Cancelar" @click="showUploadDialog = false" class="p-button-text" />
            <Button label="Enviar" @click="uploadDocument" :disabled="!documentUpload.file || !documentUpload.name || !documentUpload.type" class="p-button-primary" :loading="uploading" />
          </div>
        </div>
      </Dialog>
      
      <!-- Diálogo de confirmação -->
      <ConfirmDialog></ConfirmDialog>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import { useConfirm } from 'primevue/useconfirm';
  import { useToast } from 'primevue/usetoast';
  import Steps from 'primevue/steps';
  import ProgressSpinner from 'primevue/progressspinner';
  import Skeleton from 'primevue/skeleton';
  
  export default {
    name: 'BiddingDetail',
    components: {
      Steps,
      ProgressSpinner,
      Skeleton
    },
    props: {
      id: {
        type: [String, Number],
        required: true
      }
    },
    setup(props) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      const confirm = useConfirm();
      const toast = useToast();
      
      // Estado
      const loading = ref(true);
      const bidding = computed(() => store.getters['bidding/currentBidding']);
      const documents = ref([]);
      const showUploadDialog = ref(false);
      const uploading = ref(false);
      
      // Upload de documento
      const documentUpload = reactive({
        name: '',
        type: 'edital',
        file: null
      });
      
      // Opções para dropdown de tipo de documento
      const documentTypeOptions = [
        { label: 'Edital', value: 'edital' },
        { label: 'Anexo', value: 'anexo' },
        { label: 'Proposta', value: 'proposta' },
        { label: 'Contrato', value: 'contrato' },
        { label: 'Outros', value: 'outros' }
      ];
      
      // Steps para timeline de status
      const statusSteps = [
        { label: 'Rascunho', icon: 'pi pi-pencil' },
        { label: 'Publicada', icon: 'pi pi-check' },
        { label: 'Em Andamento', icon: 'pi pi-cog' },
        { label: 'Concluída', icon: 'pi pi-flag-fill' }
      ];
      
      // Índice do status atual na timeline
      const statusIndex = computed(() => {
        if (!bidding.value) return 0;
        
        const statusMap = {
          'draft': 0,
          'published': 1,
          'in_progress': 2,
          'completed': 3,
          'canceled': -1,
          'suspended': -1
        };
        
        return statusMap[bidding.value.status] || 0;
      });
      
      // Calcular dias até a abertura
      const daysUntilOpening = computed(() => {
        if (!bidding.value || !bidding.value.opening_date) return null;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const openingDate = new Date(bidding.value.opening_date);
        openingDate.setHours(0, 0, 0, 0);
        
        const diffTime = openingDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
      });
      
      // Métodos
      const fetchBidding = async () => {
        loading.value = true;
        
        try {
          await store.dispatch('bidding/fetchBidding', props.id);
          fetchDocuments();
        } catch (error) {
          console.error('Erro ao carregar licitação:', error);
          
          toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Ocorreu um erro ao carregar os dados da licitação',
            life: 5000
          });
        } finally {
          loading.value = false;
        }
      };
      
      const fetchDocuments = async () => {
        try {
          const response = await store.dispatch('bidding/fetchDocuments', props.id);
          documents.value = response;
        } catch (error) {
          console.error('Erro ao carregar documentos:', error);
          
          toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Ocorreu um erro ao carregar os documentos',
            life: 5000
          });
        }
      };
      
      const goBack = () => {
        router.push('/biddings');
      };
      
      const navigateToEdit = () => {
        router.push(`/biddings/${props.id}/edit`);
      };
      
      const createProposal = () => {
        router.push({
          path: '/proposals/create',
          query: { bidding_id: props.id }
        });
      };
      
      const viewProposal = (proposalId) => {
        router.push(`/proposals/${proposalId}`);
      };
      
      const editProposal = (proposalId) => {
        router.push(`/proposals/${proposalId}/edit`);
      };
      
      const generateProposalPdf = async (proposalId) => {
        try {
          // Abrir em nova aba
          window.open(`${process.env.VUE_APP_API_URL}/proposals/${proposalId}/pdf`, '_blank');
        } catch (error) {
          console.error('Erro ao gerar PDF:', error);
          
          toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Ocorreu um erro ao gerar o PDF da proposta',
            life: 5000
          });
        }
      };
      
      const onDocumentSelect = (event) => {
        documentUpload.file = event.files[0];
      };
      
      const uploadDocument = async () => {
        if (!documentUpload.file || !documentUpload.name || !documentUpload.type) {
          return;
        }
        
        uploading.value = true;
        
        try {
          await store.dispatch('bidding/uploadDocument', {
            id: props.id,
            document: documentUpload.file,
            name: documentUpload.name,
            type: documentUpload.type
          });
          
          toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Documento carregado com sucesso!',
            life: 3000
          });
          
          // Limpar formulário e fechar modal
          documentUpload.name = '';
          documentUpload.type = 'edital';
          documentUpload.file = null;
          showUploadDialog.value = false;
          
          // Recarregar documentos
          fetchDocuments();
        } catch (error) {
          console.error('Erro ao fazer upload do documento:', error);
          
          toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Ocorreu um erro ao carregar o documento',
            life: 5000
          });
        } finally {
          uploading.value = false;
        }
      };
      
      const downloadDocument = (documentId) => {
        window.open(`${process.env.VUE_APP_API_URL}/documents/${documentId}/download`, '_blank');
      };
      
      const confirmDeleteDocument = (document) => {
        confirm.require({
          message: `Tem certeza que deseja excluir o documento "${document.name}"?`,
          header: 'Confirmar Exclusão',
          icon: 'pi pi-exclamation-triangle',
          acceptClass: 'p-button-danger',
          accept: async () => {
            try {
              // Aqui você chamaria a API para excluir o documento
              // await axios.delete(`/documents/${document.id}`);
              
              toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Documento excluído com sucesso!',
                life: 3000
              });
              
              // Recarregar documentos
              fetchDocuments();
            } catch (error) {
              console.error('Erro ao excluir documento:', error);
              
              toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Ocorreu um erro ao excluir o documento',
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
      
      const getProposalStatusLabel = (status) => {
        const statusMap = {
          'draft': 'Rascunho',
          'submitted': 'Enviada',
          'approved': 'Aprovada',
          'rejected': 'Rejeitada',
          'won': 'Ganha',
          'lost': 'Perdida'
        };
        
        return statusMap[status] || status;
      };
      
      const getDocumentTypeLabel = (type) => {
        const typeMap = {
          'edital': 'Edital',
          'anexo': 'Anexo',
          'proposta': 'Proposta',
          'contrato': 'Contrato',
          'outros': 'Outros'
        };
        
        return typeMap[type] || type;
      };
      
      const getDeadlineClass = (days) => {
        if (days < 0) return 'past';
        if (days <= 1) return 'urgent';
        if (days <= 3) return 'warning';
        return 'normal';
      };
      
      // Ciclo de vida
      onMounted(() => {
        fetchBidding();
      });
      
      return {
        loading,
        bidding,
        documents,
        statusSteps,
        statusIndex,
        daysUntilOpening,
        documentUpload,
        documentTypeOptions,
        showUploadDialog,
        uploading,
        fetchBidding,
        goBack,
        navigateToEdit,
        createProposal,
        viewProposal,
        editProposal,
        generateProposalPdf,
        onDocumentSelect,
        uploadDocument,
        downloadDocument,
        confirmDeleteDocument,
        getStatusLabel,
        getModalityLabel,
        getProposalStatusLabel,
        getDocumentTypeLabel,
        getDeadlineClass
      };
    }
  }
  </script>
  
  <style scoped>
  .bidding-detail {
    width: 100%;
  }
  
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .header-left h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .header-actions {
    display: flex;
    gap: 8px;
  }
  
  .status-timeline {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .status-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 4px;
    font-weight: 500;
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
  
  .status-badge.proposal-draft {
    background-color: #e0e0e0;
    color: #424242;
  }
  
  .status-badge.proposal-submitted {
    background-color: #bbdefb;
    color: #0d47a1;
  }
  
  .status-badge.proposal-approved {
    background-color: #dcedc8;
    color: #33691e;
  }
  
  .status-badge.proposal-rejected {
    background-color: #ffccbc;
    color: #bf360c;
  }
  
  .status-badge.proposal-won {
    background-color: #c8e6c9;
    color: #2e7d32;
  }
  
  .status-badge.proposal-lost {
    background-color: #ffcdd2;
    color: #c62828;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
  }
  
  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
  }
  
  .error-message {
    text-align: center;
  }
  
  .error-message i {
    font-size: 3rem;
    color: #f44336;
    margin-bottom: 16px;
  }
  
  .detail-content {
    margin-bottom: 24px;
  }
  
  .info-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .info-row {
    display: flex;
    gap: 8px;
  }
  
  .info-label {
    font-weight: 500;
    min-width: 150px;
  }
  
  .deadline-info {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
    padding: 8px;
    border-radius: 4px;
    background-color: #f5f5f5;
  }
  
  .deadline-label {
    font-weight: 500;
  }
  
  .deadline-countdown {
    font-weight: 600;
  }
  
  .deadline-countdown.past {
    color: #9e9e9e;
  }
  
  .deadline-countdown.urgent {
    color: #f44336;
  }
  
  .deadline-countdown.warning {
    color: #fbc02d;
  }
  
  .deadline-countdown.normal {
    color: #4caf50;
  }
  
  .tags-container {
    min-height: 50px;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .tag {
    padding: 4px 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
  }
  
  .description {
    min-height: 100px;
  }
  
  .no-data, .no-tags {
    color: #9e9e9e;
    font-style: italic;
  }
  
  .upload-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .upload-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  }
  
  @media (max-width: 768px) {
    .detail-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .header-actions {
      align-self: flex-end;
    }
  }
  </style>