import { createRouter, createWebHistory } from 'vue-router';
import OrderLookup from '../views/customer/OrderLookup.vue';
import ReturnExchange from '../views/customer/ReturnExchange.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import RequestConfirmation from '../views/customer/RequestConfirmation.vue';
import PendingRequests from '../views/admin/PendingRequests.vue';
import ApprovedRequests from '../views/admin/ApprovedRequests.vue';
import RefundedRequests from '../views/admin/RefundedRequests.vue';
import RejectedRequests from '../views/admin/RejectedRequests.vue';
import ReturnRequests from '../views/admin/ReturnRequests.vue';
import ExchangeRequests from '../views/admin/ExchangeRequests.vue';

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
    name: 'AdminAll',
    component: AdminDashboard,
    children: [
      {
        path: 'pending',
        name: 'AdminPending',
        component: PendingRequests
      },
      {
        path: 'approved',
        name: 'AdminApproved',
        component: ApprovedRequests
      },
      {
        path: 'refunded',
        name: 'AdminRefunded',
        component: RefundedRequests
      },
      {
        path: 'rejected',
        name: 'AdminRejected',
        component: RejectedRequests
      }
    ]
  },
  {
    path: '/admin/returns',
    name: 'AdminReturns',
    component: AdminDashboard,
    children: [
      {
        path: 'pending',
        name: 'AdminReturnPending',
        component: PendingRequests
      },
      {
        path: 'approved',
        name: 'AdminReturnApproved',
        component: ApprovedRequests
      },
      {
        path: 'refunded',
        name: 'AdminReturnRefunded',
        component: RefundedRequests
      },
      {
        path: 'rejected',
        name: 'AdminReturnRejected',
        component: RejectedRequests
      }
    ]
  },
  {
    path: '/admin/exchanges',
    name: 'AdminExchanges',
    component: AdminDashboard,
    children: [
      {
        path: 'pending',
        name: 'AdminExchangePending',
        component: PendingRequests
      },
      {
        path: 'approved',
        name: 'AdminExchangeApproved',
        component: ApprovedRequests
      },
      {
        path: 'refunded',
        name: 'AdminExchangeRefunded',
        component: RefundedRequests
      },
      {
        path: 'rejected',
        name: 'AdminExchangeRejected',
        component: RejectedRequests
      }
    ]
  },
  {
    path: '/admin/pending',
    redirect: { name: 'AdminPending' }
  },
  {
    path: '/admin/approved',
    redirect: { name: 'AdminApproved' }
  },
  {
    path: '/admin/refunded',
    redirect: { name: 'AdminRefunded' }
  },
  {
    path: '/admin/rejected',
    redirect: { name: 'AdminRejected' }
  },
  {
    path: '/admin/returns',
    redirect: { name: 'AdminReturns' }
  },
  {
    path: '/admin/exchanges',
    redirect: { name: 'AdminExchanges' }
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