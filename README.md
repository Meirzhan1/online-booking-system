# Hotel Booking Platform (Final Project)

A full-stack hotel booking project built with Node.js, Express, and MongoDB Atlas.
The system supports user authentication, role-based access, hotel and room management, booking flow, payments, and analytics.

## Project Overview

This project provides a hotel booking experience for two main roles:
- `USER`: register/login, browse hotels and rooms, create and manage personal bookings, pay for bookings.
- `ADMIN`: create/update/delete hotels and rooms, confirm bookings, view analytics.

Key features:
- JWT-based authentication and protected routes
- Role-based authorization (`USER`, `ADMIN`)
- Hotel and room CRUD operations
- Booking availability checks by date range
- Payment and refund API
- Hotel occupancy and revenue analytics
- Responsive static frontend pages under `src/public`

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Set values in `.env`:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=3000
JWT_SECRET=your_strong_random_secret
ADMIN_SECRET=your_admin_secret
```

### 3. Run the project
Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

### 4. Open the app
- `http://localhost:3000/index.html`

## API Documentation

Base URL (local): `http://localhost:3000`

For private endpoints, send:
- `Authorization: Bearer <JWT_TOKEN>`

### Auth (Public)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user (`USER`) |
| `POST` | `/auth/login` | Login and receive JWT token |
| `POST` | `/auth/register-admin` | Register an admin (`ADMIN`) with admin secret |

Example request (`POST /auth/register`):

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Users (Private)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users/me` | `USER`, `ADMIN` | Get current user profile |
| `GET` | `/users` | `ADMIN` | Get all users |

### Hotels

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/hotels` | Public | Get all hotels (`?q=` search) |
| `GET` | `/api/hotels/:id` | Public | Get hotel by ID |
| `POST` | `/api/hotels` | `ADMIN` | Create hotel |
| `PUT` | `/api/hotels/:id` | `ADMIN` | Full hotel update |
| `PATCH` | `/api/hotels/:id` | `ADMIN` | Partial hotel update |
| `DELETE` | `/api/hotels/:id` | `ADMIN` | Delete hotel |

### Rooms

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/rooms` | Public | Get rooms with filters (`hotelId`, `minPrice`, `maxPrice`, `isActive`, `onlyAvailable`) |
| `GET` | `/api/rooms/:id` | Public | Get room by ID |
| `POST` | `/api/rooms` | `ADMIN` | Create room |
| `PUT` | `/api/rooms/:id` | `ADMIN` | Full room update |
| `PATCH` | `/api/rooms/:id` | `ADMIN` | Partial room update |
| `DELETE` | `/api/rooms/:id` | `ADMIN` | Delete room |

### Bookings

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | `USER` | Create booking |
| `PUT` | `/api/bookings/:id/cancel` | `USER` | Cancel booking |
| `PUT` | `/api/bookings/:id/confirm` | `ADMIN` | Confirm booking |
| `GET` | `/api/bookings/availability` | Public | Check availability (`roomId`, `checkIn`, `checkOut`) |
| `GET` | `/api/bookings/calendar` | Public | Get hotel booking calendar (`hotelId`) |
| `GET` | `/api/bookings/my` | `USER` | Get my bookings |
| `GET` | `/api/bookings/my/:id` | `USER` | Get one of my bookings |
| `PUT` | `/api/bookings/my/:id` | `USER` | Update my booking |
| `DELETE` | `/api/bookings/my/:id` | `USER` | Delete/cancel my booking |

Example request (`POST /api/bookings`):

```json
{
  "roomId": "65f3d8f14b9c1f2a344f98a0",
  "checkIn": "2026-03-10",
  "checkOut": "2026-03-13"
}
```

### Payments (Private)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/payments` | `USER` | Pay for a confirmed booking |
| `PUT` | `/payments/:bookingId/refund` | `USER` | Refund payment |
| `GET` | `/payments/:bookingId/status` | Authenticated | Get payment status |

Example request (`POST /payments`):

```json
{
  "bookingId": "65f3d8f14b9c1f2a344f98a0",
  "method": "CARD"
}
```

### Analytics (Private, Admin)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/analytics/hotel-occupancy` | `ADMIN` | Hotel occupancy by period (`hotelId`, `from`, `to`) |
| `GET` | `/analytics/revenue` | `ADMIN` | Revenue by period (`hotelId`, `from`, `to`) |

## Frontend Pages

- `/index.html` - landing page
- `/hotels.html` - hotels catalog
- `/hotel.html` - hotel details page
- `/room.html` - room details page
- `/register.html` - user registration page
- `/login.html` - user login page
- `/profile.html` - user profile page
- `/my-bookings.html` - user bookings page
- `/admin-hotels.html` - admin hotels management page
- `/admin-rooms.html` - admin rooms management page

## Screenshots of Features

### 1. Main Landing
![Main Landing](src/public/images/hero.JPG)
Entry section of the platform, showing brand identity and primary navigation.

### 2. Hotels Catalog
![Hotels Catalog](src/public/images/hotel-1.jpg)
Hotel listing view where users browse available hotel options.

### 3. Room Experience
![Room Experience](src/public/images/room.JPG)
Room visual used for room details and booking context.

### 4. Amenities Preview
![Amenities Preview](src/public/images/pool.JPG)
Amenities visual section highlighting guest experience.

## Notes

- Keep `.env` local and never commit it.
- Use `.env.example` as the environment template.
