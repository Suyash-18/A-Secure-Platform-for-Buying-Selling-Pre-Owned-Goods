# A Secure Platform for Buying & Selling Pre-Owned Goods

A full-stack web application that enables users to securely buy and sell pre-owned products with real-time chat, online payments, and location visibility.

This project focuses on **security, trust, and usability** in second-hand marketplaces.

---

## 🌐 Live Demo

- **Frontend (Vercel):** <ADD YOUR VERCEL LINK HERE>
- **Backend API (Render):** <ADD YOUR RENDER LINK HERE>
this is with om
---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS / CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Integrations
- Google OAuth
- Razorpay Payment Gateway
- Map integration for product location

---

## 🚀 Features

- **User Authentication**
  - Secure user signup & login using **JWT**
  - Login with **Google OAuth**

- **Product Listing**
  - Sellers can list products using a sell form
  - Upload **product images** and **purchase bills**
  - Product details stored securely in database

- **Real-Time Chat System**
  - Buyers and sellers can chat with each other
  - **Persistent chat** (messages remain after refresh/login)
  - Enables direct communication before purchase

- **Payments**
  - Integrated **Razorpay payment gateway**
  - Secure online payments for product purchases

- **Product Location**
  - Map view showing the **location of the product**
  - Helps buyers understand where the item belongs to

---

## 📸 Screenshots

> Add screenshots of:
- Home page
![alt text](image.png)
- Product listing page
![alt text](image-1.png)
- Chat interface
![alt text](image-2.png)
- Payment screen
![alt text](image-3.png)
- Map view
![alt text](image-4.png)


## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB
- npm or yarn

---

### Backend Setup
```bash
cd server
npm install
npm start

### Frontend Setup
``` bash
cd client
npm install 
npm run dev

## ⚙️ Environment Variables

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
GOOGLE_CLIENT_ID=your_google_client_id