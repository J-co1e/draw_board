import Vue from 'vue'
import App from './App.vue'
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.prototype.$message = Message
new Vue({
  render: h => h(App),
}).$mount('#app')
