<template>
  <div id="app" class="bg-gray-50 min-h-screen">
    <header class="bg-gradient-to-r from-gray-100 to-blue-100 shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center">
          <!-- Logo and App Name -->
          <div class="flex items-center space-x-3 flex-shrink-0">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">REEX</h1>
              <p class="text-xs text-gray-500">Return & Exchange Portal</p>
            </div>
          </div>
          
          <!-- Navigation - Centered -->
          <div class="hidden md:flex justify-center flex-grow">
            <nav class="flex items-center space-x-2">
              <router-link to="/" class="text-gray-600 hover:text-blue-600 font-medium transition duration-200 px-3 py-2 rounded-md">
                Home
              </router-link>
              <router-link to="/admin" class="text-gray-600 hover:text-blue-600 font-medium transition duration-200 px-3 py-2 rounded-md">
                Admin
              </router-link>
              <a href="#" class="text-gray-600 hover:text-blue-600 font-medium transition duration-200 px-3 py-2 rounded-md">
                Support
              </a>
              <a href="#" class="text-gray-600 hover:text-blue-600 font-medium transition duration-200 px-3 py-2 rounded-md">
                Security
              </a>
            </nav>
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
    <footer class="text-center py-4 text-gray-500 text-sm bg-white border-t">
      <div class="container mx-auto px-4">
        &copy; {{ new Date().getFullYear() }} REEX - Return & Exchange Portal. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* More specific global styles if needed */
</style>
