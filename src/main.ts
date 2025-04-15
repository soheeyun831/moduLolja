import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

// normalice.css 추가
import 'normalize.css';

// 전역 scss
require('./assets/scss/index.scss');

// pinia 상태 관리
const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');
