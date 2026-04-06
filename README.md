# Thesis Format Verification System (VUTF)

A comprehensive web-based system for managing, verifying, and validating thesis submissions according to academic format standards.

## 📋 Project Overview

VUTF (Thesis Unit Thesis Format) is a full-stack application designed to streamline thesis management and ensure all submissions comply with institutional formatting requirements. The system automatically checks thesis PDF files for compliance with detailed standards including:

- ✅ **Font Validation** - Sarabun font enforcement with size and type checking
- ✅ **Margin Verification** - Precise margin measurements (Top: 38.1mm, Left: 38.1mm, Bottom/Right: 25.4mm)
- ✅ **Indentation Rules** - Text indentation validation for all heading levels and lists
- ✅ **Page Sequence** - Page numbering consistency and Arabic/Roman numeral validation
- ✅ **Section Structure** - Thai chapter and section numbering validation (บทที่, ลำดับ)
- ✅ **Image/Table Formatting** - Location, spacing, and caption compliance
- ✅ **Paper Size Standards** - A4 paper dimension enforcement
- ✅ **Content Structure** - Thesis formatting guidelines for all sections
- ✅ **PDF Annotation** - Visual highlighting of detected issues directly on PDF

## 🎯 Key Features

### Automated Validation Engine
- **Real-time PDF Processing** - Analyzes thesis files instantly
- **Detailed Issue Reporting** - CSV reports with page numbers, severity levels, and precise locations
- **Multi-language Support** - Thai and English content handling
- **Smart Issue Detection** - Context-aware validation with Thai language pattern recognition
- **Batch Processing** - Support for multiple thesis submissions
- **PDF Annotation** - Generates annotated PDFs highlighting issues for easy correction

### Web Management Interface
- **User Dashboard** - Overview of all thesis submissions and their status
- **Real-time Status Updates** - WebSocket-based live notifications
- **Report Management** - Generate, download, and track validation reports
- **Multi-role Support** - Student, instructor, and administrator roles
- **Email Notifications** - Automated notifications for submission updates
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### Backend Architecture
- **RESTful API** - Comprehensive endpoints for all operations
- **Message Queue** - Asynchronous job processing with RabbitMQ
- **Caching Layer** - Redis for performance optimization
- **Real-time Communication** - WebSocket support for live updates
- **Database Transactions** - PostgreSQL with ACID compliance
- **Audit Logging** - Complete activity tracking and history

## 🏗️ Architecture

The project follows a microservices architecture with three independent but integrated components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Frontend (React)                       │
│                   (web-vutf - Port 5173)                     │
│         - Dashboard, Submission Management, Reports          │
│         - Real-time Updates via WebSocket                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (NestJS)                        │
│                 (vutf-api - Port 3000)                       │
│    - Authentication & Authorization                          │
│    - Thesis/Submission Management                            │
│    - User Management & Audit Logging                         │
│    - Email & Notification Services                           │
└─────────────────────────────────────────────────────────────┘
         ↓                           ↓
    ┌─────────┐            ┌──────────────────┐
    │ Database│            │  Message Queue   │
    │(PostgreSQL)          │  (RabbitMQ)      │
    │ Port 5432           │  Port 5672      │
    └─────────┘            └──────────────────┘
         ↓                           ↓
    ┌─────────┐            ┌──────────────────┐
    │ Cache   │            │ Format Checker   │
    │ (Redis) │            │ (FastAPI/Python) │
    │5379     │            │ Port 8002        │
    └─────────┘            └──────────────────┘
```

### Architecture Components

#### 1. **Frontend Layer (React + Vite)**
The user-facing web application providing intuitive interfaces for thesis management.

**Location:** `web-vutf/`

**Key Technologies:**
- React 18.x - Component-based UI
- Vite - Lightning-fast build tool and dev server
- TypeScript - Type-safe development
- Tailwind CSS - Utility-first styling
- React Router DOM - Client-side routing
- Socket.IO Client - Real-time WebSocket communication
- React Hook Form - Powerful form state management
- Axios - HTTP client for API calls

**Key Features:**
- Multi-page SPA with fast page transitions
- Form validation and error handling
- Real-time notification system
- File upload with progress tracking
- PDF viewer for report visualization
- Dashboard with analytics and metrics
- Responsive layout for all screen sizes

**Port:** 5173 (Development) / 80 (Production)

#### 2. **API Layer (NestJS Backend)**
The core business logic and API server managing all operations.

**Location:** `vutf-api/`

**Key Technologies:**
- NestJS 11.x - Enterprise Node.js framework
- TypeORM - Object-Relational Mapping
- PostgreSQL 12+ - Primary database
- Redis 7 - Caching and session management
- RabbitMQ 3 - Message queue for async processing
- Socket.IO - WebSocket server for real-time updates
- JWT - Token-based authentication
- Passport - Authentication middleware
- TypeScript - Type safety

**Database Modules:**
```
Entities:
- User (authentication, roles, permissions)
- Thesis (thesis metadata and information)
- Submission (submission records with timestamps)
- ThesisFile (uploaded files with versions)
- Report (validation reports)
- AuditLog (activity tracking)
- Notification (user notifications)
- MailQueue (queued emails)
```

**API Modules Overview:**

| Module | Purpose | Key Endpoints |
|--------|---------|--------------|
| **auth** | Authentication & authorization | POST /auth/login, POST /auth/register, POST /auth/refresh |
| **users** | User management | GET /users, POST /users, PATCH /users/:id |
| **thesis** | Thesis information | GET /thesis, POST /thesis, PATCH /thesis/:id |
| **submissions** | Submission workflow | POST /submissions, GET /submissions/:id, PATCH /submissions/:id/status |
| **thesis-files** | File management | POST /thesis-files/upload, GET /thesis-files/:id |
| **report-file** | Report generation | GET /report-file/:submissionId, POST /report-file/regenerate |
| **audit-log** | Activity logging | GET /audit-log, GET /audit-log/:userId |
| **mail** | Email services | POST /mail/send (internal) |
| **notifications** | Real-time alerts | WebSocket events for status updates |
| **dashboard** | Analytics & overview | GET /dashboard/stats, GET /dashboard/recent |
| **export-file** | Data export | GET /export-file/thesis-list, GET /export-file/submissions |
| **inspector** | Inspection tracking | GET /inspection-round, POST /inspection-round/schedule |
| **permissions** | Access control | GET /permissions, POST /permissions |

**Architecture Pattern:** NestJS uses a layered architecture:
- **Controllers** - Handle HTTP requests and responses
- **Services** - Business logic and data processing
- **Repositories** - Database access and queries
- **DTOs** - Data validation and transfer objects
- **Entities** - Database model definitions
- **Guards** - Request authentication and authorization
- **Interceptors** - Cross-cutting concerns (logging, transformation)
- **Filters** - Global exception handling

**Port:** 3000 (Development/Production)

#### 3. **Validation Engine (FastAPI + Python)**
The specialized PDF validation and analysis service.

**Location:** `fp-vutf/thesis_checker/`

**Key Technologies:**
- FastAPI - High-performance async Python web framework
- PyMuPDF (fitz) - PDF document processing and analysis
- pymupdf-layout - Text layout and positioning analysis
- Python 3.8+ - Core language

**Validation Modules:**

The system performs comprehensive multi-stage validation:

```
validate/
├── check_paper_size.py      # A4 dimension verification
├── check_margin.py          # Margin measurement (mm precision)
├── check_font.py            # Font name and size validation
├── check_indent.py          # Text indentation rules
├── check_page_sequence.py    # Page numbering validation
├── check_section_sequence.py # Thai chapter/section ordering
├── check_img_table.py       # Image/table location and spacing
├── detect_chapter.py        # Thai chapter detection (บทที่ N)
├── annotator.py             # PDF annotation with issue marks
└── validator.py             # Main validation orchestrator
```

**Configuration (config.json):**
```json
{
  "font": {
    "name": "sarabun",       // Required font family
    "size": 16,              // Body text font size (pt)
    "tolerance": 2           // Size tolerance (pt)
  },
  "margin_mm": {
    "top": 38.1,             // Top margin (mm)
    "left": 38.1,            // Left margin (mm)
    "bottom": 25.4,          // Bottom margin (mm)
    "right": 25.4            // Right margin (mm)
  },
  "indent_rules": {
    "main_heading_text": 10,     // Main heading indent (mm)
    "sub_heading_text_1": 20,    // Level 1 sub-heading (mm)
    "sub_heading_text_2": 22.5,  // Level 2 sub-heading (mm)
    "para_indent": 10,           // Paragraph first line indent (mm)
    "list_item_text_1": 25,      // List item level 1 (mm)
    "tolerance": 2               // Indent tolerance (mm)
  }
}
```

**Specific Validation Checks:**

1. **Font Validation (check_font.py)**
   - Primary font must be Sarabun (Thai font family)
   - Font size: 16pt ± 2pt tolerance for body text
   - Exceptions: Mathematical formulas, Greek symbols, diagrams
   - Warnings: Cordia, Angsana fonts (permitted but flagged)

2. **Margin Validation (check_margin.py)**
   - Measures margins from page edges (in millimeters)
   - Top/Left: 38.1mm (±tolerance)
   - Bottom/Right: 25.4mm (±tolerance)
   - Issues flagged on every line with margin violations

3. **Indentation Rules (check_indent.py)**
   - Main section headers: 0mm indent
   - Sub-sections level 1: 10mm indent
   - Sub-sections level 2: 20mm indent
   - Body paragraphs: 10mm first-line indent
   - List items: varies by nesting level
   - Tolerance: ±2mm

4. **Page Sequence (check_page_sequence.py)**
   - Roman numerals for front matter (I, II, III...)
   - Arabic numerals for main content (1, 2, 3...)
   - Proper transition points validated
   - Duplicate page numbers detected
   - Page count consistency verified

5. **Section Sequence (check_section_sequence.py)**
   - Thai chapter format: "บทที่ N" (Chapter N)
   - Main sections: "1", "2", "3", etc.
   - Sub-sections: "1.1", "1.2", "1.1.1", etc.
   - Section numbering must be sequential within chapter
   - Skipped numbers detected and reported
   - List items numbered correctly: 1), 2), 3)...

6. **Image/Table Validation (check_img_table.py)**
   - Detects images and tables on page
   - Validates captions format: "รูปที่ X" (Figure X), "ตารางที่ Y" (Table Y)
   - Checks spacing from text (minimum spacing required)
   - Thai numeral support: ๐-๙ (0-9 in Thai numerals)
   - Position and size validation

**Port:** 8002 (Development/Production)

**API Endpoints:**
- `POST /check_pdf` - Upload and validate thesis PDF
- Returns: CSV report with issues, annotated PDF

#### 4. **Data Layer**
Supporting infrastructure services.

**PostgreSQL Database (Port 5432)**
- All thesis, user, submission data
- Transaction support with ACID compliance
- Connection pooling for performance
- Backup and recovery mechanisms

**Redis Cache (Port 6379)**
- Session storage
- Query result caching
- Real-time data synchronization
- Rate limiting data

**RabbitMQ Message Queue (Port 5672)**
- Asynchronous job processing
- Event distribution
- Decoupled service communication
- Dead letter queue handling

**Adminer UI (Port 8080)**
- Web-based database administration
- Query execution interface
- table management tools

## 🚀 Getting Started

### System Requirements

**Minimum Requirements:**
- CPU: 2 cores, 3+ GHz
- RAM: 4GB minimum (8GB recommended)
- Disk: 20GB free space
- OS: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)

**Software Requirements:**

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18.x or higher | Backend API, Frontend build |
| Python | 3.8 or higher | PDF validation engine |
| PostgreSQL | 12.x or higher | Primary database |
| Redis | 6.x or higher | Caching (optional but recommended) |
| RabbitMQ | 3.x or higher | Message queue (optional but recommended) |
| npm | 8.x or higher | Node package manager |
| pip | 3.8+ | Python package manager |

### Installation Steps

#### Step 1: Clone Repository
```bash
git clone <repository-url>
cd "Thesis Format Verification System"
```

#### Step 2: Setup Database (PostgreSQL)

**Option A: Docker (Recommended)**
```bash
# Start PostgreSQL and related services via docker-compose
cd vutf-api
docker-compose up -d db redis rabbitmq adminer minio
```

**Option B: Manual Installation**
```bash
# Windows (using PostgreSQL installer)
# Download from https://www.postgresql.org/download/windows/
# Install with default settings, remember the password

