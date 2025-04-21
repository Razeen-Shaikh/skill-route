import { getLevelFromXP, getRankFromLevelXP } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { ActivityType, Badge, CoinTransaction, CoinWallet, DifficultyLevel, LastActivity, Quiz, QuizQuestion, Roadmap, RoadmapStep, RoadmapType, StepStatus, Tag, ThemeName, TransactionType, Tutorial, TutorialStatus, User, UserBadge, UserProfile, UserProgress, UserQuestionAttempt, UserQuizAttempt, UserRole, UserStreak } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const hashPassword = async (password: string) => await bcrypt.hash(password, 10);

const roles: UserRole[] = ["USER", "ADMIN", "MODERATOR"];
const themeOptions: ThemeName[] = ['LIGHT', 'DARK'];
const difficultyLevels: DifficultyLevel[] = ["EASY", "MEDIUM", "HARD"];
const tutorialStatus: TutorialStatus[] = ["DRAFT", "PENDING_APPROVAL", "PUBLISHED"];
const transactionType: TransactionType[] = ["EARNED", "SPENT"];
const activityType: ActivityType[] = ["BADGE", "COINS", "LOGIN", "QUIZ", "TUTORIAL", "ROADMAP", "STEP", "TRANSACTION", "XP", "LEVEL"];
const roadmapType: RoadmapType[] = ["AI", "BACKEND", "DEVOPS", "FRONTEND", "FULLSTACK"];
const getTheme = () => themeOptions[Math.floor(Math.random() * themeOptions.length)];
const getRandomDifficulty = (): DifficultyLevel =>
    difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
const getTutorialStatus = (): TutorialStatus => tutorialStatus[Math.floor(Math.random() * tutorialStatus.length)];
const getRole = (): UserRole => roles[Math.floor(Math.random() * roles.length)];
const getTransactionType = (): TransactionType => transactionType[Math.floor(Math.random() * transactionType.length)];
const getActivityType = (): ActivityType => activityType[Math.floor(Math.random() * activityType.length)];
const getRoadmapType = (): RoadmapType => roadmapType[Math.floor(Math.random() * roadmapType.length)];

const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomBool = () => Math.random() < 0.5;
let selected: { [key: string]: string } = {};
const selectedOption = (id: string, quizQuestion: { options: string[] }) => {
    selected = { [id]: quizQuestion.options[Math.floor(Math.random() * 4)] };
    return selected[id];
}

const getResetToken = () => Math.random().toString(36).substring(2, 15);

const getRandomTimeLimit = () =>
    [30, 60, 90, 120, 150, 180, 210, 240, 270, 300][Math.floor(Math.random() * 10)];


// User Progress
const getPercentageCompleted = (userId: string, tutorialId: string, quizRecords: Quiz[] = [], quizAttemptRecords: UserQuizAttempt[] = []) => {
    const tutorialQuizzes = quizRecords.filter(q => q.tutorialId === tutorialId);
    const completedQuizzes = quizAttemptRecords.filter(q => q.profileId === userId && tutorialQuizzes.some(tq => tq.id === q.quizId));

    return tutorialQuizzes.length > 0 ? Math.round((completedQuizzes.length / tutorialQuizzes.length) * 100) : 0;
};
const getUserId = (userProfileRecords: UserProfile[]) => {
    return userProfileRecords[Math.floor(Math.random() * userProfileRecords.length)].userId;
}

const getTotalQuizAttemptsByUserAndTutorial = (userId: string, tutorialId: string, quizRecords: Quiz[] = [], quizAttemptRecords: UserQuizAttempt[] = []) => {
    const tutorialQuizzes = quizRecords.filter((q: { tutorialId: string; id: string }) => q.tutorialId === tutorialId).map(q => q.id);

    return quizAttemptRecords.filter(q => q.profileId === userId && tutorialQuizzes.includes(q.quizId)).length;
};

const getBestScoreByUserIdAndTutorialId = (userId: string, tutorialId: string, quizRecords: Quiz[] = [], quizAttemptRecords: UserQuizAttempt[] = []) => {
    const tutorialQuizzes = quizRecords.filter(q => q.tutorialId === tutorialId).map(q => q.id);

    const userAttempts = quizAttemptRecords.filter(q => q.profileId === userId && tutorialQuizzes.includes(q.quizId));

    if (userAttempts.length === 0) return 0;

    return Math.max(...userAttempts.map(q => q.score));
};


const getIsCompleted = (percentageCompleted: number) => percentageCompleted === 100;

const getQuizId = (quizRecords: Quiz[] = [], tutorialRecords: Tutorial[] = []) =>
    quizRecords.filter((q: { tutorialId: string; id: string }) => q.tutorialId === tutorialRecords[0].id)[Math.floor(Math.random() * quizRecords.filter((q: { tutorialId: string; id: string }) => q.tutorialId === tutorialRecords[0].id).length)].id;
const getScoreBasedOnDifficulty = (difficulty: string) => {
    switch (difficulty) {
        case "EASY":
            return Math.floor(Math.random() * (100 - 60) + 60);
        case "MEDIUM":
            return Math.floor(Math.random() * (90 - 40) + 40);
        case "HARD":
            return Math.floor(Math.random() * (80 - 20) + 20);
        default:
            return Math.floor(Math.random() * 100);
    }
};

