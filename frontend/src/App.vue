<template>
  <div id="app" class="bg-gray-50 min-h-screen">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-800">
          Return & Exchange Portal
        </h1>
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <footer class="text-center py-4 text-gray-500 text-sm">
      Powered by YourBrand
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
