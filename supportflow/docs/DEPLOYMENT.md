# SupportFlow - Deployment Guide

## Project Structure
```
supportflow/
├── backend/          # Spring Boot 3.2.2 + Java 17
├── frontend/         # React 18 + Vite 5
├── database/         # SQL schema & seed data
└── render.yaml       # Backend deployment config (Render.com)
```

## Local Development

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` (proxies `/api` to backend)

## Production Build

### Backend
```bash
cd backend
./mvnw clean package -DskipTests
# Output: target/supportflow-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Output: dist/
```

## Deployment

### Backend → Render.com (Free Tier)

1. Push to GitHub
2. Create new Web Service on Render
3. Connect repo, select `backend` folder
4. Use Docker (Dockerfile provided)
5. Add environment variables:
   - `JWT_SECRET` - auto-generated
   - `DB_PATH` - `/var/data/supportflow.db`
   - `PORT` - `8080`
6. Add persistent disk: 1GB at `/var/data`

### Frontend → Vercel

1. Push to GitHub
2. Import project on Vercel
3. Select `frontend` folder
4. Framework: Vite (auto-detected)
5. Add environment variable:
   - `VITE_API_BASE` = `https://your-backend.onrender.com/api`

## API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Tickets
- `GET /api/tickets` - List tickets (filtered by role)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket
- `PUT /api/tickets/:id/status` - Update status
- `PUT /api/tickets/:id/assign` - Assign agent (admin)
- `DELETE /api/tickets/:id` - Delete ticket

### Feedback
- `GET /api/feedback` - List feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/:id` - Get feedback
- `PUT /api/feedback/:id/status` - Update status (admin/agent)
- `DELETE /api/feedback/:id` - Delete feedback

### Users
- `GET /api/users/me` - Current user profile
- `GET /api/users` - All users (admin)
- `GET /api/users/agents` - Support agents

### Health
- `GET /api/health` - Health check

## Default Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Customer | alice@example.com | password123 |
| Customer | suvin123@gmail.com | password123 |
| Agent | agent@supportflow.com | password123 |
| Admin | admin@supportflow.com | password123 |

## Tech Stack
- **Backend**: Spring Boot 3.2.2, Spring Security 6, JWT (jjwt 0.11.5), SQLite, JPA/Hibernate
- **Frontend**: React 18, React Router 6, Axios, Vite 5
- **Auth**: BCrypt password hashing, HS256 JWT tokens