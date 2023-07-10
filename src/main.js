import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Viewer from '@/components/viewer'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Viewer);
Vue.use(ElementUI);

Vue.config.productionTip = false

// Vue.prototype.$MEDIAPIPE_MODEL_RESOURCE = process.env.NODE_ENV === 'development' ?
//   '/@mediapipe' : 'https://cdn.jsdelivr.net/npm/@mediapipe'
Vue.prototype.$MEDIAPIPE_MODEL_RESOURCE='https://cdn.jsdelivr.net/npm/@mediapipe'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
