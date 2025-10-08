<template>
  <div class="flex flex-wrap gap-2 mb-6">
    <button 
      @click="setActiveTab('pending')"
      :class="['px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center', 
               activeTab === 'pending' 
                 ? 'bg-blue-100 text-blue-800 font-semibold' 
                 : 'text-gray-600 hover:bg-gray-100']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Requested
      <span class="ml-2 bg-blue-500 text-white text-xs font-medium py-0.5 px-2 rounded-full min-w-[24px]">
        {{ counts.pending }}
      </span>
    </button>
    
    <button 
      @click="setActiveTab('approved')"
      :class="['px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center', 
               activeTab === 'approved' 
                 ? 'bg-green-100 text-green-800 font-semibold' 
                 : 'text-gray-600 hover:bg-gray-100']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Approved
      <span class="ml-2 bg-green-500 text-white text-xs font-medium py-0.5 px-2 rounded-full min-w-[24px]">
        {{ counts.approved }}
      </span>
    </button>
    
    <button 
      @click="setActiveTab('refunded')"
      :class="['px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center', 
               activeTab === 'refunded' 
                 ? 'bg-indigo-100 text-indigo-800 font-semibold' 
                 : 'text-gray-600 hover:bg-gray-100']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Refunded
      <span class="ml-2 bg-indigo-500 text-white text-xs font-medium py-0.5 px-2 rounded-full min-w-[24px]">
        {{ counts.refunded }}
      </span>
    </button>
    
    <button 
      @click="setActiveTab('rejected')"
      :class="['px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center', 
               activeTab === 'rejected' 
                 ? 'bg-red-100 text-red-800 font-semibold' 
                 : 'text-gray-600 hover:bg-gray-100']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Rejected
      <span class="ml-2 bg-red-500 text-white text-xs font-medium py-0.5 px-2 rounded-full min-w-[24px]">
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