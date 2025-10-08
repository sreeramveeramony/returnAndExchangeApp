<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Sidebar Navigation -->
    <div class="w-64 bg-white shadow-xl border-r border-gray-200 p-5 flex flex-col">
      <div class="mb-8">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Return Exchange
        </h1>
        <p class="text-xs text-gray-500 mt-1">Admin Dashboard</p>
      </div>
      
      <!-- Navigation with links to specific request types -->
      <nav class="flex-1">
        <ul class="space-y-1">
          <li>
            <router-link 
              :to="{ name: 'AdminAll' }"
              :class="['w-full text-left px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 flex justify-between items-center', 
                       (($route.name === 'AdminAll' || $route.name === 'AdminPending' || $route.name === 'AdminApproved' || $route.name === 'AdminRefunded' || $route.name === 'AdminRejected') && (!($route.matched[0] && ($route.matched[0].name === 'AdminReturns' || $route.matched[0].name === 'AdminExchanges')))
                         ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500 shadow-sm' 
                         : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1')]"
            >
                <span class="font-medium">All Requests</span>
                <span class="bg-blue-100 text-blue-800 text-xs font-semibold py-1 px-2.5 rounded-full min-w-[32px] text-center">
                  {{ allRequests.length }}
                </span>
            </router-link>
          </li>
          <li class="mt-2">
            <router-link 
              :to="{ name: 'AdminReturns' }"
              :class="['w-full text-left px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 flex justify-between items-center', 
                       ($route.matched[0] && $route.matched[0].name === 'AdminReturns')
                         ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-l-4 border-green-500 shadow-sm' 
                         : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1']"
            >
                <span class="font-medium">Returns</span>
                <span class="bg-green-100 text-green-800 text-xs font-semibold py-1 px-2.5 rounded-full min-w-[32px] text-center">
                  {{ getRequestsByType('Return').length }}
                </span>
            </router-link>
          </li>
          <li class="mt-2">
            <router-link 
              :to="{ name: 'AdminExchanges' }"
              :class="['w-full text-left px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 flex justify-between items-center', 
                       ($route.matched[0] && $route.matched[0].name === 'AdminExchanges')
                         ? 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-l-4 border-purple-500 shadow-sm' 
                         : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1']"
            >
                <span class="font-medium">Exchanges</span>
                <span class="bg-purple-100 text-purple-800 text-xs font-semibold py-1 px-2.5 rounded-full min-w-[32px] text-center">
                  {{ getRequestsByType('Exchange').length }}
                </span>
            </router-link>
          </li>
          <li class="mt-2">
            <router-link 
              :to="{ name: 'AdminOrders' }"
              :class="['w-full text-left px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 flex justify-between items-center', 
                       $route.name === 'AdminOrders'
                         ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-l-4 border-amber-500 shadow-sm' 
                         : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1']"
            >
                <span class="font-medium">All Orders</span>
                <span class="bg-amber-100 text-amber-800 text-xs font-semibold py-1 px-2.5 rounded-full min-w-[32px] text-center">
                  {{ orderCount }}
                </span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <!-- Navigation Section Only -->
      <div class="mt-auto pt-6 border-t border-gray-200">
        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-xs text-gray-600">Live Status</span>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 p-8 overflow-y-auto">
      <div v-if="isLoading" class="flex flex-col items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-600">Loading requests...</p>
      </div>
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mx-4 my-6">
        <p class="text-red-700">{{ error }}</p>
      </div>
      <div v-else>
        <!-- Top section with title, counts, and sync button -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ requestType === 'all' ? 'All Requests' : requestType + ' Requests' }}
            </h2>
            <p class="text-gray-600 text-sm">Manage and process return and exchange requests</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
              <span class="font-medium">{{ filteredRequestsByDate.length }}</span> of <span class="font-medium">{{ allRequests.length }}</span> requests
              <span v-if="dateFilter !== 'all' && dateFilter !== 'all-time'" class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                {{ dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1) }}
              </span>
            </div>
            <SyncButton 
              @sync-start="handleSyncStart" 
              @sync-success="handleSyncSuccess" 
              @sync-error="handleSyncError" 
            />
          </div>
        </div>

        <!-- Request Status Navigation Bar (above date filter) -->
        <div class="flex flex-wrap border-b border-gray-200 mb-4 pb-0.5">
          <router-link 
            :to="getStatusRoute('Pending')"
            class="px-5 py-3 text-sm font-semibold rounded-t-lg border-b-0 mr-1 mb-0 transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            :class="[isActiveStatusRoute('Pending') ? 'bg-blue-100 text-blue-700 border border-gray-300 border-b-0 border-t-2 border-t-blue-500 -mb-0.5' : '']"
          >
            Requested
            <span class="ml-2 bg-blue-500 text-white text-xs font-medium py-0.5 px-2 rounded-full">
              {{ getRequestsByStatus('Pending').length }}
            </span>
          </router-link>
          
          <router-link 
            :to="getStatusRoute('Approved')"
            class="px-5 py-3 text-sm font-semibold rounded-t-lg border-b-0 mr-1 mb-0 transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            :class="[isActiveStatusRoute('Approved') ? 'bg-green-100 text-green-700 border border-gray-300 border-b-0 border-t-2 border-t-green-500 -mb-0.5' : '']"
          >
            Approved
            <span class="ml-2 bg-green-500 text-white text-xs font-medium py-0.5 px-2 rounded-full">
              {{ getRequestsByStatus('Approved').length }}
            </span>
          </router-link>
          
          <router-link 
            :to="getStatusRoute('Refunded')"
            class="px-5 py-3 text-sm font-semibold rounded-t-lg border-b-0 mr-1 mb-0 transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            :class="[isActiveStatusRoute('Refunded') ? 'bg-blue-500 text-white border border-blue-500 border-b-0 border-t-2 border-t-blue-600 -mb-0.5' : '']"
          >
            Refunded
            <span class="ml-2 bg-blue-600 text-white text-xs font-medium py-0.5 px-2 rounded-full">
              {{ getRequestsByStatus('Refunded').length }}
            </span>
          </router-link>
          
          <router-link 
            :to="getStatusRoute('Rejected')"
            class="px-5 py-3 text-sm font-semibold rounded-t-lg border-b-0 mr-1 mb-0 transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            :class="[isActiveStatusRoute('Rejected') ? 'bg-red-100 text-red-700 border border-gray-300 border-b-0 border-t-2 border-t-red-500 -mb-0.5' : '']"
          >
            Rejected
            <span class="ml-2 bg-red-500 text-white text-xs font-medium py-0.5 px-2 rounded-full">
              {{ getRequestsByStatus('Rejected').length }}
            </span>
          </router-link>
        </div>

        <!-- Date Filters -->
        <FilterBar 
          :dateFilter="dateFilter"
          @update:dateFilter="setDateFilter"
        />

        <!-- Content based on current route -->
        <router-view 
          :requests="filteredRequestsByDate" 
          :requestType="requestType"
          @update-request-status="updateRequestStatus"
          @fetch-requests="fetchRequests"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import StatusFilter from '../../components/StatusFilter.vue';
