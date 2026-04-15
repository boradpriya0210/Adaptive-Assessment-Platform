# 🎯 Adaptive Aptitude & DSA Assessment Platform

A full-stack web application that conducts adaptive aptitude, logical reasoning, and DSA tests with real-time difficulty adjustment. Built with Spring Boot backend and modern vanilla JavaScript frontend.

## ✨ Features

### 🎯 Core Functionality
- **Adaptive Difficulty Algorithm**: Questions automatically adjust based on performance using DSA concepts (HashMap, Priority Queue)
- **Comprehensive Test Topics**: Aptitude, Logical Reasoning, Arrays, Strings, HashMap, Trees, Graphs, Dynamic Programming, and more
- **Real-time Feedback**: Instant answer validation with visual feedback
- **Detailed Analytics**: Performance tracking with weak topics identification and speed analysis

### 🎨 Unique Frontend Features
- **Card-based Test Interface**: Modern, non-typical exam UI
- **Circular Progress Timer**: Animated SVG timer with color transitions
- **Difficulty Meter**: Visual progress bar showing Easy → Medium → Hard transitions
- **Dark/Light Mode**: Smooth theme toggle with localStorage persistence
- **Micro-animations**: Smooth transitions, pulse effects, shake animations on incorrect answers
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🧠 Backend Highlights
- **JWT Authentication**: Secure user authentication and authorization
- **Adaptive Difficulty Engine**: Uses HashMap for O(1) accuracy lookup, analyzes time per question
- **Performance Analytics**: Topic-wise accuracy, speed analysis, strengths/weaknesses identification
- **Database Seeding**: 30+ pre-loaded questions across difficulty levels

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 4.0.1
- **Database**: MySQL
- **Security**: Spring Security + JWT
- **ORM**: JPA/Hibernate
- **Language**: Java 21

### Frontend
- **Core**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Custom CSS with CSS Variables for theming
- **Animations**: Keyframe animations, SVG progress indicators

## 📋 Prerequisites

- **Java**: JDK 21 or higher
- **Maven**: 3.6 or higher
- **MySQL**: 8.0 or higher
- **Browser**: Modern browser with JavaScript enabled

## 🚀 Setup Instructions

### 1. Database Setup

Create MySQL database:
```sql
CREATE DATABASE adaptive_assessment_db;
```

Update database credentials in `src/main/resources/application.properties` if needed:
```properties
spring.datasource.username=root
spring.datasource.password=root
```

### 2. Build and Run

```bash
# Navigate to project directory
cd "c:\Users\Borad Priya\Downloads\SE Project"

# Clean and build
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 3. Access the Application

- **Landing Page**: http://localhost:8080/
- **Register**: http://localhost:8080/register.html
- **Login**: http://localhost:8080/login.html

### 4. Default Admin Credentials

- **Email**: admin@test.com
- **Password**: admin123

## 📊 Database Schema

### Tables
1. **users** - User accounts with role-based access
2. **questions** - Question bank (30+ seeded questions)
3. **tests** - Test sessions with adaptive difficulty tracking
4. **responses** - User answers with time and correctness
5. **performance** - Aggregated performance metrics

## 🎮 How to Use

1. **Register/Login**: Create an account or login
2. **Dashboard**: View your stats and start a new test
3. **Take Test**: Answer 20 adaptive questions
   - Timer starts at 60 seconds per question
   - Select an option and click Submit
   - Difficulty adjusts based on your performance
4. **View Results**: See detailed breakdown after test completion
5. **Analytics**: Track your progress, weak topics, and strengths

## 🧪 Adaptive Difficulty Logic

The platform uses advanced algorithms:

```
1. Start with EASY difficulty
2. After each answer:
   - If CORRECT && accuracy >= 70%: Increase difficulty
   - If WRONG && accuracy < 50%: Decrease difficulty
   - Else: Maintain current difficulty
3. Time-based adjustments:
   - If avg_time < 20s: Consider increasing difficulty
   - If avg_time > 90s: Consider decreasing difficulty
```

## 📁 Project Structure

```
src/
├── main/
│   ├── java/com/job/JOB/
│   │   ├── config/         # Security, Data Seeder
│   │   ├── controller/     # REST API Controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA Entities
│   │   ├── filter/         # JWT Filter
│   │   ├── repository/     # JPA Repositories
│   │   ├── service/        # Business Logic
│   │   └── util/           # JWT Utility
│   └── resources/
│       ├── static/         # Frontend files
│       │   ├── css/        # Stylesheets
│       │   ├── js/         # JavaScript files
│       │   └── *.html      # HTML pages
│       └── application.properties
```

## 🎯 DSA Concepts Used

- **HashMap**: Accuracy tracking per difficulty level (O(1) lookup)
- **Arrays**: Question storage and response management
- **Strings**: Question text manipulation
- **Graph Concepts**: Topic dependency analysis
- **Priority Concepts**: Question selection based on difficulty

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Test Management
- `POST /api/test/start` - Start new test
- `POST /api/test/submit-answer` - Submit answer and get next question

### Results & Analytics
- `GET /api/result/{testId}` - Get test result
- `GET /api/performance` - Get user performance analytics

## 🎨 UI Features

### Landing Page
- Hero section with floating animated cards
- Features showcase
- Call-to-action buttons

### Test Interface
- Circular SVG timer with color transitions (Green → Yellow → Red)
- Difficulty meter with smooth gradient animations
- Card-based question and options
- Micro-animations on selection and feedback

### Results Page
- Circular progress indicator for accuracy
- Stats cards with icons
- Difficulty breakdown (Easy/Medium/Hard)

## 🌙 Dark Mode

Toggle between light and dark themes using the moon/sun icon in the navigation bar. Theme preference is saved in localStorage.

## 📱 Responsive Design

All pages are fully responsive and optimized for:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## 🎓 Sample Questions

The database is seeded with 30 questions:
- **10 Easy**: Basic aptitude, simple DSA
- **10 Medium**: Intermediate problems
- **10 Hard**: Advanced DSA, complex reasoning

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <process_id> /F
```

### Database Connection Error
- Ensure MySQL is running
- Verify database credentials in `application.properties`
- Check if database `adaptive_assessment_db` exists

### Frontend Loading Issues
- Clear browser cache
- Check browser console for errors
- Ensure backend is running on port 8080

## 👨‍💻 Development

To modify the project:

1. **Backend Changes**: Edit Java files, rebuild with `mvn clean install`
2. **Frontend Changes**: Edit HTML/CSS/JS in `src/main/resources/static/`, refresh browser
3. **Database Changes**: Modify entities, restart application (JPA will update schema)

## 🎉 Demo Credentials

For quick testing:

**User 1:**
- Email: test@example.com
- Password: test123 (create via registration)

**Admin:**
- Email: admin@test.com
- Password: admin123

## 📝 License

This project is created for educational and interview preparation purposes.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for a unique, production-ready assessment platform.

---

**Note**: Make sure MySQL is running before starting the application. The database schema will be created automatically on first run, and sample questions will be seeded.

For any issues, please check the console logs for detailed error messages.
