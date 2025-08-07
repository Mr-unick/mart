# TenantBill

This is a NextJS application built with Firebase Studio, featuring a multi-tenant architecture for billing and product management.

## Getting Started

Follow these steps to get the application running on your local machine for development and testing.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm 
*   A local MySQL database server

### Setup Instructions

1.  **Install Dependencies:**
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```

2.  **Set up Database:**
    - Make sure your local MySQL server is running.
    - Create a new database for this project. You can name it `tenantbill`.

3.  **Configure Environment:**
    - In the root of the project, create a file named `.env`.
    - Add your database connection string to this file. It should look like this (replace with your actual credentials):
      ```
      DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
      ```
      For example:
      ```
      DATABASE_URL="mysql://root:password@localhost:3306/tenantbill"
      ```

4.  **Run Database Migration:**
    This command will sync your database schema with the Prisma schema file (`prisma/schema.prisma`) and create all the necessary tables.
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Seed the Database:**
    This command will populate your database with initial data, such as the super admin user and sample tenant data, as defined in `prisma/seed.ts`.
    ```bash
    npx prisma db seed
    ```

6.  **Run the Application:**
    Start the Next.js development server.
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:9002`.

### Login Credentials

You can log in with the following pre-seeded users:

*   **Super Admin**: `nikhil@gmail.com` (any password)
*   **Tenant Admin**: `owner@innovate.com` (any password)
