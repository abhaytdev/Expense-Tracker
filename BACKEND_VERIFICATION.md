# Backend Verification Report

**Maven was not available in the build environment (no route to Maven Central), so `mvn compile` / `mvn spring-boot:run` were never executed. Nothing below should be read as "compiles successfully" — it is a static, file-by-file consistency review only. Treat this as a head start on debugging, not a guarantee.**

## What was actually checked

All 33 backend files were reviewed by hand and cross-checked with scripted greps (package declarations against folder paths, `javax` vs `jakarta` imports, repository method calls against repository interface declarations, DTO constructor call sites against declared constructors, entity annotations, controller endpoint paths, CORS/session config, and a search for leftover TODOs or client-supplied `user_id`). Files checked:

- `ExpenseTrackerApplication.java`
- `config/`: `SecurityConfig.java`, `CorsConfig.java`
- `controller/`: `AuthController`, `TransactionController`, `DashboardController`, `UserController`, `FeedbackController`
- `dto/`: `RegisterRequest`, `LoginRequest`, `UserResponse`, `UpdateProfileRequest`, `TransactionRequest`, `TransactionResponse`, `DashboardResponse`, `FeedbackRequest`, `ApiErrorResponse`
- `entity/`: `User`, `Transaction`, `Feedback`
- `enums/TransactionType.java`
- `repository/`: `UserRepository`, `TransactionRepository`, `FeedbackRepository`
- `service/`: `AuthService`, `TransactionService`, `DashboardService`, `UserService`, `FeedbackService`
- `exception/`: `ResourceNotFoundException`, `DuplicateEmailException`, `InvalidCredentialsException`, `GlobalExceptionHandler`
- `pom.xml`, `application.properties`

## Results, by category

