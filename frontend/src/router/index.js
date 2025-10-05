import { createRouter, createWebHistory } from 'vue-router';
import OrderLookup from '../views/OrderLookup.vue';
import ReturnExchange from '../views/ReturnExchange.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import RequestConfirmation from '../views/RequestConfirmation.vue';

const routes = [
  {
    path: '/',
    name: 'OrderLookup',
    component: OrderLookup,
  },
  {
    path: '/select-items',
    name: 'ReturnExchange',
    component: ReturnExchange,
    props: route => ({ orderData: route.params.orderData }),
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
  },
  {
    path: '/confirmation',
    name: 'RequestConfirmation',
    component: RequestConfirmation,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
