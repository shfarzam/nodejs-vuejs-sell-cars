// router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Customer from './views/CustomerPage.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/customers-page', component: Customer },
];
/** 
const router = createRouter({
    history: createWebHistory(),
    routes,
});
*/

export default routes;
