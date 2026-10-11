# Product Inventory CRUD API

A complete backend application built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **Mongoose**.

> DigiSkills 3.0 Batch-04 - FSD404 (Full Stack Development with MERN) - Hands-on Exercise No. 4

## Features

- JWT-based authentication (register + login)
- bcryptjs password hashing
- Complete CRUD for products (create, read all, read one, update, delete)
- Image upload via Multer
- Filtering by category, search by name, sorting by price/date, pagination
- Aggregation API (product count + average price grouped by category)
- Centralized error handling + 404 middleware
- Security middleware: Helmet, CORS, express-rate-limit
- Input validation with express-validator

## Folder Structure

```
product-inventory-api/
├── server.js                  # Entry point, middleware, route mounting
├── package.json
├── .env.example
├── config/
│   └── db.js                  # Mongoose connection helper
├── models/
│   ├── User.js                # User schema + password hashing
│   └── Product.js             # Product schema + validation + indexes
├── controllers/
│   ├── authController.js      # Register + Login + Me
│   └── productController.js   # CRUD + aggregation
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
├── middleware/
│   ├── authMiddleware.js      # protect + admin
│   ├── errorMiddleware.js     # notFound + errorHandler
│   ├── uploadMiddleware.js    # multer config
│   └── validateMiddleware.js  # express-validator result collector
├── validators/
│   ├── authValidator.js
│   └── productValidator.js
└── uploads/
    └── products/              # Uploaded images saved here
```

## Installation

```bash
git clone <your-repo-url>
cd product-inventory-api
npm install
cp .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET
npm run dev   # or npm start
```

## API Endpoints

| Method | Endpoint                    | Auth | Description                                      |
|--------|----------------------------|------|--------------------------------------------------|
| POST   | /api/auth/register          | No   | Register a new user (returns JWT)               |
| POST   | /api/auth/login             | No   | Login existing user (returns JWT)                |
| GET    | /api/auth/me                | Yes  | Return current user profile                      |
| GET    | /api/products               | No   | List products (filter/search/sort/paginate)     |
| GET    | /api/products/:id           | No   | Get single product                               |
| POST   | /api/products               | Yes  | Create product (multipart/form-data, image)     |
| PUT    | /api/products/:id           | Yes  | Update product                                   |
| DELETE | /api/products/:id           | Yes  | Delete product                                   |
| GET    | /api/products/stats/summary| No   | Aggregation: count + avg price by category      |

### Query parameters for `GET /api/products`

- `category` - filter by category (e.g. `?category=Electronics`)
- `search`   - search by name (regex, case-insensitive)
- `sort`     - `price_asc` | `price_desc` | `oldest` | default newest
- `page`     - page number (default 1)
- `limit`    - page size (default 10)
- `minPrice` / `maxPrice` - price range

## Example Requests (Postman / Thunder Client)

### Register
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Ali Raza",
  "email": "ali@example.com",
  "password": "secret123"
}
```

### Create Product (with image)
```http
POST http://localhost:5000/api/products
Content-Type: multipart/form-data
Authorization: Bearer <JWT>

name: Wireless Mouse
description: Logitech wireless mouse
price: 1500
category: Electronics
stock: 25
image: <file>
```

## License

MIT - free for educational use.
