<template>
  <div class="flex flex-wrap border-b border-gray-200 mb-6 pb-0.5">
    <button 
      @click="setActiveTab('pending')"
      :class="['px-5 py-3 text-sm font-semibold rounded-t-lg border-b-0 mr-1 mb-0 transition-all duration-200', 
               activeTab === 'pending' 
                 ? 'bg-blue-100 text-blue-700 border border-gray-300 border-b-0 border-t-2 border-t-blue-500 -mb-0.5' 
                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50']"
    >
      Requested
      <span class="ml-2 bg-blue-500 text-white text-xs font-medium py-0.5 px-2 rounded-full">
        {{ counts.pending }}
      </span>
    </button>
    
    <button 
      @click="setActiveTab('approved')"
      :class="['px-5 py-3 text-sm font-semibold rounded-t-lg border-b-0 mr-1 mb-0 transition-all duration-200', 
               activeTab === 'approved' 
                 ? 'bg-green-100 text-green-700 border border-gray-300 border-b-0 border-t-2 border-t-green-500 -mb-0.5' 
                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50']"
    >
      Approved
      <span class="ml-2 bg-green-500 text-white text-xs font-medium py-0.5 px-2 rounded-full">
        {{ counts.approved }}
      </span>
    </button>
    
    <button 
      @click="setActiveTab('refunded')"
      :class="['px-5 py-3 text-sm font-semibold rounded-t-lg border-b-0 mr-1 mb-0 transition-all duration-200', 
               activeTab === 'refunded' 
                 ? 'bg-blue-500 text-white border border-blue-500 border-b-0 border-t-2 border-t-blue-600 -mb-0.5' 
                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50']"
    >
      Refunded
      <span class="ml-2 bg-blue-600 text-white text-xs font-medium py-0.5 px-2 rounded-full">
        {{ counts.refunded }}
      </span>
    </button>
    
    <button 
      @click="setActiveTab('rejected')"
      :class="['px-5 py-3 text-sm font-semibold rounded-t-lg border-b-0 mr-1 mb-0 transition-all duration-200', 
               activeTab === 'rejected' 
                 ? 'bg-red-100 text-red-700 border border-gray-300 border-b-0 border-t-2 border-t-red-500 -mb-0.5' 
                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50']"
    >
      Rejected
      <span class="ml-2 bg-red-500 text-white text-xs font-medium py-0.5 px-2 rounded-full">
        {{ counts.rejected }}
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'StatusTabs',
  props: {
    activeTab: {
      type: String,
      default: 'pending' 
    },
    counts: {
      type: Object,
      default: () => ({
        pending: 0,
        approved: 0,
        refunded: 0,
        rejected: 0
      })
    }
  },
  emits: ['update:activeTab'],
  methods: {
    setActiveTab(tab) {
      this.$emit('update:activeTab', tab);
    }
  }
}
</script>