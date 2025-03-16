import { User, CoinTransaction, PrismaClient, ThemeName, UserQuizAttempt } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
const themeOptions: ThemeName[] = ['DEFAULT', 'LIGHT', 'DARK']; // Define valid themes
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomBool = () => Math.random() < 0.5;
let selected: { [key: string]: string } = {};
const selectedOption = (id: number, quizQuestion: { options: string[] }) => {
    selected = { [id]: quizQuestion.options[Math.floor(Math.random() * 4)] };
    return selected[id];
}


async function main() {
    console.log('🌱 Starting database seeding...');

    /** SEED TUTORIALS **/
    const tutorialsData = [
        { title: "Basics of HTML", description: "Learn the fundamental structure of an HTML document.", content: "Introduction to HTML...", unlockPoints: 0, isLocked: false },
        { title: "HTML Document Structure", description: "Understand the elements that make up an HTML document.", content: "HTML consists of elements like...", unlockPoints: 10, isLocked: true },
        { title: "Text Formatting", description: "Learn how to style text using HTML elements.", content: "Text formatting in HTML includes...", unlockPoints: 20, isLocked: true },
        { title: "Lists", description: "Organize content using ordered, unordered, and definition lists.", content: "Lists help structure content in HTML...", unlockPoints: 30, isLocked: true },
        { title: "Links and Navigation", description: "Create hyperlinks and navigation menus.", content: "HTML allows linking between pages using...", unlockPoints: 40, isLocked: true },
        { title: "Images and Media", description: "Embed images, videos, and other multimedia elements.", content: "HTML supports multimedia embedding with...", unlockPoints: 50, isLocked: true },
        { title: "Tables", description: "Understand how to structure data using HTML tables.", content: "Tables in HTML are created using...", unlockPoints: 60, isLocked: true },
        { title: "Forms and Inputs", description: "Collect user input with forms, buttons, and input fields.", content: "HTML forms enable user input through...", unlockPoints: 70, isLocked: true },
        { title: "Semantic HTML", description: "Use semantic elements for better accessibility and SEO.", content: "Semantic HTML improves page structure...", unlockPoints: 80, isLocked: true },
        { title: "HTML Graphics", description: "Explore Canvas, SVG, and WebGL for rendering graphics.", content: "HTML5 provides graphics support through...", unlockPoints: 90, isLocked: true },
        { title: "Multimedia and APIs", description: "Learn about iframes, geolocation, and drag-and-drop.", content: "Modern HTML supports APIs such as...", unlockPoints: 100, isLocked: true },
        { title: "HTML5 Features", description: "Discover new form controls, local storage, and WebSockets.", content: "HTML5 introduces new features like...", unlockPoints: 110, isLocked: true },
        { title: "Accessibility", description: "Improve usability with ARIA roles, alt text, and tab indexing.", content: "Web accessibility ensures inclusivity through...", unlockPoints: 120, isLocked: true },
        { title: "Miscellaneous Topics", description: "Learn about comments, escape characters, and favicons.", content: "HTML includes many small but important...", unlockPoints: 130, isLocked: true },
        { title: "Best Practices", description: "Follow coding standards and responsive design principles.", content: "Best practices in HTML involve clean code...", unlockPoints: 140, isLocked: true }
    ]

    const tutorials = [];

    for (const tutorialData of tutorialsData) {
        const tutorial = await prisma.tutorial.create({
            data: {
                title: tutorialData.title,
                description: tutorialData.description,
                content: tutorialData.content,
                unlockPoints: tutorialData.unlockPoints,
                isLocked: tutorialData.isLocked,
            },
        });
        tutorials.push(tutorial);
    }

    console.log(`🌱 Created ${tutorials.length} tutorials successfully!`);

    const tutorialRecords = await prisma.tutorial.findMany();

    /** SEED QUIZZES **/
    const quizzes = await prisma.quiz.createMany({
        data: [
            { title: "Basics of HTML Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[0].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "HTML Document Structure Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[1].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Text Formatting Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[2].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Lists Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[3].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Links and Navigation Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[4].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Images and Media Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[5].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Tables Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[6].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Forms and Inputs Quiz", isTimed: true, timeLimit: 60, tutorialId: tutorialRecords[7].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Semantic HTML Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[8].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "HTML Graphics Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[9].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Multimedia and APIs Quiz", isTimed: true, timeLimit: 90, tutorialId: tutorialRecords[10].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "HTML5 Features Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[11].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Accessibility Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[12].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Miscellaneous Topics Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[13].id, createdAt: new Date(), updatedAt: new Date() },
            { title: "Best Practices Quiz", isTimed: false, timeLimit: null, tutorialId: tutorialRecords[14].id, createdAt: new Date(), updatedAt: new Date() }
        ],
    });

    console.log(`🌱 Created ${quizzes.count} quizzes successfully!`);

    const quizRecords = await prisma.quiz.findMany();

    /** SEED QUIZ QUESTIONS **/
    const quizQuestions = await prisma.quizQuestion.createMany({
        data: [
            // 📌 1. Basics of HTML Quiz
            { quizId: quizRecords[0].id, questionText: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Hyperlink Text Markup Language", "High Tech Machine Learning", "Hyper Transfer Markup Language"], correctAnswer: "Hyper Text Markup Language" },
            { quizId: quizRecords[0].id, questionText: "Which tag is used to define a paragraph?", options: ["<p>", "<div>", "<span>", "<br>"], correctAnswer: "<p>" },
            { quizId: quizRecords[0].id, questionText: "What is the root element of an HTML document?", options: ["<html>", "<head>", "<body>", "<doctype>"], correctAnswer: "<html>" },
            { quizId: quizRecords[0].id, questionText: "Which attribute is used to define an inline CSS style?", options: ["class", "id", "style", "css"], correctAnswer: "style" },
            { quizId: quizRecords[0].id, questionText: "Which tag is used for line breaks?", options: ["<br>", "<lb>", "<break>", "<p>"], correctAnswer: "<br>" },

            // 📌 2. HTML Document Structure Quiz
            { quizId: quizRecords[1].id, questionText: "Which section contains metadata of an HTML document?", options: ["<head>", "<body>", "<meta>", "<title>"], correctAnswer: "<head>" },
            { quizId: quizRecords[1].id, questionText: "Where does the <title> tag appear?", options: ["In the body", "In the head", "At the bottom", "Inside <nav>"], correctAnswer: "In the head" },
            { quizId: quizRecords[1].id, questionText: "Which tag is used for the main content?", options: ["<article>", "<body>", "<section>", "<main>"], correctAnswer: "<body>" },
            { quizId: quizRecords[1].id, questionText: "What is the correct tag for a site’s navigation links?", options: ["<nav>", "<menu>", "<ul>", "<aside>"], correctAnswer: "<nav>" },
            { quizId: quizRecords[1].id, questionText: "Which tag defines metadata such as character set?", options: ["<meta>", "<charset>", "<encoding>", "<head>"], correctAnswer: "<meta>" },

            // 📌 3. Text Formatting Quiz
            { quizId: quizRecords[2].id, questionText: "Which tag makes text bold?", options: ["<i>", "<b>", "<strong>", "<em>"], correctAnswer: "<b>" },
            { quizId: quizRecords[2].id, questionText: "What tag is used for italic text?", options: ["<em>", "<i>", "<italic>", "<italics>"], correctAnswer: "<i>" },
            { quizId: quizRecords[2].id, questionText: "Which tag represents emphasized text?", options: ["<i>", "<b>", "<em>", "<strong>"], correctAnswer: "<em>" },
            { quizId: quizRecords[2].id, questionText: "Which tag is used for underlined text?", options: ["<u>", "<ul>", "<underline>", "<text>"], correctAnswer: "<u>" },
            { quizId: quizRecords[2].id, questionText: "What is the purpose of the <blockquote> tag?", options: ["Bold text", "Block-level quote", "Italic text", "Emphasized text"], correctAnswer: "Block-level quote" },

            // 📌 4. Lists Quiz
            { quizId: quizRecords[3].id, questionText: "Which tag is used for an ordered list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<ol>" },
            { quizId: quizRecords[3].id, questionText: "Which tag represents a list item?", options: ["<list>", "<item>", "<li>", "<dt>"], correctAnswer: "<li>" },
            { quizId: quizRecords[3].id, questionText: "Which list type is numbered?", options: ["Ordered List", "Unordered List", "Definition List", "None"], correctAnswer: "Ordered List" },
            { quizId: quizRecords[3].id, questionText: "Which tag is used for definition lists?", options: ["<dl>", "<ul>", "<dt>", "<li>"], correctAnswer: "<dl>" },
            { quizId: quizRecords[3].id, questionText: "What tag represents a term in a definition list?", options: ["<dd>", "<dl>", "<dt>", "<li>"], correctAnswer: "<dt>" },

            // 📌 5. Links and Navigation Quiz
            { quizId: quizRecords[4].id, questionText: "Which tag is used for hyperlinks?", options: ["<link>", "<a>", "<href>", "<nav>"], correctAnswer: "<a>" },
            { quizId: quizRecords[4].id, questionText: "Which attribute defines the hyperlink destination?", options: ["src", "href", "target", "link"], correctAnswer: "href" },
            { quizId: quizRecords[4].id, questionText: "What does target='_blank' do?", options: ["Opens in a new tab", "Changes color", "Adds underline", "Deletes link"], correctAnswer: "Opens in a new tab" },
            { quizId: quizRecords[4].id, questionText: "Which tag represents navigation?", options: ["<nav>", "<menu>", "<header>", "<aside>"], correctAnswer: "<nav>" },
            { quizId: quizRecords[4].id, questionText: "What does the 'rel' attribute specify?", options: ["Link relationship", "Link styling", "JavaScript function", "Color scheme"], correctAnswer: "Link relationship" },

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

        ],
    });

    console.log(`🌱 Created ${quizQuestions.count} quiz questions successfully!`);

    const quizQuestionRecords = await prisma.quizQuestion.findMany();

    /** SEED BADGES **/
    const badges = await prisma.badge.createMany({
        data: Array.from({ length: 10 }, (_, i) => ({
            name: `Badge ${i + 1}`,
            imageUrl: `https://dummyimage.com/100x100/${Math.floor(Math.random() * 16777215).toString(16)}/ffffff.png&text=Badge${i + 1}`,
            pointsReq: (i + 1) * 100,
        })),
    });

    console.log(`🌱 Created ${badges.count} badges successfully!`);

    const badgeRecords = await prisma.badge.findMany();

    /** SEED USERS **/

    console.log('🌱 Seeding users...');

    const usersData = [
        { email: 'alice@mail.com', username: 'Alice' },
        { email: 'bob@mail.com', username: 'Bob' },
        { email: 'charlie@mail.com', username: 'Charlie' },
        { email: 'kali@mail.com', username: 'Kali' },
    ];

    const users: Array<User & { quizAttempts: UserQuizAttempt[] } & { transactions: CoinTransaction[] }> = [];

    for (const userData of usersData) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                username: userData.username,
                email: userData.email,
                passwordHash: await hashPassword("password123"),
                avatarUrl: `https://i.pravatar.cc/150?u=${userData.username}`,
                quizAttempts: {
                    createMany: {
                        data: quizRecords.map(quiz => ({
                            quizId: quiz.id,
                            startedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
                            completedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
                            score: Math.floor(Math.random() * 100),
                        })),
                    },
                },
                streaks: {
                    create: {
                        streakCount: Math.floor(Math.random() * 100),
                        lastLogin: new Date(Date.now() - 1),
                    },
                },
            },
            include: {
                quizAttempts: true,
                transactions: true,
            }
        });
        users.push(
            {
                ...user,
                quizAttempts: user.quizAttempts,
                transactions: user.transactions,
            }
        );
    }

    console.log(`🌱 Created ${usersData.length} users successfully!`);

    const userRecords = await prisma.user.findMany();

    console.log('🌱 Seeding user profile...');

    const userProfileData = [{
        userId: userRecords[0].id,
        rank: Math.floor(Math.random() * 100),
        points: Math.floor(Math.random() * 10_000),
        coinsEarned: Math.floor(Math.random() * 1_000),
        coinsSpent: Math.floor(Math.random() * 1_000),
        theme: themeOptions[Math.floor(Math.random() * themeOptions.length)],
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    },
    {
        userId: userRecords[1].id,
        rank: Math.floor(Math.random() * 100),
        points: Math.floor(Math.random() * 10_000),
        coinsEarned: Math.floor(Math.random() * 1_000),
        coinsSpent: Math.floor(Math.random() * 1_000),
        theme: themeOptions[Math.floor(Math.random() * themeOptions.length)],
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    },
    {
        userId: userRecords[2].id,
        rank: Math.floor(Math.random() * 100),
        points: Math.floor(Math.random() * 10_000),
        coinsEarned: Math.floor(Math.random() * 1_000),
        coinsSpent: Math.floor(Math.random() * 1_000),
        theme: themeOptions[Math.floor(Math.random() * themeOptions.length)],
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    },
    {
        userId: userRecords[3].id,
        rank: Math.floor(Math.random() * 100),
        points: Math.floor(Math.random() * 10_000),
        coinsEarned: Math.floor(Math.random() * 1_000),
        coinsSpent: Math.floor(Math.random() * 1_000),
        theme: themeOptions[Math.floor(Math.random() * themeOptions.length)],
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }];

    for (const userProfile of userProfileData) {
        await prisma.userProfile.create({
            data: userProfile,
        });
    }

    console.log(`🌱 Created ${userProfileData.length} user profiles successfully!`);

    const userProfileRecords = await prisma.userProfile.findMany();

    console.log('🌱 Seeding transactions...');

    const transactions = await prisma.coinTransaction.createMany({
        data: Array.from({ length: 10 }, () => ({
            userProfileId: userProfileRecords[Math.floor(Math.random() * userProfileRecords.length)].userId,
            amount: Math.floor(Math.random() * 1000),
            type: getRandomBool() ? "EARNED" : "SPENT",
            description: 'Transaction description',
            transactionAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        })),
    });

    console.log(`🌱 Created ${transactions.count} transactions successfully!`);

    const transactionRecords = await prisma.coinTransaction.findMany();

    console.log('🌱 Seeding userProgress...');

    const userProgressData = Array.from({ length: 10 }, (_, i) => ({
        userId: userRecords[Math.floor(Math.random() * userRecords.length)].id,
        tutorialId: tutorialRecords[i].id,
        isCompleted: getRandomBool(),
        completedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }));

    const userProgress = await prisma.userProgress.createMany({
        data: userProgressData,
    });

    console.log(`🌱 Created ${userProgressData.length} user progress successfully!`);

    const userProgressRecords = await prisma.userProgress.findMany();

    console.log('🌱 Seeding userBadges...');

    const userBadgesData = Array.from({ length: 10 }, (_, i) => ({
        userId: userRecords[Math.floor(Math.random() * userRecords.length)].id,
        badgeId: badgeRecords[Math.floor(Math.random() * badgeRecords.length)].id,
        earnedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }));

    for (const userBadge of userBadgesData) {
        await prisma.userBadge.upsert({
            where: {
                userId_badgeId: {
                    userId: userBadge.userId,
                    badgeId: userBadge.badgeId,
                },
            },
            update: {},
            create: userBadge,
        })
    }

    console.log(`🌱 Created ${userBadgesData.length} user badges successfully!`);

    const userBadgeRecords = await prisma.userBadge.findMany();

    console.log('🌱 Seeding streaks...');

    const streaksData = Array.from({ length: userRecords.length }, (_, i) => ({
        userId: userRecords[i].id,
        streakCount: Math.floor(Math.random() * 10),
        // longestStreak: Math.floor(Math.random() * 10),
        lastLogin: new Date(Date.now() - 1),
    }));

    for (const streak of streaksData) {
        await prisma.userStreak.upsert({
            where: {
                userId: streak.userId,
            },
            update: {},
            create: streak,
        })
    }

    console.log(`🌱 Created ${streaksData.length} streaks successfully!`);

    const streakRecords = await prisma.userStreak.findMany();

    console.log('🌱 Seeding quizAttempts...');

    const quizAttemptsData = Array.from({ length: 10 }, (_, i) => ({
        userId: users[Math.floor(Math.random() * users.length)].id,
        quizId: quizRecords[Math.floor(Math.random() * quizRecords.length)].id,
        startedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        completedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        score: Math.floor(Math.random() * 100),
    }));

    const quizAttempts = await prisma.userQuizAttempt.createMany({
        data: quizAttemptsData,
    });

    console.log(`🌱 Created ${quizAttemptsData.length} quiz attempts successfully!`);

    const quizAttemptRecords = await prisma.userQuizAttempt.findMany();

    console.log('🌱 Seeding questionAttempts...');

    const questionAttemptsData = [];

    for (let i = 1; i < quizRecords.length; i++) {
        questionAttemptsData.push({
            userQuizAttemptId: quizAttemptRecords[Math.floor(Math.random() * quizAttemptRecords.length)].id,
            questionId: quizQuestionRecords[i].id,
            selectedOption: selectedOption(i, { options: quizQuestionRecords[i].options }),
            isCorrect: selected[quizQuestionRecords[i].id] === quizQuestionRecords[i].correctAnswer,
            pointsEarned: selected[quizQuestionRecords[i].id] === quizQuestionRecords[i].correctAnswer ? 10 : 0,
            quizId: quizRecords[i].id
        });
    }

    const questionAttempts = await prisma.userQuestionAttempt.createMany({
        data: questionAttemptsData,
    });

    console.log(`🌱 Created ${questionAttempts.count} question attempts successfully!`);

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