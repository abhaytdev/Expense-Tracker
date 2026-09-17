# Expense Tracker

A full-stack personal finance tracker: React (Vite) frontend, Spring Boot + MySQL backend, session-based authentication, and a 3D-style finance logo built entirely with SVG and CSS.

> **Backend build status: not executed in this sandbox.** The environment this project was built in has no route to Maven Central, so `mvn` could never run here. The backend was written to standard Spring Boot 3 / Java 17 patterns and checked file-by-file for consistency (see `BACKEND_VERIFICATION.md`), but the first real compiler feedback happens on your machine. The frontend, by contrast, **was** installed and built successfully here (`npm install && npm run build` — 127 modules, no errors).

---

## 1. Project overview

Expense Tracker lets a signed-in user record income and expenses, see a live dashboard of totals and balance, search and filter their transaction history, and manage their profile — all scoped strictly to their own account.

## 2. 3D design concept

The brand mark is an original SVG wallet with a flap, a gold coin, and a checkmark, rendered with linear gradients and a soft drop-shadow — no Three.js, WebGL, or external images. Depth comes from plain CSS: `perspective()`, `rotateX`/`rotateY`, layered shadows, and a `floatLogo` keyframe animation used only on the splash screen and the dashboard hero. The rest of the UI stays flat and calm so the 3D touches read as accents, not a gimmick.

## 3. Features

- Register / log in / log out with a server-side session (no JWT)
- Dashboard: total income, total expenses, balance, transaction count, 5 most recent transactions
- Add / edit / delete transactions, each strictly scoped to the logged-in user
- Search transactions by description/category, filter by type and category
- Profile page (name editable, email read-only), feedback form, help page
- Splash screen, responsive layout (desktop sidebar → mobile top nav)

## 4. Technologies

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, React Router 6, Axios, plain CSS |
| Backend | Java 25 (LTS), Spring Boot 3.5.x, Spring Web, Spring Data JPA, Spring Security, Bean Validation |
| Database | MySQL only |
| Auth | Session cookie (`HttpSession`) + BCrypt password hashing — no JWT |

## 5. Folder structure

```
expense-tracker/
├── README.md
├── BACKEND_VERIFICATION.md
└── backend/
    ├── pom.xml
    └── src/main/
        ├── resources/
        │   ├── application.properties            (edit the MySQL password here)
        │   └── application.properties.example     (checked-in template, same content)
        └── java/com/example/expensetracker/
            ├── ExpenseTrackerApplication.java
            ├── config/        SecurityConfig.java, CorsConfig.java
            ├── controller/    AuthController, TransactionController, DashboardController,
            │                  UserController, FeedbackController
            ├── dto/           RegisterRequest, LoginRequest, UserResponse, UpdateProfileRequest,
            │                  TransactionRequest, TransactionResponse, DashboardResponse,
            │                  FeedbackRequest, ApiErrorResponse
            ├── entity/        User.java, Transaction.java, Feedback.java
            ├── enums/         TransactionType.java
            ├── repository/    UserRepository, TransactionRepository, FeedbackRepository
            ├── service/       AuthService, TransactionService, DashboardService,
            │                  UserService, FeedbackService
            └── exception/     ResourceNotFoundException, DuplicateEmailException,
                               InvalidCredentialsException, GlobalExceptionHandler
└── frontend/
    ├── package.json, vite.config.js, index.html, .env.example
    ├── public/logo-3d.svg
    └── src/
        ├── main.jsx, App.jsx
        ├── api/        axiosConfig, authApi, transactionApi, dashboardApi, userApi, feedbackApi
        ├── context/    AuthContext.jsx
        ├── components/ Logo3D, SplashScreen, Layout, Sidebar, Header, ProtectedRoute,
        │               SummaryCard, TransactionForm, TransactionTable, ConfirmDialog,
        │               LoadingMessage, EmptyMessage
        ├── pages/       Login, Register, Dashboard, AddTransaction, EditTransaction,
        │               Transactions, Profile, Help, Feedback, NotFound
        ├── styles/      variables, global, logo3d, splash, auth, layout, dashboard,
        │               forms, transactions, responsive (.css)
        └── utils/       constants.js, formatCurrency.js, formatDate.js
```

