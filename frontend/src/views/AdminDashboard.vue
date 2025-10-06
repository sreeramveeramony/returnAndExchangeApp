<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar Navigation -->
    <div class="w-64 bg-white shadow-md p-4 flex flex-col">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <!-- Return/Exchange Navigation -->
      <nav class="flex-1">
        <ul class="space-y-2">
          <li>
            <button 
              @click="setRequestType('all')" 
              :class="['w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition duration-150', 
                       requestType === 'all' 
                         ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
                         : 'text-gray-700 hover:bg-gray-100']"
            >
              <div class="flex justify-between items-center">
                <span>All Requests</span>
                <span class="bg-gray-200 text-gray-800 text-xs font-medium py-1 px-2 rounded-full">
                  {{ allRequests.length }}
                </span>
              </div>
            </button>
          </li>
          <li>
            <button 
              @click="setRequestType('Return')" 
              :class="['w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition duration-150', 
                       requestType === 'Return' 
                         ? 'bg-green-100 text-green-700 border-l-4 border-green-500' 
                         : 'text-gray-700 hover:bg-gray-100']"
            >
              <div class="flex justify-between items-center">
                <span>Returns</span>
                <span class="bg-green-200 text-green-800 text-xs font-medium py-1 px-2 rounded-full">
                  {{ getRequestsByType('Return').length }}
                </span>
              </div>
            </button>
          </li>
          <li>
            <button 
              @click="setRequestType('Exchange')" 
              :class="['w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition duration-150', 
                       requestType === 'Exchange' 
                         ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500' 
                         : 'text-gray-700 hover:bg-gray-100']"
            >
              <div class="flex justify-between items-center">
                <span>Exchanges</span>
                <span class="bg-purple-200 text-purple-800 text-xs font-medium py-1 px-2 rounded-full">
                  {{ getRequestsByType('Exchange').length }}
                </span>
              </div>
            </button>
          </li>
        </ul>
      </nav>
      
      <!-- Navigation Section Only -->
      <div class="mt-6">
        <h3 class="text-sm font-medium text-gray-900 mb-3">Navigation</h3>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div v-if="isLoading" class="text-center text-gray-500">
        <p>Loading requests...</p>
      </div>
      <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-md">
        <p>Error loading requests: {{ error }}</p>
      </div>
      <div v-else>
        <div class="mb-6 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">
            {{ requestType === 'all' ? 'All Requests' : requestType + ' Requests' }}
            <span class="text-sm font-normal text-gray-600 ml-2">
              (Showing {{ filteredRequestsByDate.length }} of {{ allRequests.length }} requests{{ dateFilter !== 'all' ? ' - ' + dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1) : '' }})
            </span>
          </h2>
        </div>
        
        <!-- Tabs -->
        <div class="flex border-b border-gray-200 mb-6">
          <button 
            @click="activeTab = 'pending'"
            :class="['py-3 px-6 text-center font-medium text-sm border-b-2 -mb-px', 
                     activeTab === 'pending' 
                       ? 'border-blue-500 text-blue-600' 
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Requested
            <span class="ml-2 bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded-full">
              {{ getRequestsByStatus('Pending').length }}
            </span>
          </button>
          
          <button 
            @click="activeTab = 'approved'"
            :class="['py-3 px-6 text-center font-medium text-sm border-b-2 -mb-px', 
                     activeTab === 'approved' 
                       ? 'border-blue-500 text-blue-600' 
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Approved
            <span class="ml-2 bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded-full">
              {{ getRequestsByStatus('Approved').length }}
            </span>
          </button>
          
          <button 
            @click="activeTab = 'refunded'"
            :class="['py-3 px-6 text-center font-medium text-sm border-b-2 -mb-px', 
                     activeTab === 'refunded' 
                       ? 'border-blue-500 text-blue-600' 
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Refunded
            <span class="ml-2 bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded-full">
              {{ getRequestsByStatus('Refunded').length }}
            </span>
          </button>
          
          <button 
            @click="activeTab = 'rejected'"
            :class="['py-3 px-6 text-center font-medium text-sm border-b-2 -mb-px', 
                     activeTab === 'rejected' 
                       ? 'border-blue-500 text-blue-600' 
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Rejected
            <span class="ml-2 bg-gray-100 text-gray-800 text-xs font-medium py-1 px-2 rounded-full">
              {{ getRequestsByStatus('Rejected').length }}
            </span>
          </button>
        </div>

        <!-- Date Filters -->
        <div class="flex flex-wrap gap-2 mt-4">
          <button 
            @click="setDateFilter('all')"
            :class="['px-3 py-1.5 text-xs font-medium rounded-full', 
                     dateFilter === 'all' 
                       ? 'bg-blue-500 text-white' 
                       : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50']"
          >
            All Time
          </button>
          <button 
            @click="setDateFilter('today')"
            :class="['px-3 py-1.5 text-xs font-medium rounded-full', 
                     dateFilter === 'today' 
                       ? 'bg-blue-500 text-white' 
                       : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50']"
          >
            Today
          </button>
          <button 
            @click="setDateFilter('yesterday')"
            :class="['px-3 py-1.5 text-xs font-medium rounded-full', 
                     dateFilter === 'yesterday' 
                       ? 'bg-blue-500 text-white' 
                       : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50']"
          >
            Yesterday
          </button>
          <button 
            @click="setDateFilter('week')"
            :class="['px-3 py-1.5 text-xs font-medium rounded-full', 
                     dateFilter === 'week' 
                       ? 'bg-blue-500 text-white' 
                       : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50']"
          >
            Last 7 Days
          </button>
          <button 
            @click="setDateFilter('month')"
            :class="['px-3 py-1.5 text-xs font-medium rounded-full', 
                     dateFilter === 'month' 
                       ? 'bg-blue-500 text-white' 
                       : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50']"
          >
            Last 30 Days
          </button>
        </div>

      <!-- Requested/Pending Tab Content -->
      <div v-show="activeTab === 'pending'">
        <div v-if="getRequestsByStatus('Pending').length === 0" class="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
          <p>No pending requests.</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="request in getRequestsByStatus('Pending')" :key="request._id" class="bg-white p-5 rounded-lg shadow-md border border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Order #{{ request.originalOrder ? request.originalOrder.name : '[Unknown]' }} - <span class="font-normal">{{ request.type }} Request</span>
                </h2>
                <p class="text-sm text-gray-500">{{ new Date(request.createdAt).toLocaleString() }}</p>
              </div>
              <div :class="statusClass(request.status)" class="mt-2 sm:mt-0 text-sm font-medium py-1 px-3 rounded-full">
                {{ request.status }}
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <h3 class="font-semibold text-gray-700 mb-2">Items to Return:</h3>
              <ul>
                <li v-for="item in request.items" :key="item.lineItemId" class="flex justify-between items-center text-sm mb-1">
                  <span>{{ item.title }} (x{{ item.quantity }})</span>
                  <span class="text-gray-600">{{ formatCurrency(item.price) }}</span>
                </li>
              </ul>

              <div v-if="request.type === 'Exchange' && request.exchangeItem" class="mt-3 border-t border-gray-100 pt-3">
                 <h3 class="font-semibold text-gray-700 mb-2">Requested Exchange Item:</h3>
                 <p class="text-sm">{{ request.exchangeItem.title }} (x{{ request.exchangeItem.quantity }})</p>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
              <button @click="updateRequestStatus(request._id, 'Rejected')" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150">
                Reject
              </button>
              <button @click="updateRequestStatus(request._id, 'Approved')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150">
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Approved Tab Content -->
      <div v-show="activeTab === 'approved'">
        <div v-if="getRequestsByStatus('Approved').length === 0" class="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
          <p>No approved requests.</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="request in getRequestsByStatus('Approved')" :key="request._id" class="bg-white p-5 rounded-lg shadow-md border border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Order #{{ request.originalOrder ? request.originalOrder.name : '[Unknown]' }} - <span class="font-normal">{{ request.type }} Request</span>
                </h2>
                <p class="text-sm text-gray-500">{{ new Date(request.createdAt).toLocaleString() }}</p>
              </div>
              <div :class="statusClass(request.status)" class="mt-2 sm:mt-0 text-sm font-medium py-1 px-3 rounded-full">
                {{ request.status }}
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <h3 class="font-semibold text-gray-700 mb-2">Items to Return:</h3>
              <ul>
                <li v-for="item in request.items" :key="item.lineItemId" class="flex justify-between items-center text-sm mb-1">
                  <span>{{ item.title }} (x{{ item.quantity }})</span>
                  <span class="text-gray-600">{{ formatCurrency(item.price) }}</span>
                </li>
              </ul>

              <div v-if="request.type === 'Exchange' && request.exchangeItem" class="mt-3 border-t border-gray-100 pt-3">
                 <h3 class="font-semibold text-gray-700 mb-2">Requested Exchange Item:</h3>
                 <p class="text-sm">{{ request.exchangeItem.title }} (x{{ request.exchangeItem.quantity }})</p>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
              <button @click="updateRequestStatus(request._id, 'Refunded')" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150">
                Mark as Refunded
              </button>
              <button @click="updateRequestStatus(request._id, 'Rejected')" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Refunded Tab Content -->
      <div v-show="activeTab === 'refunded'">
        <div v-if="getRequestsByStatus('Refunded').length === 0" class="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
          <p>No refunded requests.</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="request in getRequestsByStatus('Refunded')" :key="request._id" class="bg-white p-5 rounded-lg shadow-md border border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Order #{{ request.originalOrder ? request.originalOrder.name : '[Unknown]' }} - <span class="font-normal">{{ request.type }} Request</span>
                </h2>
                <p class="text-sm text-gray-500">{{ new Date(request.createdAt).toLocaleString() }}</p>
              </div>
              <div :class="statusClass(request.status)" class="mt-2 sm:mt-0 text-sm font-medium py-1 px-3 rounded-full">
                {{ request.status }}
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <h3 class="font-semibold text-gray-700 mb-2">Items to Return:</h3>
              <ul>
                <li v-for="item in request.items" :key="item.lineItemId" class="flex justify-between items-center text-sm mb-1">
                  <span>{{ item.title }} (x{{ item.quantity }})</span>
                  <span class="text-gray-600">{{ formatCurrency(item.price) }}</span>
                </li>
              </ul>

              <div v-if="request.type === 'Exchange' && request.exchangeItem" class="mt-3 border-t border-gray-100 pt-3">
                 <h3 class="font-semibold text-gray-700 mb-2">Requested Exchange Item:</h3>
                 <p class="text-sm">{{ request.exchangeItem.title }} (x{{ request.exchangeItem.quantity }})</p>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
              <button @click="updateRequestStatus(request._id, 'Completed')" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150">
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Rejected Tab Content -->
      <div v-show="activeTab === 'rejected'">
        <div v-if="getRequestsByStatus('Rejected').length === 0" class="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
          <p>No rejected requests.</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="request in getRequestsByStatus('Rejected')" :key="request._id" class="bg-white p-5 rounded-lg shadow-md border border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Order #{{ request.originalOrder ? request.originalOrder.name : '[Unknown]' }} - <span class="font-normal">{{ request.type }} Request</span>
                </h2>
                <p class="text-sm text-gray-500">{{ new Date(request.createdAt).toLocaleString() }}</p>
              </div>
              <div :class="statusClass(request.status)" class="mt-2 sm:mt-0 text-sm font-medium py-1 px-3 rounded-full">
                {{ request.status }}
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <h3 class="font-semibold text-gray-700 mb-2">Items to Return:</h3>
              <ul>
                <li v-for="item in request.items" :key="item.lineItemId" class="flex justify-between items-center text-sm mb-1">
                  <span>{{ item.title }} (x{{ item.quantity }})</span>
                  <span class="text-gray-600">{{ formatCurrency(item.price) }}</span>
                </li>
              </ul>

              <div v-if="request.type === 'Exchange' && request.exchangeItem" class="mt-3 border-t border-gray-100 pt-3">
                 <h3 class="font-semibold text-gray-700 mb-2">Requested Exchange Item:</h3>
                 <p class="text-sm">{{ request.exchangeItem.title }} (x{{ request.exchangeItem.quantity }})</p>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
              <button @click="updateRequestStatus(request._id, 'Approved')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150">
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      requests: [],
      isLoading: true,
      error: null,
      activeTab: 'pending', // Default to showing pending requests
      dateFilter: 'all', // Default to showing all requests
      requestType: 'all', // Default to showing all request types
    };
  },
  async created() {
    await this.fetchRequests();
  },
  computed: {
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
        // THIS IS THE FIX: We must pass the status in the request body.
        const response = await axios.patch(`http://localhost:3001/api/requests/${id}`, { status });
        const index = this.requests.findIndex(req => req._id === id);
        if (index !== -1) {
          this.requests[index].status = response.data.status;
        }
      } catch (err) {
        // More descriptive error handling for the UI
        const errorMessage = (err.response && err.response.data && err.response.data.message) || 'An unknown error occurred while updating the status.';
        alert(`Failed to update request: ${errorMessage}`); // Using alert for immediate feedback in admin panel
        console.error('Update Request Error:', err);
      }
    },
    // Get requests by status
    getRequestsByStatus(status) {
      return (this.requestsByStatus && this.requestsByStatus[status]) || [];
    },
    formatCurrency(value) {
        if (!value) return '$0.00';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
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
    }
  },
};
</script>

