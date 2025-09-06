# 🛍️ ShopHere - Full-Stack E-commerce Platform

---

## 🚀 About The Project

**ShopHere** is a complete and modern e-commerce platform built with a Node.js, Express, and MongoDB backend, and a dynamic frontend using vanilla HTML, CSS, and JavaScript. This project was developed to showcase full-stack development skills, from creating a secure RESTful API to implementing a rich and responsive user interface.

The goal was to create a fluid and secure shopping experience by incorporating essential features of a real-world e-commerce site, such as user authentication, cart management, order history, and a complete checkout flow.

---

## ✨ Key Features

### Backend & API

- **RESTful API:** Robust and scalable architecture with Express.
- **JWT Authentication:** Secure login and registration system using JSON Web Tokens.
- **Password Recovery:** Complete "Forgot Password" flow with secure, expiring token generation.
- **Strong Password Validation:** Backend and frontend validation to enforce strong password policies (min. 8 characters, uppercase, lowercase, number, and special character).
- **Order Management:** Logic to create, view, and cancel orders.
- **Stock Control:** Inventory is automatically updated when an order is placed or canceled.
- **MongoDB Database:** Data modeling with Mongoose for Products, Users, Carts, and Orders.

### Frontend & UX

- **Persistent Shopping Cart:** Works for both logged-in users (synced with the database) and guests (using `localStorage`).
- **Responsive Interface:** Modern and adaptive design for desktops and mobile devices.
- **Animated Transitions:** Smooth animations between pages and on user actions for a more fluid experience.
- **Visual Notifications:** Instant feedback (toasts) when adding items to the cart.
- **Password Visibility Toggle:** An icon to show/hide the password, improving usability in forms.
- **Dynamic Pages:** Product and listing page content is loaded dynamically from the API.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Token (JWT), bcrypt.js
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Environment:** Dotenv
- **Utilities:** Nodemon

---

## 🏁 Getting Started

Follow the steps below to set up and run the project in your local environment.

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (a local server or a MongoDB Atlas instance)

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/AnnyKaah/ecommecer-JS-hash.git
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the project root and add the following variables:

    ```env
    # Server Port
    PORT=3000

    # MongoDB Connection URI
    MONGO_URI=mongodb://localhost:27017/shophere

    # JWT Secret
    JWT_SECRET=your_super_secret_key
    ```

4.  **Seed the database (Optional but recommended):**
    Run the seeder to add sample products to the database.

    ```sh
    npm run data:import
    ```

    _To clear the database, use `npm run data:destroy`._

5.  **Start the server:**

    ```sh
    npm run dev
    ```

6.  **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

---

## 📝 API Endpoints

The API follows RESTful principles. All private endpoints require a `Bearer Token` in the authorization header.

- `POST /api/auth/login`: Authenticates a user.
- `POST /api/auth/register`: Registers a new user.
- `POST /api/auth/forgot-password`: Starts the password recovery flow.
- `PUT /api/auth/reset-password/:token`: Resets the password with a valid token.

- `GET /api/products`: Returns all products.
- `GET /api/products/:id`: Returns a specific product.

- `GET /api/cart`: (Private) Returns the logged-in user's cart.
- `POST /api/cart`: (Private) Adds an item to the cart.
- `PUT /api/cart/:productId`: (Private) Updates an item's quantity.
- `DELETE /api/cart/:productId`: (Private) Removes an item from the cart.

- `POST /api/orders`: (Private) Creates a new order from the cart.
- `GET /api/orders/myorders`: (Private) Returns the logged-in user's orders.
- `PUT /api/orders/:id/cancel`: (Private) Cancels an order.

---

## 🖼️ Screenshots

<p align="center">
  <img src="https://github.com/AnnyKaah/ecommecer-JS-hash/raw/main/docs/screenshots/homepage.png" alt="Homepage" width="200" />
  <img src="https://github.com/AnnyKaah/ecommecer-JS-hash/raw/main/docs/screenshots/product-page.png" alt="Product Page" width="200" />
</p>
<p align="center">
  Homepage &nbsp;&nbsp;&nbsp; Product Page
</p>

<p align="center">
  <img src="https://github.com/AnnyKaah/ecommecer-JS-hash/raw/main/docs/screenshots/cart.png" alt="Shopping Cart" width="200" />
  <img src="https://github.com/AnnyKaah/ecommecer-JS-hash/raw/main/docs/screenshots/login-page.png" alt="Login Page" width="200" />
</p>
<p align="center">
  Shopping Cart &nbsp;&nbsp;&nbsp; Login Page
</p>


---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ by <strong>Anny Karoline</strong>
</p>
<p align="center">
  <a href="https://br.linkedin.com/in/annykarolinedecarvalhomartins" target="_blank">LinkedIn</a> • 
  <a href="https://github.com/AnnyKaah" target="_blank">GitHub</a> • 
  <a href="https://github.com/AnnyKaah/meu-portifolio#" target="_blank">Portfolio</a>
</p>