Two small, deliberate additions beyond the original spec's file list, both for a real reason:

- **`UpdateProfileRequest` DTO** — profile editing only changes `name`. Email is left read-only because it's also the session login identifier; if it were editable, changing it mid-session would strand that session (it would stop matching any user row) with no re-verification flow to recover — and the spec explicitly excludes email verification. Simpler to keep it read-only than to build around that edge case.
- **`DuplicateEmailException` / `InvalidCredentialsException`** — two small, focused exception classes so `GlobalExceptionHandler` returns the exact right HTTP status (400 vs 401) instead of overloading `ResourceNotFoundException` for things that aren't "not found."

## 6. Backend architecture

Simple Controller → Service → Repository, one direction only. Controllers extract the current user's email from the injected `Authentication` object (never from the request body) and pass it into the service layer. Services own all business rules — ownership checks, validation-adjacent logic, DTO mapping — and repositories do nothing but data access. `SecurityConfig` defines a `UserDetailsService` bean backed directly by `UserRepository` (a small lambda, not a whole extra class) so `AuthenticationManager` can authenticate against real BCrypt-hashed passwords.

## 7. Frontend architecture

`AuthContext` holds the current user and checks `/api/auth/current-user` once on load to restore the session after a refresh. `ProtectedRoute` redirects to `/login` if that check finds nobody logged in. Axios is centralized in one instance (`withCredentials: true`, base URL from `VITE_API_BASE_URL`) with a response interceptor that redirects to `/login` on a `401` — except for the current-user check itself, which is expected to 401 when nobody's logged in yet.

## 8. Database schema

```sql
users          id (PK), name, email (unique), password (BCrypt hash), created_at
transactions   id (PK), user_id (FK -> users.id), type (INCOME|EXPENSE), amount (decimal),
               category, description, transaction_date, created_at
feedback       id (PK), user_id (FK -> users.id), message, created_at
```

`transactions.user_id` and `feedback.user_id` are `NOT NULL` foreign keys. Hibernate creates/updates these tables automatically (`ddl-auto=update`) — it does **not** create the `expense_tracker` database itself; see the MySQL setup below.

## 9. Authentication flow

1. `POST /api/auth/register` — BCrypt-hashes the password, saves the user.
2. `POST /api/auth/login` — `AuthenticationManager` verifies the password against the stored hash; on success, the `SecurityContext` is written into the `HttpSession` under Spring Security's own session key, and the browser gets a `JSESSIONID` cookie.
3. Every later request sends that cookie (`axios` with `withCredentials: true`); Spring Security's session filter reconstructs the `SecurityContext` from it, so `Authentication.getName()` reliably gives the current user's email in every controller.
4. `POST /api/auth/logout` — handled entirely by Spring Security's logout filter (not a controller method): invalidates the session and clears the cookie.
5. Unauthenticated requests to any protected endpoint get a plain `401`, not a redirect to a login page (the default Spring Security login page is disabled).

## 10. API endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | Public | |
| POST | `/api/auth/login` | Public | |
| POST | `/api/auth/logout` | Protected | Handled by the security filter chain, not a controller |
| GET | `/api/auth/current-user` | Protected | |
| GET | `/api/transactions` | Protected | Optional `search`, `type`, `category` query params |
| POST | `/api/transactions` | Protected | |
| GET | `/api/transactions/{id}` | Protected | 404 if it's not yours |
| PUT | `/api/transactions/{id}` | Protected | 404 if it's not yours |
| DELETE | `/api/transactions/{id}` | Protected | 404 if it's not yours |
| GET | `/api/dashboard/summary` | Protected | |
| GET | `/api/users/profile` | Protected | |
| PUT | `/api/users/profile` | Protected | Name only |
| POST | `/api/feedback` | Protected | |

