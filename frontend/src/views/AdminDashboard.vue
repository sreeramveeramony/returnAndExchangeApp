<template>
  <div class="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
    <div v-if="isLoading" class="text-center text-gray-500">
      <p>Loading requests...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-md">
      <p>Error loading requests: {{ error }}</p>
    </div>
    <div v-else-if="requests.length === 0" class="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
      <p>No return or exchange requests found.</p>
    </div>
    <div v-else class="space-y-4">
      <div v-for="request in requests" :key="request._id" class="bg-white p-5 rounded-lg shadow-md border border-gray-200">
        <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              Order #{{ request.originalOrder ? request.originalOrder.name : '[Unknown]' }} - <span class="font-normal">{{ request.type }} Request</span>
            </h2>
            <p class="text-sm text-gray-500">{{ new Date(request.createdAt).toLocaleString() }}</p>
          </div>
          <div :class="statusClass(request.status)" class="mt-2 sm:mt-0 text-sm font-medium py-1 px-3 rounded-full">
            {{ request.status }}
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-4">
          <h3 class="font-semibold text-gray-700 mb-2">Items to Return:</h3>
          <ul>
            <li v-for="item in request.items" :key="item.lineItemId" class="flex justify-between items-center text-sm mb-1">
              <span>{{ item.title }} (x{{ item.quantity }})</span>
              <span class="text-gray-600">{{ formatCurrency(item.price) }}</span>
            </li>
          </ul>

          <div v-if="request.type === 'Exchange' && request.exchangeItem" class="mt-3 border-t border-gray-100 pt-3">
             <h3 class="font-semibold text-gray-700 mb-2">Requested Exchange Item:</h3>
             <p class="text-sm">{{ request.exchangeItem.title }} (x{{ request.exchangeItem.quantity }})</p>
          </div>
        </div>
        
        <div v-if="request.status === 'Pending'" class="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
          <button @click="updateRequestStatus(request._id, 'Rejected')" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150">
            Reject
          </button>
          <button @click="updateRequestStatus(request._id, 'Approved')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150">
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      requests: [],
      isLoading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchRequests();
  },
  methods: {
    async fetchRequests() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3001/api/requests');
        this.requests = response.data;
      } catch (err) {
        this.error = 'Could not connect to the server or failed to fetch data.';
        console.error('Fetch Requests Error:', err);
      } finally {
        this.isLoading = false;
      }
    },
    async updateRequestStatus(id, status) {
      try {
        // THIS IS THE FIX: We must pass the status in the request body.
        const response = await axios.patch(`http://localhost:3001/api/requests/${id}`, { status });
        const index = this.requests.findIndex(req => req._id === id);
        if (index !== -1) {
          this.requests[index].status = response.data.status;
        }
      } catch (err) {
        // More descriptive error handling for the UI
        const errorMessage = (err.response && err.response.data && err.response.data.message) || 'An unknown error occurred while updating the status.';
        alert(`Failed to update request: ${errorMessage}`); // Using alert for immediate feedback in admin panel
        console.error('Update Request Error:', err);
      }
    },
    formatCurrency(value) {
        if (!value) return '$0.00';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    },
    statusClass(status) {
      switch (status) {
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'Approved':
          return 'bg-green-100 text-green-800';
        case 'Rejected':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  },
};
</script>

