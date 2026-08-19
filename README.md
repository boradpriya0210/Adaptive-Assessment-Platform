Adaptive Assessment Platform

A full-stack web application designed to help users prepare for interviews through adaptive assessments. The platform dynamically adjusts question difficulty based on user performance and provides detailed analytics, test history, and topic-wise performance insights.

🚀 Features

User Features

User registration and secure login

JWT-based authentication

Profile management

Topic-based assessments

Adaptive question difficulty

Real-time answer validation

Test result and score tracking

Test history

Performance analytics

Weak-topic identification

Strength analysis

Dark/light theme support

Admin Features

Role-based admin access

Question management

Add and manage assessment questions

Monitor platform data and users

Adaptive Assessment Engine

The platform automatically adjusts question difficulty based on performance:

Easy → Medium → Hard when accuracy meets the required threshold.

Difficulty decreases when performance falls below the configured threshold.

Performance is evaluated using answer accuracy and response data.

Topic-wise performance is analyzed to identify strengths and weak areas.

🛠️ Technologies Used

Backend

Java 21

Spring Boot

Spring Web

Spring Data JPA

Hibernate

Spring Security

JWT (JSON Web Token)

MySQL

Maven

Lombok

Frontend

HTML5

CSS3

JavaScript

Vite

Deployment

Docker

🏗️ Project Architecture

Frontend
HTML + CSS + JavaScript + Vite
        │
        │ REST API
        ▼
Spring Boot Backend
        │
        ├── Spring Security
        ├── JWT Authentication
        ├── Adaptive Difficulty Engine
        ├── JPA / Hibernate
        │
        ▼
MySQL Database

📂 Project Structure

SE Project/
│
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── test.js
│   │   ├── result.js
│   │   ├── history.js
│   │   ├── profile.js
│   │   └── admin.js
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── test.html
│   │   ├── result.html
│   │   ├── history.html
│   │   ├── profile.html
│   │   ├── admin.html
│   │   └── add-question.html
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── src/
│   ├── main/
│   │   ├── java/com/job/JOB/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── filter/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── util/
│   │   └── resources/
│   │       ├── static/
│   │       └── application.properties
│
├── Dockerfile
├── pom.xml
└── README.md

📋 Main Modules

1. Authentication

Provides user registration and login using JWT-based authentication.

2. Adaptive Testing

Users can select a topic and begin an assessment. The system evaluates answers and dynamically adjusts question difficulty.

3. Question Management

Supports topic-based questions with different difficulty levels such as Easy, Medium, and Hard.

4. Performance Analysis

Analyzes user performance, accuracy, strengths, and weak topics.

5. Test History

Stores previous assessments and allows users to review their test performance.

6. User Profile

Allows users to view and update their profile information.

7. Admin Panel

Provides administrative functionality for managing assessment questions and platform resources.

🔐 Security

The application implements:

JWT-based authentication

Spring Security

BCrypt password encryption

Role-based authorization

Protected REST API endpoints

Stateless session management

CORS configuration

⚙️ Adaptive Difficulty Logic

The application uses an adaptive difficulty engine to modify the difficulty level during an assessment.

Start Test
    │
    ▼
Easy Question
    │
    ▼
Evaluate Answer
    │
    ├── High Accuracy ──► Increase Difficulty
    │
    ├── Low Accuracy ───► Decrease Difficulty
    │
    └── Normal Accuracy ► Maintain Difficulty
    │
    ▼
Next Question

The assessment currently supports a maximum of 10 questions per test.

🗄️ Database

The application uses MySQL with Spring Data JPA and Hibernate.

Configure the database in:

src/main/resources/application.properties

Example configuration:

spring.datasource.url=jdbc:mysql://localhost:3306/adaptive_assessment_db
spring.datasource.username=your_username
spring.datasource.password=your_password

🚀 Getting Started

Prerequisites

Make sure the following software is installed:

Java 21 or higher

Maven

MySQL

Node.js

npm

🔧 Backend Setup

1. Clone or Extract the Project

Navigate to the project directory:

cd "SE Project"

2. Configure MySQL

Update the database credentials in:

src/main/resources/application.properties

3. Run the Backend

./mvnw spring-boot:run

On Windows:

mvnw.cmd spring-boot:run

The backend runs by default on:

http://localhost:8080

💻 Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Build the frontend:

npm run build

🐳 Docker Deployment

The project includes a multi-stage Dockerfile that:

Builds the Vite frontend.

Copies the generated frontend files into Spring Boot static resources.

Builds the Spring Boot application.

Runs the final application using a Java runtime image.

Build the Docker image:

docker build -t adaptive-assessment-platform .

Run the container:

docker run -p 8080:8080 adaptive-assessment-platform

🔌 Key API Areas

The backend contains API modules for:

Authentication

Users

Tests

Questions

Results

Performance

Administration

📊 Project Highlights

Full-stack web application

Adaptive question difficulty

Topic-based assessments

JWT authentication

Role-based access control

Test history tracking

Performance analytics

Weak-topic identification

Strength analysis

MySQL database integration

Dockerized deployment

Responsive modern user interface

👨‍💻 Developer

Your Name

Role: Full-Stack Developer

📅 Project Duration

Add your actual project duration here

Example: 3 Months

📄 License

This project was developed for educational and academic purposes.
