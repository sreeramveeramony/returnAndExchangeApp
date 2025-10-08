<template>
  <div>
    <div class="mb-6">
      <SyncButton 
        @sync-start="handleSyncStart" 
        @sync-success="handleSyncSuccess" 
        @sync-error="handleSyncError" 
      />
      <p v-if="syncMessage" class="text-sm text-gray-600 mt-2">{{ syncMessage }}</p>
    </div>
    <!-- This component just exists to set the context for return-specific routes -->
    <router-view 
      :requests="getRequestsByType('Return')" 
      :requestType="'Return'"
      @update-request-status="updateRequestStatus"
      @fetch-requests="fetchRequests"
    />
  </div>
</template>

<script>
export default {
  name: 'AdminReturns',
  computed: {
    getRequestsByType() {
      return this.$parent.getRequestsByType;
    },
    updateRequestStatus() {
      return this.$parent.updateRequestStatus;
    },
    fetchRequests() {
      return this.$parent.fetchRequests;
    }
  }
}
</script>