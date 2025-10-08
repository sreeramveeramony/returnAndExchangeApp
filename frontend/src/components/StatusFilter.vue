<template>
  <nav class="flex-1">
    <ul class="space-y-1">
      <li>
        <button 
          @click="setRequestType('all')" 
          :class="['w-full text-left px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 flex justify-between items-center', 
                   requestType === 'all' 
                     ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500 shadow-sm' 
                     : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1']"
        >
            <span class="font-medium">All Requests</span>
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold py-1 px-2.5 rounded-full min-w-[32px] text-center">
              {{ counts.all }}
            </span>
        </button>
      </li>
      <li class="mt-2">
        <button 
          @click="setRequestType('Return')" 
          :class="['w-full text-left px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 flex justify-between items-center', 
                   requestType === 'Return' 
                     ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-l-4 border-green-500 shadow-sm' 
                     : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1']"
        >
            <span class="font-medium">Returns</span>
            <span class="bg-green-100 text-green-800 text-xs font-semibold py-1 px-2.5 rounded-full min-w-[32px] text-center">
              {{ counts.return }}
            </span>
        </button>
      </li>
      <li class="mt-2">
        <button 
          @click="setRequestType('Exchange')" 
          :class="['w-full text-left px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 flex justify-between items-center', 
                   requestType === 'Exchange' 
                     ? 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-l-4 border-purple-500 shadow-sm' 
                     : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1']"
        >
            <span class="font-medium">Exchanges</span>
            <span class="bg-purple-100 text-purple-800 text-xs font-semibold py-1 px-2.5 rounded-full min-w-[32px] text-center">
              {{ counts.exchange }}
            </span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'StatusFilter',
  props: {
    requestType: {
      type: String,
      default: 'all'
    },
    counts: {
      type: Object,
      default: () => ({
        all: 0,
        return: 0,
        exchange: 0
      })
    }
  },
  emits: ['update:requestType'],
  methods: {
    setRequestType(type) {
      this.$emit('update:requestType', type);
    }
  }
}
</script>