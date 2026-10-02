# SupportFlow

**SupportFlow** is an end-to-end Customer Support & Feedback Ticket Management System. It streamlines customer feedback logging, automatic ticket categorization and escalation, and admin workflow oversight with role-based access control.

---

## Project Structure

```
supportflow/
├── frontend/             # React 18 + Vite frontend application
│   ├── src/
│   │   ├── components/   # UI components (Navbar, Layout, Forms, ProtectedRoute)
│   │   ├── context/      # AuthContext & state management
│   │   ├── pages/        # Dashboard, Tickets, TicketDetail, Feedback, Profile, AdminUsers
│   │   └── services/     # Axios API client & backend endpoints
│   ├── index.html
│   ├── package.json
│   ├── vercel.json       # Vercel deployment configuration
│   └── vite.config.js
│
├── backend/              # Spring Boot 3.2.2 + Java 17 REST API
│   ├── src/
│   │   ├── main/java/    # Spring Boot application, controllers, models, repositories, security
│   │   └── main/resources/ # application.properties, data.sql
│   ├── test-payloads/    # Test request JSON payloads
│   ├── Dockerfile        # Container build definition
│   ├── pom.xml           # Maven dependencies & build configuration
│   └── mvnw / mvnw.cmd   # Maven wrapper
│
├── database/             # Database DDL, DML seed scripts, and utility tools
│   ├── schema.sql        # Database table definitions & foreign keys
│   ├── seed.sql          # Seed data with default users and tickets
│   └── scripts/          # Helper utilities (e.g. password hash generator)
│
├── docs/                 # Architectural diagrams, specifications & deployment guides
│   ├── Problem_Statement.md
│   ├── DEPLOYMENT.md
│   ├── Draft_Diagrams.md
│   ├── CHANGELOG.md
│   └── *.png             # ER diagram, Class diagram, Architecture diagram
│
├── render.yaml           # Render.com cloud deployment configuration
├── README.md             # Project documentation
└── .gitignore            # Git ignore patterns
```

---

## Tech Stack

- **Frontend**: React 18, Vite 5, React Router v6, Axios
- **Backend**: Java 17, Spring Boot 3.2.2, Spring Security, Spring Data JPA, JWT (jjwt 0.12.5)
- **Database**: MySQL / SQLite
- **Deployment**: Vercel (Frontend), Render (Backend / Docker)

---

## Getting Started

### Prerequisites
- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher (with npm)
- **Database**: MySQL 8.x or SQLite

---

### 1. Database Setup

#### Using MySQL:
1. Create database:
   ```sql
   CREATE DATABASE supportflow_db;
   ```
2. Run schema and seed scripts:
   ```bash
   mysql -u root -p supportflow_db < database/schema.sql
   mysql -u root -p supportflow_db < database/seed.sql
   ```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure database credentials in `src/main/resources/application.properties` or create a `.env` file based on `.env.example`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/supportflow_db?useSSL=false&serverTimezone=Asia/Kolkata
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```
3. Run the application:
   ```bash
   # Windows
   ./mvnw.cmd spring-boot:run

   # macOS / Linux
   ./mvnw spring-boot:run
   ```
   The backend starts at `http://localhost:8080`.

---

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
   The frontend starts at `http://localhost:5173`.

---

## Default User Accounts

All seed accounts use the default password: `password123`

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@supportflow.com` | `password123` | Full administrative control, user & agent management, analytics |
| **Support Agent** | `bob@supportflow.com` | `password123` | Ticket resolution, priority updates, feedback assignment |
| **Customer** | `alice@example.com` | `password123` | Ticket creation, feedback submission, status tracking |

---

## Key Features

- **Role-Based Access Control**: Granular permissions for Admin, Agent, and Customer roles.
- **Ticket Lifecycle Management**: Create, assign, update priority (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and resolve tickets (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
- **Customer Feedback Workflow**: Collect feedback, categorize ratings, and automatically route issues.
- **Secure Authentication**: Stateless JWT token authentication with BCrypt password hashing.
- **Responsive Dashboard**: Real-time ticket statistics, metrics, and filtering.

---

## Documentation

For architecture and deployment guides, see the `docs/` folder:
- [Problem_Statement.md](docs/Problem_Statement.md) — System requirements and domain specification
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) — Deployment instructions for Vercel and Render
- [Draft_Diagrams.md](docs/Draft_Diagrams.md) — System architecture, Class, and ER diagrams