# Linux (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# macOS (using Homebrew)
brew install postgresql
brew services start postgresql
```

**Create Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE vutf_db;
CREATE USER vutf_user WITH PASSWORD 'your_secure_password';
ALTER ROLE vutf_user SET client_encoding TO 'utf8';
GRANT ALL PRIVILEGES ON DATABASE vutf_db TO vutf_user;
\q
```

#### Step 3: Setup Backend API (NestJS)
```bash
cd vutf-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database and external service credentials

# Run database migrations
npm run migration:run

# Seed initial data (optional)
npm run seed

# Start development server
npm run start:dev

# Or for production build
npm run build
npm run start:prod
```

**Environment Variables (.env):**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=vutf_user
DB_PASSWORD=your_secure_password
DB_DATABASE=vutf_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:5173

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@vutf.edu

# Format Checker
FORMAT_CHECKER_URL=http://localhost:8002

# File Upload
MAX_FILE_SIZE=52428800  # 50MB
UPLOAD_PATH=./uploads
```

**Available npm scripts:**
```bash
npm run start          # Start production server
npm run start:dev      # Start with file watching
npm run start:debug    # Start with debug mode
npm run build          # Build for production
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Generate coverage report
npm run test:e2e       # Run end-to-end tests
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run migration:run  # Run pending migrations
npm run migration:generate  # Generate new migration from entities
npm run seed           # Seed database with initial data
npm run typeorm        # Run TypeORM CLI commands
```

#### Step 4: Setup Thesis Format Checker (Python)
```bash
cd fp-vutf/thesis_checker

# Create virtual environment
# Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install fastapi uvicorn pymupdf python-multipart pymupdf-layout tqdm

# Optional dependencies for enhanced features
pip install python-dotenv corslog

# Run the service
python main.py

# Alternative: Run with specific host/port
python main.py --host 0.0.0.0 --port 8002
```

**Requirements.txt (create if needed):**
```
fastapi==0.104.1
uvicorn==0.24.0
pymupdf==1.23.7
pymupdf-layout==0.1.0
python-multipart==0.0.6
tqdm==4.66.1
python-dotenv==1.0.0
```

#### Step 5: Setup Frontend (React)
```bash
cd web-vutf

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
# Edit .env with backend URL

# Start development server
npm run dev

# Or build for production
npm run build

# Preview production build
npm run preview
```

**Frontend Environment (.env):**
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_MAX_FILE_SIZE=52428800
```

**Available npm scripts:**
```bash
npm run dev           # Start development server (http://localhost:5173)
npm run build         # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run format      # Format code with Prettier
npm run test        # Run tests (if configured)
```

#### Step 6: Verify Installation
```bash
# In separate terminals, verify all services are running:

# 1. Check Backend API
curl http://localhost:3000/health

# 2. Check Format Checker
curl http://localhost:8002/docs

# 3. Check Frontend
# Open browser: http://localhost:5173
```

### Docker Setup (Complete Stack)

For a complete containerized setup:

```bash
cd vutf-api

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Access services:
# - PostgreSQL: localhost:5432 (via Adminer at localhost:8080)
# - Redis: localhost:6379
# - RabbitMQ: localhost:5672 (Management UI: localhost:15672)
# - Backend API: localhost:3000
# - Minio: localhost:9000 (S3-compatible storage)

# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Quick Access URLs
| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Thesis submission and tracking |
| Backend API | http://localhost:3000 | REST API endpoints |
| API Docs | http://localhost:3000/api/docs | Swagger documentation |
| Format Checker | http://localhost:8002/docs | Validation API documentation |
| Database Admin | http://localhost:8080 | PostgreSQL management (Adminer) |
| RabbitMQ UI | http://localhost:15672 | Message queue monitoring |
| Minio Console | http://localhost:9000 | File storage management |

## 🔄 Workflow & Process Flow

### Thesis Submission & Validation Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: USER AUTHENTICATION                                         │
│ Student logs into web application                                   │
│ JWT token issued by backend                                         │
└──────────────────────┬──────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 2: THESIS SUBMISSION                                           │
│ Student uploads thesis PDF file                                     │
│ Backend validates file (type, size, permissions)                    │
│ File stored in database/storage                                     │
│ Submission record created with 'PENDING' status                     │
└──────────────────────┬──────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 3: QUEUE FOR PROCESSING                                        │
│ Backend publishes job to RabbitMQ queue                             │
│ Validation job includes: file path, submission ID, config            │
│ Status updated to 'PROCESSING'                                      │
└──────────────────────┬──────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 4: PDF VALIDATION                                              │
│ Format Checker receives job from queue                              │
│ Loads PDF and configuration (config.json)                           │
│ Performs all validation checks in sequence                          │
│ Generates issues list and annotated PDF                             │
│ Returns results with HTTP response                                  │
└──────────────────────┬──────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 5: REPORT GENERATION                                           │
│ Backend receives validation results                                 │
│ Generates CSV report with all issues                                │
│ Saves annotated PDF to storage                                      │
│ Creates Report record in database                                   │
│ Status updated to 'COMPLETED'                                       │
└──────────────────────┬──────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 6: NOTIFICATION & FEEDBACK                                     │
│ WebSocket event sent to student's browser (real-time update)        │
│ Email notification sent to student                                  │
│ Instructor receives notification (if assigned)                      │
│ Audit log entry created                                             │
└──────────────────────┬──────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 7: ISSUE REVIEW & CORRECTION                                   │
│ Student downloads annotated PDF with issue markers                  │
│ Student reviews CSV report with detailed issue descriptions         │
│ Student corrects identified formatting issues                       │
│ Student resubmits corrected thesis                                  │
│ Process flows back to STEP 2                                        │
└──────────────────────┬──────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 8: APPROVAL & COMPLETION                                       │
│ Once all issues resolved or approved by instructor                  │
│ Status updated to 'APPROVED'                                        │
│ Certificate/Confirmation generated                                  │
│ Thesis locked from further submissions                              │
│ Final notification sent to all stakeholders                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow Between Services

**Synchronous Communication (REST API):**
```
Frontend (React) ←→ Backend API (NestJS)
   ↓ (HTTP/HTTPS)
- User authentication
- Thesis CRUD operations
- Submission status queries
- Report download
- User profile management
```

**Asynchronous Communication (Message Queue):**
```
Backend API → RabbitMQ → Format Checker
    ↓
    Job: {
      file_id: UUID,
      file_path: string,
      submission_id: UUID,
      config: JSON,
      timestamp: ISO8601
    }
    ↓
Format Checker → HTTP Callback → Backend API
    ↓
    Result: {
      issues: Array,
      annotated_pdf: Buffer,
      execution_time: number,
      status: "success|failed"
    }
```

**Real-time Communication (WebSocket):**
```
Backend API (Socket.IO Server) ←→ Frontend (Socket.IO Client)
    ↓
Events:
- submission:created
- submission:processing
- submission:completed
- submission:failed
- notification:new
- audit-log:entry
```

### Submission Status States

```
PENDING → PROCESSING → COMPLETED → APPROVED
   ↑                        ↓
   └── (on resubmit) ←──── REJECTED
                             ↓
                         RESUBMITTED
