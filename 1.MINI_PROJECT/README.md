# Article Management System API

A RESTful API for managing articles with user authentication, built with Node.js, Express, and PostgreSQL.

## Features

- User registration and login with JWT authentication
- CRUD operations for articles (create, read, update, delete)
- Authorization (users can only access/manage their own articles)
- Pagination and filtering articles by status (draft/published)
- Search articles by keyword in title
- Word frequency counter algorithm

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd 1.MINI_PRIOJECT
```

2. Install dependencies

```bash
npm install
```

3. Create a PostgreSQL database

4. Configure environment variables
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your database credentials and JWT secret

```bash
cp .env.example .env
```

5. Run database migrations

```bash
npm run db_create
```

6. Run database migrations

```bash
npm run migrate
```

7. Start the server

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Articles

- `GET /api/articles` - Get all articles (with pagination and filters)
- `GET /api/articles/:id` - Get a specific article
- `POST /api/articles` - Create a new article
- `PUT /api/articles/:id` - Update an article
- `DELETE /api/articles/:id` - Delete an article
- `GET /api/articles?search=keyword` - Search articles by keyword in title

## Testing

To test the API endpoints, you can use tools like Postman or curl.

### Example Requests

#### Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

#### Create an article (with JWT token)

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Test Article", "body": "This is a test article", "status": "draft"}'
```

#### Get articles with pagination and filtering

```bash
curl -X GET "http://localhost:3000/api/articles?page=1&limit=10&status=published" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Search articles by keyword

```bash
curl -X GET "http://localhost:3000/api/articles?search=golang" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## SQL Optimization

Two ways to optimize slow queries:

1. Create indexes on frequently queried columns (e.g., user_id, status, title)
2. Use query optimization techniques like proper JOIN strategies and limiting result sets

## Word Frequency Counter

The API includes a utility function that counts word frequency in a text, ignoring capitalization.

## System Design for Scalability

To handle 1 million users:

1. Implement horizontal scaling with load balancing
2. Use connection pooling for database connections
3. Implement caching with Redis for frequently accessed data
4. Consider database sharding for large datasets
5. Use asynchronous processing for time-consuming operations
6. Implement rate limiting to prevent abuse

## License

MIT
