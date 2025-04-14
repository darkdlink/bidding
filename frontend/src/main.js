import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import ProgressBar from 'primevue/progressbar';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Panel from 'primevue/panel';
import Divider from 'primevue/divider';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Menu from 'primevue/menu';
import Chart from 'primevue/chart';
import Badge from 'primevue/badge';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';

// CSS
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/styles/main.css';

// Configuração do Axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para adicionar token em todas as requisições
axios.interceptors.request.use(
  config => {
    const token = store.getters['auth/token'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      store.dispatch('auth/logout');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

// Criar aplicação
const app = createApp(App);

// Usar plugins
app.use(router);
app.use(store);
app.use(VueAxios, axios);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(ConfirmationService);

// Registrar componentes globais
app.component('Toast', Toast);
app.component('Button', Button);
app.component('InputText', InputText);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Calendar', Calendar);
app.component('Dropdown', Dropdown);
app.component('Dialog', Dialog);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('ProgressBar', ProgressBar);
app.component('Textarea', Textarea);
app.component('FileUpload', FileUpload);
app.component('Panel', Panel);
app.component('Divider', Divider);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Menu', Menu);
app.component('Chart', Chart);
app.component('Badge', Badge);
app.component('InputNumber', InputNumber);
app.component('MultiSelect', MultiSelect);

// Filtros globais
app.config.globalProperties.$filters = {
  formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('pt-BR');
  },
  formatDateTime(value) {
    if (!value) return '';
    return new Date(value).toLocaleString('pt-BR');
  },
  formatCurrency(value) {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  },
  truncate(text, length, suffix) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + (suffix || '...');
  }
};

// Montar aplicação
app.mount('#app');