// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {Avatar, Button, Container, Dialog, Footer, Main} from 'element-ui'

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Container)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Avatar)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