```

| Status | Meaning | Action Available |
|--------|---------|-----------------|
| **PENDING** | File uploaded, waiting for validation | View details, Delete |
| **PROCESSING** | Validation in progress | Cannot edit or delete |
| **COMPLETED** | Validation finished with results | Download report, Resubmit |
| **REJECTED** | Issues found, student can fix and resubmit | Resubmit |
| **APPROVED** | All requirements met, thesis accepted | View final report |
| **ARCHIVED** | Submission stored in archive | View only |

## 📁 Project Structure

### Complete Directory Layout

```
Thesis Format Verification System/
│
├── README.md                           # This file
├── .gitignore                          # Git ignore rules
│
├── fp-vutf/                            # Python Format Validation Engine
│   ├── README.md                       # Setup instructions
│   ├── CONTRIBUTING.md                 # Contribution guidelines
│   │
│   └── thesis_checker/                 # Main Python application
│       ├── main.py                     # FastAPI application entry point
│       ├── config.py                   # Configuration loader
│       ├── config.json                 # Validation rules configuration
│       ├── models.py                   # Data models (Issue, ThesisState)
│       ├── utils.py                    # Utility functions
│       │
│       ├── core/                       # Core validation modules
│       │   ├── validator.py            # Main validation orchestrator
│       │   ├── check_font.py           # Font validation (Sarabun enforcer)
│       │   ├── check_margin.py         # Margin verification (mm precision)
│       │   ├── check_indent.py         # Indentation level checking
│       │   ├── check_page_sequence.py  # Page numbering (I, II, 1, 2...)
│       │   ├── check_section_sequence.py # Thai chapter/section order
│       │   ├── check_paper_size.py     # A4 dimension validation
│       │   ├── check_img_table.py      # Image/table position & captions
│       │   ├── check_utils.py          # Shared validation utilities
│       │   ├── detect_chapter.py       # Thai "บทที่" detection
│       │   ├── annotator.py            # Generates marked PDFs
│       │   └── debug_line.py           # Debugging utilities
│       │
│       ├── worker/                     # Async job processing
│       │   ├── config.py               # Worker config
│       │   ├── producer.py             # RabbitMQ job producer
│       │   ├── consumer.py             # RabbitMQ job consumer
│       │   ├── s3_client.py            # Cloud storage client
│       │   └── README.md
│       │
│       └── output_files/               # Generated validation reports
│           ├── report_full_*.csv       # Validation results
│           └── annotated_*.pdf         # Marked-up PDFs
│
├── vutf-api/                           # NestJS Backend API Server
│   ├── README.md                       # API documentation
│   ├── CONTRIBUTING.md
│   ├── package.json                    # Node.js dependencies
│   ├── package-lock.json
│   ├── tsconfig.json                   # TypeScript config
│   ├── eslint.config.mjs               # Linting rules
│   ├── docker-compose.yaml             # Container services definition
│   ├── Dockerfile                      # API container image
│   ├── .env.example                    # Environment template
│   ├── nest-cli.json
│   │
│   ├── src/
│   │   ├── main.ts                     # App bootstrap
│   │   ├── app.module.ts               # Root module with all imports
│   │   ├── app.service.ts              # Base app service
│   │   ├── app.controller.ts
│   │   │
│   │   ├── config/                     # Configuration
│   │   │   └── app.config.ts           # Environment-based config
│   │   │
│   │   ├── database/                   # Database management
│   │   │   ├── data-source.ts          # TypeORM connection setup
│   │   │   ├── gen-migration.js        # Migration generator
│   │   │   ├── migrations/             # DB schema migrations
│   │   │   └── seeds/                  # Initial data loaders
│   │   │
│   │   ├── common/                     # Shared infrastructure
│   │   │   ├── decorators/             # @Public(), @Roles(), etc
│   │   │   ├── filters/                # Global exception handling
│   │   │   ├── guards/                 # Auth: JwtAuthGuard, RolesGuard
│   │   │   ├── interceptors/           # Request/response processing
│   │   │   ├── interfaces/             # Shared TypeScript interfaces
│   │   │   ├── helpers/                # Utility functions
│   │   │   ├── modules/                # Shared modules (DB, Cache)
│   │   │   └── services/               # Common services (Logger, etc)
│   │   │
│   │   ├── modules/                    # Feature modules (domain logic)
│   │   │   ├── auth/                   # Login, JWT tokens, strategies
│   │   │   ├── users/                  # User CRUD & management
│   │   │   ├── thesis/                 # Thesis metadata
│   │   │   ├── submissions/            # Thesis submission workflow
│   │   │   ├── thesis-files/           # File upload/storage
│   │   │   ├── report-file/            # Report generation
│   │   │   ├── audit-log/              # Activity tracking
│   │   │   ├── mail/                   # Email notifications
│   │   │   ├── notifications/          # WebSocket events
│   │   │   ├── dashboard/              # Analytics endpoint
│   │   │   ├── permissions/            # Access control
│   │   │   ├── student/                # Student entity
│   │   │   ├── instructor/             # Faculty/advisor roles
│   │   │   ├── thesis-topic/           # Topic management
│   │   │   ├── thesis-group/           # Grouped submissions
│   │   │   ├── class-sections/         # Cohort grouping
│   │   │   ├── inspection_round/       # Review scheduling
│   │   │   ├── announcements/          # System messages
│   │   │   ├── doc-config/             # Format configuration
│   │   │   ├── export-file/            # Data export
│   │   │   ├── group-member/           # Team members
│   │   │   └── track-thesis/           # Progress tracking
│   │   │
│   │   ├── shared/                     # Shared module
│   │   ├── templates/                  # Email HTML templates
│   │   └── assets/                     # Static assets (fonts, etc)
│   │
│   ├── test/                           # Integration & E2E tests
│   │   ├── app.e2e-spec.ts
│   │   ├── auth.e2e-spec.ts
│   │   ├── jest-e2e.json
│   │   └── *.http                      # HTTP testing files (REST Client)
│   │
│   └── dist/                           # Compiled JavaScript output
│
└── web-vutf/                           # React + Vite Frontend
    ├── README.md
    ├── CONTRIBUTING.md
    ├── package.json                    # React dependencies
    ├── package-lock.json
    ├── tsconfig.json                   # TypeScript configuration
    ├── vite.config.ts                  # Build configuration
    ├── postcss.config.js               # CSS processing
    ├── tailwind.config.js              # Tailwind setup
    ├── eslint.config.mjs
    ├── .env.example
    ├── index.html
    │
    ├── src/
    │   ├── main.tsx                    # React entry point
    │   ├── App.tsx                     # Root component
    │   ├── vite-env.d.ts
    │   ├── index.css                   # Global styles
    │   │
    │   ├── components/                 # Reusable UI components
    │   │   ├── common/                 # Header, Sidebar, Footer, etc
    │   │   ├── forms/                  # Form components
    │   │   ├── modals/                 # Dialog windows
    │   │   ├── tables/                 # Data tables
    │   │   ├── cards/                  # Card layouts
    │   │   └── upload/                 # File upload widget
    │   │
    │   ├── pages/                      # Page/screen components
    │   │   ├── Dashboard.tsx           # Main overview
    │   │   ├── Login.tsx               # Authentication
    │   │   ├── Submissions.tsx         # Submission list
    │   │   ├── SubmissionDetail.tsx    # Detail view
    │   │   ├── ReportView.tsx          # Report viewer
    │   │   ├── Profile.tsx             # User profile
    │   │   └── ...
    │   │
    │   ├── routes/                     # Route configuration
    │   ├── services/                   # API client services
    │   │   ├── api.ts                  # Axios instance
    │   │   ├── authService.ts
    │   │   ├── submissionService.ts
    │   │   ├── reportService.ts
    │   │   └── socketService.ts        # WebSocket client
    │   │
    │   ├── contexts/                   # React context for state
    │   │   ├── AuthContext.tsx
    │   │   ├── NotificationContext.tsx
    │   │   └── ...
    │   │
    │   ├── hooks/                      # Custom React hooks
    │   │   ├── useAuth.ts
    │   │   ├── useNotification.ts
    │   │   └── ...
    │   │
    │   ├── types/                      # TypeScript type definitions
    │   │   ├── submission.types.ts
    │   │   ├── user.types.ts
    │   │   └── ...
    │   │
    │   ├── utils/                      # Utility functions
    │   │   ├── formatters.ts           # Date, number formatting
    │   │   ├── validators.ts           # Form validation
    │   │   └── ...
    │   │
    │   ├── styles/                     # CSS modules & globals
    │   └── assets/                     # Images, icons, fonts
    │
    └── dist/                           # Production build output
```

### Key Directory Purposes

**fp-vutf/thesis_checker/core/**
- Each file contains one validation rule implementation
- All files operate on PyMuPDF document structures
- Results combined by `validator.py` orchestrator

**vutf-api/src/modules/**
- Each module is independently testable
- Contains Entity, DTO, Service, Controller, Repository
- Exports module definition in `*.module.ts`

**web-vutf/src/**
- `components/` → Reusable, stateless UI elements
- `pages/` → Full page layouts using components
- `services/` → All HTTP & WebSocket API calls
- `contexts/` → Global state management (Auth, Notifications)

## 🛠️ Development Guide

### Code Organization & Best Practices

#### Backend API (NestJS)

**Module Structure:**
```
module/
├── {module}.entity.ts        # Database model
├── {module}.repository.ts    # Database queries
├── {module}.dto.ts           # Request/response objects
├── {module}.service.ts       # Business logic
├── {module}.controller.ts    # HTTP endpoints
├── {module}.module.ts        # Module definition
└── {module}.spec.ts          # Unit tests
```

**Creating a New Feature:**
1. Generate module: `nest g resource modules/feature-name`
2. Define entity in `*.entity.ts` with TypeORM decorators
3. Create repository extending `Repository<Entity>`
4. Implement service with business logic
5. Add controller endpoints with DTOs for validation
6. Update `module.ts` to export entity and register repository
7. Import module in `app.module.ts`

**Running Tests:**
```bash
# Unit tests
npm run test

