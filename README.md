# Attendance Intelligence System

A semester-aware attendance tracking and prediction system designed for university students.

This project helps students:
- track attendance
- visualize academic calendars
- manage holidays and no-class days
- predict attendance percentages
- calculate safe bunks dynamically

Built using:
- Java
- Spring Boot
- MySQL
- JPA/Hibernate

## Features

### Semester Management
- Create academic semesters
- Store semester start and end dates
- Generate semester timelines automatically

### Intelligent Calendar System
Automatically generates calendar days for the semester.
Supports:
- Working Days
- Weekends
- University Holidays
- Restricted Holidays
- No Class Days
- Exam Days

### Dynamic Calendar Engine
The backend automatically:
- iterates through semester dates
- classifies weekends
- creates academic calendar entries
- stores all semester days in the database
This creates the foundation for future attendance prediction logic.

## Planned Features

### Attendance Tracking
- Mark attendance course-wise
- Track absences
- Calculate attendance percentage dynamically

### Attendance Prediction Engine
- Calculate safe bunks remaining
- Predict semester-end attendance
- Warn users about attendance risks

### Course Management
Users will be able to:
- add courses
- define lectures/week
- define tutorials/week
- define labs/week

### Interactive Semester Calendar
Frontend will include:
- hoverable academic calendar
- color-coded day types
- attendance insights

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate

### Database
- MySQL
- Docker

### Planned Frontend
- Next.js
- Clerk Authentication

## Project Structure
```text
src/main/java/com/arnav/attendanceapp

├── semester
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── dto
│
├── calendar
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── dto
│
├── attendance
├── course
├── common
└── config
```

## Current Backend Flow
```text
HTTP Request
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL Database
```

## Current API

### Create Semester
`POST /api/semesters/create`

**Request Body**
```json
{
  "name": "Monsoon 2026",
  "startDate": "2026-08-01",
  "endDate": "2026-12-15"
}
```

## Database Design

### Semester
Stores:
- semester metadata
- start/end dates

### CalendarDay
Stores:
- date
- day type
- semester relationship

### Day Types
- `WORKING_DAY`
- `WEEKEND`
- `UNIVERSITY_HOLIDAY`
- `RESTRICTED_HOLIDAY`
- `NO_CLASS_DAY`
- `EXAM_DAY`

## Future Goals
- Attendance prediction engine
- Smart bunk calculator
- AI-powered attendance insights
- Interactive dashboards
- Mobile-responsive frontend
- Multi-user support
- Authentication with Clerk

## Author
**Arnav Vyas**

Backend-focused engineering student interested in:
- distributed systems
- backend architecture
- scalable applications
- real-time systems
