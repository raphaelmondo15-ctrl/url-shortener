# URL Shortener API

A production-ready URL shortener backend built with **Node.js**, **Express**, and **PostgreSQL**. The API allows users to create shortened URLs, redirect users to original URLs, track clicks, export analytics, and manage links.

The project includes validation, database integration, automated testing, API documentation with Swagger, and deployment-ready configuration.

---

## Features

### Link Management

* Create short URLs from long URLs
* Generate automatic short codes
* Support custom vanity codes
* Prevent duplicate short codes
* Delete existing links
* Retrieve link metadata

### Redirection

* Redirect users from short URLs to original URLs
* Track every redirect
* Handle expired links
* Return proper HTTP status codes

### Analytics

* Track:

  * Number of clicks
  * User agent
  * Referrer
  * Click timestamps

* View click logs

* Export click history as CSV

### Validation & Security

* Request validation using Zod
* Parameterized PostgreSQL queries
* Environment variable configuration
* Security middleware support

### Developer Features

* Swagger API documentation
* Automated API testing
* PostgreSQL database schema creation
* Production-ready project structure

---

# Tech Stack

## Backend

* Node.js
* Express.js
* PostgreSQL
* pg (node-postgres)

## Validation

* Zod

## Testing

* Node.js Test Runner
* Supertest

## Documentation

* Swagger UI
* swagger-jsdoc

## Security

* Helmet
* CORS

---

# Project Structure

```
url-shortener/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── link.controller.js
│   │   └── health.controller.js
│   │
│   ├── middleware/
│   │   └── validateLink.middleware.js
│   │
│   ├── routes/
│   │   └── link.routes.js
│   │
│   ├── schemas/
│   │   └── links.schema.js
│   │
│   ├── services/
│   │   ├── link.service.js
│   │   └── shortCode.service.js
│   │
│   ├── sql/
│   │   └── schema.js
│   │
│   ├── utils/
│   │   ├── csv.js
│   │   └── pagination.js
│   │
│   ├── app.js
│   └── server.js
│
├── test/
│   ├── health.test.js
│   ├── link.test.js
│   ├── redirect.test.js
│   ├── clicks.test.js
│   ├── security.test.js
│   └── setup.js
│
├── docs/
│   └── swagger.js
│
├── package.json
└── README.md
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd url-shortener
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file:

```env
PORT=3000

DB_USER=your_database_user
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432
```

For testing create:

```
.env.test
```

with your test database credentials.

---

# Database

The application automatically creates the required tables when the server starts.

## Links Table

Stores shortened URLs:

```sql
links
------
id
code
target_url
created_at
expires_at
click_count
```

## Clicks Table

Stores analytics:

```sql
clicks
------
id
link_id
clicked_at
referrer
user_agent
```

---

# Running the Application

## Development

```bash
npm run dev
```

The server runs on:

```
http://localhost:3000
```

---

## Production

```bash
npm start
```

---

# API Documentation

Swagger documentation is available at:

```
GET /api-docs
```

Example:

```
http://localhost:3000/api-docs
```

---

# API Endpoints

## Health Check

### Check API status

```
GET /health
```

Response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## Create Short Link

```
POST /links
```

Request:

```json
{
  "target_url": "https://google.com"
}
```

Response:

```json
{
  "id": 1,
  "code": "aB93xZ",
  "target_url": "https://google.com"
}
```

---

## Create Custom Short Link

```
POST /links
```

Request:

```json
{
  "target_url": "https://google.com",
  "code": "google"
}
```

---

## Redirect

```
GET /:code
```

Example:

```
GET /google
```

Redirects to:

```
https://google.com
```

---

## Get Link Information

```
GET /links/:code
```

Returns:

* Original URL
* Creation date
* Expiration date
* Click count

---

## Get Click Logs

```
GET /links/:code/clicks
```

Returns click history:

```json
[
  {
    "id":1,
    "clicked_at":"2026-07-23T10:00:00Z",
    "user_agent":"Mozilla",
    "referrer":null
  }
]
```

---

## Export Click Logs

```
GET /links/:code/clicks.csv
```

Returns:

```
clicked_at,referrer,user_agent
```

---

## Delete Link

```
DELETE /links/:code
```

Response:

```
204 No Content
```

---

# Testing

Run all tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

The test suite covers:

* Health endpoint
* Link creation
* Validation
* Vanity codes
* Duplicate codes
* Redirects
* Expired links
* Click tracking
* CSV export
* Security checks

---

# Deployment

The API is deployment-ready.

Before deploying:

1. Configure production environment variables
2. Connect PostgreSQL database
3. Set start command:

```
npm start
```

4. Verify:

```
GET /health
```

Expected:

```json
{
  "status":"ok",
  "database":"connected"
}
```

---

# Future Improvements

Possible improvements:

* User authentication
* Rate limiting
* QR code generation
* Advanced analytics dashboard
* Redis caching
* Background cleanup jobs for expired links
* API keys for external clients

---

# License

MIT License
