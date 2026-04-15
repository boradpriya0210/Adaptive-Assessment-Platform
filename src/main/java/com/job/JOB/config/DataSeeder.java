package com.job.JOB.config;

import com.job.JOB.entity.Question;
import com.job.JOB.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (questionRepository.count() == 0) {
            seedQuestions();
        }
    }

    private void seedQuestions() {
        List<Question> questions = new ArrayList<>();

        // EASY Questions (Topic: Java)
        questions.add(new Question(null, "Java", Question.Difficulty.EASY, 
            "What is the default value of a boolean variable in Java?", "True", "False", "null", "0", "False"));
        questions.add(new Question(null, "Java", Question.Difficulty.EASY, 
            "Which keyword is used to create an object in Java?", "class", "new", "object", "create", "new"));
        questions.add(new Question(null, "Java", Question.Difficulty.EASY, 
            "What is the size of int data type in Java?", "8-bit", "16-bit", "32-bit", "64-bit", "32-bit"));
        questions.add(new Question(null, "Java", Question.Difficulty.EASY, 
            "Which package contains the Random class?", "java.util", "java.lang", "java.io", "java.net", "java.util"));
        questions.add(new Question(null, "Java", Question.Difficulty.EASY, 
            "Which of these is NOT a primitive data type?", "int", "double", "char", "String", "String"));

        // MEDIUM Questions (Topic: Java)
        questions.add(new Question(null, "Java", Question.Difficulty.MEDIUM, 
            "What is the purpose of the 'volatile' keyword?", "To make a variable immutable", "To ensure thread safety for a variable", "To prevent serialization", "To declare a constant", "To ensure thread safety for a variable"));
        questions.add(new Question(null, "Java", Question.Difficulty.MEDIUM, 
            "Which collection allows duplicate elements but maintains insertion order?", "HashSet", "TreeSet", "ArrayList", "HashMap", "ArrayList"));
        questions.add(new Question(null, "Java", Question.Difficulty.MEDIUM, 
            "What is the base class for all exceptions in Java?", "RuntimeException", "Exception", "Throwable", "Error", "Throwable"));
        questions.add(new Question(null, "Java", Question.Difficulty.MEDIUM, 
            "Which method is used to start a thread execution?", "init()", "start()", "run()", "resume()", "start()"));
        questions.add(new Question(null, "Java", Question.Difficulty.MEDIUM, 
            "What does the 'final' keyword mean when applied to a class?", "The class cannot be instantiated", "The class cannot be inherited", "The class methods are all final", "The class is thread-safe", "The class cannot be inherited"));

        // HARD Questions (Topic: Java)
        questions.add(new Question(null, "Java", Question.Difficulty.HARD, 
            "What is the difference between fail-fast and fail-safe iterators?", "Fail-fast throws ConcurrentModificationException, Fail-safe doesn't", "Fail-safe throws ConcurrentModificationException, Fail-fast doesn't", "There is no difference", "Fail-fast is used only for Maps", "Fail-fast throws ConcurrentModificationException, Fail-safe doesn't"));
        questions.add(new Question(null, "Java", Question.Difficulty.HARD, 
            "How does a WeakHashMap handle keys?", "It prevents keys from being garbage collected", "Keys can be garbage collected if no other references exist", "Keys are stored in a database", "It is synchronized by default", "Keys can be garbage collected if no other references exist"));
        questions.add(new Question(null, "Java", Question.Difficulty.HARD, 
            "What is the use of PhantomReference in Java?", "To keep an object in memory", "To perform cleanup before garbage collection", "To increase memory efficiency", "To implement caching", "To perform cleanup before garbage collection"));
        questions.add(new Question(null, "Java", Question.Difficulty.HARD, 
            "What is the purpose of the 'ForkJoinPool'?", "To handle standard I/O", "To execute tasks in parallel using work-stealing algorithm", "To manage database connections", "To implement thread-local storage", "To execute tasks in parallel using work-stealing algorithm"));
        questions.add(new Question(null, "Java", Question.Difficulty.HARD, 
            "In Java 8, which interface is a functional interface?", "Serializable", "Comparable", "Predicate", "List", "Predicate"));

        // Aptitude Questions - EASY
        questions.add(new Question(null, "Aptitude", Question.Difficulty.EASY, 
            "What is the next number in the series: 2, 4, 8, 16, ...?", "24", "30", "32", "64", "32"));
        questions.add(new Question(null, "Aptitude", Question.Difficulty.EASY, 
            "If 5 workers can build a wall in 10 days, how many days will 10 workers take?", "5 days", "10 days", "20 days", "2 days", "5 days"));

        // Aptitude Questions - MEDIUM
        questions.add(new Question(null, "Aptitude", Question.Difficulty.MEDIUM, 
            "A train 150m long is running at 54 km/hr. How much time will it take to cross a platform 250m long?", "20s", "25s", "26.67s", "30s", "26.67s"));
        questions.add(new Question(null, "Aptitude", Question.Difficulty.MEDIUM, 
            "The sum of ages of 5 children born at the intervals of 3 years each is 50 years. What is the age of the youngest child?", "4 years", "8 years", "10 years", "12 years", "4 years"));

        // Aptitude Questions - HARD
        questions.add(new Question(null, "Aptitude", Question.Difficulty.HARD, 
            "A sum of money at compound interest amounts to thrice itself in 3 years. In how many years will it be 9 times itself?", "6 years", "9 years", "12 years", "15 years", "6 years"));
        questions.add(new Question(null, "Aptitude", Question.Difficulty.HARD, 
            "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:", "10 min", "12 min", "15 min", "25 min", "12 min"));

        questionRepository.saveAll(questions);
    }
}
