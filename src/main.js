// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {
  Button,
  Container,
  Dialog,
  Divider,
  Footer,
  Main,
  MessageBox,
  Radio,
  Input
} from 'element-ui'
import 'flex.css'

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Container)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Divider)
Vue.use(Radio)
Vue.use(Input)

Vue.config.productionTip = false

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
