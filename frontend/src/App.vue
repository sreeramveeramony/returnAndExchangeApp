<template>
  <div id="app" class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
    <!-- Show header based on environment or route -->
    <header v-if="showHeader" class="bg-white shadow-md border-b border-gray-200">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo and App Name -->
          <div class="flex items-center space-x-3 flex-shrink-0">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight">REEX</h1>
              <p class="text-xs text-gray-500 mt-0.5">Enterprise Return & Exchange Management</p>
            </div>
          </div>
          
          <!-- Navigation - Centered -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link to="/" class="text-gray-600 hover:text-blue-700 font-medium transition duration-200 px-4 py-2 rounded-lg text-sm">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </span>
            </router-link>
            <router-link to="/admin" class="text-gray-600 hover:text-blue-700 font-medium transition duration-200 px-4 py-2 rounded-lg text-sm">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </span>
            </router-link>
            <a href="#" class="text-gray-600 hover:text-blue-700 font-medium transition duration-200 px-4 py-2 rounded-lg text-sm">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Support
              </span>
            </a>
            <a href="#" class="text-gray-600 hover:text-blue-700 font-medium transition duration-200 px-4 py-2 rounded-lg text-sm">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Security
              </span>
            </a>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button class="text-gray-600 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <footer v-if="showHeader" class="text-center py-5 text-gray-500 text-sm bg-white border-t border-gray-200 mt-auto">
      <div class="container mx-auto px-4">
        <p>&copy; {{ new Date().getFullYear() }} REEX - Enterprise Return & Exchange Management Platform. All rights reserved.</p>
      </div>
    </footer>
    
    <!-- Customer pages footer without header -->
    <footer v-else class="text-center py-4 text-gray-500 text-sm">
      <p>Powered by <span class="font-semibold text-gray-700">REEX</span></p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    showHeader() {
      // Check environment variable to determine interface type
      // If VUE_APP_INTERFACE is 'admin', show header (admin interface)
      // Otherwise, don't show header for customer interface
      return process.env.VUE_APP_INTERFACE === 'admin';
    }
  },
  mounted() {
    // If running in admin mode and on root path, redirect to admin
    if (process.env.VUE_APP_INTERFACE === 'admin' && this.$route.path === '/') {
      this.$router.push('/admin');
    }
  }
};
</script>

<style>
/* More specific global styles if needed */
</style>
