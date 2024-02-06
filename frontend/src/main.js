// main.js
//import { BootstrapVue3 } from 'bootstrap-vue-3'

import Vue from 'vue';
import App from './App.vue';
import routes from './router';
import VueRouter from 'vue-router'
import axios from 'axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

/**import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { BootstrapVue } from 'bootstrap-vue';
*/

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css';
//const app = createApp(App);

// Install BootstrapVue
//app.use(BootstrapVue3)

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.config.productionTip = false

Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    mode: 'history' // Use 'hash' if you don't have server configuration for history mode
});

/**
// Set up Axios 
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // backend API URL
});

// Add an interceptor to include the token in the headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
});

app.config.globalProperties.$axios = axiosInstance;
app.config.productionTip = false;

app.use(router);
app.mount('#app');
*/

// Set up Axios 
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // backend API URL
});
// Add an interceptor to include the token in the headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
});

Vue.prototype.$axios = axiosInstance;
new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');