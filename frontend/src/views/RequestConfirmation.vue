<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full mx-auto">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-center">
          <h1 class="text-2xl font-bold text-white">Return & Exchange Portal</h1>
        </div>
        
        <div class="p-8">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg class="h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 class="mt-6 text-2xl font-bold text-gray-900">Request Submitted!</h2>
            <p class="mt-4 text-gray-600">
              Your return/exchange request has been successfully submitted. You will receive an email confirmation shortly with the next steps.
            </p>
            
            <div class="mt-8 bg-blue-50 rounded-lg p-4 text-left">
              <h3 class="text-sm font-semibold text-blue-800 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                What to expect next
              </h3>
              <ul class="mt-2 space-y-2">
                <li class="flex items-start">
                  <svg class="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span class="text-sm text-blue-700">Email confirmation with request details</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span class="text-sm text-blue-700">Review and approval within 1-2 business days</span>
                </li>
                <li class="flex items-start">
                  <svg class="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span class="text-sm text-blue-700">Shipping instructions for returns or exchanges</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="mt-10">
            <router-link to="/" class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Start Another Request
            </router-link>
            
            <div class="mt-6 text-center">
              <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-700">
                Need help? Contact support
              </a>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-8 py-6 text-center">
          <p class="text-xs text-gray-500">Thank you for choosing us</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequestConfirmation',
}
</script>
