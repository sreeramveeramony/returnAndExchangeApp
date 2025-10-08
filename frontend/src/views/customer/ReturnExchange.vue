<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl w-full mx-auto">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <h1 class="text-2xl font-bold text-white">Return & Exchange Portal</h1>
          <p class="text-blue-100 mt-1">Select items to return or exchange</p>
        </div>
        
        <div class="p-6 md:p-8">
          <div v-if="order" class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-800">Order #{{ order.name }}</h2>
                <p class="text-sm text-gray-600 mt-1">Placed on {{ new Date(order.created_at).toLocaleDateString() }}</p>
              </div>
              <div class="mt-3 sm:mt-0">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ formatCurrency(order.total_price) }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="order" class="space-y-6">
            <div v-for="item in order.line_items" :key="item.id" class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div class="p-5">
                <div class="flex flex-col sm:flex-row">
                  <div class="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                    <img :src="item.image_url || 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=Img'" alt="Product Image" class="w-20 h-20 object-contain rounded-lg border border-gray-200">
                  </div>
                  
                  <div class="flex-grow">
                    <div class="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h3 class="font-semibold text-gray-800 text-lg">{{ item.title }}</h3>
                        <p class="text-sm text-gray-600 mt-1" v-if="item.variant_title">{{ item.variant_title }}</p>
                        <p class="text-sm text-gray-500 mt-1">Quantity: {{ item.quantity }}</p>
                      </div>
                      
                      <div class="mt-3 md:mt-0">
                        <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(item.price) }}</p>
                      </div>
                    </div>
                    
                    <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-700 mr-3">Action:</span>
                        <div class="relative">
                          <select 
                            v-model="itemActions[item.id]" 
                            class="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200"
                          >
                            <option value="none">Don't Return</option>
                            <option value="return">Return</option>
                            <option value="exchange">Exchange</option>
                          </select>
                          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="itemActions[item.id] === 'exchange'" class="mt-3 sm:mt-0">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                          </svg>
                          Exchange Selected
                        </span>
                      </div>
                      
                      <div v-else-if="itemActions[item.id] === 'return'" class="mt-3 sm:mt-0">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                          </svg>
                          Return Selected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-6 border-t border-gray-200">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex items-center">
                  <span class="text-sm text-gray-600 mr-2">Selected items:</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ selectedItemCount }} of {{ order.line_items.length }}
                  </span>
                </div>
                
                <button
                  @click="submitRequest"
                  :disabled="isLoading || !isAnyItemSelected"
                  class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span v-if="isLoading" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Submit Request
                  </span>
                </button>
              </div>
              
              <p v-if="error" class="text-red-500 text-sm mt-4 text-center flex items-center justify-center">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ error }}
              </p>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <div class="flex justify-center">
              <svg class="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Loading order details</h3>
            <p class="mt-1 text-sm text-gray-500">Please wait while we fetch your order information...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReturnExchange',
  data() {
    return {
      order: null,
      itemActions: {}, // e.g., { lineItemId: 'return', ... }
      isLoading: false,
      error: null,
    };
  },
  created() {
    try {
      const orderDataString = sessionStorage.getItem('orderData');
      if (orderDataString) {
        this.order = JSON.parse(orderDataString);
        // Initialize actions for each item
        this.order.line_items.forEach(item => {
            // Add a placeholder for image if missing
            if (!item.image_url) {
                item.image_url = `https://placehold.co/100x100/e2e8f0/e2e8f0?text=${encodeURIComponent(item.title.substring(0, 10))}`
            }
            this.itemActions[item.id] = 'none';
        });
      } else {
          this.error = "Could not load order data. Please go back and try again.";
      }
    } catch (e) {
      console.error("Failed to parse order data from sessionStorage", e);
      this.error = "An error occurred while loading order details.";
    }
  },
  computed: {
    isAnyItemSelected() {
      if (!this.order) return false;
      return Object.values(this.itemActions).some(action => action !== 'none');
    }
  },
  methods: {
    async submitRequest() {
      this.isLoading = true;
      this.error = null;

      const itemsForProcessing = this.order.line_items
        .filter(item => ['return', 'exchange'].includes(this.itemActions[item.id]))
        .map(item => ({
          lineItemId: item.id,
          variantId: item.variant_id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          requestedAction: this.itemActions[item.id]
        }));

      if (itemsForProcessing.length === 0) {
        this.error = "Please select at least one item to return or exchange.";
        this.isLoading = false;
        return;
      }
      
      const hasExchange = itemsForProcessing.some(item => item.requestedAction === 'exchange');
      const requestType = hasExchange ? 'Exchange' : 'Return';

      const payload = {
        type: requestType,
        items: itemsForProcessing,
        originalOrder: this.order,
      };

      try {
        await axios.post('http://localhost:3001/api/requests', payload);
        this.$router.push({ name: 'RequestConfirmation' });
      } catch (err) {
        const backendError = err.response && err.response.data && err.response.data.message;
        this.error = backendError || 'There was an error submitting your request. Please try again.';
        console.error("Submission Error:", err.response ? err.response.data : err);
      } finally {
        this.isLoading = false;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    },
  },
};
</script>

