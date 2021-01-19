import Vue from 'vue';
import router from './router';
import App from './App';
import i18n from './i18n';
import '@babel/polyfill';
import '@/plugins/ant-design-vue';
import './styles.less';
import { i18nService } from './services/i18n';

Vue.config.productionTip = false;
i18nService.init(i18n);

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');
