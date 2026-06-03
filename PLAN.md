# Implementation Plan

## What This App Does

Replaces the physical semester calendar given to students. Students input their timetable, mark attendance for each class, and can see exactly how many more classes they can skip per course before dropping below the minimum attendance threshold (default 75%).

---

## Current State

### Implemented
- **Semester module** — create semester, auto-generate all calendar days for the date range
- **Calendar module** — each day classified by type (WORKING_DAY, WEEKEND_DAY, UNIVERSITY_HOLIDAY, NO_CLASS_DAY, EXAM_DAY, RESTRICTED_HOLIDAY); admin updates days one by one via PATCH
- **Course module** — courses belong to a semester, store name + lectures/tutorials/labs per week + minimum attendance %

### Problems with current state
- No auth — all endpoints are public
- Courses are not tied to a user — everyone shares courses
- No timetable — no way to know which days a course actually meets
- No attendance tracking

---

## Phase 1 — Auth

### New packages needed
```
@nestjs/passport  @nestjs/jwt  passport  passport-jwt  bcrypt
@types/bcrypt  @types/passport-jwt
```

### New files
```
src/auth/
  user-role.enum.ts          → enum UserRole { ADMIN, STUDENT }
  user.entity.ts             → table: users (id, email, passwordHash, name, role, createdAt)
  dto/register.dto.ts        → { name, email, password }
  dto/login.dto.ts           → { email, password }
  jwt.strategy.ts            → validates Bearer token, attaches user to request
  decorators/
    current-user.decorator.ts → @CurrentUser() param decorator → pulls user from request
  guards/
    jwt-auth.guard.ts        → requires valid JWT (applied to most routes)
    admin.guard.ts           → requires role === ADMIN (applied to admin-only routes)
  auth.service.ts            → register(), login(), validateUser()
  auth.controller.ts         → POST /api/auth/register, POST /api/auth/login
  auth.module.ts
```

### JWT payload shape
```json
{ "sub": 1, "email": "student@college.edu", "role": "STUDENT" }
```
JWT secret from env `JWT_SECRET`. Expiry: 7 days.

### Auth service logic
- `register`: hash password with bcrypt (salt 10), save user, return JWT
- `login`: find by email, compare hash, return JWT
- `validateUser`: called by JWT strategy, returns user by id from token payload

