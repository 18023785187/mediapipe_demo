import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Viewer from '@/components/viewer'
import './plugins/console'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Viewer);
Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.prototype.$MEDIAPIPE_MODEL_RESOURCE = process.env.NODE_ENV === 'development' ?
  '/@mediapipe' : 'https://cdn.jsdelivr.net/npm/@mediapipe'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

console.image('https://cdn.nfa.qq.com/gmaster_prod/16879104/gmaster/3riwosyxk6o0/yuan2.png')
console.image('https://img.bosszhipin.com/beijin/upload/avatar/20230628/607f1f3d68754fd0a797ee87c86e0555a5e23d22e4d1a5519fa9e4de5f683d8a28a90754fd577d7d_s.png', 200, 200)
