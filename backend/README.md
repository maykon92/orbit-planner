Orbit Planner API

Backend for Orbit Planner, an intelligent life management platform that combines scheduling, travel planning, media tracking (books/movies), and social features — with future AI integration.

About the Project
Orbit Planner allows users to:
Create custom tabs (agenda, travel, books, etc.)
Manage items within each tab
Upload images
Create posts (private or public)
Interact with likes and comments
Receive smart suggestions (AI integration coming soon)

Tech Stack
Node.js
Express.js
MongoDB Atlas
Mongoose
JWT (Authentication)
bcrypt (Password hashing)
Multer (File upload)
Helmet (Security)
Express Rate Limit (Protection)

Project Structure
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
└── server.js

Authentication
This API uses:
JWT for authentication
authGuard middleware to protect routes

Installation
git clone https://github.com/YOUR_USERNAME/orbit-planner.git
cd backend
npm install
Environment Variables

Create a .env file based on .env.example:
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DB_USER=your_mongodb_user
DB_PASS=your_mongodb_password
JWT_SECRET=your_secret_key

Running the Server
npm run dev

API Endpoints

Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Tabs
GET /api/tabs
POST /api/tabs
PUT /api/tabs/:id
DELETE /api/tabs/:id

Items
GET /api/items/tab/:tabId
POST /api/items
PUT /api/items/:id
DELETE /api/items/:id

Upload
POST /api/uploads

Posts
GET /api/posts/feed
GET /api/posts/my-posts
POST /api/posts
POST /api/posts/:id/like
POST /api/posts/:id/comments
Config
GET /api/config

Health Check
GET /api/health

Security
Helmet (HTTP headers protection)
Rate limiting
JWT authentication
Mongoose schema validation (enums)


Roadmap
AI integration (OpenAI)
React frontend
Followers system
Notifications
Production deployment

Author: Maykon Da Luz