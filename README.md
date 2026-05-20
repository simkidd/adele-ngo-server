# Adele Empowerment Foundation — API Server

Production-grade Express.js + TypeScript backend for the Adele Empowerment Foundation vocational training platform.

## Stack

- **Node.js** + **TypeScript**
- **Express.js** — HTTP server
- **MongoDB** + **Mongoose** — Database
- **JWT** — Auth (separate secrets for admin + applicant)
- **Cloudinary** — File storage (passport photos, blog covers, certificates, QR codes)
- **Nodemailer + Brevo SMTP** — Transactional email
- **Puppeteer** — Certificate PDF generation
- **qrcode** — QR code generation
- **Zod** — Request validation
- **node-cron** — Forfeiture job (runs nightly at 02:00 AM)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Seed database

```bash
npm run seed
```

Default accounts created:
| Role | Email | Password |
|---|---|---|
| Super Admin | admin@adelefoundation.org | Adele2025! |
| PH Officer | officer.ph@adelefoundation.org | Officer2025! |
| Bayelsa Officer | officer.by@adelefoundation.org | Officer2025! |
| Blog Editor | editor@adelefoundation.org | Editor2025! |

### 4. Start development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
npm start
```

---

## API Base URL

```
http://localhost:5000/api
```

## Health Check

```
GET /api/health
```

---

## API Reference

### Admin Auth — `/api/auth`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Admin login |
| POST | `/refresh` | Public | Refresh access token |
| POST | `/logout` | Public | Logout |
| GET | `/me` | Admin | Get current admin |
| PATCH | `/me` | Admin | Update profile |
| PATCH | `/me/password` | Admin | Change password |
| GET | `/users` | super_admin | List admin users |
| POST | `/users` | super_admin | Create admin user |
| DELETE | `/users/:id` | super_admin | Deactivate user |

### Applicant — `/api/applicant`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register + submit application |
| POST | `/login` | Public | Applicant login |
| POST | `/refresh` | Public | Refresh token |
| POST | `/logout` | Public | Logout |
| POST | `/upload/passport` | Public | Upload passport photo |
| GET | `/me` | Applicant | Dashboard overview |
| PATCH | `/me` | Applicant | Update profile |
| PATCH | `/me/password` | Applicant | Change password |
| GET | `/application` | Applicant | Application detail + status |
| GET | `/certificate` | Applicant | Get issued certificate |
| GET | `/announcements` | Applicant | Get announcements |

### Programs — `/api/programs`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all programs |
| GET | `/:id` | Public | Get program |
| POST | `/` | super_admin | Create program |
| PATCH | `/:id` | super_admin | Update program |
| PATCH | `/:id/toggle` | super_admin | Toggle active status |
| POST | `/:id/assign-center` | super_admin | Assign to center |
| POST | `/:id/remove-center` | super_admin | Remove from center |

### Cohorts — `/api/cohorts`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/open` | Public | Get current open cohort |
| GET | `/` | Admin | List all cohorts |
| GET | `/:id` | Admin | Get cohort |
| POST | `/` | super_admin | Create cohort |
| PATCH | `/:id` | super_admin | Update cohort |
| PATCH | `/:id/status` | super_admin | Transition cohort status |

### Registrations — `/api/registrations`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Admin | List (scoped to center for officers) |
| GET | `/stats` | Admin | Status breakdown counts |
| GET | `/:id` | Admin | Single registration detail |
| PATCH | `/:id/status` | Admin | Update status |
| DELETE | `/:id` | Admin | Delete + restore slot |

### Certificates — `/api/certificates`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/verify/:certId` | Public | Verify certificate (QR scan) |
| GET | `/` | Admin | List all certificates |
| POST | `/issue` | Admin | Issue certificate |

### Biometric — `/api/biometric`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/pending` | Admin | List pending verifications |
| GET | `/status/:applicantId` | Admin | Biometric status |
| POST | `/enroll` | Admin | Enroll fingerprint |
| POST | `/verify` | Admin | Verify fingerprint match |

### Announcements — `/api/announcements`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/public` | Public | Public announcements |
| GET | `/` | Admin | All announcements |
| POST | `/` | Admin | Create |
| PATCH | `/:id` | Admin | Update |
| DELETE | `/:id` | Admin | Delete |

### Blog — `/api/blog`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Published posts |
| GET | `/slug/:slug` | Public | Post by slug |
| GET | `/admin/all` | Admin | All posts inc. drafts |
| POST | `/` | Admin | Create post |
| PATCH | `/:id` | Admin | Update post |
| DELETE | `/:id` | Admin | Delete post |
| POST | `/:id/cover` | Admin | Upload cover image |

### Events — `/api/events`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/public` | Public | Upcoming events |
| GET | `/:id` | Public | Single event |
| POST | `/:id/rsvp` | Public | Submit RSVP |
| GET | `/` | Admin | All events |
| POST | `/` | Admin | Create event |
| PATCH | `/:id` | Admin | Update event |
| DELETE | `/:id` | Admin | Delete event |
| GET | `/:id/rsvps` | Admin | Event RSVPs |

### Centers — `/api/centers`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List centers |
| GET | `/:id` | Public | Single center |
| PATCH | `/:id` | super_admin | Update center |
| PATCH | `/:id/manager` | super_admin | Assign manager |

### Submissions — `/api/submissions`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | Public | Submit contact form |
| GET | `/` | Admin | List submissions |
| PATCH | `/:id/read` | Admin | Mark as read |
| DELETE | `/:id` | Admin | Delete |

---

## Background Jobs

### Forfeiture Job
Runs every night at **02:00 AM**.

Finds all registrations with:
- `status = "Accepted"`
- `verificationDeadline < now`

For each:
1. Restores the seat in the cohort
2. Deletes the Registration document
3. Logs the action

The Applicant account is **never deleted**.

---

## Certificate Flow

```
POST /api/certificates/issue { registrationId }
  → Validate registration (must be Enrolled)
  → Generate certId (AEF-PH-2025-EL-000042)
  → Generate QR code PNG (qrcode library)
  → Generate PDF (Puppeteer, A4 landscape template)
  → Upload QR + PDF to Cloudinary
  → Save Certificate to MongoDB
  → Send email to graduate with PDF attachment
  → Return certificate data
```

---

## Biometric Integration

The biometric service (`src/services/biometric.service.ts`) is **device-agnostic**.

The fingerprint template (base64) is sent from the admin frontend after the SDK captures it:

```
POST /api/biometric/enroll
{
  "applicantId": "...",
  "fingerprintTemplate": "base64_template_from_sdk"
}
```

Compatible SDKs: SecuGen, Futronic, or any SDK that outputs a base64 template.
The template is AES-encrypted before storage.

---

## Environment Variables

See `.env.example` for all required variables.
