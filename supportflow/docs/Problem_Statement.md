# Problem Statement

## 1. Title
**Customer Feedback & Escalation Workflow System**

## 2. Domain
Customer Service / Workflow Automation

## 3. Users
- **Customer** — Submits feedback and issues through the system.
- **Support Agent** — Receives and resolves escalated feedback.
- **Admin** — Oversees the workflow, manages agents, and monitors dashboards.

## 4. Problem
Customers currently submit feedback and issues through ad-hoc channels (email, phone, chat), and the escalation process is slow, manual, and unclear. There is no centralized system to track, prioritize, or route these submissions, resulting in delayed resolutions, missed escalations, and poor customer satisfaction.

## 5. Proposed Solution
A web-based application that enables customers to log feedback and issues in a structured manner. The system will:
- **Auto-categorize** incoming feedback by severity level.
- **Automatically escalate** and route tickets to the appropriate support agent based on category and severity.
- **Track resolution** through a logged audit trail of actions.
- Provide **admin oversight** via dashboards and agent management.
- **Send email notifications** when escalations are created and when resolutions are logged.

## 6. Database Schema
The system persists data across five core tables with the following relationships:

| Table           | Description                                              | Relationships                                  |
|-----------------|----------------------------------------------------------|------------------------------------------------|
| **Customer**    | End-user who submits feedback.                           | 1 → N **Feedback** (one customer submits many feedback records) |
| **Feedback**    | The feedback/issue record submitted by a customer.       | N → 1 **Customer**; 1 → 1/N **Escalation** (feedback is linked to an escalation; severity determines whether an escalation is created) |
| **Escalation**  | Routing and severity-based escalation linked to feedback. | N → 1 **Feedback**; N → 1 **Agent** (many escalations assigned to one agent); 1 → N **ResolutionLog** |
| **Agent**       | Support staff assigned to resolve escalations.           | 1 → N **Escalation** (one agent can handle many escalations) |
| **ResolutionLog** | Audit trail of actions taken to resolve an escalation.  | N → 1 **Escalation**; N → 1 **Agent** (the agent who performed the action) |

## 7. User Roles & Permissions
| Role     | Permissions                                             |
|----------|---------------------------------------------------------|
| Admin    | Manage agents (create, deactivate), view dashboards, oversee workflows. |
| Agent    | View assigned escalations, update status, add resolution logs. |
| Customer | Submit feedback, view own submission status and resolution history. |

## 8. Third-Party Integrations
- **Email notification service** (e.g., SMTP provider / SendGrid) — Sends email notifications to agents when new escalations are routed to them, and to customers when their feedback is resolved.

## 9. Future Enhancements (AI)
- **Sentiment analysis** of feedback content — to refine severity categorization and detect dissatisfied customers automatically. Planned for a later phase; not part of the initial release.

## 10. Success Criteria
- Feedback can be logged in under 1 minute.
- Escalations are routed automatically to the correct agent.
- Resolutions are tracked end-to-end from submission to closure.

## 11. Acceptance Criteria
- Customers can submit feedback via a simple web form (subject, description, category).
- The system auto-categorizes feedback severity (low, medium, high, critical).
- Escalations above a threshold severity are automatically routed to an available agent.
- Agents receive email notifications for newly assigned escalations.
- Resolution actions are recorded in the ResolutionLog with timestamps.
- Customers can view the status and resolution history of their submitted feedback.
- Admins can view aggregate dashboards (total feedback, escalations by severity, resolution times).
- Admins can create, deactivate, and view agent accounts.
- The entire feedback-to-resolution flow is trackable end-to-end.

## 12. Out of Scope
- Payment integration or billing workflows.
- Advanced analytics and ML-based predictive insights.
- Mobile app (responsive web only for initial release).

## 13. Chosen Track
**Java (Spring Boot)** — A robust, enterprise-grade framework well-suited for building scalable backend services, RESTful APIs, and workflow automation with strong ecosystem support for security, validation, and data persistence.

## 14. Suggested Commit Message
```
docs: add customer feedback and escalation workflow problem statement
```
