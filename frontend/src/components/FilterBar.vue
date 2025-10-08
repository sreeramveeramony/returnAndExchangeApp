<template>
  <div class="flex flex-wrap gap-2 mb-6 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
    <span class="text-sm font-medium text-gray-700 self-center mr-3">Filter by:</span>
    <button 
      @click="setDateFilter('all')"
      :class="['px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200', 
               dateFilter === 'all' 
                 ? 'bg-blue-500 text-white shadow-md' 
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
    >
      All Time
    </button>
    <button 
      @click="setDateFilter('today')"
      :class="['px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200', 
               dateFilter === 'today' 
                 ? 'bg-blue-500 text-white shadow-md' 
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
    >
      Today
    </button>
    <button 
      @click="setDateFilter('yesterday')"
      :class="['px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200', 
               dateFilter === 'yesterday' 
                 ? 'bg-blue-500 text-white shadow-md' 
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
    >
      Yesterday
    </button>
    <button 
      @click="setDateFilter('week')"
      :class="['px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200', 
               dateFilter === 'week' 
                 ? 'bg-blue-500 text-white shadow-md' 
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
    >
      Last 7 Days
    </button>
    <button 
      @click="setDateFilter('month')"
      :class="['px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200', 
               dateFilter === 'month' 
                 ? 'bg-blue-500 text-white shadow-md' 
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
    >
      Last 30 Days
    </button>
  </div>
</template>

<script>
export default {
  name: 'FilterBar',
  props: {
    dateFilter: {
      type: String,
      default: 'all'
    }
  },
  emits: ['update:dateFilter'],
  methods: {
    setDateFilter(filter) {
      this.$emit('update:dateFilter', filter);
    }
  }
}
</script>