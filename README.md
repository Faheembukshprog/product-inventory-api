# Product Inventory API

A RESTful API for managing a product inventory, built with Node.js, Express, MongoDB, and Mongoose. It includes JWT authentication, product CRUD, image uploads, filtering, pagination, and category statistics.

> Created for DigiSkills 3.0 Batch 04, FSD404 (Full Stack Development with MERN), Hands-on Exercise 4.

## Features

- Register and log in with JWT authentication; passwords are hashed with bcrypt.
- Create, view, update, and delete products.
- Upload product images with a 5 MB limit.
- Filter products by category and price range; search by product name.
- Sort and paginate product listings.
- View product and stock statistics grouped by category.
- Validate request data and handle errors centrally.
- Apply Helmet security headers, configurable CORS, and rate limiting.

## Tech stack

- Node.js and Express
- MongoDB and Mongoose
- JSON Web Tokens and bcryptjs
- Multer for image uploads
- express-validator for request validation

## Requirements

- Node.js and npm
- A MongoDB database, either local or MongoDB Atlas

## Getting started

1. Clone the repository and enter its directory:

   ```bash
   git clone https://github.com/<your-username>/product-inventory-api.git
   cd product-inventory-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your local environment file by copying `.env.example` to `.env`.

   PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   macOS/Linux:

   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and set `MONGO_URI` to your MongoDB connection string and `JWT_SECRET` to a long, random secret. Do not commit `.env`.

5. Start the API:

   ```bash
   npm run dev
   ```

   Or start without the development watcher:

   ```bash
   npm start
   ```

By default, the API listens on `http://localhost:5000`. Verify it is running at `GET /health`.

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Runtime environment; enables request logging in development | `development` |
| `PORT` | HTTP port | `5000` |
| `CLIENT_URL` | Allowed CORS origin | `*` |
| `MONGO_URI` | MongoDB connection string (**required**) | — |
| `JWT_SECRET` | Secret used to sign JWTs (**set a strong value**) | — |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in milliseconds | `900000` |
| `RATE_LIMIT_MAX` | Maximum requests per IP during the window | `100` |

## API

All routes use the base URL `http://localhost:5000`. Protected routes require the token returned by registration or login:

```http
Authorization: Bearer <token>
```

### Health and authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | No | API health check |
| `POST` | `/api/auth/register` | No | Register a user and return a JWT |
| `POST` | `/api/auth/login` | No | Log in and return a JWT |
| `GET` | `/api/auth/me` | Yes | Get the authenticated user's profile |

Register and login accept JSON. Example registration body:

```json
{
  "name": "Ali Raza",
  "email": "ali@example.com",
  "password": "secret123"
}
```

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products` | No | List products |
| `GET` | `/api/products/:id` | No | Get one product |
| `GET` | `/api/products/stats/summary` | No | Get category statistics |
| `POST` | `/api/products` | Yes | Create a product |
| `PUT` | `/api/products/:id` | Yes | Update a product |
| `DELETE` | `/api/products/:id` | Yes | Delete a product |

Product creation and updates accept `multipart/form-data`; use the `image` field for an optional image. Allowed extensions are `.jpg`, `.jpeg`, `.png`, `.webp`, and `.gif` (maximum file size: 5 MB). Images are served from `/uploads/`.

Example product fields:

| Field | Description |
|---|---|
| `name` | Product name |
| `description` | Product description |
| `price` | Product price |
| `category` | Product category |
| `stock` | Available quantity |
| `image` | Optional image file |

### Product list query parameters

| Parameter | Description |
|---|---|
| `category` | Match a category |
| `search` | Case-insensitive search in product names |
| `minPrice` | Minimum product price |
| `maxPrice` | Maximum product price |
| `sort` | `price_asc`, `price_desc`, or `oldest`; defaults to newest first |
| `page` | Page number; defaults to `1` |
| `limit` | Results per page; defaults to `10` |

Example:

```text
GET /api/products?category=Electronics&search=mouse&minPrice=10&maxPrice=100&sort=price_asc&page=1&limit=10
```

The category statistics endpoint returns product count, average price, total stock, and minimum and maximum price for each category.

## Project structure

```text
.
├── config/          # MongoDB connection
├── controllers/     # Authentication and product handlers
├── middleware/      # Authentication, uploads, validation, and errors
├── models/          # Mongoose User and Product models
├── routes/          # API route definitions
├── uploads/         # Uploaded product images
├── validators/      # Request validation rules
├── server.js        # Express application entry point
└── package.json
```

## License

This project is licensed under the MIT License.
