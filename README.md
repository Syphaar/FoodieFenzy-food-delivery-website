# Food Delivery Website

A full-stack food ordering platform with a customer-facing restaurant website, an admin dashboard, and a Node.js API. The project demonstrates end-to-end product thinking across menu browsing, authentication, cart management, checkout, payment confirmation, and order administration.

## Project Highlights

- Customer storefront for browsing menu items, viewing restaurant pages, managing cart items, and placing orders.
- JWT-based user authentication with protected routes for cart, checkout, and order history.
- Admin dashboard for adding menu items, uploading product images, managing item listings, and updating order statuses.
- Stripe Checkout integration for online payments, with support for cash-on-delivery orders.
- MongoDB persistence for users, menu items, cart entries, and orders.
- Image upload support using Multer and static file serving from the backend.
- Separate frontend applications for customers and administrators, both powered by React and Vite.

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Framer Motion
- React Hot Toast
- React Icons

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcrypt
- Multer
- Stripe
- dotenv

## Application Structure

```text
food-delivery-website/
+-- admin/          # Admin dashboard for menu and order management
+-- backend/        # Express API, database models, controllers, routes, uploads
+-- restaurant/     # Customer-facing restaurant storefront
```

## Core Features

### Customer App

- Browse restaurant pages, menu items, and special offers.
- Register and log in securely.
- Add items to cart and update item quantities.
- Checkout with customer delivery details.
- Pay online through Stripe Checkout or choose cash on delivery.
- View order history and payment verification status.

### Admin App

- Add new food items with name, description, category, price, rating, and image.
- View all menu items.
- Delete menu items.
- View customer orders.
- Update order status from processing to delivery stages.

### Backend API

- User registration and login.
- Menu item creation, retrieval, and deletion.
- Authenticated cart retrieval, creation, update, deletion, and clearing.
- Authenticated customer order creation and order history.
- Stripe payment session creation and confirmation.
- Admin order retrieval and status updates.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB database
- Stripe account for online payments

### Installation

Install dependencies for each part of the project:

```bash
cd backend
npm install

cd ../restaurant
npm install

cd ../admin
npm install
```

### Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=4000
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:5173
```

The backend currently connects to MongoDB from `backend/config/db.js`. For production readiness, move the MongoDB connection string into an environment variable before deployment.

### Run Locally

Start the backend API:

```bash
cd backend
npm start
```

Start the customer storefront:

```bash
cd restaurant
npm run dev
```

Start the admin dashboard:

```bash
cd admin
npm run dev
```

By default, the backend runs on:

```text
http://localhost:4000
```

The frontend apps are served by Vite, commonly on:

```text
http://localhost:5173
http://localhost:5174
```

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/user/register` | Register a new user |
| `POST` | `/api/user/login` | Log in and receive a JWT |
| `GET` | `/api/items` | Get all menu items |
| `POST` | `/api/items` | Create a menu item with image upload |
| `DELETE` | `/api/items/:id` | Delete a menu item |
| `GET` | `/api/cart` | Get authenticated user's cart |
| `POST` | `/api/cart` | Add item to cart |
| `PUT` | `/api/cart/:id` | Update cart item quantity |
| `DELETE` | `/api/cart/:id` | Remove item from cart |
| `POST` | `/api/cart/clear` | Clear authenticated user's cart |
| `POST` | `/api/orders` | Create an order |
| `GET` | `/api/orders` | Get authenticated user's orders |
| `GET` | `/api/orders/confirm` | Confirm Stripe payment session |
| `GET` | `/api/orders/getall` | Get all orders for admin |
| `PUT` | `/api/orders/getall/:id` | Update any order for admin |

## Scripts

### Backend

```bash
npm start
```

Runs the Express server with Nodemon.

### Restaurant and Admin

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## What This Project Demonstrates

- Full-stack JavaScript development using React, Node.js, Express, and MongoDB.
- REST API design with controllers, routes, middleware, and database models.
- Authentication and route protection using JWT.
- File upload handling for real product images.
- Payment workflow integration with Stripe Checkout.
- Separation of customer and admin responsibilities across two frontend clients.
- Practical ecommerce flows including cart state, checkout, order history, and admin fulfillment.

## Future Improvements

- Move MongoDB credentials fully into environment variables.
- Add admin authentication and role-based access control.
- Add automated tests for API endpoints and checkout flows.
- Add deployment configuration for the API and both frontend clients.
- Improve centralized API configuration for frontend base URLs.
