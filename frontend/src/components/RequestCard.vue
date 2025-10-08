<template>
  <div class="bg-white p-5 rounded-lg shadow-md border border-gray-200">
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
    
    <!-- Action buttons will be defined by parent component -->
    <div class="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200" v-if="actionButtons">
      <button 
        v-for="action in actionButtons" 
        :key="action.name"
        @click="action.click"
        :class="[action.class, 'font-bold py-2 px-4 rounded-md text-sm transition duration-150']"
      >
        {{ action.text }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequestCard',
  props: {
    request: {
      type: Object,
      required: true
    },
    actionButtons: {
      type: Array,
      default: () => []
    }
  },
  methods: {
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