# Specific test file
npm run test -- auth.service.spec

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

#### Format Checker (Python)

**Adding a New Validation Rule:**
1. Create `check_{feature}.py` in `core/` directory
2. Implement function: `def check_{feature}(page_num, ...) -> List[Issue]:`
3. Return Issue objects with: `page`, `code`, `message`, `severity`, `bbox`
4. Import and call in `validator.py`'s `run_all_checks()`
5. Add test cases with sample PDFs

**Configuration:**
- Edit `config.json` to adjust tolerance levels
- Thai language patterns in `config.py` (PATTERNS dict)
- Font exceptions and math symbol definitions

#### Frontend (React)

**Adding a New Page:**
1. Create component in `pages/PageName.tsx`
2. Define types in `types/`
3. Create service in `services/` for API calls
4. Add route to `routes/index.tsx`
5. Use custom hooks (`useAuth`, `useNotification`, etc)
6. Leverage context for global state

**Styling:**
- Use Tailwind CSS utility classes
- Custom CSS in `styles/` as modules
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`

### Database Migrations

**Generate Migration (after entity changes):**
```bash
npm run migration:generate -- --name AddNewField
# Creates: src/database/migrations/{timestamp}-AddNewField.ts
```

**Review & Execute:**
```bash
# Check pending migrations
npm run typeorm -- migration:show

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

**Manual Migration:**
```typescript
// src/database/migrations/timestamp-FeatureName.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class FeatureName1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'new_table',
        columns: [
          // column definitions
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('new_table');
  }
}
```

### Code Quality Standards

**Linting & Formatting:**
```bash
# Backend API
cd vutf-api
npm run lint           # ESLint
npm run format         # Prettier

# Frontend
cd web-vutf
npm run lint
npm run format
```

**ESLint Rules:**
- No `console.log` in production code
- Proper error handling with try-catch
- No unused imports or variables
- TypeScript strict mode enabled

**Prettier Format:**
- 2 spaces indentation (JS/TS)
- Single quotes for strings
- Semicolons required
- Max line length: 80 characters

### Testing

**Backend Unit Tests:**
```typescript
// example.service.spec.ts
describe('ExampleService', () => {
  let service: ExampleService;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ExampleService],
    }).compile();
    service = module.get<ExampleService>(ExampleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should perform action', () => {
    const result = service.doSomething();
    expect(result).toBeDefined();
  });
});
```

**E2E Tests:**
```typescript
// app.e2e-spec.ts
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  });
});
```

**Frontend Testing (if Jest configured):**
```typescript
// Example.test.tsx
import { render, screen } from '@testing-library/react';
import Example from './Example';

describe('Example Component', () => {
  it('renders correctly', () => {
    render(<Example />);
    expect(screen.getByText(/text/i)).toBeInTheDocument();
  });
});
```

### Performance Tips

**Backend:**
- Use pagination for large datasets
- Implement Redis caching for frequent queries
- Use database indexes on frequently queried fields
- Batch file uploads for threading efficiency
- Monitor RabbitMQ queue length for bottlenecks

**Format Checker:**
- Process PDFs asynchronously
- Cache font information per page
- Parallel check execution when possible
- Limit PDF size (e.g., max 100MB)

**Frontend:**
- Code split routes with React.lazy()
- Memoize expensive computations (useMemo)
- Lazy load images
- Minimize bundle size
- Use virtualization for long lists

### Debugging

**Backend Debugging:**
```bash
# Start with debugger on port 9229
npm run start:debug

# In VS Code: Attach debugger or use launch.json
{
  "type": "node",
  "request": "attach",
  "name": "Attach",
  "port": 9229
}
```

**Frontend Debugging:**
```bash
# Use browser DevTools (F12)
# Or use VS Code Debugger for Chrome
npm run dev
# Add breakpoints in source code
```

**Database Debugging:**
```bash
# Access PostgreSQL directly
psql -U vutf_user -d vutf_db

# Query examples
SELECT * FROM "user" WHERE email = 'student@example.com';
SELECT * FROM submission WHERE status = 'PROCESSING';
```

### Environment Management

**Development (.env for development):**
- Local database connection
- JWT secret (any value)
- Logging level: debug

**Production (.env for production):**
- Remote database (Cloud SQL, RDS)
- Strong JWT secret
- Disabled debug logging
- HTTPS only
- CORS restricted origins

## � API Documentation & Testing

### Backend API Endpoints

#### Authentication
```
POST   /auth/login              # Authenticate user
POST   /auth/register            # Create new account
POST   /auth/refresh-token      # Refresh JWT token
POST   /auth/logout             # Logout and invalidate token
GET    /auth/me                 # Get current user profile
```

#### Users
```
GET    /users                   # List all users (pagination)
GET    /users/:id              # Get user details
POST   /users                   # Create new user
PATCH  /users/:id              # Update user
DELETE /users/:id              # Delete user
POST   /users/:id/change-password # Change password
```

#### Thesis Management
```
GET    /thesis                  # List all theses (with filters)
GET    /thesis/:id             # Get thesis details
POST   /thesis                  # Create new thesis
PATCH  /thesis/:id             # Update thesis metadata
DELETE /thesis/:id             # Delete thesis
GET    /thesis/:id/submissions # Get all submissions for thesis
```

#### Submissions & Validation
```
POST   /submissions             # Submit thesis file
GET    /submissions            # List submissions with status
GET    /submissions/:id        # Get submission details
PATCH  /submissions/:id        # Update submission
PATCH  /submissions/:id/status # Update submission status
DELETE /submissions/:id        # Delete submission

POST   /submissions/:id/resubmit # Resubmit with new file
GET    /submissions/:id/history # Get submission history
```

#### Reports
```
GET    /report-file/:submissionId           # Download validation report (CSV)
GET    /report-file/:submissionId/pdf       # Download annotated PDF
GET    /report-file/:submissionId/summary   # Get report summary
POST   /report-file/:submissionId/regenerate # Regenerate report
```

#### Dashboard & Analytics
```
GET    /dashboard/stats        # Overall statistics
GET    /dashboard/recent       # Recent submissions
GET    /dashboard/pending      # Pending approvals
GET    /dashboard/charts       # Analytics data
```

#### Export & Reporting
```
GET    /export-file/thesis-list      # Export all theses
GET    /export-file/submissions      # Export submissions
GET    /export-file/reports          # Export all reports
GET    /export-file/audit-log        # Export audit log (admin only)
```

#### Notifications
```
WebSocket connected on: /socket.io/

Events:
- submission:created (payload: submissionData)
- submission:processing (payload: submissionId)
- submission:completed (payload: submissionId, reportPath)
- submission:failed (payload: submissionId, error)
- notification:alert (payload: message, type)
- audit-log:entry (payload: logData)
```

### Format Checker API

#### PDF Validation
```
POST /check_pdf

Request:
- Form data with key: "file"
- Value: PDF file (multipart/form-data)

Response (200):
{
  "issues": [
    {
      "page": 1,
      "code": "FONT_ERROR",
      "severity": "error",
      "message": "ฟอนต์ผิดระเบียบ: GenericSerif (ต้องเป็น Sarabun)",
      "bbox": [10, 20, 100, 30]
    }
  ],
  "summary": {
    "total_issues": 45,
    "critical": 10,
    "warnings": 35
  },
  "execution_time_ms": 1234
}
```

#### CSV Report Format
```
Page,Code,Severity,Message,BBox
1,FONT_ERROR,error,"ฟอนต์ผิด: GenericSerif","[10,20,100,30]"
1,MARGIN_ERROR,error,"ขอบซ้ายผิด: 37.5mm (ต้องเป็น 38.1mm)","[0,0,50,100]"
2,INDENT_WARNING,warning,"ระยะย่อหน้าผิด: 9mm (ต้องเป็น 10mm)","[30,50,400,60]"
```

### Testing with Postman/HTTP Client

**1. Authentication Flow:**
```http
### Login
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

### Response
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "name": "Student Name",
    "role": "student"
  }
}

### Store token for subsequent requests
# Add header to all requests:
# Authorization: Bearer {access_token}
```

**2. Thesis Submission:**
```http
### Create Thesis
POST http://localhost:3000/thesis
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Thesis Title",
  "description": "Thesis description",
  "advisor_id": "advisor-uuid",
  "submission_deadline": "2024-05-31"
}

### Upload Submission
POST http://localhost:3000/submissions
Authorization: Bearer {token}
Content-Type: multipart/form-data

file=@/path/to/thesis.pdf
thesis_id=thesis-uuid
```

**3. Check Validation Status:**
```http
### Get Submission Details
GET http://localhost:3000/submissions/{submission_id}
Authorization: Bearer {token}

### Response
{
  "id": "submission-uuid",
  "thesis_id": "thesis-uuid",
  "file_path": "/uploads/thesis.pdf",
  "status": "COMPLETED",
  "created_at": "2024-03-01T10:30:00Z",
  "completed_at": "2024-03-01T10:32:15Z",
  "report": {
    "id": "report-uuid",
    "total_issues": 45,
    "critical_issues": 10,
    "warnings": 35
  }
}
```

**4. Download Report:**
```http
### Get CSV Report
GET http://localhost:3000/report-file/{submission_id}
Authorization: Bearer {token}

# Returns: CSV file download

### Get Annotated PDF
GET http://localhost:3000/report-file/{submission_id}/pdf
Authorization: Bearer {token}

# Returns: PDF file with issue annotations
```

