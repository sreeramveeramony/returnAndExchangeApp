<template>
  <div>
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