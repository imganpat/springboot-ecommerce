# Neki Ecommerce platform

A full-stack e-commerce project built with a Spring Boot backend and a React + Vite frontend. The application supports user authentication, product browsing, admin product management, cart functionality, image uploads, and a dashboard.

## Tech Stack

- Backend: Java, Spring Boot, Maven
- Frontend: React, Vite, JavaScript
- Styling: Tailwinds CSS / custom UI components
- Storage: Local file uploads
- Tooling: Docker-ready project setup

## Project Structure

```text
Day 01/
├── backend/
│   ├── src/
│   ├── requests/
│   ├── .env
│   ├── pom.xml
│   ├── Dockerfile
│   └── mvnw
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── README.md
└── .gitignore
```

## Features

- Admin registration and login
- User registration and login
- Product listing and detail views
- Admin product create, update, delete, and restore
- Cart add/remove functionality
- Product image upload support
- Dashboard and admin panel UI
- Responsive frontend experience

## Backend Setup

1. Open a terminal in `backend/`
2. Ensure Java is installed
3. Configure environment variables in `.env` if required
4. Run the app:

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

The backend will run on the port configured in `application.properties` (typically `8080` unless adjusted).

## Frontend Setup

1. Open a terminal in `client/`
2. Install dependencies:

```bash
cd client
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Environment Notes

- The backend has a `.env` file under `backend/`
- The frontend also contains a `.env` file under `client/`
- Update API URLs and credentials as needed for your local environment

## Main API Flow

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`
- `PATCH /api/admin/products/{id}/restore`

### Cart
- `GET /api/cart`
- `POST /api/cart/add`
- `DELETE /api/cart/remove`

### Image Upload
- `POST /api/admin/products/{id}/upload-image`

## Docker

A `Dockerfile` is included in the backend project. You can build the image with:

```bash
cd backend
docker build -t ecommerce-api .
```

Run it with:

```bash
docker run -p 8080:8080 ecommerce-api
```

## Notes

This project is intended as an internship learning project and demonstrates a practical e-commerce app structure with both frontend and backend responsibilities.

## License

This project is for learning and development purposes.