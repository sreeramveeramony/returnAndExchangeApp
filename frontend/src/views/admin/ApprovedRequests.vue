<template>
  <div>
    <div v-if="getRequestsByStatus('Approved').length === 0" class="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
      <p>No approved requests.</p>
    </div>
    <div v-else class="space-y-4">
      <RequestCard 
        v-for="request in getRequestsByStatus('Approved')" 
        :key="request._id" 
        :request="request"
        :actionButtons="[
          {
            name: 'refund',
            text: 'Mark as Refunded',
            class: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150',
            click: () => updateRequestStatus(request._id, 'Refunded')
          },
          {
            name: 'reject',
            text: 'Reject',
            class: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150',
            click: () => updateRequestStatus(request._id, 'Rejected')
          }
        ]"
      />
    </div>
  </div>
</template>

<script>
import RequestCard from '../../components/RequestCard.vue';

export default {
  name: 'AdminApproved',
  components: {
    RequestCard
  },
  props: {
    requests: {
      type: Array,
      default: () => []
    },
    requestType: {
      type: String,
      default: 'all'
    }
  },
  emits: ['update-request-status'],
  methods: {
    getRequestsByStatus(status) {
      return this.requests.filter(request => request.status === status);
    },
    updateRequestStatus(id, status) {
      this.$emit('update-request-status', id, status);
    },
    formatCurrency(value) {
      if (!value) return '₹0.00';
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    },
    statusClass(status) {
      switch (status) {
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'Approved':
          return 'bg-green-100 text-green-800';
        case 'Refunded':
          return 'bg-blue-100 text-blue-800';
        case 'Rejected':
          return 'bg-red-100 text-red-800';
        case 'Completed':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  }
}
</script>