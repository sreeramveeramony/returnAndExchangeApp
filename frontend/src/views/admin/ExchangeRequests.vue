<template>
  <div>
    <!-- This component just exists to set the context for exchange-specific routes -->
    <router-view 
      :requests="getRequestsByType('Exchange')" 
      :requestType="'Exchange'"
      @update-request-status="updateRequestStatus"
      @fetch-requests="fetchRequests"
    />
  </div>
</template>

<script>
export default {
  name: 'AdminExchanges',
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