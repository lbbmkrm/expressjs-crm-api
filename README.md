# CRM RESTful API

This project was built using Node.js, Express, and Prisma, with a focus on clean architecture, security, and scalability. It serves as a case study or portfolio piece showcasing the best practices I know in backend application development.

## Features

- **User Management**: User registration, authentication (JWT), and role-based access control (Admin, Manager, Sales, Viewer).
- **Customer & Contact Management**: Create, read, update, and delete customers and their associated contacts.
- **Sales Pipeline**:
    - **Leads**: Track potential customers.
    - **Opportunities**: Manage sales deals from qualification to closing.
- **Task Management**: Assign and track tasks related to customers, leads, or opportunities.
- **Marketing Campaigns**: Plan and manage marketing campaigns.
- **Product & Sales Tracking**: Manage products and record sales transactions.
- **Support Tickets**: Handle customer support requests.
- **Interactions**: Log notes and activities (calls, emails, meetings) for various records.
- **Document Management**: Upload and associate documents with different entities.
- **Dashboard**: (Conceptual) Endpoint for fetching dashboard data.
- **Soft Deletes**: Implemented for most models to prevent accidental data loss.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **API Documentation**: OpenAPI (Swagger)
- **Testing**: Jest, Supertest
- **Logging**: Winston

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)
- A package manager like [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/crm-api.git
    cd crm-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Update the `.env` file with your database connection string and a JWT secret:
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    JWT_SECRET="your_jwt_secret_key"
    JWT_EXPIRES_IN="1d"
    ```

4.  **Run database migrations:**
    This will create the database schema based on the models defined in `prisma/schema.prisma`.
    ```bash
    npm run db:migrate
    ```

5.  **(Optional) Seed the database:**
    To populate the database with initial data for testing.
    ```bash
    npm run db:seed
    ```

### Running the Application

-   **Development mode** (with hot-reloading):
    ```bash
    npm run dev
    ```

-   **Production mode**:
    ```bash
    npm start
    ```

The server will start on the port specified in your configuration (default is likely 3000 or 8000).

### Running Tests

To run the automated tests:
```bash
npm test
```

## API Documentation

This API is documented using the OpenAPI 3.0 specification. Once the application is running, you can access the interactive Swagger UI documentation at:

**http://localhost:{PORT}/api-docs**

(Replace `PORT` with the port your application is running on).

## Project Structure

The project follows a layered architecture to ensure a clean separation of concerns:

```
/
├── prisma/             # Prisma schema, migrations, and seeds
├── src/
│   ├── app.js          # Main Express application setup
│   ├── config/         # Application configuration (logger, etc.)
│   ├── controllers/    # Request/response handling logic
│   ├── middlewares/    # Express middlewares (auth, error handling, validation)
│   ├── policies/       # Authorization logic for different roles
│   ├── repositories/   # Data access layer (interacts with Prisma)
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic layer
│   ├── utils/          # Utility classes and functions
│   └── validators/     # Joi validation schemas
└── tests/              # Jest test files
```