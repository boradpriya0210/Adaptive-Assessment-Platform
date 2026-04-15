# Running Without Maven

## Quick Solution: Install Maven

**Download Maven**: https://maven.apache.org/download.cgi
- Download `apache-maven-3.9.x-bin.zip`
- Extract to `C:\Program Files\Apache\maven`
- Add to PATH: `C:\Program Files\Apache\maven\bin`
- Restart terminal and run `mvn -version`

## Then Run:

```bash
mvn clean install
mvn spring-boot:run
```

## Alternative: Use IDE

### IntelliJ IDEA (Recommended)
1. Open IntelliJ IDEA
2. File → Open → Select project folder
3. Wait for Maven import to complete
4. Find `JobApplication.java`
5. Click green ▶ play button

### VS Code with Java Extension
1. Install "Extension Pack for Java"
2. Install "Spring Boot Extension Pack"
3. Open project folder
4. Press F5 to run

## MySQL Database Setup

Before running, ensure:
```sql
CREATE DATABASE adaptive_assessment_db;
```

Update `application.properties` if needed:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

## Access Application

Once running:
- URL: http://localhost:8080/
- Admin: admin@test.com / admin123