### Route protection after auth is added
| Route | Guard |
|-------|-------|
| POST /api/auth/register | public |
| POST /api/auth/login | public |
| GET /api/semesters | JwtAuthGuard |
| GET /api/semesters/:id | JwtAuthGuard |
| POST /api/semesters | JwtAuthGuard + AdminGuard |
| GET /api/calendar/semester/:id | JwtAuthGuard |
| PATCH /api/calendar/day/:id | JwtAuthGuard + AdminGuard |
| All /api/courses/* | JwtAuthGuard |
| All /api/schedule/* | JwtAuthGuard |
| All /api/attendance/* | JwtAuthGuard |

---

## Phase 2 — Make Courses User-Owned

Courses must belong to both a semester AND a user. Each student manages their own courses.

### Changes to existing files
**`course.entity.ts`** — add relation:
```typescript
@ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
@JoinColumn({ name: 'user_id' })
user: User;

@Column({ name: 'user_id' })
userId: number;
```

**`course.service.ts`** — update all methods to accept and filter by `userId`:
- `create(dto, userId)` — attach userId on save
- `findAll(userId)` — filter by userId
- `findBySemester(semesterId, userId)` — filter by both
- `findOne(id, userId)` — throw 404 if not owned by user
- `remove(id, userId)` — verify ownership before delete

**`course.controller.ts`** — add `JwtAuthGuard`, extract `@CurrentUser()`, pass userId to service

---

## Phase 3 — Schedule (Timetable)

Each student sets which days of the week their courses meet and what class type occurs on each day. One row = one class session per week.

Example: Course "DSA" → Lecture on Monday, Lecture on Wednesday, Tutorial on Friday → 3 rows.

### New files
```
src/schedule/
  class-type.enum.ts         → enum ClassType { LECTURE, TUTORIAL, LAB }
  day-of-week.enum.ts        → enum DayOfWeek { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY }
  schedule.entity.ts         → table: schedules (id, userId, courseId, dayOfWeek, classType)
  dto/
    create-schedule.dto.ts   → { courseId, dayOfWeek, classType }
  schedule.service.ts
  schedule.controller.ts
  schedule.module.ts
```

### Schedule entity
```
schedules
  id           PK
  user_id      FK → users (CASCADE)
  course_id    FK → courses (CASCADE)
  day_of_week  enum (MONDAY…SATURDAY)
  class_type   enum (LECTURE, TUTORIAL, LAB)
```

### Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/schedule | Add one schedule entry for a course |
| GET | /api/schedule?courseId=N | Get all schedule entries for a course |
| DELETE | /api/schedule/:id | Remove a schedule entry |

---

## Phase 4 — Attendance

Students mark present or absent for each class as it happens.

### New files
```
src/attendance/
  attendance-status.enum.ts    → enum AttendanceStatus { PRESENT, ABSENT }
  attendance-record.entity.ts  → table: attendance_records
  dto/
    mark-attendance.dto.ts     → { courseId, date, classType, status }
  attendance.service.ts
  attendance.controller.ts
  attendance.module.ts
```

### AttendanceRecord entity
```
attendance_records
  id           PK
  user_id      FK → users (CASCADE)
  course_id    FK → courses (CASCADE)
  date         date (YYYY-MM-DD)
  class_type   enum (LECTURE, TUTORIAL, LAB)
  status       enum (PRESENT, ABSENT)
  UNIQUE(user_id, course_id, date, class_type)   ← prevent duplicates
```

### Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/attendance | Mark attendance for one class |
| GET | /api/attendance/course/:courseId | Full attendance log for a course |
| GET | /api/attendance/stats/:courseId | Stats + bunk calculator (main feature) |
| PATCH | /api/attendance/:id | Correct a wrong entry |

### Stats response shape (`GET /api/attendance/stats/:courseId`)
```json
{
  "courseId": 1,
  "courseName": "Data Structures",
  "minimumAttendance": 75,
  "overall": {
    "conducted": 30,
    "attended": 24,
    "percentage": 80.0,
    "safeBunksRemaining": 4,
    "classesNeededFor75": 0
  },
  "byType": {
    "LECTURE":  { "conducted": 20, "attended": 16, "percentage": 80.0 },
    "TUTORIAL": { "conducted": 7,  "attended": 6,  "percentage": 85.7 },
    "LAB":      { "conducted": 3,  "attended": 2,  "percentage": 66.7 }
  }
}
```

### Bunk calculator logic (in AttendanceService)
```
a = count of PRESENT records for this user+course
c = count of all records (conducted)
r = remaining scheduled classes (see below)

safeBunksRemaining = max(0, floor(a + 0.25 * r - 0.75 * c))
classesNeededFor75 = max(0, ceil((0.75 * c - a) / 0.25))   // only meaningful if a/c < 0.75
```

### How to calculate `r` (remaining scheduled classes)
1. Get the course's semester
2. Get all CalendarDays for that semester where `dayType = WORKING_DAY` AND `date > today`
3. For each such future working day, get its day of week (Mon/Tue/etc.)
4. Count how many schedule entries this user has for this course on that day of week
5. Sum across all future working days → this is `r`

---

## Phase 5 — App Module wiring

Update `app.module.ts` to import: `AuthModule`, `ScheduleModule`, `AttendanceModule`

Update `.env.example` to add:
```
JWT_SECRET=your-secret-key
```

---

## Database Schema (final)

```
users
  id, email (unique), password_hash, name, role (ADMIN|STUDENT), created_at

semesters
  id, name (unique), start_date, end_date

calendar_days
  id, date, day_type, description, semester_id → semesters

courses
  id, name, lectures_per_week, tutorials_per_week, labs_per_week,
  minimum_attendance, semester_id → semesters, user_id → users

schedules
  id, user_id → users, course_id → courses, day_of_week, class_type

attendance_records
  id, user_id → users, course_id → courses, date, class_type, status
  UNIQUE(user_id, course_id, date, class_type)
```

---

## Build Order

1. Phase 1 — Auth (everything else depends on userId)
2. Phase 2 — Course ownership (small change, unblocks schedule/attendance)
3. Phase 3 — Schedule (needed by bunk calculator)
4. Phase 4 — Attendance (the main feature)
5. Phase 5 — Wire up app module, update .env.example