**5. Format Checker Test:**
```http
### Upload for Validation (using cURL)
curl -X POST http://localhost:8002/check_pdf \
  -F "file=@/path/to/thesis.pdf"

### Response
{
  "issues": [...],
  "summary": {...},
  "execution_time_ms": 1234
}
```

### Using VS Code REST Client

Create `test.http` file:
```http
### Variables
@baseUrl = http://localhost:3000
@token = your-jwt-token

### Authentication
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

###
@token = <copy token from response>

### Get Current User
GET {{baseUrl}}/auth/me
Authorization: Bearer {{token}}

### List Submissions
GET {{baseUrl}}/submissions?page=1&limit=10
Authorization: Bearer {{token}}

### Submit Thesis
POST {{baseUrl}}/submissions
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

thesis_id=<uuid>
file=@/path/to/thesis.pdf

### Download Report
GET {{baseUrl}}/report-file/<submission-id>
Authorization: Bearer {{token}}
```

### API Response Format

**Success Response:**
```json
{
  "statusCode": 200,
  "message": "Operation successful",
  "data": { /* response body */ }
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest",
  "details": { /* error details */ }
}
```

**Pagination Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    { /* items */ }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Submission retrieved |
| 201 | Created | Thesis created |
| 204 | No Content | Deletion successful |
| 400 | Bad Request | Invalid file format |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Submission not found |
| 409 | Conflict | Duplicate entry |
| 413 | Payload Too Large | File exceeds size limit |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |
| 503 | Service Unavailable | Validation engine offline |

## 📊 Understanding Validation Reports

### Report Columns Explained

**CSV Report Format:**
```
Page: Page number where issue detected (1-indexed)
Code: Issue identifier (e.g., FONT_ERROR, MARGIN_ERROR)
Severity: error, warning, or info
Message: Thai language description of issue
BBox: [x0, y0, x1, y1] - Bounding box coordinates in points
```

### Issue Codes Reference

#### Font Issues
| Code | Meaning | Typical Fix |
|------|---------|------------|
| FONT_ERROR | Wrong font family | Change to Sarabun font |
| FONT_SIZE_ERROR | Font size outside tolerance | Use 16pt ± 2pt |
| FONT_SIZE_WARNING | Minor size deviation | Check font consistency |
| FONT_LANG_WARNING | Thai font instead of Latin | Use appropriate fonts |

#### Margin Issues
| Code | Meaning | Typical Fix |
|------|---------|------------|
| MARGIN_TOP_ERROR | Top margin too small | Increase top margin to 38.1mm |
| MARGIN_LEFT_ERROR | Left margin too small | Increase left margin to 38.1mm |
| MARGIN_BOTTOM_ERROR | Bottom margin too small | Increase bottom margin to 25.4mm |
| MARGIN_RIGHT_ERROR | Right margin too small | Increase right margin to 25.4mm |

#### Indentation Issues
| Code | Meaning | Typical Fix |
|------|---------|------------|
| INDENT_HEADING_ERROR | Heading indent wrong | Fix main heading position |
| INDENT_PARA_ERROR | Paragraph indent wrong | Use 10mm first-line indent |
| INDENT_LIST_ERROR | List item indent wrong | Align list items properly |
| INDENT_SUBLIST_ERROR | Sub-list indent wrong | Nested lists must be properly indented |

#### Page Sequence Issues
| Code | Meaning | Typical Fix |
|------|---------|------------|
| PAGE_NUMBER_ERROR | Wrong page numbering | Fix page numbering sequence |
| PAGE_NUMBER_ROMAN_ERROR | Roman numerals incorrect | Use I, II, III (front matter) |
| PAGE_NUMBER_ARABIC_ERROR | Arabic numerals incorrect | Use 1, 2, 3 (main content) |
| PAGE_DUPLICATE_ERROR | Duplicate page numbers | Remove duplicate numbering |

#### Section Issues
| Code | Meaning | Typical Fix |
|------|---------|------------|
| SECTION_SEQ_ERROR | Section numbering wrong | Use sequential numbering (1, 2, 3) |
| SUBSECTION_SEQ_ERROR | Sub-section numbering wrong | Use 1.1, 1.2, 1.3 format |
| CHAPTER_ERROR | Chapter heading missing | Add "บทที่ N" header |
| CHAPTER_SEQ_ERROR | Chapter number doesn't match | Fix chapter numbering |

#### Image/Table Issues
| Code | Meaning | Typical Fix |
|------|---------|------------|
| IMAGE_CAPTION_ERROR | Image caption format wrong | Use "รูปที่ N: Caption" |
| TABLE_CAPTION_ERROR | Table caption format wrong | Use "ตารางที่ N: Caption" |
| IMAGE_SPACING_ERROR | Image too close to text | Add spacing around image |
| TABLE_SPACING_ERROR | Table too close to text | Add spacing around table |

#### Paper Issues
| Code | Meaning | Typical Fix |
|------|---------|------------|
| PAPER_SIZE_ERROR | Not A4 paper | Change page size to A4 |
| PAPER_DPI_LOW_WARNING | Low image resolution | Re-scan with higher DPI |

### Example Report Interpretation

```csv
Page,Code,Severity,Message,BBox
1,MARGIN_TOP_ERROR,error,"ขอบบนผิด: 37.5mm (ต้องเป็น 38.1mm)","[0,0,595,50]"
2,FONT_ERROR,error,"ฟอนต์ผิด: TimesNewRoman (ต้องเป็น Sarabun)","[100,200,400,225]"
3,INDENT_PARA_ERROR,warning,"ระยะย่อหน้าผิด: 9mm (ต้องเป็น 10mm)","[30,150,500,160]"
5,PAGE_NUMBER_ERROR,error,"เลขหน้าผิด: ต้องเป็นเลขอารบิก","[550,20,585,35]"
```

**Interpretation:**
1. Page 1: Top margin too small (37.5mm, should be 38.1mm) - **Critical**
2. Page 2: Wrong font (Times New Roman instead of Sarabun) - **Critical**
3. Page 3: Paragraph indent slightly off (9mm instead of 10mm) - **Warning**
4. Page 5: Wrong page number format - **Critical**

### Fixing Issues

1. **Download the annotated PDF** - Shows exact locations of issues
2. **Review CSV report** - Understand each issue
3. **Open thesis in editor** - Make corrections
4. **Save and resubmit** - Upload corrected version
5. **Compare reports** - Verify issues are resolved

### Common Issue Patterns

**Too Many Font Issues:**
- Check if entire thesis uses wrong font
- Set default font to Sarabun in word processor
- Verify embedded fonts in PDF

**Margin Issues on Every Page:**
- Check page setup/format settings
- Verify margins in page layout (not within content)
- Re-export PDF with correct page Setup

**Inconsistent Page Numbering:**
- Check for manual page numbers in text
- Use word processor's page numbering feature
- Restart numbering at each chapter if needed

## 🔐 Security Best Practices

### Authentication & Authorization

**JWT Token Security:**
- Store token in memory or secure HTTP-only cookie (not localStorage)
- Set appropriate expiration times (15 min access, 7d refresh)
- Validate token signature on every request
- Rotate JWT secrets regularly in production

**Password Security:**
```typescript
// Backend service example
import * as bcrypt from 'bcrypt';

// Hash password on registration
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// Verify password on login
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

**Role-Based Access Control (RBAC):**
```typescript
// Use @Roles() decorator for protected endpoints
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'instructor')
@Get('/admin-only')
adminOnly() {
  return 'Admin access only';
}
```

### Input Validation

**Frontend:**
```typescript
// Validate before sending to backend
import { z } from 'zod';

const submissionSchema = z.object({
  thesis_id: z.string().uuid(),
  file: z.instanceof(File).refine(
    (file) => file.size <= 50 * 1024 * 1024,
    'File must be less than 50MB'
  ),
});
```

**Backend:**
```typescript
// Use class-validator for DTOs
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### File Upload Security

**Validation:**
- Check file MIME type (application/pdf only)
- Validate file size limits (max 50MB recommended)
- Scan files for malware (optional: integrate ClamAV)
- Generate unique filenames to prevent overwrites

```typescript
// Backend service
validateUploadedFile(file: Express.Multer.File) {
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_TYPES = ['application/pdf'];
  
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new BadRequestException('Only PDF files allowed');
  }
  if (file.size > MAX_SIZE) {
    throw new BadRequestException('File exceeds 50MB limit');
  }
  
  // Generate secure filename
  const filename = `${Date.now()}-${randomUUID()}.pdf`;
  return filename;
}
```

### Database Security

**SQL Injection Prevention:**
- Use ORM (TypeORM) parameterized queries
- Never concatenate user input in queries
- Sanitize all user inputs

```typescript
// Good - TypeORM prevents SQL injection
const user = await this.userRepository.findOne({
  where: { email: userInput },
});

// Bad - Avoided with ORM
const query = `SELECT * FROM user WHERE email = '${userInput}'`;
```

**Data Encryption:**
```typescript
// Encrypt sensitive fields
import * as crypto from 'crypto';

encryptField(plaintext: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
```

### API Security

**Rate Limiting:**
```typescript
// Use ThrottlerModule in NestJS
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,        // Time window in seconds
      limit: 10,      // Max requests per window
    }),
  ],
})
export class AppModule {}
```

**CORS Configuration:**
```typescript
// Be specific about allowed origins
app.enableCors({
  origin: process.env.FRONTEND_URL?.split(',') || [],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

**HTTPS in Production:**
- Obtain SSL certificate (Let's Encrypt free)
- Set Secure, HttpOnly, SameSite flags on cookies
- Implement HSTS (HTTP Strict Transport Security)

### Environment Management

**Secrets Management:**
```bash
# Never commit .env file
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore

# Use environment-specific files
.env.development
.env.production
.env.staging

