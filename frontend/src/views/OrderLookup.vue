<template>
  <div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">Start Your Return or Exchange</h2>
    <p class="text-gray-600 text-center mb-8">Enter your order details to begin.</p>
    <form @submit.prevent="findOrder">
      <div class="mb-6">
        <label for="orderNumber" class="block text-gray-700 text-sm font-bold mb-2">Order Number</label>
        <input
          type="text"
          id="orderNumber"
          v-model="orderNumber"
          class="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., #1001"
          required
        />
      </div>
      <div class="mb-8">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          required
        />
      </div>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:bg-blue-300"
        >
          <span v-if="isLoading">Searching...</span>
          <span v-else>Find My Order</span>
        </button>
      </div>
      <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
    </form>
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
        const response = await axios.post('http://localhost:3001/api/lookup-order', {
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