async function main() {
    console.log('🌱 Starting database seeding...');

    /** SEED USERS **/

    console.log("🌱 Seeding users...");

    const usersData = [
        { email: "alice@mail.com", username: "razeen", firstName: "Razeen", lastName: "Shaikh" },
        { email: "bob@mail.com", username: "bob", firstName: "Bob", lastName: "Smith" },
        { email: "charlie@mail.com", username: "charlie", firstName: "Charlie", lastName: "Brown" },
        { email: "kali@mail.com", username: "kali", firstName: "Kali", lastName: "Smith" },
        { email: "jane@mail.com", username: "jane", firstName: "Jane", lastName: "Doe" },
        { email: "john@mail.com", username: "john", firstName: "John", lastName: "Doe" },
        { email: "mark@mail.com", username: "mark", firstName: "Mark", lastName: "Smith" },
        { email: "jim@mail.com", username: "jim", firstName: "Jim", lastName: "Smith" },
        { email: "joe@mail.com", username: "joe", firstName: "Joe", lastName: "Smith" },
        { email: "mike@mail.com", username: "mike", firstName: "Mike", lastName: "Smith" },
        { email: "sally@mail.com", username: "sally", firstName: "Sally", lastName: "Smith" },
        { email: "sue@mail.com", username: "sue", firstName: "Sue", lastName: "Smith" },
        { email: "tom@mail.com", username: "tom", firstName: "Tom", lastName: "Smith" },
        { email: "tim@mail.com", username: "tim", firstName: "Tim", lastName: "Smith" },
    ];

    const users: User[] = [];

    for (const userData of usersData) {
        const createdAt = getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000))
        const updatedAt = new Date(createdAt.getTime() + getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000)).getTime());
        // const deletedAt = getRandomBool() ? null : new Date(updatedAt.getTime() + getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000)).getTime());
        const role = getRole() || "GUEST";

        const user = await prisma.user.create({
            data: {
                username: userData.username ?? "user",
                firstName: userData.firstName ?? "",
                lastName: userData.lastName,
                email: userData.email ?? "default@mail.com",
                passwordHash: await hashPassword("password123"),
                role,
                emailVerified: true,
                failedAttempts: 0,
                resetToken: getResetToken(),
                resetTokenExpiry: getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000)),
                lockedUntil: getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000)),
                verificationToken: getResetToken(),
                createdAt,
                updatedAt,
                deletedAt: null,
            }
        });

        users.push({
            ...user,
            id: user.id.toString(),
        });
    }

    console.log(`🌱 Created ${usersData.length} users successfully!`);

    const userRecords = await prisma.user.findMany();

    /** SEED TUTORIALS **/

    console.log('🌱 Seeding tutorials...');

    const tutorialsData = [
        { title: "Basics of HTML", description: "Learn the fundamental structure of an HTML document.", content: '# Basics of HTML\n## Introduction\nHTML (HyperText Markup Language) is the standard language for creating web pages. It structures content using elements enclosed in tags.\n## Setting Up an HTML Document\nEvery HTML document follows a basic structure:\n```html\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Webpage</title>\n  </head>\n  <body>\n    <h1>Welcome to HTML</h1>\n    <p>This is a simple webpage.</p>\n  </body>\n</html>\n```\n### Explanation:\n* `<!DOCTYPE html>` declares the document type.\n* `<html>` is the root element.\n* `<head>` contains meta-information and the title.\n* `<body>` contains the visible page content.\n## Common HTML Elements\n### Headings\nHeadings range from `<h1>` (largest) to `<h6>` (smallest):\n```html\n<h1>Main Heading</h1>\n<h2>Subheading</h2>\n<h3>Smaller Heading</h3>\n```\n### Paragraphs\nText is wrapped in `<p>` tags:\n```html\n<p>This is a paragraph.</p>\n```\n### Links\nCreate hyperlinks using `<a>`:\n```html\n<a href="https://www.example.com">Visit Example</a>\n```\n### Images\nDisplay images with `<img>`:\n```html\n<img src="image.jpg" alt="Description of image">\n```\n### Lists\n#### Ordered List:\n```html\n<ol>\n  <li>First item</li>\n  <li>Second item</li>\n</ol>\n```\n#### Unordered List:\n```html\n<ul>\n  <li>Item one</li>\n  <li>Item two</li>\n</ul>\n```\n## Forms\nForms collect user input:\n```html\n<form>\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name">\n  <input type="submit" value="Submit">\n</form>\n```\n## Tables\nTables organize data:\n```html\n<table>\n  <tr>\n    <th>Name</th>\n    <th>Age</th>\n  </tr>\n  <tr>\n    <td>Alice</td>\n    <td>25</td>\n  </tr>\n</table>\n```\n## Conclusion\nThis guide covers the fundamentals of HTML. Practice by creating your own webpages and experimenting with different elements.', cost: 0, isLocked: false, category: "HTML" },
        {
            title: "HTML Document Structure", description: "Understand the elements that make up an HTML document.", content: `# **HTML Document Structure**  

## **Introduction**  
HTML (HyperText Markup Language) forms the backbone of every web page. It provides the structure and meaning to content by using elements like headings, paragraphs, links, images, and more. Understanding the **HTML document structure** is crucial for building well-structured, accessible, and SEO-friendly websites.  

---

## **Basic Structure of an HTML Document**  

An HTML document consists of several key elements, each serving a specific purpose. Below is a basic HTML template:  

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to My Web Page</h1>
    <p>This is a simple HTML document.</p>
</body>
</html>
\`\`\`
---

## **Breakdown of the Structure**  

### **1. \`<!DOCTYPE html>\` – Document Type Declaration**  
- Declares the document as an HTML5 document.  
- Ensures that the browser correctly interprets the HTML.  

### **2. \`<html>\` – The Root Element**  
- The entire HTML document is wrapped inside this tag.  
- The \`lang="en"\` attribute specifies that the language of the document is English.  

### **3. \`<head>\` – Metadata Section**  
- Contains information about the document, such as:  
  - \`<meta charset="UTF-8">\` – Specifies character encoding (UTF-8 supports all characters).  
  - \`<meta name="viewport" content="width=device-width, initial-scale=1.0">\` – Ensures responsiveness.  
  - \`<title>\` – Sets the title displayed on the browser tab.  

### **4. \`<body>\` – Content Section**  
- Holds the visible content of the webpage, including:  
  - \`<h1>\` – A heading tag (largest level).  
  - \`<p>\` – A paragraph tag for text.  

---

## **Visual Representation of HTML Structure**  

\`\`\`
HTML Document
├── <!DOCTYPE html>
├── <html>
│   ├── <head>
│   │   ├── <meta charset="UTF-8">
│   │   ├── <meta name="viewport">
│   │   ├── <title>
│   ├── <body>
│   │   ├── <h1>
│   │   ├── <p>
\`\`\`

---

## **Additional HTML Elements**  

| Element | Description |
|---------|------------|
| \`<h1> to <h6>\` | Headings for structuring content. \`<h1>\` is the most important. |
| \`<p>\` | Defines a paragraph. |
| \`<a>\` | Creates hyperlinks. |
| \`<img>\` | Displays images. |
| \`<ul>\` & \`<ol>\` | Unordered and ordered lists, respectively. |
| \`<table>\` | Defines tables in HTML. |

---

## **Example: A Simple Web Page with Multiple Elements**  

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Structure Example</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is an example of an HTML document structure.</p>

    <h2>Navigation</h2>
    <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
    </ul>

    <h2 id="about">About Me</h2>
    <p>I am learning HTML and building web pages!</p>

    <h2 id="contact">Contact</h2>
    <p>Email me at: <a href="mailto:example@example.com">example@example.com</a></p>
</body>
</html>
\`\`\`

---

## **Conclusion**  
Understanding the HTML document structure is the first step to becoming a web developer. A well-structured HTML page ensures better readability, maintainability, and SEO performance.  

Next, you can explore **HTML Attributes and Elements** to enhance your knowledge! 🚀
`, unlockxp: 10, isLocked: true
        },
        {
            title: "Text Formatting", description: "Learn how to style text using HTML elements.", content: `
# **Text Formatting in HTML**  

## **Introduction**  
Text formatting in HTML allows you to style and enhance textual content to improve readability and presentation. HTML provides a variety of elements to apply styles such as bold, italic, underlining, highlighting, and more. Understanding these elements helps in structuring content effectively on web pages.  

---

## **Basic Text Formatting Elements**  

HTML offers several text formatting tags, each serving a different purpose. Below is a table summarizing the most commonly used elements:  

| **Tag** | **Description** | **Example** |
|---------|---------------|-------------|
| \`<b>\` | Bold text (without importance) | \`<b>Bold Text</b>\` → **Bold Text** |
| \`<strong>\` | Important bold text | \`<strong>Important</strong>\` → **Important** |
| \`<i>\` | Italic text (without emphasis) | \`<i>Italic Text</i>\` → *Italic Text* |
| \`<em>\` | Emphasized text | \`<em>Emphasis</em>\` → *Emphasis* |
| \`<u>\` | Underlined text | \`<u>Underlined</u>\` → _Underlined_ |
| \`<mark>\` | Highlighted text | \`<mark>Highlighted</mark>\` → <mark>Highlighted</mark> |
| \`<small>\` | Smaller text | \`<small>Smaller</small>\` → <small>Smaller</small> |
| \`<del>\` | Strikethrough (deleted) text | \`<del>Deleted</del>\` → ~~Deleted~~ |
| \`<ins>\` | Inserted (underlined) text | \`<ins>Inserted</ins>\` → <ins>Inserted</ins> |
| \`<sub>\` | Subscript text | \`H<sub>2</sub>O\` → H₂O |
| \`<sup>\` | Superscript text | \`E = mc<sup>2</sup>\` → E = mc² |

---

## **Example: Using Text Formatting in HTML**  

Here’s a simple example demonstrating different text formatting elements in action:  

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Formatting in HTML</title>
</head>
<body>
    <h1>Text Formatting Example</h1>
    <p>This is a <b>bold</b> text.</p>
    <p>This is an <i>italic</i> text.</p>
    <p>This is an <strong>important</strong> statement.</p>
    <p>This is an <em>emphasized</em> text.</p>
    <p>This text is <u>underlined</u>.</p>
    <p>This text is <mark>highlighted</mark>.</p>
    <p>This is <small>smaller</small> text.</p>
    <p>This text has a <del>strikethrough</del>.</p>
    <p>This text is <ins>inserted</ins>.</p>
    <p>Chemical formula for water: H<sub>2</sub>O</p>
    <p>Einstein’s equation: E = mc<sup>2</sup></p>
</body>
</html>
\`\`\`

---

## **Best Practices for Text Formatting**  

1. **Use \`<strong>\` instead of \`<b>\` when the text is important.**  
2. **Use \`<em>\` instead of \`<i>\` for emphasis.**  
3. **Avoid excessive use of \`<u>\`, \`<b>\`, or \`<i>\` as it can make the content difficult to read.**  
4. **Use \`<mark>\` sparingly to highlight only important sections.**  
5. **For SEO and accessibility, prefer semantic elements like \`<strong>\` and \`<em>\` over purely stylistic ones like \`<b>\` and \`<i>\`.**  

---

## **Conclusion**  
Text formatting in HTML enhances the presentation of textual content. By understanding and using the right tags, you can make your webpage content more structured, readable, and accessible.  

### 🔥 Next, explore **CSS Styling** to further improve text appearance on your web pages!
`, cost: 20, isLocked: true, category: "HTML"
        },
        { title: "Lists", description: "Organize content using ordered, unordered, and definition lists.", content: "Lists help structure content in HTML...", cost: 30, isLocked: true, category: "HTML" },
        { title: "Links and Navigation", description: "Create hyperlinks and navigation menus.", content: "HTML allows linking between pages using...", cost: 40, isLocked: true, category: "HTML" },
        { title: "Images and Media", description: "Embed images, videos, and other multimedia elements.", content: "HTML supports multimedia embedding with...", cost: 50, isLocked: true, category: "HTML" },
        { title: "Tables", description: "Understand how to structure data using HTML tables.", content: "Tables in HTML are created using...", cost: 60, isLocked: true, category: "HTML" },
        { title: "Forms and Inputs", description: "Collect user input with forms, buttons, and input fields.", content: "HTML forms enable user input through...", cost: 70, isLocked: true, category: "HTML" },
        { title: "Semantic HTML", description: "Use semantic elements for better accessibility and SEO.", content: "Semantic HTML improves page structure...", cost: 80, isLocked: true, category: "HTML" },
        { title: "HTML Graphics", description: "Explore Canvas, SVG, and WebGL for rendering graphics.", content: "HTML5 provides graphics support through...", cost: 90, isLocked: true, category: "HTML" },
        { title: "Multimedia and APIs", description: "Learn about iframes, geolocation, and drag-and-drop.", content: "Modern HTML supports APIs such as...", cost: 100, isLocked: true, category: "HTML" },
        { title: "HTML5 Features", description: "Discover new form controls, local storage, and WebSockets.", content: "HTML5 introduces new features like...", cost: 110, isLocked: true, category: "HTML" },
        { title: "Accessibility", description: "Improve usability with ARIA roles, alt text, and tab indexing.", content: "Web accessibility ensures inclusivity through...", cost: 120, isLocked: true, category: "HTML" },
        { title: "Miscellaneous Topics", description: "Learn about comments, escape characters, and favicons.", content: "HTML includes many small but important...", cost: 130, isLocked: true, category: "HTML" },
        { title: "Best Practices", description: "Follow coding standards and responsive design principles.", content: "Best practices in HTML involve clean code...", cost: 140, isLocked: true, category: "HTML", hasChallenge: true }
    ];

    const tutorials: Tutorial[] = [];

    for (const tutorialData of tutorialsData) {
        const tutorialDataToCreate = {
            title: tutorialData.title,
            description: tutorialData.description,
            content: tutorialData.content,
            cost: tutorialData.cost,
            isLocked: tutorialData.isLocked,
            authorId: userRecords[Math.floor(Math.random() * userRecords.length)].id,
            likes: Math.floor(Math.random() * 100),
            views: Math.floor(Math.random() * 100),
            category: tutorialData.category,
            hasChallenge: tutorialData?.hasChallenge ?? false,
            difficulty: getRandomDifficulty(),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: getTutorialStatus(),
            tutorialId: null,
            deletedAt: null,
            stepsId: null,
        };

        const tutorial = await prisma.tutorial.create({
            data: tutorialDataToCreate,
        });

        tutorials.push(tutorial);
    }

    for (let i = 0; i < tutorials.length - 1; i++) {
        await prisma.tutorial.update({
            where: { id: tutorials[i].id },
            data: { nextTutorialId: tutorials[i + 1].id },
        });
    }

    console.log(`🌱 Created ${tutorials.length} tutorials successfully!`);

    const tutorialRecords = await prisma.tutorial.findMany();

    /** SEED QUIZ TAGS */
    console.log('🌱 Seeding tags...');

    const tagsData = [
        { name: "HTML", slug: "html" },
        { name: "CSS", slug: "css" },
        { name: "JavaScript", slug: "javascript" },
        { name: "Web Development", slug: "web-development" },
        { name: "Frontend", slug: "frontend" },
        { name: "Backend", slug: "backend" },
        { name: "Responsive Design", slug: "responsive-design" },
        { name: "Accessibility", slug: "accessibility" },
        { name: "SEO", slug: "seo" },
        { name: "Performance", slug: "performance" }
    ];

    const tags: Tag[] = [];

    for (const tagData of tagsData) {
        const tag = await prisma.tag.create({
            data: {
                name: tagData.name,
                slug: tagData.slug,
            },
        });

        tags.push({ ...tag, id: tag.id.toString() });
    }

    console.log(`🌱 Created ${tags.length} tags successfully!`);

    // const tagRecords = await prisma.tag.findMany();

    /** SEED QUIZZES **/

    console.log('🌱 Seeding quizzes...');

    const quizzesData = [
        { title: "Basics of HTML Quiz", tutorialId: tutorials[0].id },
        { title: "HTML Elements Quiz", tutorialId: tutorials[0].id },
        { title: "HTML Document Structure Quiz", tutorialId: tutorials[1].id },
        { title: "Text Formatting Quiz", tutorialId: tutorials[2].id },
        { title: "Lists Quiz", tutorialId: tutorials[3].id },
        { title: "Links and Navigation Quiz", tutorialId: tutorials[4].id },
        { title: "Images and Media Quiz", tutorialId: tutorials[5].id },
        { title: "Tables Quiz", tutorialId: tutorials[6].id },
        { title: "Forms and Inputs Quiz", tutorialId: tutorials[7].id },
        { title: "Semantic HTML Quiz", tutorialId: tutorials[8].id },
        { title: "HTML Graphics Quiz", tutorialId: tutorials[9].id },
        { title: "Multimedia and APIs Quiz", tutorialId: tutorials[10].id },
        { title: "HTML5 Features Quiz", tutorialId: tutorials[11].id },
        { title: "Accessibility Quiz", tutorialId: tutorials[12].id },
        { title: "Miscellaneous Topics Quiz", tutorialId: tutorials[13].id },
        { title: "Best Practices Quiz", tutorialId: tutorials[14].id }
    ];

    const quizzes: Quiz[] = [];

    for (let index = 0; index < quizzesData.length; index++) {
        const quizData = quizzesData[index];
        const isTimed = getRandomBool();
        const timeLimit = isTimed ? getRandomTimeLimit() : null;
        const estimatedDuration = isTimed ? timeLimit : 30;

        const tutorialInfo = tutorialRecords.find((t: { id: string }) => t.id === quizData.tutorialId);

        const createdQuiz = await prisma.quiz.create({
            data: {
                title: quizData.title,
                slug: slugify(quizData.title, { lower: true }),
                isTimed,
                timeLimit,
                tutorialId: quizData.tutorialId,
                createdAt: new Date(),
                updatedAt: new Date(),
                maxScore: 100,
                passPercentage: 50,
                difficulty: getRandomDifficulty(),
                order: index + 1,
                tutorialLocked: tutorialInfo?.isLocked ?? false,
                questionCount: isTimed ? 5 : 10,
                estimatedDuration,
            },
        });

        quizzes.push({
            ...createdQuiz,
            id: createdQuiz.id.toString(),
            tutorialId: createdQuiz.tutorialId.toString(),
            deletedAt: null,
            stepsId: null,
        });
    }

    console.log(`🌱 Created ${quizzes.length} quizzes successfully!`);

    const quizRecords = await prisma.quiz.findMany();


    /** SEED QUIZ QUESTIONS **/

    console.log('🌱 Seeding quiz questions...');

    const quizQuestionData = [
        // 📌 1. Basics of HTML Quiz
        { quizId: quizRecords[0].id, questionText: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Hyperlink Text Markup Language", "High Tech Machine Learning", "Hyper Transfer Markup Language"], correctAnswer: "Hyper Text Markup Language" },
        { quizId: quizRecords[0].id, questionText: "Which tag is used to define a paragraph?", options: ["<p>", "<div>", "<span>", "<br>"], correctAnswer: "<p>" },
        { quizId: quizRecords[0].id, questionText: "What is the root element of an HTML document?", options: ["<html>", "<head>", "<body>", "<doctype>"], correctAnswer: "<html>" },
        { quizId: quizRecords[0].id, questionText: "Which attribute is used to define an inline CSS style?", options: ["class", "id", "style", "css"], correctAnswer: "style" },
        { quizId: quizRecords[0].id, questionText: "Which tag is used for line breaks?", options: ["<br>", "<lb>", "<break>", "<p>"], correctAnswer: "<br>" },

        // 📌 2. HTML Elements Quiz
        { quizId: quizRecords[1].id, questionText: "What is the correct HTML element for inserting a line break?", options: ["<br>", "<lb>", "<break>", "<p>"], correctAnswer: "<br>" },
        { quizId: quizRecords[1].id, questionText: "Which HTML element is used to create an unordered list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<ul>" },
        { quizId: quizRecords[1].id, questionText: "Which HTML element is used to create an ordered list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<ol>" },
        { quizId: quizRecords[1].id, questionText: "Which HTML element is used to create a definition list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<dl>" },
        { quizId: quizRecords[1].id, questionText: "Which HTML element is used to create a list item?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<li>" },

        // 📌 2. HTML Document Structure Quiz
        { quizId: quizRecords[2].id, questionText: "Which section contains metadata of an HTML document?", options: ["<head>", "<body>", "<meta>", "<title>"], correctAnswer: "<head>" },
        { quizId: quizRecords[2].id, questionText: "Where does the <title> tag appear?", options: ["In the body", "In the head", "At the bottom", "Inside <nav>"], correctAnswer: "In the head" },
        { quizId: quizRecords[2].id, questionText: "Which tag is used for the main content?", options: ["<article>", "<body>", "<section>", "<main>"], correctAnswer: "<body>" },
        { quizId: quizRecords[2].id, questionText: "What is the correct tag for a site’s navigation links?", options: ["<nav>", "<menu>", "<ul>", "<aside>"], correctAnswer: "<nav>" },
        { quizId: quizRecords[2].id, questionText: "Which tag defines metadata such as character set?", options: ["<meta>", "<charset>", "<encoding>", "<head>"], correctAnswer: "<meta>" },

        // 📌 3. Text Formatting Quiz
        { quizId: quizRecords[3].id, questionText: "Which tag makes text bold?", options: ["<i>", "<b>", "<strong>", "<em>"], correctAnswer: "<b>" },
        { quizId: quizRecords[3].id, questionText: "What tag is used for italic text?", options: ["<em>", "<i>", "<italic>", "<italics>"], correctAnswer: "<i>" },
        { quizId: quizRecords[3].id, questionText: "Which tag represents emphasized text?", options: ["<i>", "<b>", "<em>", "<strong>"], correctAnswer: "<em>" },
        { quizId: quizRecords[3].id, questionText: "Which tag is used for underlined text?", options: ["<u>", "<ul>", "<underline>", "<text>"], correctAnswer: "<u>" },
        { quizId: quizRecords[3].id, questionText: "What is the purpose of the <blockquote> tag?", options: ["Bold text", "Block-level quote", "Italic text", "Emphasized text"], correctAnswer: "Block-level quote" },

        // 📌 4. Lists Quiz
        { quizId: quizRecords[4].id, questionText: "Which tag is used for an ordered list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<ol>" },
        { quizId: quizRecords[4].id, questionText: "Which tag represents a list item?", options: ["<list>", "<item>", "<li>", "<dt>"], correctAnswer: "<li>" },
        { quizId: quizRecords[4].id, questionText: "Which list type is numbered?", options: ["Ordered List", "Unordered List", "Definition List", "None"], correctAnswer: "Ordered List" },
        { quizId: quizRecords[4].id, questionText: "Which tag is used for definition lists?", options: ["<dl>", "<ul>", "<dt>", "<li>"], correctAnswer: "<dl>" },
        { quizId: quizRecords[4].id, questionText: "What tag represents a term in a definition list?", options: ["<dd>", "<dl>", "<dt>", "<li>"], correctAnswer: "<dt>" },

        // 📌 5. Links and Navigation Quiz
        { quizId: quizRecords[5].id, questionText: "Which tag is used for hyperlinks?", options: ["<link>", "<a>", "<href>", "<nav>"], correctAnswer: "<a>" },
        { quizId: quizRecords[5].id, questionText: "Which attribute defines the hyperlink destination?", options: ["src", "href", "target", "link"], correctAnswer: "href" },
        { quizId: quizRecords[5].id, questionText: "What does target='_blank' do?", options: ["Opens in a new tab", "Changes color", "Adds underline", "Deletes link"], correctAnswer: "Opens in a new tab" },
        { quizId: quizRecords[5].id, questionText: "Which tag represents navigation?", options: ["<nav>", "<menu>", "<header>", "<aside>"], correctAnswer: "<nav>" },
        { quizId: quizRecords[5].id, questionText: "What does the 'rel' attribute specify?", options: ["Link relationship", "Link styling", "JavaScript function", "Color scheme"], correctAnswer: "Link relationship" },

        // 📌 6. Images and Media Quiz
        { quizId: quizRecords[5].id, questionText: "Which tag is used to embed an image?", options: ["<pic>", "<img>", "<image>", "<media>"], correctAnswer: "<img>" },
        { quizId: quizRecords[5].id, questionText: "Which attribute defines an image source?", options: ["src", "href", "alt", "source"], correctAnswer: "src" },
        { quizId: quizRecords[5].id, questionText: "Which tag is used for embedding videos?", options: ["<video>", "<embed>", "<movie>", "<vid>"], correctAnswer: "<video>" },
        { quizId: quizRecords[5].id, questionText: "Which attribute provides alternative text for an image?", options: ["title", "alt", "desc", "name"], correctAnswer: "alt" },
        { quizId: quizRecords[5].id, questionText: "Which tag is used for embedding audio?", options: ["<music>", "<audio>", "<sound>", "<mp3>"], correctAnswer: "<audio>" },

        // 📌 7. Tables
        { quizId: quizRecords[6].id, questionText: "Which tag is used to create a table in HTML?", options: ["<table>", "<tbl>", "<td>", "<tr>"], correctAnswer: "<table>" },
        { quizId: quizRecords[6].id, questionText: "Which tag defines a table row?", options: ["<th>", "<tr>", "<td>", "<row>"], correctAnswer: "<tr>" },
        { quizId: quizRecords[6].id, questionText: "What does the <th> tag represent?", options: ["Table header", "Table cell", "Table row", "Table body"], correctAnswer: "Table header" },
        { quizId: quizRecords[6].id, questionText: "Which attribute is used to merge columns?", options: ["colspan", "rowspan", "merge", "span"], correctAnswer: "colspan" },
        { quizId: quizRecords[6].id, questionText: "What does the <caption> tag do in a table?", options: ["Adds a title to the table", "Creates a new column", "Merges rows", "Defines a table cell"], correctAnswer: "Adds a title to the table" },

        // 📌 8. Forms and Inputs
        { quizId: quizRecords[7].id, questionText: "Which tag is used to create a form?", options: ["<form>", "<input>", "<button>", "<fieldset>"], correctAnswer: "<form>" },
        { quizId: quizRecords[7].id, questionText: "Which attribute specifies the type of an input field?", options: ["type", "name", "input", "field"], correctAnswer: "type" },
        { quizId: quizRecords[7].id, questionText: "What is the default method for submitting a form?", options: ["POST", "GET", "PUT", "DELETE"], correctAnswer: "GET" },
        { quizId: quizRecords[7].id, questionText: "Which input type is used for a password field?", options: ["text", "password", "secure", "hidden"], correctAnswer: "password" },
        { quizId: quizRecords[7].id, questionText: "Which tag is used to create a submit button?", options: ["<button>", "<submit>", "<input type='submit'>", "<form-submit>"], correctAnswer: "<input type='submit'>" },

        // 📌 9. Semantic HTML
        { quizId: quizRecords[8].id, questionText: "Which tag is used for the main content of a page?", options: ["<section>", "<main>", "<article>", "<div>"], correctAnswer: "<main>" },
        { quizId: quizRecords[8].id, questionText: "Which tag defines a self-contained section?", options: ["<section>", "<article>", "<aside>", "<nav>"], correctAnswer: "<article>" },
        { quizId: quizRecords[8].id, questionText: "What does the <aside> element represent?", options: ["A sidebar or additional content", "A navigation bar", "A paragraph", "A footer"], correctAnswer: "A sidebar or additional content" },
        { quizId: quizRecords[8].id, questionText: "Which tag is used for defining a footer?", options: ["<foot>", "<footer>", "<bottom>", "<end>"], correctAnswer: "<footer>" },
        { quizId: quizRecords[8].id, questionText: "What is the benefit of semantic HTML?", options: ["Improves SEO and accessibility", "Changes color", "Makes the page faster", "Reduces page size"], correctAnswer: "Improves SEO and accessibility" },

        // 📌 10. HTML Graphics
        { quizId: quizRecords[9].id, questionText: "Which tag is used to draw graphics in HTML?", options: ["<canvas>", "<svg>", "<graphic>", "<draw>"], correctAnswer: "<canvas>" },
        { quizId: quizRecords[9].id, questionText: "What does SVG stand for?", options: ["Scalable Vector Graphics", "Simple Visual Graphics", "Smart View Graphics", "Systematic Vector Graphics"], correctAnswer: "Scalable Vector Graphics" },
        { quizId: quizRecords[9].id, questionText: "Which tag is used for vector graphics?", options: ["<canvas>", "<svg>", "<vector>", "<draw>"], correctAnswer: "<svg>" },
        { quizId: quizRecords[9].id, questionText: "Which API allows drawing on the canvas?", options: ["Canvas API", "SVG API", "WebGL", "2D Graphics API"], correctAnswer: "Canvas API" },
        { quizId: quizRecords[9].id, questionText: "What is WebGL used for?", options: ["Rendering 3D graphics", "Playing music", "Styling HTML", "Creating forms"], correctAnswer: "Rendering 3D graphics" },

        // 📌 11. Multimedia and APIs
        { quizId: quizRecords[10].id, questionText: "Which tag is used for embedding a video?", options: ["<video>", "<media>", "<play>", "<vid>"], correctAnswer: "<video>" },
        { quizId: quizRecords[10].id, questionText: "Which API is used to track user location?", options: ["Geolocation API", "GPS API", "Navigator API", "Location Tracker API"], correctAnswer: "Geolocation API" },
        { quizId: quizRecords[10].id, questionText: "What does the drag-and-drop API enable?", options: ["Moving elements with the mouse", "File uploads", "Playing audio", "Resizing text"], correctAnswer: "Moving elements with the mouse" },
        { quizId: quizRecords[10].id, questionText: "Which tag is used for embedding external content like YouTube videos?", options: ["<iframe>", "<embed>", "<object>", "<source>"], correctAnswer: "<iframe>" },
        { quizId: quizRecords[10].id, questionText: "Which API is used to store data in the browser?", options: ["LocalStorage", "SessionStorage", "Cookies", "All of the above"], correctAnswer: "All of the above" },

        // 📌 12. HTML5
        { quizId: quizRecords[11].id, questionText: "Which HTML5 feature allows offline storage?", options: ["Local Storage", "Cookies", "Cache API", "Session Storage"], correctAnswer: "Local Storage" },
        { quizId: quizRecords[11].id, questionText: "Which tag is used for progress bars?", options: ["<progress>", "<bar>", "<meter>", "<load>"], correctAnswer: "<progress>" },
        { quizId: quizRecords[11].id, questionText: "Which new input type was introduced in HTML5?", options: ["date", "email", "range", "All of the above"], correctAnswer: "All of the above" },
        { quizId: quizRecords[11].id, questionText: "What is WebSockets used for?", options: ["Real-time communication", "File uploads", "Image rendering", "Video playback"], correctAnswer: "Real-time communication" },
        { quizId: quizRecords[11].id, questionText: "What does the <datalist> element provide?", options: ["Auto-suggest options", "Form validation", "File uploads", "Data storage"], correctAnswer: "Auto-suggest options" },

        // 📌 13. ARIA
        { quizId: quizRecords[12].id, questionText: "What does ARIA stand for?", options: ["Accessible Rich Internet Applications", "Automated Rich Interface Attributes", "Adaptive Responsive Interface API", "Accessible Runtime Integration API"], correctAnswer: "Accessible Rich Internet Applications" },
        { quizId: quizRecords[12].id, questionText: "What is the purpose of alt text?", options: ["Describe images for screen readers", "Change image color", "Increase page speed", "Resize images"], correctAnswer: "Describe images for screen readers" },
        { quizId: quizRecords[12].id, questionText: "Which attribute defines keyboard navigation order?", options: ["tabindex", "accesskey", "role", "index"], correctAnswer: "tabindex" },
        { quizId: quizRecords[12].id, questionText: "Which ARIA role is used for a button?", options: ["button", "alert", "form", "navigation"], correctAnswer: "button" },
        { quizId: quizRecords[12].id, questionText: "Which color contrast ratio is recommended for accessibility?", options: ["4.5:1", "3:1", "6:1", "2:1"], correctAnswer: "4.5:1" },

        // 📌 14. Accessibility
        { quizId: quizRecords[13].id, questionText: "What is a best practice for writing HTML?", options: ["Use semantic tags", "Use inline styles", "Avoid closing tags", "Use uppercase tags"], correctAnswer: "Use semantic tags" },
        { quizId: quizRecords[13].id, questionText: "Which approach improves website accessibility?", options: ["Using alt text", "Hiding all images", "Using only divs", "Avoiding headings"], correctAnswer: "Using alt text" },
        { quizId: quizRecords[13].id, questionText: "Which technique improves SEO?", options: ["Semantic HTML", "Large images", "Excessive JavaScript", "Using only tables"], correctAnswer: "Semantic HTML" },
        { quizId: quizRecords[13].id, questionText: "Why should you avoid inline CSS?", options: ["Reduces maintainability", "Makes CSS easier", "Improves speed", "No impact"], correctAnswer: "Reduces maintainability" },
        { quizId: quizRecords[13].id, questionText: "Which unit is recommended for responsive design?", options: ["em", "px", "cm", "mm"], correctAnswer: "em" },

        // 📌 15. Best Practices
        { quizId: quizRecords[14].id, questionText: "What is the recommended file size for images?", options: ["100KB", "200KB", "500KB", "1MB"], correctAnswer: "1MB" },
        { quizId: quizRecords[14].id, questionText: "Which color contrast ratio is recommended for accessibility?", options: ["4.5:1", "3:1", "6:1", "2:1"], correctAnswer: "4.5:1" },
        { quizId: quizRecords[14].id, questionText: "What is the recommended file size for images?", options: ["100KB", "200KB", "500KB", "1MB"], correctAnswer: "1MB" },
        { quizId: quizRecords[14].id, questionText: "What is the recommended file size for images?", options: ["100KB", "200KB", "500KB", "1MB"], correctAnswer: "1MB" },
        { quizId: quizRecords[14].id, questionText: "What is the recommended file size for images?", options: ["100KB", "200KB", "500KB", "1MB"], correctAnswer: "1MB" },
    ];

    const quizQuestions: QuizQuestion[] = [];

    for (const quizQuestion of quizQuestionData) {
        const createQuizQuestion = await prisma.quizQuestion.upsert({
            where: {
                quizId_questionText: {
                    quizId: quizQuestion.quizId,
                    questionText: quizQuestion.questionText,
                },
            },
            update: {},
            create: {
                quizId: quizQuestion.quizId,
                questionText: quizQuestion.questionText,
                options: quizQuestion.options,
                correctAnswer: quizQuestion.correctAnswer,
                xp: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        quizQuestions.push({
            ...createQuizQuestion,
            id: createQuizQuestion.id.toString(),
            quizId: createQuizQuestion.quizId.toString(),
        });
    }

    console.log(`🌱 Created ${quizQuestions.length} quiz questions successfully!`);

    const quizQuestionRecords = await prisma.quizQuestion.findMany();

    /** SEED BADGES **/

    console.log('🌱 Seeding badges...');

    const badgesData = Array.from({ length: 10 }, (_unused, i) => ({
        name: `Badge ${i + 1}`,
        imageUrl: `https://dummyimage.com/100x100/${Math.floor(Math.random() * 16777215).toString(16)}/ffffff.png&text=Badge${i + 1}`,
        xpReq: (i + 1) * 100,
    }));

    const badges: Badge[] = [];

    for (const badgeData of badgesData) {
        const createdBadge = await prisma.badge.create({
            data: {
                name: badgeData.name,
                imageUrl: badgeData.imageUrl,
                xpReq: badgeData.xpReq,
                description: `Description for ${badgeData.name}`,
                createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
                updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            },
        });
        badges.push({
            ...createdBadge,
            id: createdBadge.id.toString(),
            createdAt: createdBadge.createdAt,
            updatedAt: createdBadge.updatedAt,
        });
    }

    console.log(`🌱 Created ${badges.length} badges successfully!`);

    const badgeRecords = await prisma.badge.findMany();

    /** SEED USER PROFILES **/

    console.log('🌱 Seeding user profile...');

    const userProfileData = [];

    for (let i = 0; i < userRecords.length; i++) {
        const xp = Math.floor(Math.random() * 10_000);
        const level = getLevelFromXP(xp);
        const rank = getRankFromLevelXP(level, xp);

        userProfileData.push({
            userId: userRecords[i].id,
            bio: `I'm user ${i + 1}!`,
            location: `Location ${i + 1}`,
            website: `https://example${i + 1}.com`,
            socialLinks: [`https://twitter.com/user${i + 1}`, `https://github.com/user${i + 1}`],
            avatar: `https://i.pravatar.cc/150?u=${userRecords[i].username}`,
            rank,
            level,
            xp,
            levelProgress: Math.floor(Math.random() * level * 100),
            levelProgressMax: level * 100,
            theme: themeOptions[Math.floor(Math.random() * themeOptions.length)],
            lastLogin: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        });
    }

    const userProfiles: UserProfile[] = [];

    for (const userProfile of userProfileData) {
        const createdUserProfile = await prisma.userProfile.upsert({
            where: {
                userId: userProfile.userId,
            },
            update: {},
            create: {
                userId: userProfile.userId,
                bio: userProfile.bio,
                location: userProfile.location,
                website: userProfile.website,
                socialLinks: userProfile.socialLinks,
                avatar: userProfile.avatar,
                level: userProfile.level,
                levelProgress: userProfile.levelProgress,
                levelProgressMax: userProfile.levelProgressMax,
                xp: userProfile.xp,
                rank: userProfile.rank,
                theme: userProfile.theme,
                createdAt: userProfile.createdAt,
                updatedAt: userProfile.updatedAt,
            },
        });
        userProfiles.push({ ...createdUserProfile });
    }

    console.log(`🌱 Created ${userProfiles.length} user profiles successfully!`);

    const userProfileRecords = await prisma.userProfile.findMany();

    console.log('🌱 Seeding transactions...');

    const transactionsData = Array.from({ length: 50 }, () => ({
        profileId: userRecords[Math.floor(Math.random() * userRecords.length)].id,
        amount: Math.floor(Math.random() * 100),
        type: getTransactionType(),
        description: 'Transaction description',
        transactionAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }));

    const transactions: CoinTransaction[] = [];

    for (const transactionData of transactionsData) {
        const createdTransaction = await prisma.coinTransaction.upsert({
            where: {
                profileId_transactionAt: {
                    profileId: transactionData.profileId,
                    transactionAt: transactionData.transactionAt,
                },
            },
            update: {},
            create: {
                profileId: transactionData.profileId,
                amount: transactionData.amount,
                type: transactionData.type,
                description: transactionData.description,
                transactionAt: transactionData.transactionAt,
                createdAt: transactionData.createdAt,
                updatedAt: transactionData.updatedAt,
            },
        });
        transactions.push({ ...createdTransaction });
    }
    transactions.sort((a, b) => a.transactionAt.getTime() - b.transactionAt.getTime());

    console.log(`🌱 Created ${transactions.length} transactions successfully!`);

    const transactionRecords = await prisma.coinTransaction.findMany();

    console.log('🌱 Seeding userBadges...');

    const userBadgesData = Array.from({ length: userProfileRecords.length }, (_, i) => ({
        profileId: userProfileRecords[i].userId,
        badgeId: badgeRecords[Math.floor(Math.random() * badgeRecords.length)].id,
        earnedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }));

    const userBadges: UserBadge[] = [];

    for (const userBadge of userBadgesData) {
        const createUserBadge = await prisma.userBadge.create({
            data: userBadge,
        });

        userBadges.push({ ...createUserBadge });
    }

    console.log(`🌱 Created ${userBadgesData.length} user badges successfully!`);

    const userBadgeRecords = await prisma.userBadge.findMany();

    console.log('🌱 Seeding streaks...');

    const streaksData = Array.from({ length: userRecords.length }, (_, i) => ({
        profileId: userRecords[i].id,
        streak: Math.floor(Math.random() * 100),
        streakDays: Math.floor(Math.random() * 30),
        lastLogin: new Date(Date.now() - 1),
        currentStart: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        currentEnd: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        longestStreak: Math.floor(Math.random() * 100),
        longestStart: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        longestEnd: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }));

    const streaks: UserStreak[] = [];

    for (const streak of streaksData) {
        const createStreak = await prisma.userStreak.create({
            data: streak,
        });

        streaks.push({ ...createStreak });
    }

    console.log(`🌱 Created ${streaksData.length} streaks successfully!`);

    const streakRecords = await prisma.userStreak.findMany();

    /** SEED COIN WALLET **/

    console.log('🌱 Seeding coin wallets...');

    const coinWalletsData = Array.from({ length: userProfileRecords.length }, (_, i) => ({
        profileId: userProfileRecords[i].userId,
        coins: Math.floor(Math.random() * 1000),
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }));

    const coinWallets: CoinWallet[] = [];

    for (const coinWallet of coinWalletsData) {
        const createCoinWallet = await prisma.coinWallet.create({
            data: coinWallet,
        });

        coinWallets.push({ ...createCoinWallet });
    }

    console.log(`🌱 Created ${coinWallets.length} coin wallets successfully!`);

    const coinWalletRecords = await prisma.coinWallet.findMany();

    /** SEED QUIZ ATTEMPTS**/

    console.log('🌱 Seeding quiz attempts...');

    const quizAttemptsData: UserQuizAttempt[] = [];

    for (let i = 0; i < quizRecords.filter((q: { tutorialId: string }) => q.tutorialId === tutorialRecords[Math.floor(Math.random() * tutorialRecords.length)].id).length * userProfileRecords.length * 2; i++) {
        const quizId = getQuizId(quizRecords, tutorialRecords);
        const startedAt = getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31));
        const quizRecord = quizRecords.find((q: { id: string }) => q.id === quizId);
        const score = getScoreBasedOnDifficulty(quizRecord?.difficulty || "EASY");

        const completedAt = quizRecord?.timeLimit
            ? new Date(startedAt.getTime() + quizRecord.timeLimit * 60 * 1000)
            : startedAt;

        quizAttemptsData.push({
            id: crypto.randomUUID(),
            profileId: getUniqueUserId(userProfileRecords, quizAttemptsData) || "default-user-id",
            quizId,
            startedAt,
            completedAt,
            score,
            createdAt: startedAt,
            updatedAt: startedAt,
            isPassed: score >= 50,
            feedback: null,
        });
    }

    const quizAttempts: UserQuizAttempt[] = [];
    for (const quizAttempt of quizAttemptsData) {
        const createQuizAttempt = await prisma.userQuizAttempt.create({
            data: {
                profileId: quizAttempt.profileId,
                quizId: quizAttempt.quizId,
                startedAt: quizAttempt.startedAt,
                completedAt: quizAttempt.completedAt,
                score: quizAttempt.score,
                createdAt: quizAttempt.startedAt,
                updatedAt: quizAttempt.startedAt,
            },
        });
        createQuizAttempt && quizAttempts.push({
            ...createQuizAttempt,
            id: createQuizAttempt.id.toString(),
            profileId: createQuizAttempt.profileId.toString(),
            quizId: createQuizAttempt.quizId.toString(),
            startedAt: createQuizAttempt.startedAt,
            completedAt: createQuizAttempt.completedAt,
            score: createQuizAttempt.score,
            createdAt: createQuizAttempt.createdAt,
            updatedAt: createQuizAttempt.updatedAt,
        });
    }

    quizAttempts.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());

    console.log(`🌱 Created ${quizAttemptsData.length} quiz attempts successfully!`);

    const quizAttemptRecords = await prisma.userQuizAttempt.findMany();

    /** SEED QUESTION ATTEMPTS **/

    console.log('🌱 Seeding question attempts...');

    const questionAttemptsData = [];
    for (const quizAttempt of quizAttemptRecords) {
        for (const question of quizQuestionRecords) {
            const selectedAnswer = selectedOption(question.id, { options: question.options });
            questionAttemptsData.push({
                userQuizAttemptId: quizAttempt.id,
                questionId: question.id,
                selectedOption: selectedAnswer,
                isCorrect: selectedAnswer === question.correctAnswer,
                xpEarned: selectedAnswer === question.correctAnswer ? question.xp : 0,
                createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
                updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            });
        }
    }

    const questionAttempts: UserQuestionAttempt[] = [];
    for (const questionAttempt of questionAttemptsData) {
        const createQuestionAttempt = await prisma.userQuestionAttempt.create({
            data: {
                userQuizAttemptId: questionAttempt.userQuizAttemptId!,
                questionId: questionAttempt.questionId!,
                selectedOption: questionAttempt.selectedOption!,
                isCorrect: questionAttempt.isCorrect!,
                xpEarned: questionAttempt.xpEarned!,
                createdAt: questionAttempt.createdAt!,
                updatedAt: questionAttempt.updatedAt!,
            },
        });
        questionAttempts.push(createQuestionAttempt);
    }

    console.log(`🌱 Created ${questionAttempts.length} question attempts successfully!`);

    const questionAttemptRecords = await prisma.userQuestionAttempt.findMany();

    /** User Progress **/

    console.log('🌱 Seeding userProgress...');

    const userProgressData = Array.from({ length: 10 }, (_, i) => {
        const profileId = getUserId(userProfileRecords);
        const tutorialId = tutorialRecords[i].id;
        const percentageCompleted = getPercentageCompleted(profileId, tutorialId, quizRecords, quizAttemptRecords);
        const isCompleted = getIsCompleted(percentageCompleted);
        const attempts = getTotalQuizAttemptsByUserAndTutorial(profileId, tutorialId, quizRecords, quizAttemptRecords);
        const bestScore = getBestScoreByUserIdAndTutorialId(profileId, tutorialId, quizRecords, quizAttemptRecords);
        const date = getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31));

        return ({
            profileId,
            tutorialId,
            isCompleted,
            attempts,
            bestScore,
            percentageCompleted,
            interviewCompleted: false,
            challengeCompleted: false,
            completedAt: date,
            createdAt: date,
            updatedAt: new Date(date.getTime() + date.getTime()),
        })
    });

    const usersProgress: UserProgress[] = [];

    for (const userProgress of userProgressData) {
        const createProgress = await prisma.userProgress.create({
            data: {
                profileId: userProgress.profileId!,
                tutorialId: userProgress.tutorialId!,
                isCompleted: userProgress.isCompleted,
                attempts: userProgress.attempts,
                bestScore: userProgress.bestScore,
                percentageCompleted: userProgress.percentageCompleted,
                interviewCompleted: userProgress.interviewCompleted,
                challengeCompleted: userProgress.challengeCompleted,
                completedAt: userProgress.completedAt,
            },
        });
        usersProgress.push({
            ...createProgress,
            profileId: createProgress.profileId.toString(),
            tutorialId: createProgress.tutorialId.toString(),
            isCompleted: createProgress.isCompleted,
            attempts: createProgress.attempts,
            bestScore: createProgress.bestScore,
            percentageCompleted: createProgress.percentageCompleted,
            interviewCompleted: createProgress.interviewCompleted,
            challengeCompleted: createProgress.challengeCompleted,
            completedAt: createProgress.completedAt,
        });
    }

    console.log(`🌱 Created ${userProgressData.length} user progress successfully!`);

    const userProgressRecords = await prisma.userProgress.findMany();

    /** Roadmap **/
    console.log('🌱 Seeding roadmaps...');

    const roadmapData = [
        { title: 'MERN Stack', description: 'A comprehensive roadmap for web development.', createdAt: new Date(), updatedAt: new Date(), type: RoadmapType.FRONTEND, category: 'Web Development' },
        { title: 'Data Science Roadmap', description: 'A roadmap for aspiring data scientists.', createdAt: new Date(), updatedAt: new Date() },
        { title: 'Machine Learning Roadmap', description: 'A roadmap for machine learning enthusiasts.', createdAt: new Date(), updatedAt: new Date() },
        { title: 'Mobile Development Roadmap', description: 'A roadmap for mobile app developers.', createdAt: new Date(), updatedAt: new Date() },
    ];

    const roadmaps: Roadmap[] = [];
    for (const roadmap of roadmapData) {
        const createRoadmap = await prisma.roadmap.create({
            data: {
                title: roadmap.title,
                description: roadmap.description,
                createdAt: roadmap.createdAt,
                updatedAt: roadmap.updatedAt,
                type: getRoadmapType() || roadmap.type,
                category: ['Web Development', 'Data Science', 'Machine Learning', 'Mobile Development'][getRandomInt(0, 3)],
                createdById: userRecords[Math.floor(Math.random() * userRecords.length)].id,
            },
        });
        roadmaps.push(createRoadmap);
    }

    console.log(`🌱 Created ${roadmaps.length} roadmaps successfully!`);
    const roadmapRecords = await prisma.roadmap.findMany();

    /** Roadmap Steps **/
    console.log('🌱 Seeding roadmap steps...');

    await prisma.roadmapStep.deleteMany();

    const roadmapSteps: RoadmapStep[] = [];

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: 'HTML',
                description: 'Learn the basics of HTML.',
                status: StepStatus.COMPLETED,
                roadmapId: roadmaps[0].id,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 1,
                progress: 100,
                completed: getRandomBool(),
                completedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
                parentId: null,
            },
        }),
    );

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: 'CSS',
                description: 'Understand the fundamentals of CSS.',
                roadmapId: roadmaps[0].id,
                status: StepStatus.IN_PROGRESS,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 2,
                progress: getRandomBool() ? 100 : 0,
                completed: getRandomBool(),
                completedAt: getRandomBool() ? getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
                parentId: roadmapSteps[0].id,
            },
        }),
    );

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: 'JavaScript',
                description: 'Master the essentials of JavaScript.',
                roadmapId: roadmaps[0].id,
                status: StepStatus.IN_PROGRESS,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 3,
                progress: getRandomBool() ? 100 : 0,
                completed: getRandomBool(),
                completedAt: getRandomBool() ? getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
                parentId: roadmapSteps[0].id,
            },
        }),
    );

    // roadmapSteps[0] = await prisma.roadmapStep.update({
    //     where: { id: roadmapSteps[0].id },
    //     data: {
    //         children: {
    //             connect: [
    //                 { id: roadmapSteps[1].id },
    //                 { id: roadmapSteps[2].id },
    //             ],
    //         },
    //     },
    // });

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: "Tailwind CSS",
                description: "Learn the basics of Tailwind CSS.",
                roadmapId: roadmaps[0].id,
                status: StepStatus.NOT_STARTED,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 1,
                progress: getRandomBool() ? 100 : 0,
                completed: getRandomBool(),
                completedAt: getRandomBool() ? getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
                parentId: roadmapSteps[1].id,
            }
        })
    )

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: 'React',
                description: 'Get introduced to React.',
                roadmapId: roadmaps[0].id,
                status: StepStatus.NOT_STARTED,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 4,
                progress: getRandomBool() ? 100 : 0,
                completed: getRandomBool(),
                completedAt: getRandomBool() ? getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
                parentId: roadmapSteps[0].id,
            }
        })
    )

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: 'Node.js',
                description: 'Learn the basics of Node.js.',
                roadmapId: roadmaps[0].id,
                status: StepStatus.NOT_STARTED,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 5,
                progress: getRandomBool() ? 100 : 0,
                completed: getRandomBool(),
                completedAt: getRandomBool() ? getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
                parentId: roadmapSteps[0].id,
            }
        })
    )

    console.log(`🌱 Created ${roadmapSteps.length} roadmap steps successfully!`);

    // const roadmapStepData = [
    //     { title: 'HTML Basics', description: 'Learn the basics of HTML.',  status: StepStatus.COMPLETED, roadmapId: roadmaps[0].id, createdAt: new Date(), updatedAt: new Date(), order: 1, progress: 100, completed: getRandomBool(), completedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)), parentId: null, parent: null },
    //     { title: 'CSS Fundamentals', description: 'Understand the fundamentals of CSS.', roadmapId: roadmaps[0].id, createdAt: new Date(), updatedAt: new Date(), order: 2 },
    //     { title: 'JavaScript Essentials', description: 'Master the essentials of JavaScript.', roadmapId: roadmaps[0].id, createdAt: new Date(), updatedAt: new Date(), order: 3 },
    //     { title: 'React Introduction', description: 'Get introduced to React.', roadmapId: roadmaps[0].id, createdAt: new Date(), updatedAt: new Date(), order: 4 },
    //     { title: 'Node.js Basics', description: 'Learn the basics of Node.js.', roadmapId: roadmaps[0].id, createdAt: new Date(), updatedAt: new Date(), order: 5 },
    // ];

    // const roadmapSteps: RoadmapStep[] = [];
    // for (const roadmapStep of roadmapStepData) {
    //     const createRoadmapStep = await prisma.roadmapStep.create({
    //         data: {
    //             title: roadmapStep.title,
    //             description: roadmapStep.description,
    //             roadmapId: roadmapStep.roadmapId,
    //             order: roadmapStep.order,
    //             createdAt: roadmapStep.createdAt,
    //             updatedAt: roadmapStep.updatedAt,
    //         },
    //     });
    //     roadmapSteps.push(createRoadmapStep);
    // }

    // console.log(`🌱 Created ${roadmapSteps.length} roadmap steps successfully!`);
    // const roadmapStepRecords = await prisma.roadmapStep.findMany();

    /** Recent Activity **/

    // console.log('🌱 Seeding recent activities...');

    let type = getActivityType();
    let value = 0;

    const getValue = () => {
        if (type === ActivityType.QUIZ) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.BADGE) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.TRANSACTION) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.TUTORIAL) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.XP) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.COINS) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.LEVEL) {
            value = Math.floor(Math.random() * 10);
        }
        return value;
    }

    const getDescription = () => {
        if (type === ActivityType.QUIZ) {
            return quizRecords[Math.floor(Math.random() * quizRecords.length)].title;
        } else if (type === ActivityType.BADGE) {
            return badgeRecords[Math.floor(Math.random() * badgeRecords.length)].name;
        } else if (type === ActivityType.TRANSACTION) {
            return transactionRecords[Math.floor(Math.random() * transactionRecords.length)].description;
        } else if (type === ActivityType.TUTORIAL) {
            return tutorialRecords[Math.floor(Math.random() * tutorialRecords.length)].title;
        } else if (type === ActivityType.XP) {
            return `Earned ${value} XP`;
        } else if (type === ActivityType.COINS) {
            return `Earned ${value} Coins`;
        } else if (type === ActivityType.LEVEL) {
            return `Unlocked Level ${value}`
        }
    }

    console.log(`🌱 Seeding last activities...`);

    const lastActivitiesData = Array.from({ length: 10 }, () => ({
        userId: userRecords[Math.floor(Math.random() * userRecords.length)].id,
        type: getActivityType(),
        xpAwarded: getValue(),
        description: getDescription(),
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31))
    }));

    const lastActivities: LastActivity[] = [];
    for (const activity of lastActivitiesData) {
        const createActivity = await prisma.lastActivity.create({
            data: {
                userId: activity.userId,
                type: activity.type,
                xpAwarded: activity.xpAwarded,
                description: activity.description,
                createdAt: activity.createdAt,
            },
        });
        lastActivities.push({ ...createActivity });
    }

    console.log(`🌱 Created ${lastActivities.length} last activities successfully!`);

    /** SEEDING COMPLETED **/

    console.log('✅ Database seeding completed successfully!');
}



main()
    .catch(error => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });



function getRandomInt(arg0: number, arg1: number) {
    return Math.floor(Math.random() * (arg1 - arg0 + 1)) + arg0;
}

function getUniqueUserId(userProfileRecords: UserProfile[], quizAttemptsData: UserQuizAttempt[]) {
    const userIds = userProfileRecords.map((profile) => profile.userId);
    const randomIndex = Math.floor(Math.random() * userIds.length);

    quizAttemptsData.forEach((quizAttempt) => {
        if (quizAttempt.profileId === userIds[randomIndex]) {
            userIds.splice(randomIndex, 1);
        }
    });

    if (userIds.length === 0) {
        return null;
    }

    return userIds[randomIndex];
}

