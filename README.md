# SupportFlow – Customer Support System

SupportFlow is a web-based customer feedback and complaint management system.

It helps customers submit complaints, support staff manage tickets, and administrators monitor and escalate unresolved issues.

## Features

* Customer registration and login
* Submit complaints and feedback
* Support ticket management
* Staff assignment
* Ticket status tracking
* Automatic escalation
* Customer ratings
* Admin dashboard
* MySQL database

## Technology

* **Backend:** Java, Spring Boot
* **Database:** MySQL
* **Frontend:** HTML, CSS, JavaScript
* **Authentication:** JWT, BCrypt
* **Tools:** VS Code, Git, GitHub

## Project Structure

```text
SupportFlow/
├── backend/
├── frontend/
├── database/
├── docs/
├── README.md
└── .gitignore
```

## Workflow

```text
Customer
   ↓
Complaint / Feedback
   ↓
Ticket Created
   ↓
Staff Assigned
   ↓
Issue Resolution
   ↓
Customer Notified
   ↓
Closed

If SLA Exceeded
   ↓
Escalation
   ↓
Manager
```

## Database

MySQL database:

```text
supportflow_db
```

Main tables:

```text
users
customers
employees
tickets
categories
ticket_assignments
escalations
responses
notifications
ratings
```

## Project Goal

To provide a simple and efficient platform for managing customer complaints, improving support response time, and automatically escalating unresolved issues.

## Author

SuvinKumar J
