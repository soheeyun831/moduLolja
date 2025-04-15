import { createApp } from 'vue'
import App from './App.vue'
// normalice.css 추가
import "normalize.css";

// 전역 scss
require("./assets/scss/index.scss");

createApp(App).mount('#app')
