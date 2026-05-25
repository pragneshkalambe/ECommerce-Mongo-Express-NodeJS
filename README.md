# Ecommerce Platform (SSR) with Session Authentication

A full-stack ecommerce web application built using **Node.js**, **Express.js**, **MongoDB**, and **Handlebars**. The application supports user authentication, product management, shopping cart functionality, real-time updates, image uploads, and secure online payments through Razorpay.

## Features

### User Features
- User Registration and Login
- Session-Based Authentication
- Product Listing and Product Details
- Add to Cart and Remove from Cart
- Quantity Management
- Checkout Process
- Razorpay Payment Integration
- Order Placement and Tracking

### Admin Features
- Product Management
- Add New Products
- Edit Existing Products
- Delete Products
- Image Upload Support
- Category-Based Product Handling

### Technical Features
- RESTful API Architecture
- Session Authentication and Route Protection
- Real-Time Cart Updates using Socket.IO
- Image Uploads using Multer
- Razorpay Payment Gateway Integration
- MongoDB Database Integration
- Dynamic Server-Side Rendering using Handlebars

---

## Tech Stack

### Frontend
- Handlebars (SSR)
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- Express Session
- Session-Based Authentication

### Additional Libraries
- Multer
- Socket.IO
- Razorpay

### Tools
- Git
- GitHub
- Postman

---

## Project Structure

```bash
project-root/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── views/
├── public/
├── uploads/
├── config/
├── app.js
├── package.json
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

SESSION_SECRET=your_session_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

### Run Application

```bash
npm start
```

or

```bash
npm run dev
```

Application will run at:

```bash
http://localhost:5000
```

---

## Authentication Flow

1. User registers an account.
2. User logs in successfully.
3. Session is created and stored on the server.
4. Protected routes verify authenticated sessions.
5. Unauthorized users are redirected to login.

---

## Payment Flow

1. User adds products to cart.
2. User proceeds to checkout.
3. Razorpay order is created on the backend.
4. Payment is completed through Razorpay.
5. Payment signature is verified securely.
6. Order is successfully stored in the database.

---

## Learning Outcomes

Through this project I gained practical experience with:

- Building server-side rendered applications using Handlebars
- Designing RESTful APIs using Express.js
- Session-based authentication and authorization
- MongoDB data modeling
- Payment gateway integration using Razorpay
- Real-time communication using Socket.IO
- File upload handling using Multer
- Full-stack application architecture

---

## Future Improvements

- Admin Dashboard Analytics
- Product Search and Filters
- Wishlist Functionality
- Product Reviews and Ratings
- Order History Dashboard
- Deployment on Cloud Platforms

---

## Author

**Pragnesh Kalambe**

GitHub: https://github.com/pragneshkalambe

LinkedIn: https://linkedin.com/in/pragnesh-kalambe-a679682b4
