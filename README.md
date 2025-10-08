MEVN Stack Return Prime Clone
This is a full-stack application that mimics the return and exchange functionality of the Shopify app "Return Prime". It's built with the MEVN stack (MongoDB, Express.js, Vue.js, Node.js).

## Port Configuration
- Customer Interface: Runs on port 8080 (no header/navigation)
- Admin Interface: Runs on port 8081 (with full header/navigation)
- Backend: Runs on port 3001

Features
Customer-Facing Flow: Customers can look up their order with an order number and email, select items for return or exchange, and submit a request.

Admin Dashboard: Admins can view all submitted requests, and approve or reject them.

Shopify Integration: The backend communicates with the Shopify Admin API to fetch order details.

Modular Design: The project is structured with a separate frontend and backend, promoting separation of concerns.

Prerequisites
Node.js and npm

MongoDB instance (local or cloud like MongoDB Atlas)

A Shopify development store with Admin API access credentials.

Setup Instructions
Backend
Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file by copying the example:

cp .env.example .env

Edit the .env file with your credentials:

MONGO_URI: Your MongoDB connection string.

SHOPIFY_SHOP_URL: Your Shopify store URL (e.g., your-store.myshopify.com).

SHOPIFY_ACCESS_TOKEN: Your Shopify Admin API access token.

Start the backend server:

npm run dev

The server will be running on http://localhost:3001.

Frontend
Navigate to the frontend directory:

cd ../frontend

Install dependencies:

npm install

Start the Vue development server:

npm run serve

The frontend will be running on http://localhost:8080.

How to Use
Open your browser to http://localhost:8080 to access the customer portal.

Enter a valid order number and email from your Shopify store.

Select items for return or exchange and submit.

Navigate to http://localhost:8080/admin to view and manage the requests in the admin dashboard.

API Version
This application is configured to use the 2025-10 version of the Shopify Admin API.