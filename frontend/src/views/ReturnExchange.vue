<template>
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-gray-700 text-center mb-2">Select items to return or exchange</h2>
    <p v-if="order" class="text-gray-600 text-center mb-8">Order #{{ order.name }}</p>

    <div v-if="order" class="space-y-4">
      <div v-for="item in order.line_items" :key="item.id" class="flex items-center p-4 border rounded-md">
        <img :src="item.image_url || 'https://placehold.co/64x64/e2e8f0/e2e8f0?text=Img'" alt="Product Image" class="w-16 h-16 object-cover rounded-md mr-4">
        <div class="flex-grow">
          <p class="font-semibold text-gray-800">{{ item.title }}</p>
          <p class="text-sm text-gray-500" v-if="item.variant_title">{{ item.variant_title }}</p>
          <p class="text-sm text-gray-600">{{ formatCurrency(item.price) }}</p>
        </div>
        <div class="ml-4">
          <select v-model="itemActions[item.id]" class="border rounded-md p-2 text-sm">
            <option value="none">Don't Return</option>
            <option value="return">Return</option>
            <option value="exchange">Exchange</option>
          </select>
        </div>
      </div>

      <div class="pt-6 border-t">
        <button
          @click="submitRequest"
          :disabled="isLoading || !isAnyItemSelected"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Submitting...</span>
          <span v-else>Submit Request</span>
        </button>
        <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
      </div>
    </div>
    <div v-else>
        <p class="text-center text-gray-500">Loading order details...</p>
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
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    },
  },
};
</script>

