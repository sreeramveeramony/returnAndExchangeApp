module.exports = {
  transpileDependencies: [
    // Add any dependencies that need transpilation here
  ],
  
  // Configure the development server
  devServer: (function() {
    // Determine port based on mode
    // For admin mode, use port 8081; for other modes, use 8080
    const mode = process.env.VUE_CLI_MODE || 'development';
    const port = mode === 'admin' ? 8081 : 8080;
    
    return {
      port: port, // Admin runs on 8081, customer on 8080
      proxy: {
        '/api': {
          target: 'http://localhost:3001', // Backend server
          changeOrigin: true,
          pathRewrite: {
            '^/api': '' // Remove /api prefix when forwarding to backend
          }
        }
      }
    };
  })()
}