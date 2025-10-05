<template>
  <div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md text-center">
    <svg class="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h2 class="text-2xl font-semibold text-gray-800 mt-4">Request Submitted!</h2>
    <p class="text-gray-600 mt-2">
      Your return/exchange request has been successfully submitted. You will receive an email confirmation shortly with the next steps.
    </p>
    <div class="mt-6">
      <router-link to="/" class="text-blue-600 hover:underline">Start another request</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequestConfirmation',
}
</script>
