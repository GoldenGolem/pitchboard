// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'
import Vuetify from 'vuetify'
import axios from 'axios'
import VeeValidate from 'vee-validate'
import Vue2Filters from 'vue2-filters'
import ToggleButton from 'vue-js-toggle-button'
import moment from 'vue-moment'
import numeral from 'numeral'
import VueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import io from 'socket.io-client'
import Echo from 'laravel-echo'
import VueEcho from 'vue-echo'
import VueChatScroll from 'vue-chat-scroll'
import VueTransmit from 'vue-transmit'
import VTooltip from 'v-tooltip'
import Croppa from 'vue-croppa'
import VueIntercom from 'vue-intercom'
// import VueQuillEditor from 'vue-quill-editor'
import * as config from './../config/site.js'

Vue.config.productionTip = false

Vue.prototype.$http = axios.create({
  baseURL: config.apiUrl
})

Vue.use(Vuetify, {
  theme: {
    primary: '#03a9f4',
    accent: '#80d8ff',
    secondary: '#424242',
    info: '#2196F3',
    warning: '#ffc107',
    error: '#FF5252',
    success: '#4CAF50'
  }
})

Vue.use(VeeValidate)
Vue.use(Vue2Filters)
Vue.use(ToggleButton)
Vue.use(moment)
Vue.use(VueChatScroll)
Vue.use(VueTransmit)
Vue.use(Croppa)

Vue.use(VTooltip, { 'defaultContainer': '.application' })

window.io = io

const EchoInstance = new Echo({
  broadcaster: 'socket.io',
  host: config.socketUrl,
})
Vue.use(VueEcho, EchoInstance)

Vue.use(VueIntercom, {
  appId: config.intercom.appId
})

Vue.directive('animateHeight', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    console.log('inserted', el.offsetHeight)
    console.log('childNodes', el.childNodes)
    el.style.height = null
    el.style.height = el.offsetHeight + 'px'
    console.log(el.style)
  },
  componentUpdated: function (el) {
    console.log('updated', el.childNodes[0].offsetHeight)
    setTimeout(() => {
      el.style.height = el.childNodes[0].offsetHeight + 'px'
    }, 400)
  }
})

Vue.filter("humanNumber", function (num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
})

Vue.filter("stripTags", function (value) {
  return value.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, ' ')
})

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const STEP = 1024;

function format(value, power) {
  return (value / Math.pow(STEP, power)).toFixed(2) + UNITS[power];
}

Vue.filter('fileSize', function (value) {
  value = parseFloat(value, 10);
  for (var i = 0; i < UNITS.length; i++) {
    if (value < Math.pow(STEP, i)) {
      if (UNITS[i - 1]) {
        return format(value, i - 1);
      }
      return value + UNITS[i];
    }
  }
  return format(value, i - 1);
});

// Vue.use(VueAxios, axios)

Vue.use(VueAuthenticate, {
  baseUrl: config.apiUrl, // Your API domain

  providers: config.authProviders,

  bindRequestInterceptor: function () { },

  bindResponseInterceptor: function () { }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