# For production, use secure secret management:
# - AWS Secrets Manager
# - Azure Key Vault
# - HashiCorp Vault
```

### Audit & Logging

**Enable Audit Logging:**
```typescript
// Log all user actions
@Injectable()
export class AuditService {
  async log(userId: string, action: string, details: any) {
    await this.auditRepository.save({
      userId,
      action,
      details,
      timestamp: new Date(),
      ipAddress: this.getClientIp(),
      userAgent: this.getUserAgent(),
    });
  }
}
```

**Monitor & Alert:**
- Log all authentication attempts
- Alert on failed login attempts (brute force detection)
- Track file uploads and access
- Monitor database queries

## 🗄️ Database Schema & Management

### Core Entities Overview

```
User (Authentication & Identity)
├── id (UUID), email, password (hashed), name, role
├── role: admin | instructor | student
└── timestamps: created_at, updated_at

Thesis (Thesis Metadata)
├── id, title, description, status
├── student_id → User
├── advisor_id → User
├── submission_deadline
└── timestamps

Submission (Thesis Version)
├── id, thesis_id → Thesis
├── file_path, file_name, file_size
├── submission_number (v1, v2, ...)
├── status: PENDING | PROCESSING | COMPLETED | APPROVED | REJECTED
└── inspector_id → User (nullable)

Report (Validation Results)
├── id, submission_id → Submission (UNIQUE)
├── total_issues, critical_issues, warning_issues
├── csv_content (full report data)
├── annotated_pdf_path
└── timestamps

AuditLog (Activity Tracking)
├── user_id → User, action, entity_type, entity_id
├── changes (JSONB: old & new values)
├── ip_address, user_agent
└── timestamp

Notification (User Alerts)
├── user_id → User
├── type: submission_started | submission_completed | resubmit_required
├── message, is_read
└── timestamps
```

### Database Operations

**Running Migrations:**
```bash
cd vutf-api

# Check migration status
npm run typeorm -- migration:show

# Generate migration from entity changes
npm run migration:generate -- --name AddNewFeature

# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Seed with initial data
npm run seed
```

**Backup & Restore:**
```bash
# Backup PostgreSQL database
pg_dump -U vutf_user -h localhost vutf_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip backup_20240301_120000.sql  # Creates .sql.gz

# Restore from backup
psql -U vutf_user -h localhost vutf_db < backup_20240301_120000.sql

# Restore compressed backup
gunzip -c backup_20240301_120000.sql.gz | psql -U vutf_user -h localhost vutf_db
```

**Performance Optimization:**
```sql
-- Create indexes for common queries
CREATE INDEX idx_submission_status ON submission(status);
CREATE INDEX idx_submission_thesis ON submission(thesis_id);
CREATE INDEX idx_submission_created ON submission(created_at DESC);
CREATE INDEX idx_user_email ON "user"(email UNIQUE);
CREATE INDEX idx_thesis_student ON thesis(student_id);
CREATE INDEX idx_report_submission ON report(submission_id);

-- Analyze query plans
EXPLAIN ANALYZE 
SELECT * FROM submission 
WHERE status = 'PENDING' 
ORDER BY created_at DESC;

-- Vacuum to reclaim space
VACUUM ANALYZE;

-- Check index usage
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';
```

**Direct Database Access:**
```bash
# Connect to PostgreSQL
psql -U vutf_user -h localhost -d vutf_db

# Useful queries
\dt                    # List tables
\d+ submission         # Describe table
SELECT COUNT(*) FROM submission;
SELECT * FROM submission WHERE status = 'PENDING';
UPDATE submission SET status = 'COMPLETED' WHERE id = 'uuid';

# Export data to CSV
\copy (SELECT * FROM submission) TO 'submissions.csv' CSV HEADER;
```

## 📦 Build, Deployment & Production

### Building for Production

#### Backend API Build
```bash
cd vutf-api

# Build NestJS project
npm run build

# Output created in dist/
# dist/main.js - Main application file
# dist/**/*.js - All compiled files

# Verify build
ls -la dist/
```

#### Frontend Production Build
```bash
cd web-vutf

# Build with TypeScript checking
npm run build

# Output created in dist/
# dist/index.html - Main HTML file
# dist/assets/ - Bundled CSS, JS, images

# Test production build locally
npm run preview
# Open http://localhost:4173
```

#### Docker Images
```bash
# Build backend image
cd vutf-api
docker build -t vutf-backend:latest .

# Build frontend image
cd web-vutf
docker build -t vutf-frontend:latest .

# Or use docker-compose to build all
docker-compose build
```

### Deployment Strategies

#### Strategy 1: Direct Server Deployment

**Prerequisites:**
- Ubuntu 20.04+ server
- Node.js 18+, Python 3.8+, PostgreSQL 12+
- SSH access to server
- Domain name (optional)

**Steps:**

1. **Prepare Server:**
```bash
# SSH into server
ssh user@server-ip

# Install dependencies
sudo apt update
sudo apt install nodejs npm python3 postgresql postgresql-contrib nginx git

# Start services
sudo systemctl start postgresql
```

2. **Deploy Backend:**
```bash
# Clone repository
git clone <repo-url> /var/www/vutf-api
cd /var/www/vutf-api

# Install and build
npm install
npm run build

# Start with PM2 (process manager)
sudo npm install -g pm2
pm2 start "npm run start:prod" --name vutf-api
pm2 save
```

3. **Deploy Frontend:**
```bash
# Build frontend
cd /var/www/web-vutf
npm install
npm run build

# Serve with nginx
# Copy dist/ to /var/www/html or configure reverse proxy
cp -r dist/* /var/www/html/
```

4. **Nginx Configuration:**
```nginx
# /etc/nginx/sites-available/vutf
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket upgrade
    location /socket.io/ {
        proxy_pass http://localhost:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # SSL (with Let's Encrypt)
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
}
```

#### Strategy 2: Docker Container Deployment

```bash
# Using docker-compose on production server
scp docker-compose.yaml user@server:/var/www/vutf/
scp .env.production user@server:/var/www/vutf/.env
ssh user@server

cd /var/www/vutf
docker-compose up -d

# Monitor containers
docker-compose ps
docker-compose logs -f backend
```

#### Strategy 3: Cloud Deployment

**AWS Deployment (Elastic Beanstalk + RDS):**
```bash
# Install AWS CLI
pip install awsebcli

# Initialize Elastic Beanstalk
eb init -p node.js-18 vutf-backend

# Create environment
eb create vutf-prod

# Deploy
eb deploy

# View logs
eb logs
```

**Azure Deployment (App Service + Azure Database for PostgreSQL):**
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Deploy
az webapp up --name vutf-app --resource-group myResourceGroup --runtime "NODE|18-lts"
```

**Google Cloud Deployment (Cloud Run + Cloud SQL):**
```bash
# Install Google Cloud CLI
# Deploy to Cloud Run (serverless)
gcloud run deploy vutf-backend \
  --source . \
  --platform managed \
  --region us-central1

# Connect to Cloud SQL
gcloud sql connect vutf-db --user=postgres
```

### Production Configuration

**Environment Variables (.env.production):**
```env
# Node
NODE_ENV=production

# Database (Cloud)
DB_HOST=cloud-db.example.com
DB_PORT=5432
DB_USERNAME=vutf_prod_user
DB_PASSWORD=strong_random_password_here
DB_DATABASE=vutf_production

# Redis (Cloud)
REDIS_HOST=cloud-redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=redis_strong_password

# JWT
JWT_SECRET=very_long_random_string_min_32_chars
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=https://yourdomain.com

# File Storage (S3 or GCS)
AWS_S3_BUCKET=vutf-pdfs-prod
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=***
AWS_SECRET_ACCESS_KEY=***

# Email
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASSWORD=sendgrid_api_key

# Format Checker
FORMAT_CHECKER_URL=https://format-checker.yourdomain.com

# Logging
LOG_LEVEL=warn
SENTRY_DSN=your_sentry_dsn_here
```

### Monitoring & Maintenance

**Health Checks:**
```bash
# Check backend availability
curl -I https://yourdomain.com/api/health

# Check database connection
curl -I https://yourdomain.com/api/db-health

# Monitor uptime (set up cron job)
*/5 * * * * curl https://yourdomain.com/health || alert_admin
```

**Log Aggregation (ELK Stack):**
```yaml
# Send logs to centralized location
- Filebeat collects logs from services
- Logstash processes and filters
- Elasticsearch stores logs
- Kibana visualizes logs
```

**Performance Monitoring:**
- **New Relic** - Application performance monitoring
- **Datadog** - Infrastructure and APM monitoring
- **Sentry** - Error tracking and reporting

**Backup Strategy:**
```bash
# Daily backups
0 2 * * * /usr/local/bin/backup-database.sh

# Weekly full backups
0 3 * * 0 /usr/local/bin/backup-full.sh

