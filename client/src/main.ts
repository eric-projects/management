import Vue from 'vue';
import router from './router';
import App from './App';
import i18n from './i18n';
import '@babel/polyfill';
import '@/plugins/ant-design-vue';
import './styles.less';
import { i18nService } from './services/i18n';
// import { Editor } from 'tinymce';

Vue.config.productionTip = false;
i18nService.init(i18n);
// Vue.use(Editor);
new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app');
