<template>
  <button 
    @click="syncOrders" 
    :disabled="syncing"
    class="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition duration-200 flex items-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
  >
    <span v-if="syncing" class="flex items-center">
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Syncing...
    </span>
    <span v-else class="flex items-center">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      Sync Orders
    </span>
  </button>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SyncButton',
  emits: ['sync-start', 'sync-success', 'sync-error'],
  data() {
    return {
      syncing: false,
      syncMessage: null
    };
  },
  methods: {
    async syncOrders() {
      this.syncing = true;
      this.$emit('sync-start');
      
      try {
        await axios.post('http://localhost:3001/api/sync-orders');
        this.$emit('sync-success', 'Orders synced successfully!');
        
        // Wait a bit before clearing the state to allow any parent components to handle the success
        setTimeout(() => {
          this.syncing = false;
        }, 1000);
      } catch (err) {
        const errorMessage = 'Error syncing orders: ' + ((err.response && err.response.data && err.response.data.message) || err.message);
        this.$emit('sync-error', errorMessage);
        this.syncing = false;
      }
    }
  }
};
</script>