# Verify backups
0 4 * * * /usr/local/bin/verify-backups.sh
```

**SSL/TLS Certificate Renewal:**
```bash
# Auto-renewal with Let's Encrypt
0 12 * * * certbot renew --quiet
```

## 📚 Documentation & Resources

### Project Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Backend API | [vutf-api/README.md](./vutf-api/README.md) | API setup & usage |
| Format Checker | [fp-vutf/README.md](./fp-vutf/README.md) | Validator setup & configuration |
| Frontend | [web-vutf/README.md](./web-vutf/README.md) | Frontend development |
| Contribution Guidelines | [CONTRIBUTING.md](./fp-vutf/CONTRIBUTING.md) | How to contribute |

### External Documentation

**NestJS Framework:**
- [Official Documentation](https://docs.nestjs.com)
- [NestJS - Getting Started](https://docs.nestjs.com/first-steps)
- [TypeORM Guide](https://typeorm.io)

**React Framework:**
- [React Documentation](https://react.dev)
- [React Hooks](https://react.dev/reference/react)
- [React Router](https://reactrouter.com)

**Python & FastAPI:**
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [PyMuPDF Documentation](https://pymupdf.readthedocs.io)
- [Python Official Docs](https://docs.python.org)

**Database & DevOps:**
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Redis Documentation](https://redis.io/docs)

### Code Examples

**Example 1: Creating a Submission**
```typescript
// Frontend
const submitThesis = async (fileInput: File, thesisId: string) => {
  const formData = new FormData();
  formData.append('thesis_id', thesisId);
  formData.append('file', fileInput);

  try {
    const response = await axiosInstance.post('/submissions', formData);
    showNotification('Submission uploaded successfully');
    return response.data;
  } catch (error) {
    showError('Failed to upload thesis');
  }
};
```

**Example 2: Checking Validation Status (Polling)**
```typescript
// Frontend - Poll server for status updates
const checkValidationStatus = async (submissionId: string) => {
  const interval = setInterval(async () => {
    const response = await axiosInstance.get(`/submissions/${submissionId}`);
    
    if (response.data.status === 'COMPLETED') {
      clearInterval(interval);
      downloadReport(submissionId);
    } else if (response.data.status === 'FAILED') {
      clearInterval(interval);
      showError('Validation failed');
    }
  }, 2000); // Check every 2 seconds
};
```

**Example 3: WebSocket Notifications (Real-time Status)**
```typescript
// Frontend - Real-time updates via WebSocket
const socket = io('http://localhost:3000');

socket.on('submission:completed', (data) => {
  console.log('Submission finished:', data.submissionId);
  downloadReport(data.submissionId);
});

socket.on('submission:failed', (data) => {
  console.log('Submission failed:', data.error);
  showError(data.error);
});
```

**Example 4: Downloading and Processing Report**
```typescript
// Frontend - Download and parse CSV report
const downloadAndParseReport = async (submissionId: string) => {
  try {
    const response = await axiosInstance.get(
      `/report-file/${submissionId}`,
      { responseType: 'blob' }
    );
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report_${submissionId}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Or parse CSV
    const csv = await response.data.text();
    const rows = Papa.parse(csv).data;
    displayIssues(rows);
  } catch (error) {
    showError('Failed to download report');
  }
};
```

### FAQ (Frequently Asked Questions)

**Q: How long does validation take?**
A: Typically 1-5 seconds depending on PDF size and complexity. Large PDFs (50+ pages) may take longer.

**Q: What's the maximum file size?**
A: Default is 50MB. Can be increased in `.env` (MAX_FILE_SIZE).

**Q: Can I resubmit a thesis?**
A: Yes, students can resubmit unlimited times. Each submission is versioned.

**Q: Where are validation reports stored?**
A: CSV in database, PDFs in S3/storage, originals in file system.

**Q: Is there an API for bulk submissions?**
A: Not yet, but can be implemented. Contact development team.

**Q: How do I extend validation checks?**
A: Add new `check_*.py` file in `fp-vutf/thesis_checker/core/` and call from `validator.py`.

**Q: Can I customize validation rules?**
A: Yes, edit `config.json` in `fp-vutf/thesis_checker/`.

**Q: How do I integrate with our existing LMS?**
A: Use the REST API. See [API Documentation](#-api-documentation--testing).

**Q: What about GDPR compliance?**
A: Implement data retention policies, user data export, and right-to-be-forgotten endpoints.

**Q: Can I white-label the system?**
A: Yes, customize styling and configuration in frontend and backend configs.

### Performance Benchmark

**Typical Performance Metrics:**

| Metric | Expected | Hardware* |
|--------|----------|-----------|
| PDF Upload | <10s | Standard (2 cores, 4GB RAM) |
| Single Page Validation | 50-100ms | Per page analysis |
| Full PDF (100 pages) | 5-10s | 2-core CPU with SSD |
| Full PDF (500 pages) | 20-40s | High volume |
| Report CSV Generation | <1s | Database write |
| API Response (list) | <500ms | With 1000 records |
| API Response (single) | <100ms | Direct DB lookup |

*Hardware: 2 CPU cores, 4GB RAM, SSD storage

### Scalability Considerations

**Vertical Scaling (Bigger Server):**
- Increase CPU cores for parallel PDF processing
- Add more RAM for caching (Redis)
- Use faster SSD for database and file storage

**Horizontal Scaling (Multiple Servers):**
- Run multiple format checker instances behind load balancer
- Deploy API on multiple servers with load balancer
- Use shared database and Redis
- Queue jobs with RabbitMQ

**Caching Strategies:**
- Cache validation reports (Redis)
- Cache user sessions (Redis)
- Cache PDF font analysis results
- CDN for static frontend assets

### Integration Examples

**Integrating with Moodle LMS:**
```php
// Moodle plugin endpoint
$courseId = required_param('course', PARAM_INT);
$assignmentId = required_param('assignment', PARAM_INT);
$submissionId = $DB->get_field('assign_submission', 'id', 
    array('assignment' => $assignmentId)
);

// Call VUTF API
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://vutf.example.com/api/submissions',
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . $vutfApiToken
    ),
    CURLOPT_POSTFIELDS => json_encode(array(
        'thesis_id' => $assignmentId,
        'student_id' => $USER->id
    ))
));
$response = curl_exec($curl);
```

**Integrating with Canvas LMS:**
```javascript
// Canvas plugin
const canvasAssignment = {
  name: 'Thesis Submission',
  description: 'Submit your thesis with automatic format validation',
  external_tool_tag_attributes: {
    url: 'https://vutf.example.com/canvas-launch',
    text: 'Submit Thesis',
    new_tab: false
  }
};

fetch('/api/v1/courses/:course_id/assignments', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + canvasToken },
  body: JSON.stringify({ assignment: canvasAssignment })
});
```

### Troubleshooting Resources

- **GitHub Issues**: Report bugs and request features
- **Stack Overflow**: Tag questions with project frameworks
- **Community Forums**: Join discussions with other users
- **Slack**: Join community Slack (if available)

### Version History

| Version | Release Date | Major Changes |
|---------|--------------|--------------|
| 1.0.0 | 2024-03-01 | Initial release |
| 0.9.0-beta | 2024-02-15 | Beta testing phase |
| 0.1.0-alpha | 2024-01-01 | Project inception |

### Roadmap (Future Features)

- [ ] Multi-language support (Thai, English, Chinese)
- [ ] Advanced analytics dashboard
- [ ] Custom validation rule builder (UI)
- [ ] Batch submission processing
- [ ] Mobile app (iOS/Android)
- [ ] AI-powered auto-correction suggestions
- [ ] Video tutorial integration
- [ ] Third-party LMS integrations
- [ ] Webhook notifications
- [ ] API rate limiting dashboard

### License

This project is licensed under [LICENSE] (Please check LICENSE file)

### Contributors

- Development Team
- Quality Assurance
- Documentation Team

### Acknowledgments

- NestJS Team ([nestjs.com](https://nestjs.com))
- React Community
- PyMuPDF Contributors
- PostgreSQL Community
- Open-source community

## 🐛 Troubleshooting Guide

### Installation Issues

#### Node.js/npm Problems
```bash
# Error: npm command not found
# Solution: Install Node.js from https://nodejs.org/
# Verify installation:
node --version
npm --version

# Error: npm ERR! code ERESOLVE
# Solution: Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Error: npm ERR! peer dep missing
# Solution: Install peer dependencies
npm install --save-peer [package-name]
```

#### Python Environment Issues
```bash
# Error: python3: command not found
# Solution: Install Python 3.8+
# Windows: Download from python.org
# macOS: brew install python@3.11
# Linux: sudo apt-get install python3.11

# Error: No module named 'fastapi'
# Solution: Ensure venv is activated
source venv/bin/activate  # macOS/Linux
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt

# Error: ModuleNotFoundError: No module named 'pymupdf'
# Solution: Install missing dependency
pip install pymupdf pymupdf-layout
```

#### Database Connection Errors

```bash
# Error: connect ECONNREFUSED 127.0.0.1:5432
# Solution: PostgreSQL not running or wrong port
# Windows: Start PostgreSQL from Services
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Check PostgreSQL is running:
psql -U postgres -c "SELECT version();"

# Error: role "vutf_user" does not exist
# Solution: Create database user
psql -U postgres -c "CREATE ROLE vutf_user WITH LOGIN PASSWORD 'password';"
psql -U postgres -c "ALTER ROLE vutf_user CREATEDB;"

# Error: database "vutf_db" does not exist
# Solution: Create database
psql -U postgres -c "CREATE DATABASE vutf_db OWNER vutf_user;"
```

### Runtime Issues

#### Backend API (NestJS)

**Port Already in Use:**
```bash
# Error: listen EADDRINUSE :::3000
# Solution: Find and kill process using port 3000

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Or change port in .env:
APP_PORT=3001
```

**Database Migration Failed:**
```bash
# Error: QueryFailedError: relation "user" does not exist
# Solution: Run migrations
npm run migration:run

# Check migration status:
npm run typeorm -- migration:show

# Reset database (WARNING: deletes data):
npm run typeorm -- query "SELECT * FROM typeorm_metadata;"
npm run migration:revert  # Revert all
npm run migration:run     # Run all again

# Seed with initial data:
npm run seed
```

**JWT Token Errors:**
```bash
# Error: Unauthorized (token expired/invalid)
# Solution: Check JWT_SECRET in .env and ensure consistency
# Frontend: Delete localStorage JWT and login again
localStorage.clear()
# Or logout and login again
```

**RabbitMQ Connection Error:**
```bash
# Error: Cannot connect to message queue
# Solution: Ensure RabbitMQ is running
docker-compose logs rabbitmq

# Check connection:
docker exec vutf_rabbitmq rabbitmq-diagnostics -q ping
# Should return "ok"

