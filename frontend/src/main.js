import { createApp } from 'vue';
import App from './App.vue';
import router from './core/router';
import { store } from './core/store';
import './styles/index.css';

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');