## 11. MySQL setup

```sql
CREATE DATABASE expense_tracker;
```

That's the only manual step — Hibernate creates the tables on first run. Then edit `backend/src/main/resources/application.properties` (or copy `.example` to a fresh copy) and set your real password:

```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

## 12. Environment variables

Backend: none required beyond `application.properties` (username/password above).

Frontend (`frontend/.env.example` → copy to `.env`):
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## 13. Backend setup and run

Requires **JDK 25** on your PATH (`java -version` should show 25) and Maven.

```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Runs on `http://localhost:8080`.

**Why 25 and not 26:** Java 26 (released March 2026) is a short-term release with only 6 months of support and no LTS guarantee. Java 25 (September 2025) is the current LTS, supported into the 2030s, and Spring Boot 3.5.5+ explicitly documents Java 25 support — so this project pins to Java 25 and Spring Boot 3.5.6 rather than the newer but shorter-lived 26. If you specifically need 26, only `<java.version>` in `pom.xml` has to change; nothing else in the code depends on the exact JDK version.

## 14. Frontend setup and run

```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`. Production build: `npm run build` (already verified to succeed).

## 15. Manual testing checklist

**Auth:** register → duplicate email rejected → login → wrong password rejected → refresh page and stay logged in → logout → dashboard redirects to login when logged out.

**Transactions:** add income → add expense → edit one → delete one (with confirm dialog) → search by description → filter by type → filter by category → clear filters → confirm a second account never sees the first account's transactions.

**Dashboard:** total income / total expense / balance arithmetic is correct → recent list shows at most 5, newest first.

**UI:** splash screen shows once on load → logo appears on splash, login, register, sidebar, and dashboard hero → mobile width (< 720px) collapses the sidebar to a top bar and the transaction table scrolls horizontally instead of overflowing the page.

## 16. Common errors

See the table in `BACKEND_VERIFICATION.md` for MySQL/Maven/CORS troubleshooting (unknown database, access denied, port conflicts, cookie/session issues). The short version: create the database before first run, and restart the backend after any `SecurityConfig` edit.

## 17. Future improvements

Pagination on the transactions list, a proper "change email" flow with re-verification, CSRF protection layered on top of the session cookie for a real deployment (disabled here for simplicity, since everything runs on `localhost`), monthly spending charts, export to CSV.

## 18. Interview explanation

"I built a full-stack Expense Tracker using React, Spring Boot, and MySQL. The frontend is a Vite-based React app with route-level protection, a shared Axios client, and a context that restores the logged-in user on refresh. The backend follows a plain Controller-Service-Repository structure: controllers never trust a client-supplied user ID — they read the current user from Spring Security's `Authentication` object, which is populated from a server-side session rather than a JWT. Passwords are hashed with BCrypt and never returned to the frontend. Every transaction query, update, and delete is scoped to the logged-in user at the repository level, so one account can never see or modify another's data. The 3D-style logo and dashboard hero are built entirely with SVG and CSS — gradients, perspective transforms, and a subtle float animation — so the visual polish doesn't add any real complexity to the stack."

## 19. Pushing this to GitHub

A `.gitignore` is included at the project root (excludes `node_modules`, `dist`, `target`, IDE folders, OS files). From the `expense-tracker` folder:

```bash
git init
git add .
git commit -m "Initial commit: full-stack Expense Tracker (React + Spring Boot + MySQL)"
git branch -M main
```

Create an empty repository on GitHub first (no README/license/gitignore — this project already has its own), then:

```bash
git remote add origin https://github.com/abhaytdev/expense-tracker.git
git push -u origin main
```

Swap the URL for whatever repo name you actually create if it isn't `expense-tracker`.