# RabbitMQ Management UI:
# http://localhost:15672 (guest/guest)
```

#### Format Checker (Python)

**PDF Processing Errors:**
```python
# Error: fitz.FileError: cannot open file
# Solution: Verify PDF file exists and is valid
# Check PDF file:
pip install pdfplumber
python -c "import pdfplumber; pdf = pdfplumber.open('file.pdf')"

# Error: RuntimeError: Font not found
# Solution: PDF might have embedded fonts issue
# Try: Install system fonts or resave PDF

# Error: MemoryError (large PDF)
# Solution: Increase memory or chunk processing
# Limit PDF size in config.json:
max_file_size_mb = 100
```

**Configuration Issues:**
```bash
# Error: KeyError: 'font' (config.json parsing)
# Solution: Verify config.json syntax
python -c "import json; json.load(open('config.json'))"
# Check all required fields exist

# Error: Margin/Indent checks not working
# Solution: Edit config.json with correct mm values
# Verify tolerance is reasonable (±2mm for margins)
```

**Port/Network Issues:**
```bash
# Error: Connection refused on 8002
# Solution: Format checker not running or wrong port
python main.py                    # Start service
python main.py --port 8002       # Check port
python main.py --host 0.0.0.0    # Listen all interfaces

# Check if port listening:
# Windows: netstat -an | findstr 8002
# macOS/Linux: lsof -i :8002

# Firewall blocking:
# Add Python to firewall exceptions
```

#### Frontend (React)

**Blank Page / Won't Load:**
```bash
# Error: Page shows blank or only header
# Solution 1: Clear browser cache
# DevTools → Ctrl+Shift+Delete → Clear all

# Solution 2: Check browser console for errors
# F12 → Console tab
# Look for errors in red

# Solution 3: Verify backend is running
curl http://localhost:3000/health
# Should return 200 OK

# Solution 4: Check .env configuration
cat .env | grep VITE_API_URL
# Should point to http://localhost:3000
```

**CORS Errors:**
```
Error: Access to XMLHttpRequest at 'http://localhost:3000' from 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:**
```bash
# Check backend CORS configuration (src/main.ts):
# allowedOrigins should include frontend URL

# Verify .env in vutf-api:
FRONTEND_URL=http://localhost:5173

# Restart backend for changes to take effect
npm run start:dev
```

**File Upload Fails:**
```
Error: 413 Payload Too Large
```

**Solution:**
```bash
# Increase file size limit in .env:
MAX_FILE_SIZE=52428800  # 50MB

# Check API configuration (src/main.ts):
app.use(json({ limit: '50mb' }))
app.use(urlencoded({ limit: '50mb' }))

# Restart backend after changes
```

**WebSocket Connection Failed:**
```
Error: WebSocket connection failed
```

**Solution:**
```typescript
// Check socketService.ts configuration
const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

// Verify Socket.IO is enabled in backend:
// src/main.ts should have:
// app.useWebSocketAdapter(new IoAdapter(app));
```

### Performance Issues

**Slow Submission Processing:**

```bash
# Check format checker logs:
tail -f fp-vutf/thesis_checker/debug_output_data.ans

# Check RabbitMQ queue length:
# RabbitMQ UI: http://localhost:15672 → Queues tab
# Long queue means processing backlog

# Solution: Scale format checker or optimize checks
# Edit config.json to reduce tolerance/checks
```

**High Memory Usage:**

```bash
# Monitor memory:
# Windows (PowerShell):
Get-Process | sort-object WS -Descending | select-object -first 5

# macOS/Linux:
top
# Press 'M' to sort by memory

# Solution: Restart services/increase RAM
# Or reduce batch size for processing
```

**Slow Database Queries:**

```bash
# Enable slow query logging:
# PostgreSQL config: log_min_duration_statement = 1000

# Check index usage:
# In psql:
SELECT * FROM pg_stat_user_indexes;

# Add missing indexes:
CREATE INDEX idx_submission_status ON submission(status);
CREATE INDEX idx_user_email ON "user"(email);
```

### Docker Issues

**Container Won't Start:**
```bash
# Check logs:
docker-compose logs service_name

# Verify images exist:
docker images

# Rebuild images:
docker-compose build --no-cache

# Clean up and restart:
docker-compose down -v
docker-compose up -d
```

**Port Conflicts:**
```bash
# Change port mapping in docker-compose.yaml:
# From: "3000:3000"
# To: "3001:3000"

# Then:
docker-compose down
docker-compose up -d
```

### Getting Help

**Before Reporting Issues:**
1. Check error logs: `docker-compose logs [service]`
2. Verify all services running: `docker-compose ps`
3. Test endpoints: `curl http://localhost:3000/health`
4. Check browser console (F12)
5. Verify .env configuration
6. Try restarting services

**Enable Debug Logging:**

```bash
# Backend:
# In .env:
LOG_LEVEL=debug

# Frontend:
# In browser console:
localStorage.setItem('debug', '*')

# Python:
# In config.py:
DEBUG = True
```

**Common Solution Checklist:**
- [ ] All services running (Docker: `docker-compose ps`)
- [ ] Database connected (Test: `npm run typeorm -- query "SELECT 1"`)
- [ ] Environment variables configured (.env files present)
- [ ] Ports not in use (Check with `netstat` or `lsof`)
- [ ] File permissions correct (Linux: `chmod 755` directories)
- [ ] Node/Python versions correct (Verify with `--version`)
- [ ] Fresh install tried (Delete `node_modules`, reinstall)

### Support Resources

- **NestJS Documentation:** https://docs.nestjs.com/
- **React Documentation:** https://react.dev/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Docker Documentation:** https://docs.docker.com/
- **GitHub Issues:** Check for known issues in repository
- **Stack Overflow:** Tag your question with appropriate frameworks

## 📞 Support & Contact

### Getting Help

**For Technical Issues:**
1. **Check Documentation** - Review README files in each component
2. **Search Existing Issues** - GitHub issues or discussions
3. **Enable Debug Mode** - Set DEBUG=true in configs for detailed logs
4. **Collect Information Before Reporting:**
   - Error message and stack trace
   - Steps to reproduce
   - Environment details (OS, Node/Python version)
   - Recent changes made
   - Server logs (if applicable)

### Reporting Issues

**Create GitHub Issue with:**
```markdown
## Title
Brief description of the problem

## Expected Behavior
What should happen

## Actual Behavior
What is happening instead

## Steps to Reproduce
1. Step 1
2. Step 2
3. ...

## Environment
- OS: Windows/macOS/Linux
- Node.js Version: X.X.X
- Python Version: X.X.X
- PostgreSQL Version: X.X.X

## Error Message
```
error stack trace here
```

## Additional Context
Any other relevant information
```

### Support Channels

| Channel | Contact | Response Time |
|---------|---------|--------------|
| GitHub Issues | [Create Issue](/issues) | 24-48 hours |
| Email | support@vutf.example.com | 24-48 hours |
| Slack | #vutf-support | Real-time (during work hours) |
| Forum | discuss.vutf.example.com | 24-72 hours |

### Community Contribution

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

### Professional Support

For enterprise support, training, or custom development:
- **Email:** support@vutf.example.com
- **Phone:** +66-00-000-0000

### Security Issues

**Report Security Vulnerabilities Responsibly:**
- DO NOT post publicly on GitHub issues
- Email: security@vutf.example.com
- Include: description, affected versions, affected components
- Allow 48 hours for initial response

### Training & Onboarding

**Available Resources:**
- Video Tutorials (YouTube)
- Live Webinars (Quarterly)
- Documentation Wiki
- Interactive Tutorials
- Custom Training (Enterprise)

**Onboarding Checklist:**
- [ ] Development environment setup
- [ ] Database configuration
- [ ] API testing and exploration
- [ ] Frontend development
- [ ] Deployment strategies
- [ ] Security best practices

---

## 📄 License

This project is licensed under the [LICENSE](./LICENSE) file - please check for licensing details.

### Citation

If you use this project in academic work, please cite:

```bibtex
@software{vutf2025,
  title = {Thesis Format Verification System},
  author = {RMUTT Computer Engineering Team},
  year = {2025},
  url = {https://github.com/pleumKittipoom/Thesis-Format-Verification-System}
}
```

## 🎯 Quick Reference

### Essential Commands

```bash
# Backend
npm run start:dev          # Start development server
npm run test              # Run tests
npm run build             # Build for production
npm run migration:run     # Run database migrations

# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Check code quality

# Format Checker
python main.py          # Start validation service
pip install -r requirements.txt  # Install dependencies

# Docker
docker-compose up -d    # Start all services
docker-compose down     # Stop all services
docker-compose logs -f  # View logs
```

### Environment Variables Template

```env
# Backend
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=vutf_user
DB_PASSWORD=password
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000

# Format Checker
PYTHONUNBUFFERED=1
```

### Useful URLs

```
http://localhost:5173    # Frontend (React)
http://localhost:3000    # Backend API
http://localhost:8002    # Format Checker API
http://localhost:15672   # RabbitMQ Management
http://localhost:8080    # Adminer (Database UI)
```

### Directory Navigation

```bash
cd fp-vutf/thesis_checker  # Format checker
cd vutf-api                # Backend API
cd web-vutf                # Frontend
```

### Common Development Tasks

```bash
# Start all services for development
cd vutf-api && npm run start:dev &
cd fp-vutf/thesis_checker && python main.py &
cd web-vutf && npm run dev

# Run tests across all modules
npm --prefix vutf-api run test

# Format all code
npm --prefix vutf-api run format
npm --prefix web-vutf run format

# Database backup
pg_dump -U vutf_user -d vutf_db > backup.sql

# View logs
docker-compose logs -f backend
docker-compose logs -f db
```

---

**Last Updated:** April 2026  
**Project Version:** 1.0.0  
**Maintained by:** Development Team  
**Status:** ✅ Active Development

### Stars & Fork

If you found this project useful, please consider giving it a ⭐ and sharing with others!

---
