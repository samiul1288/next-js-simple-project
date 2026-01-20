# Next Items App

A simple full-stack application built with **Next.js 15/16 (App Router)** and **Express.js**.  
The app demonstrates public and protected routes, mock authentication, and CRUD operations using a REST API.

---

## 🚀 Live Links

- **Frontend (Vercel):**  
  https://next-js-simple-project-cr7a.vercel.app

- **Backend API (Render):**  
  https://next-js-simple-project.onrender.com

- **API Health Check:**  
  https://next-js-simple-project.onrender.com/health

---

## 🔐 Demo Login Credentials (Mock Authentication)

- **Email:** `test@example.com`  
- **Password:** `password123`

---

## 🛠️ Technologies Used

- **Next.js 15/16** (App Router)
- **React**
- **TypeScript**
- **Express.js**
- **Node.js**
- **Tailwind CSS**
- **Cookie-based Authentication**
- **Vercel** (Frontend Deployment)
- **Render** (Backend Deployment)

---

## 📂 Project Features

### 1️⃣ Landing Page
- Publicly accessible
- Includes **7 relevant sections**
- Navbar and Footer included
- Navigation links to Home, Items, Login, and Add Item (conditional)

### 2️⃣ Authentication (Mock Login)
- Hardcoded email & password
- Authentication stored using **cookies**
- Protected routes using **Next.js middleware**
- Successful login redirects to **Items page**

### 3️⃣ Item List Page
- Publicly accessible
- Fetches item data from **Express.js API**
- Displays item name, description, price, image, category, and rating

### 4️⃣ Item Details Page
- Publicly accessible
- Shows full details of a single item

### 5️⃣ Protected Add Item Page
- Accessible **only when logged in**
- Login required to access `/add-item`
- Form to add a new item
- Item data stored via **Express.js server**
- Toast notification shown on successful item creation

### 6️⃣ Logout
- Clears authentication cookies
- Prevents access to protected routes after logout

---

## 🛣️ Route Summary

### Frontend Routes
- `/` → Landing Page
- `/login` → Login Page
- `/items` → Item List Page (Public)
- `/items/[id]` → Item Details Page (Public)
- `/add-item` → Add Item Page (Protected)

### API Routes (Next.js)
- `/api/login` → Mock login
- `/api/logout` → Logout
- `/api/items` → Get items / Add item (protected POST)

### Backend Routes (Express.js)
- `/health` → API health check
- `/api/items` → Get all items / Create item
- `/api/items/:id` → Get single item

---

## ⚙️ Setup & Installation (Local)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/samiul1288/next-js-simple-project.git
cd next-js-simple-project
