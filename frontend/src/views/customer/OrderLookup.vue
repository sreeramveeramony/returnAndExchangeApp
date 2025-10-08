<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full mx-auto">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div class="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-center">
          <h1 class="text-2xl font-bold text-white">Return & Exchange Portal</h1>
          <p class="text-blue-100 mt-1">Process Your Return or Exchange Request</p>
        </div>
        
        <div class="p-8">
          <div class="text-center mb-8">
            <div class="mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4">
              <svg class="w-9 h-9 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Enter Your Order Information</h3>
            <p class="text-gray-600">Provide your order number and email to begin the return or exchange process.</p>
          </div>
          
          <form @submit.prevent="findOrder">
            <div class="mb-6">
              <label for="orderNumber" class="block text-gray-800 text-sm font-semibold mb-2.5">Order Number</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="orderNumber"
                  v-model="orderNumber"
                  class="pl-10 shadow-sm border border-gray-300 rounded-lg w-full py-3.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:border-blue-500 transition duration-200 bg-gray-50 focus:bg-white"
                  placeholder="e.g., #1001"
                  required
                />
              </div>
            </div>
            
            <div class="mb-7">
              <label for="email" class="block text-gray-800 text-sm font-semibold mb-2.5">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="pl-10 shadow-sm border border-gray-300 rounded-lg w-full py-3.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:border-blue-500 transition duration-200 bg-gray-50 focus:bg-white"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <div class="flex items-center justify-center">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  Locate My Order
                </span>
              </button>
            </div>
            
            <p v-if="error" class="text-red-500 text-sm mt-4 text-center flex items-center justify-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ error }}
            </p>
          </form>
        </div>
        
        <div class="bg-gray-50 px-8 py-6 text-center">
          <p class="text-xs text-gray-500">Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OrderLookup',
  data() {
    return {
      orderNumber: '',
      email: '',
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async findOrder() {
      this.isLoading = true;
      this.error = null;
      try {
        // Changed to fetch from local DB instead of Shopify API
        const response = await axios.post('http://localhost:3001/api/orders/lookup', {
          orderNumber: this.orderNumber.startsWith('#') ? this.orderNumber : `#${this.orderNumber}`,
          email: this.email,
        });

        if (response.data) {
           // Store the order data in sessionStorage
           sessionStorage.setItem('orderData', JSON.stringify(response.data));
           // Navigate without params
           this.$router.push({ name: 'ReturnExchange' });
        } else {
            this.error = 'Order not found or email does not match. Please check your details.';
        }
      } catch (err) {
        this.error = 'Could not find your order. Please double-check your order number and email.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

