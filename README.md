# 💰 Expense Tracker

A full-stack expense management application built with React, Spring Boot, and MySQL.

## 🚀 Live Demo

🔗 Live Application: Coming Soon

## 📌 About The Project

Expense Tracker is a full-stack web application designed to help users manage and track their daily expenses efficiently.

The application provides a simple and user-friendly interface for recording expenses, managing financial data, and viewing expense information in an organized way.

## ✨ Features

- Add and manage expenses
- View expense records
- Expense categorization
- User-friendly dashboard
- REST API based backend
- MySQL database integration
- Responsive React frontend
- Secure database configuration using environment variables

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

### Database
- MySQL

### Tools
- Git
- GitHub
- VS Code
- MySQL Workbench

## 📂 Project Structure

```text
expense-tracker/
├── backend/
│   ├── src/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore

⚙️ Local Setup
1. Clone the repository
git clone https://github.com/abhaytdev/Expense-Tracker.git
cd Expense-Tracker
2. Database Setup
Create a MySQL database:
CREATE DATABASE expense_tracker;
3. Backend Setup
Navigate to the backend:
cd backend
Set your database password as an environment variable.
PowerShell:
$env:DB_PASSWORD="your_mysql_password"
Run the Spring Boot application:
mvn spring-boot:run
Backend runs on:
http://localhost:8080
4. Frontend Setup
Open another terminal:
cd frontend
npm install
npm run dev
Frontend runs on:
http://localhost:5173
🔐 Environment Variables
The database password is not stored directly in the source code.
spring.datasource.password=${DB_PASSWORD}
Set the environment variable before starting the backend.
🔗 Application Architecture
React + Vite
     │
     │ REST API
     ▼
Spring Boot Backend
     │
     │ JPA / Hibernate
     ▼
MySQL Database
📡 Backend
The backend is implemented using Spring Boot and provides REST APIs for communicating with the frontend and managing application data.
🗄️ Database
MySQL is used as the relational database.
Hibernate/JPA is used for database interaction and entity management.
🔒 Security
Database credentials are handled using environment variables.
Sensitive credentials are not committed to GitHub.
.gitignore is used to prevent unnecessary/local files from being uploaded.
📈 Future Improvements
User authentication and authorization
Expense analytics and charts
Monthly/ yearly reports
Budget management
Export expenses to CSV/PDF
Cloud deployment
Improved mobile responsiveness
👨‍💻 Author
Abhay Singh
GitHub: https://github.com/abhaytdev⁠�
├── README.md
└── BACKEND_VERIFICATION.md you actually create if it isn't `expense-tracker`.
