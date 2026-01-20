# 📋 IERS Quality Assurance Tracker

This document tracks the end-to-end validation of the IERS Platform. 

## 🚦 Status Key
- 🟢 **PASS**: Functionality is working as expected.
- 🟡 **MINOR**: Working but needs UX/UI polish.
- 🔴 **FAIL**: Critical bug or data integrity issue.
- ⚪ **PENDING**: Not yet tested.

---

## Phase 1: Authentication & RBAC
| ID | Scenario | Persona | Expected Result | Status | Notes |
|:---|:---|:---|:---|:---|:---|
| 1.1 | Login Logic | Student | Redirect to `/dashboard/student` | ⚪ | |
| 1.2 | Permission Wall | Student | Accessing `/admin/faculty` returns 403 | ⚪ | |
| 1.3 | Menu Visibility | Faculty | Sidebar shows "Reviews" but hides "Admin Settings" | ⚪ | |

## Phase 2: PhD Application Lifecycle
| ID | Scenario | Persona | Expected Result | Status | Notes |
|:---|:---|:---|:---|:---|:---|
| 2.1 | New Application | Student | Record saved in `phd_applications` + Workflow started | ⚪ | |
| 2.2 | Scrutiny Step | Admin | Click "Approve" moves Alice to Step 2 | ⚪ | |
| 2.3 | Rejection Flow | Admin | Rejecting application sets instance to `REJECTED` | ⚪ | |

## Phase 3: Placements & NAAC
| ID | Scenario | Persona | Expected Result | Status | Notes |
|:---|:---|:---|:---|:---|:---|
| 3.1 | Drive Visibility | Student | Google Cloud drive visible in "Openings" | ⚪ | |
| 3.2 | SSR Submission | Admin | Section 1.1.1 content persists after refresh | ⚪ | |

---

## 🐞 Bug Log (Fix Loop)
| Issue | Module | Severity | Resolution | Verified |
|:---|:---|:---|:---|:---|
| Backend Startup `TypeError: handler must be a function` | Auth API | 🔴 Critical | Fixed bad middleware import in `auth.routes.js` | 🟢 |
| Frontend `npm run dev` fails with missing export `employeesApi` | NotificationBell | 🔴 Critical | Refactored to use IERS mock data | 🟢 |
| Frontend crash due to missing `calendarApi` | Calendar | 🔴 Critical | Replaced with IERS academic calendar Mocks | 🟢 |
| Frontend crash due to missing `meetupsApi` | Meetups | 🔴 Critical | Replaced with Collaboration Placeholder | 🟢 |
| Frontend crash due to missing `documentsApi` | Documents | 🔴 Critical | Replaced with Document Repository Placeholder | 🟢 |
| Login "Access Denied" Error | Auth | 🔴 Critical | Repaired `iers_users` sync & schema mismatch | 🟢 |
| API Permission Denied (Slug Mismatch) | RBAC | 🔴 Critical | Synced DB permissions with Code requirements | 🟢 |
| Workflow Seeding | PhD | 🟡 Task | Seeded "PhD Admission" + Application for Rahul | 🟢 |
| System Rebranding | UI | 🟡 Task | Renamed "YVI" to "ELMS", replaced Logos | 🟢 |