import FilterBar from '../../components/FilterBar.vue';
import SyncButton from '../../components/SyncButton.vue';

export default {
  name: 'AdminDashboard',
  components: {
    StatusFilter,
    FilterBar,
    SyncButton
  },
  data() {
    return {
      requests: [],
      isLoading: true,
      error: null,
      dateFilter: 'all', // Default to showing all requests
      syncMessage: null,
      orderCount: 0 // Add order count to data
    };
  },
  async created() {
    await this.fetchRequests();
    await this.loadOrderCount();
  },
  computed: {
    requestType() {
      // Determine request type based on current route
      if (this.$route.name === 'AdminReturns' || this.$route.matched.some(r => r && r.name === 'AdminReturns')) {
        return 'Return';
      } else if (this.$route.name === 'AdminExchanges' || this.$route.matched.some(r => r && r.name === 'AdminExchanges')) {
        return 'Exchange';
      }
      return 'all'; // Default to all for AdminAll route and status routes under all
    },
    // Filter requests by date and type
    // Filter requests by date and type
    filteredRequestsByDate() {
      let filteredRequests = this.requests;
      
      // First filter by type (all, return, exchange)
      if (this.requestType !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.type && request.type === this.requestType);
      }
      
      // Then filter by date
      if (this.dateFilter !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);

        filteredRequests = filteredRequests.filter(request => {
          const requestDate = new Date(request.createdAt);
          const requestDateOnly = new Date(requestDate.getFullYear(), requestDate.getMonth(), requestDate.getDate());

          switch (this.dateFilter) {
            case 'today':
              return requestDateOnly.getTime() === today.getTime();
            case 'yesterday':
              return requestDateOnly.getTime() === yesterday.getTime();
            case 'week':
              return requestDateOnly >= weekAgo;
            case 'month':
              return requestDateOnly >= monthAgo;
            default:
              return true;
          }
        });
      }
      
      return filteredRequests;
    },
    
    // Group filtered requests by status
    requestsByStatus() {
      const grouped = {
        Pending: [],
        Approved: [],
        Refunded: [],
        Rejected: []
      };
      this.filteredRequestsByDate.forEach(request => {
        if (request.status && grouped.hasOwnProperty(request.status)) {
          grouped[request.status].push(request);
        } else if (request.status) {
          // Handle any other status values if they exist
          if (!grouped[request.status]) {
            grouped[request.status] = [];
          }
          grouped[request.status].push(request);
        }
      });
      return grouped;
    },
    
    // All requests for the count in sidebar
    allRequests() {
      return this.requests;
    },
    
    // Count of all orders 
    // The actual count is stored in the data property and updated via fetchOrdersCount
  },
  methods: {
    async fetchRequests() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3001/api/requests');
        this.requests = response.data;
      } catch (err) {
        this.error = 'Could not connect to the server or failed to fetch data.';
        console.error('Fetch Requests Error:', err);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Set the date filter
    setDateFilter(filter) {
      this.dateFilter = filter;
    },
    // Set the request type filter (all, return, exchange)
    setRequestType(type) {
      this.requestType = type;
    },
    // Get requests by type
    getRequestsByType(type) {
      return (this.requests || []).filter(request => request.type && request.type === type);
    },
    
    async updateRequestStatus(id, status) {
      try {
        // Update the request status in the database
        const response = await axios.patch(`http://localhost:3001/api/requests/${id}`, { status });
        const index = this.requests.findIndex(req => req._id === id);
        if (index !== -1) {
          this.requests[index].status = response.data.status;
        }
        
        // The local order status will be updated as part of the request update process
        // The Shopify API call is handled within the request update endpoint
      } catch (err) {
        // More descriptive error handling for the UI
        const errorMessage = (err.response && err.response.data && err.response.data.message) || 'An unknown error occurred while updating the status.';
        alert("Return or Exchange is already initiated for this order"); // Using alert for immediate feedback in admin panel
        console.error('Update Request Error:', err);
      }
    },
    // Get requests by status
    getRequestsByStatus(status) {
      return (this.requestsByStatus && this.requestsByStatus[status]) || [];
    },
    formatCurrency(value) {
        if (!value) return '₹0.00';
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    },
    statusClass(status) {
      switch (status) {
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'Approved':
          return 'bg-green-100 text-green-800';
        case 'Refunded':
          return 'bg-blue-100 text-blue-800';
        case 'Rejected':
          return 'bg-red-100 text-red-800';
        case 'Completed':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
    typeClass(type) {
      switch (type) {
        case 'Return':
          return 'bg-blue-100 text-blue-800';
        case 'Exchange':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
    
    handleSyncStart() {
      this.syncMessage = 'Starting sync...';
    },
    
    async handleSyncSuccess(message) {
      this.syncMessage = message;
      // Refresh the requests list
      await this.fetchRequests();
      // Clear message after 3 seconds
      setTimeout(() => {
        this.syncMessage = null;
      }, 3000);
    },
    
    handleSyncError(message) {
      this.syncMessage = message;
      console.error('Sync Error:', message);
    },
    
    async loadOrderCount() {
      try {
        const response = await axios.get('http://localhost:3001/api/orders');
        this.orderCount = response.data.length;
      } catch (err) {
        console.error('Failed to fetch order count:', err);
        this.orderCount = 0;
      }
    },
    
    // Generate the correct route name based on current context (all, returns, exchanges)
    getStatusRoute(status) {
      // Determine the base route name based on current context
      let baseRoute = 'Admin';
      
      if (this.$route.name === 'AdminReturns' || this.$route.matched.some(r => r && r.name === 'AdminReturns')) {
        baseRoute = 'AdminReturn';
      } else if (this.$route.name === 'AdminExchanges' || this.$route.matched.some(r => r && r.name === 'AdminExchanges')) {
        baseRoute = 'AdminExchange';
      }
      
      // Map status to the appropriate route suffix
      const statusMap = {
        'Pending': 'Pending',
        'Approved': 'Approved', 
        'Refunded': 'Refunded',
        'Rejected': 'Rejected'
      };
      
      const routeName = baseRoute + statusMap[status];
      
      return { name: routeName };
    },
    
    // Check if the current route matches a specific status route
    isActiveStatusRoute(status) {
      let baseRoute = 'Admin';
      
      if (this.$route.name === 'AdminReturns' || this.$route.matched.some(r => r && r.name === 'AdminReturns')) {
        baseRoute = 'AdminReturn';
      } else if (this.$route.name === 'AdminExchanges' || this.$route.matched.some(r => r && r.name === 'AdminExchanges')) {
        baseRoute = 'AdminExchange';
      }
      
      const statusMap = {
        'Pending': 'Pending',
        'Approved': 'Approved', 
        'Refunded': 'Refunded',
        'Rejected': 'Rejected'
      };
      
      const routeName = baseRoute + statusMap[status];
      
      return this.$route.name === routeName;
    }
  },
};
</script>