| Check | Result |
|---|---|
| Package declaration matches folder path | Pass — all 33 files |
| `javax.*` imports (should all be `jakarta.*` for Spring Boot 3) | Pass — none found |
| Repository methods called from services exist (declared or inherited from `JpaRepository`/`JpaSpecificationExecutor`) | Pass — every call traced |
| DTO constructor call sites match declared constructor signatures | Pass — `UserResponse` (4 args), `TransactionResponse` (7 args), `ApiErrorResponse` (2 args) all verified at every call site |
| Every `@Entity` has a public no-arg constructor (required by JPA) | Pass — `User`, `Transaction`, `Feedback` |
| Entity relationship annotations (`@ManyToOne`, `@JoinColumn`, `@Enumerated`) | Present and consistent on `Transaction.user`, `Feedback.user`, `Transaction.type` |
| Controller endpoint paths match the spec's API table | Pass — see the endpoint list in `README.md` |
| No endpoint reads `user_id` from the client | Pass — every transaction/feedback path derives the user from `Authentication.getName()` → `UserRepository.findByEmail(...)`, never from the request body |
| `Sort` imported wherever `Sort.by(...)` is used | Pass — `TransactionRepository`, `TransactionService`, `DashboardService` |
| CORS: exact origin (not `*`) + `allowCredentials(true)` | Pass — `http://localhost:5173` only, per the CORS+credentials rule that forbids combining `*` with credentials |
| Logout: `POST /api/auth/logout`, matched explicitly (not relying on Spring Security's version-dependent default matcher) | Configured with `AntPathRequestMatcher("/api/auth/logout", "POST")` |
| No leftover TODO/FIXME/placeholder/`UnsupportedOperationException` | Pass — none found |
| `pom.xml` has all 5 required dependencies + correct Java version | Pass — `spring-boot-starter-web`, `-data-jpa`, `-security`, `-validation`, `mysql-connector-j` (runtime). Originally `<java.version>17</java.version>` with parent `3.3.4`; bumped to `<java.version>25</java.version>` with parent `3.5.6` on request, since 3.5.5+ is the first Spring Boot 3.x line to explicitly document Java 25 support |
| `application.properties` MySQL URL/driver/dialect | Present and consistent with `com.mysql.cj.jdbc.Driver` / `MySQLDialect` |

## What static checking cannot confirm (this is the honest limit)

- Whether `HttpStatusReturningLogoutSuccessHandler`'s no-arg constructor and `AuthenticationConfiguration.getAuthenticationManager()` exist with exactly this signature on the Spring Security 6.x version Maven actually resolves. These are standard, long-standing APIs, but "standard" is not "confirmed" without a compiler.
- Whether the `UserDetailsService` bean (defined in `SecurityConfig`, backed by `UserRepository`) correctly wires into `AuthenticationManager` at runtime — this is standard Spring Boot autoconfiguration behavior, but it's a runtime bean-graph question, not something grep can verify.
- Whether Hibernate maps `Transaction`/`Feedback`/`User` to MySQL cleanly with `ddl-auto=update` — mapping errors (e.g. reserved-word column names, charset issues) only surface when Hibernate actually talks to a live MySQL instance.
- Whether the exact dependency versions Maven resolves are mutually compatible (transitive version conflicts don't show up in a text review).

## Fixes applied during the review

No inconsistencies were found that needed fixing — the checks above came back clean. The one deliberate, non-default choice worth flagging: logout uses an explicit `AntPathRequestMatcher` for `POST /api/auth/logout` instead of relying on `logout()`'s default matcher, specifically to avoid a version-dependent default.

## Commands to run locally

```bash
cd backend
mvn clean install      # resolves dependencies + compiles — this is the real test
mvn spring-boot:run    # starts the server on :8080
```

## Expected successful output

`mvn clean install` ends with `BUILD SUCCESS`. `mvn spring-boot:run` ends its startup log with a line like:

```
Tomcat started on port 8080 (http) with context path ''
Started ExpenseTrackerApplication in X.XXX seconds
```

If you see that, the backend is genuinely verified — more than anything a static review can promise.

## Common errors and solutions

| Error | Likely cause | Fix |
|---|---|---|
| `Unknown database 'expense_tracker'` | Database was never created | Run `CREATE DATABASE expense_tracker;` in MySQL first — Hibernate creates tables, not the database itself |
| `Access denied for user 'root'@'localhost'` | Wrong password in `application.properties` | Update `spring.datasource.password` to your real MySQL root password |
| `Communications link failure` / connection refused | MySQL isn't running, or wrong port | Start MySQL; confirm it's on `3306` (or update the URL) |
| `Public Key Retrieval is not allowed` | MySQL 8 default auth plugin | Already handled via `allowPublicKeyRetrieval=true` in the datasource URL; if it still appears, check your MySQL user's auth plugin |
| `Port 8080 was already in use` | Another process on 8080 | Stop it, or change `server.port` |
| CORS error in the browser console | Frontend not running on `http://localhost:5173`, or backend not restarted after a config change | Confirm the Vite dev server port; restart `mvn spring-boot:run` after any `SecurityConfig`/`CorsConfig` edit |
| Login succeeds but `current-user` returns 401 right after | Browser blocking the session cookie | Confirm Axios has `withCredentials: true` (it does, in `axiosConfig.js`) and that you're calling `http://localhost:8080`, not `127.0.0.1` (browsers treat these as different origins for cookie purposes) |

## Addendum: Java 17 → 25 version bump

Per request, `pom.xml` was changed from Spring Boot `3.3.4` / Java `17` to Spring Boot `3.5.6` / Java `25`. This is a **larger** unknown than the original review, not a smaller one:

- It's a real, evidence-backed pairing — Spring Boot's own release notes confirm 3.5.5+ documents Java 25 support, and 25 (not 26) was chosen specifically because it's the current LTS (support into the early 2030s) while 26 is a 6-month, non-LTS release.
- But it is a version this exact project has never been built against, in this sandbox or anywhere else. The rest of the code (entities, DTOs, security config) didn't need to change for this bump, and a grep pass confirms no other file still references `17` or `3.3.4` — but "no code changes were needed" is a code-review claim, not a build result.
- `mvn clean install` is still the only thing that actually confirms this combination works end to end on your machine.
