<template>
  <div>
    
    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p class="text-gray-600">Loading orders...</p>
    </div>
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mx-4 my-6">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-else>
      <div class="mb-4 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">All Orders ({{ orders.length }})</h3>
        <div class="flex items-center">
          <span class="text-sm text-gray-600 mr-2">Search:</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by order number, email..." 
            class="border border-gray-300 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return/Exchange</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order._id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ order.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(order.created_at).toLocaleDateString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(order.total_price) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="orderStatusClass(order.financial_status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ order.financial_status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span v-if="order.returnRequest" class="text-blue-600">
                  {{ order.returnRequest.type }} - {{ order.returnRequest.status }}
                </span>
                <span v-else class="text-gray-500">No requests</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SyncButton from '../../components/SyncButton.vue';

export default {
  name: 'AdminOrders',
  components: {
    SyncButton
  },
  data() {
    return {
      orders: [],
      loading: true,
      error: null,
      syncMessage: null,
      searchQuery: ''
    };
  },
  async created() {
    await this.fetchOrders();
  },
  computed: {
    filteredOrders() {
      if (!this.searchQuery) {
        return this.orders;
      }
      
      const query = this.searchQuery.toLowerCase();
      return this.orders.filter(order => 
        order.name.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query) ||
        (order.customer && order.customer.email && order.customer.email.toLowerCase().includes(query))
      );
    }
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3001/api/orders');
        this.orders = response.data;
      } catch (err) {
        this.error = 'Could not connect to the server or failed to fetch orders.';
        console.error('Fetch Orders Error:', err);
      } finally {
        this.loading = false;
      }
    },
    
    handleSyncStart() {
      this.syncMessage = 'Starting sync...';
    },
    
    handleSyncSuccess(message) {
      this.syncMessage = message;
      // Refresh the order list
      this.fetchOrders();
      // Clear message after 3 seconds
      setTimeout(() => {
        this.syncMessage = null;
      }, 3000);
    },
    
    handleSyncError(message) {
      this.syncMessage = message;
      console.error('Sync Orders Error:', message);
    },
    
    formatCurrency(value) {
      if (!value) return '₹0.00';
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    },
    
    orderStatusClass(status) {
      switch (status) {
        case 'paid':
        case 'partially_paid':
          return 'bg-green-100 text-green-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'refunded':
        case 'partially_refunded':
          return 'bg-blue-100 text-blue-800';
        case 'voided':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  }
};
</script>