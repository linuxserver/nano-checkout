import Vue from 'vue'
import App from './App.vue'
import Notifications from 'vue-notification'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.use(Notifications)
import vueCountryRegionSelect from 'vue-country-region-select'
Vue.use(vueCountryRegionSelect)
import vmodal from 'vue-js-modal'
Vue.use(vmodal)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
