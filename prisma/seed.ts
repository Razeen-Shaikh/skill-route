import { ThemeName, DifficultyLevel, User, UserQuestionAttempt, UserProgress } from "@/lib/interface";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
const themeOptions: ThemeName[] = ['LIGHT', 'DARK'];
const difficultyLevels: DifficultyLevel[] = ["EASY", "MEDIUM", "HARD"];
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomBool = () => Math.random() < 0.5;
let selected: { [key: string]: string } = {};
const selectedOption = (id: number, quizQuestion: { options: string[] }) => {
    selected = { [id]: quizQuestion.options[Math.floor(Math.random() * 4)] };
    return selected[id];
}
// const calculateCoins = (score: number, maxScore: number, difficulty: 'easy' | 'medium' | 'hard') => {
//     const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
//     const baseCoins = 10; // Minimum reward per quiz
//     return Math.floor((score / maxScore) * difficultyMultiplier * baseCoins);
// };


async function main() {
    console.log('🌱 Starting database seeding...');

    /** SEED USERS **/

    console.log("🌱 Seeding users...");

    const usersData: Partial<User>[] = [
        { email: "alice@mail.com", username: "razeen", firstName: "Razeen", lastName: "Shaikh", role: "admin" },
        { email: "bob@mail.com", username: "bob", firstName: "Bob", lastName: "Smith", role: "user" },
        { email: "charlie@mail.com", username: "charlie", firstName: "Charlie", lastName: "Brown", role: "user" },
        { email: "kali@mail.com", username: "kali", firstName: "Kali", lastName: "Smith", role: "user" },
        { email: "jane@mail.com", username: "jane", firstName: "Jane", lastName: "Doe", role: "user" },
        { email: "john@mail.com", username: "john", firstName: "John", lastName: "Doe", role: "user" },
        { email: "mark@mail.com", username: "mark", firstName: "Mark", lastName: "Smith", role: "admin" },
        { email: "jim@mail.com", username: "jim", firstName: "Jim", lastName: "Smith", role: "user" },
        { email: "joe@mail.com", username: "joe", firstName: "Joe", lastName: "Smith", role: "user" },
        { email: "mike@mail.com", username: "mike", firstName: "Mike", lastName: "Smith", role: "user" },
        { email: "sally@mail.com", username: "sally", firstName: "Sally", lastName: "Smith", role: "user" },
        { email: "sue@mail.com", username: "sue", firstName: "Sue", lastName: "Smith", role: "admin" },
        { email: "tom@mail.com", username: "tom", firstName: "Tom", lastName: "Smith", role: "user" },
        { email: "tim@mail.com", username: "tim", firstName: "Tim", lastName: "Smith", role: "user" },
    ];

    const users = [];

    for (const userData of usersData) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                username: userData.username ?? "user",
                firstName: userData.firstName ?? "",
                lastName: userData.lastName,
                email: userData.email ?? "default@mail.com",
                passwordHash: await hashPassword("password123"),
                avatarUrl: `https://i.pravatar.cc/150?u=${userData.username}`,
                role: userData.role,
                emailVerified: true,
            },
        });

        users.push(user);
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
`, unlockPoints: 10, isLocked: true
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

    const tutorials = [];

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
            difficulty: difficultyLevels[Math.floor(Math.random() * 3)],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const tutorial = await prisma.tutorial.create({
            data: tutorialDataToCreate,
        });

        tutorials.push(tutorial);
    }

    console.log({ tutorials })

    for (let i = 0; i < tutorials.length - 1; i++) {
        await prisma.tutorial.update({
            where: { id: tutorials[i].id },
            data: { nextTutorialId: tutorials[i + 1].id },
        });
    }

    console.log({ tutorials })

    console.log(`🌱 Created ${tutorials.length} tutorials successfully!`);

    const tutorialRecords = await prisma.tutorial.findMany();

    /** SEED QUIZZES **/

    console.log('🌱 Seeding quizzes...');

    let isTimed = false;
    const getIsTimed = () => {
        isTimed = [true, false][Math.floor(Math.random() * 2)];
        return isTimed
    };

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

    const quizzes = [];

    for (const quiz of quizzesData) {
        const createdQuiz = await prisma.quiz.create({
            data: {
                title: quiz.title,
                isTimed: getIsTimed(),
                timeLimit: isTimed ? [30, 60, 90, 120, 150, 180, 210, 240, 270, 300][Math.floor(Math.random() * 10)] : null,
                tutorialId: quiz.tutorialId,
                createdAt: new Date(),
                updatedAt: new Date(),
                maxScore: 100,
                passPercentage: 50,
                difficulty: difficultyLevels[Math.floor(Math.random() * 3)]
            }
        });
        quizzes.push(createdQuiz);
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

    await prisma.quizQuestion.createMany({
        data: quizRecords.flatMap((quiz, quizIndex) => {
            const questionDataSlice = quizQuestionData.slice(quizIndex * 5, (quizIndex + 1) * 5);
            return questionDataSlice.map((questionData) => ({
                quizId: quiz.id,
                questionText: questionData.questionText,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer,
                points: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
        }),
    });

    const quizQuestionRecords = await prisma.quizQuestion.findMany();

    /** SEED BADGES **/

    console.log('🌱 Seeding badges...');

    const badges = await prisma.badge.createMany({
        data: Array.from({ length: 10 }, (_unused, i) => ({
            name: `Badge ${i + 1}`,
            imageUrl: `https://dummyimage.com/100x100/${Math.floor(Math.random() * 16777215).toString(16)}/ffffff.png&text=Badge${i + 1}`,
            pointsReq: (i + 1) * 100,
        })),
    });

    console.log(`🌱 Created ${badges.count} badges successfully!`);

    const badgeRecords = await prisma.badge.findMany();

    /** SEED USER PROFILES **/

    console.log('🌱 Seeding user profile...');

    const userProfileData = [];

    for (let i = 0; i < userRecords.length; i++) {
        userProfileData.push({
            userId: userRecords[i].id,
            rank: i + 1,
            points: Math.floor(Math.random() * 10_000),
            coins: Math.floor(Math.random() * 10000),
            theme: themeOptions[Math.floor(Math.random() * themeOptions.length)],
            createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        });
    }

    for (const userProfile of userProfileData) {
        await prisma.userProfile.create({
            data: userProfile,
        });
    }

    console.log(`🌱 Created ${userProfileData.length} user profiles successfully!`);

    // const userProfileRecords = await prisma.userProfile.findMany();

    console.log('🌱 Seeding transactions...');

    const transactions = await prisma.coinTransaction.createMany({
        data: Array.from({ length: 50 }, () => ({
            userProfileId: userRecords[Math.floor(Math.random() * userRecords.length)].id,
            amount: Math.floor(Math.random() * 100),
            type: getRandomBool() ? "EARNED" : "SPENT",
            description: 'Transaction description',
            transactionAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        })),
    });

    console.log(`🌱 Created ${transactions.count} transactions successfully!`);

    const transactionRecords = await prisma.coinTransaction.findMany();

    console.log('🌱 Seeding userBadges...');

    const userBadgesData = Array.from({ length: 20 }, () => ({
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

    // const userBadgeRecords = await prisma.userBadge.findMany();

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

    // const streakRecords = await prisma.userStreak.findMany();

    /** SEED QUIZ ATTEMPTS**/

    console.log('🌱 Seeding quiz attempts...');

    let attemptQuizId = quizRecords[Math.floor(Math.random() * quizRecords.length)].id;
    const getQuizId = () => {
        attemptQuizId = quizRecords.filter(q => q.tutorialId === tutorialRecords[0].id)[Math.floor(Math.random() * quizRecords.filter(q => q.tutorialId === tutorialRecords[0].id).length)].id;
        return attemptQuizId;
    }

    const getStartedAt = () => getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31));

    const getScoreBasedOnDifficulty = (difficulty: string) => {
        switch (difficulty) {
            case "EASY":
                return Math.floor(Math.random() * (100 - 60) + 60); // 60-100
            case "MEDIUM":
                return Math.floor(Math.random() * (90 - 40) + 40); // 40-90
            case "HARD":
                return Math.floor(Math.random() * (80 - 20) + 20); // 20-80
            default:
                return Math.floor(Math.random() * 100);
        }
    };

    const quizAttemptsData = Array.from({
        length: quizRecords.filter(q => q.tutorialId === tutorialRecords[0].id).length * userRecords.length * 2
    }, () => {
        const quizId = getQuizId();
        const startedAt = getStartedAt();
        const quizRecord = quizRecords.find(q => q.id === quizId);

        const completedAt = quizRecord?.timeLimit
            ? new Date(startedAt.getTime() + quizRecord.timeLimit * 60 * 1000)
            : startedAt;

        return ({
            userId: userRecords[Math.floor(Math.random() * users.length)].id,
            quizId,
            startedAt,
            completedAt,
            score: getScoreBasedOnDifficulty(quizRecord?.difficulty || "EASY"),
        })
    });

    await prisma.userQuizAttempt.createMany({
        data: quizAttemptsData,
    });

    console.log(`🌱 Created ${quizAttemptsData.length} quiz attempts successfully!`);

    const quizAttemptRecords = await prisma.userQuizAttempt.findMany();

    /** User Question Attempt **/

    console.log('🌱 Seeding question attempts...');

    const questionAttemptsData: Partial<UserQuestionAttempt>[] = [];

    for (const quizAttempt of quizAttemptRecords) {
        for (const question of quizQuestionRecords) {
            const selectedAnswer = selectedOption(question.id, { options: question.options });
            questionAttemptsData.push({
                userQuizAttemptId: quizAttempt.id,
                questionId: question.id,
                selectedOption: selectedAnswer,
                isCorrect: selectedAnswer === question.correctAnswer,
                pointsEarned: selectedAnswer === question.correctAnswer ? question.points : 0,
                createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
                updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            } as UserQuestionAttempt);
        }
    }

    const questionAttempts = [];

    for (const questionAttempt of questionAttemptsData) {
        const createQuestionAttempt = await prisma.userQuestionAttempt.create({
            data: {
                userQuizAttemptId: questionAttempt.userQuizAttemptId!,
                questionId: questionAttempt.questionId!,
                selectedOption: questionAttempt.selectedOption!,
                isCorrect: questionAttempt.isCorrect!,
                pointsEarned: questionAttempt.pointsEarned!,
                createdAt: questionAttempt.createdAt!,
                updatedAt: questionAttempt.updatedAt!,
            },
        });
        questionAttempts.push(createQuestionAttempt);
    }

    console.log(`🌱 Created ${questionAttempts.length} question attempts successfully!`);

    /** User Progress **/

    console.log('🌱 Seeding userProgress...');

    let userId = userRecords[Math.floor(Math.random() * userRecords.length)].id;
    const getUserId = () => {
        userId = userRecords[Math.floor(Math.random() * userRecords.length)].id;
        return userId;
    }

    const getTotalQuizAttemptsByUserAndTutorial = (userId: number, tutorialId: number) => {
        // Get all quizzes that belong to the tutorial
        const tutorialQuizzes = quizRecords.filter(q => q.tutorialId === tutorialId).map(q => q.id);

        // Filter quiz attempts where the user attempted a quiz from this tutorial
        return quizAttemptRecords.filter(q => q.userId === userId && tutorialQuizzes.includes(q.quizId)).length;
    };


    const getBestScoreByUserIdAndTutorialId = (userId: number, tutorialId: number) => {
        // Get all quizzes associated with the tutorial
        const tutorialQuizzes = quizRecords.filter(q => q.tutorialId === tutorialId).map(q => q.id);

        // Get all attempts where the user attempted a quiz from this tutorial
        const userAttempts = quizAttemptRecords.filter(q => q.userId === userId && tutorialQuizzes.includes(q.quizId));

        // If there are no attempts, return 0
        if (userAttempts.length === 0) return 0;

        // Return the highest score from those attempts
        return Math.max(...userAttempts.map(q => q.score));
    };


    const getPercentageCompleted = (userId: number, tutorialId: number) => {
        const tutorialQuizzes = quizRecords.filter(q => q.tutorialId === tutorialId);
        const completedQuizzes = quizAttemptRecords.filter(q => q.userId === userId && tutorialQuizzes.some(tq => tq.id === q.quizId));

        return tutorialQuizzes.length > 0 ? Math.round((completedQuizzes.length / tutorialQuizzes.length) * 100) : 0;
    };

    const getIsCompleted = (percentageCompleted: number) => percentageCompleted === 100;

    const userProgressData: Partial<UserProgress>[] = Array.from({ length: 10 }, (_, i) => {
        const userId = getUserId();
        const tutorialId = tutorialRecords[i].id;
        const percentageCompleted = getPercentageCompleted(userId, tutorialId);

        return ({
            userId: getUserId(),
            tutorialId: tutorialRecords[i].id,
            isCompleted: getIsCompleted(percentageCompleted),
            attempts: getTotalQuizAttemptsByUserAndTutorial(userId, tutorialId),
            bestScore: getBestScoreByUserIdAndTutorialId(userId, tutorialId),
            percentageCompleted,
            interviewCompleted: false,
            challengeCompleted: false,
            completedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            updatedAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        } as unknown as UserProgress)
    });

    for (const userProgress of userProgressData) {
        await prisma.userProgress.upsert({
            where: {
                userId_tutorialId: {
                    userId: userProgress.userId!,
                    tutorialId: userProgress.tutorialId!,
                },
            },
            update: {
                isCompleted: userProgress.isCompleted,
                attempts: userProgress.attempts,
                bestScore: userProgress.bestScore,
                percentageCompleted: userProgress.percentageCompleted,
                interviewCompleted: userProgress.interviewCompleted,
                challengeCompleted: userProgress.challengeCompleted,
                completedAt: userProgress.completedAt,
            },
            create: {
                userId: userProgress.userId!,
                tutorialId: userProgress.tutorialId!,
                isCompleted: userProgress.isCompleted,
                attempts: userProgress.attempts,
                bestScore: userProgress.bestScore,
                percentageCompleted: userProgress.percentageCompleted,
                interviewCompleted: userProgress.interviewCompleted,
                challengeCompleted: userProgress.challengeCompleted,
                completedAt: userProgress.completedAt,
            },
        })
    }

    console.log(`🌱 Created ${userProgressData.length} user progress successfully!`);

    // const userProgressRecords = await prisma.userProgress.findMany();

    /** Recent Activity **/

    console.log('🌱 Seeding recent activities...');

    let type = "";
    let value = 0;

    const getType = () => {
        type = ["quiz_completed", "badge_unlocked", "transaction", "tutorial_completed", "xp_earned", "coins_earned", "level_unlocked"][Math.floor(Math.random() * 7)];
        return type;
    }

    const getValue = () => {
        if (type === "quiz_completed") {
            value = Math.floor(Math.random() * 100);
        } else if (type === "badge_unlocked") {
            value = Math.floor(Math.random() * 100);
        } else if (type === "transaction") {
            value = Math.floor(Math.random() * 100);
        } else if (type === "tutorial_completed") {
            value = Math.floor(Math.random() * 100);
        } else if (type === "xp_earned") {
            value = Math.floor(Math.random() * 100);
        } else if (type === "coins_earned") {
            value = Math.floor(Math.random() * 100);
        } else if (type === "level_unlocked") {
            value = Math.floor(Math.random() * 10);
        }
        return value;
    }

    const getDescription = () => {
        if (type === "quiz_completed") {
            return quizRecords[Math.floor(Math.random() * quizRecords.length)].title;
        } else if (type === "badge_unlocked") {
            return badgeRecords[Math.floor(Math.random() * badgeRecords.length)].name;
        } else if (type === "transaction") {
            return transactionRecords[Math.floor(Math.random() * transactionRecords.length)].description;
        } else if (type === "tutorial_completed") {
            return tutorialRecords[Math.floor(Math.random() * tutorialRecords.length)].title;
        } else if (type === "xp_earned") {
            return `Earned ${value} XP`;
        } else if (type === "coins_earned") {
            return `Earned ${value} Coins`;
        } else if (type === "level_unlocked") {
            return `Unlocked Level ${value}`
        }
    }

    const recentActivities = await prisma.recentActivity.createMany({
        data: Array.from({ length: 10 }, () => ({
            userId: userRecords[Math.floor(Math.random() * userRecords.length)].id,
            type: getType(),
            referenceId: [quizRecords[Math.floor(Math.random() * quizRecords.length)].id, badgeRecords[Math.floor(Math.random() * badgeRecords.length)].id, transactionRecords[Math.floor(Math.random() * transactionRecords.length)].id, tutorialRecords[Math.floor(Math.random() * tutorialRecords.length)].id][Math.floor(Math.random() * 4)],
            value: getValue(),
            description: getDescription(),
            createdAt: getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31))
        })),
    });

    console.log(`🌱 Created ${recentActivities.count} recent activities successfully!`);

    console.log('✅ Database seeding completed successfully!');
}
/******  0b3f36be-3826-48aa-801e-02c2069ab5e7  *******/
main()
    .catch(error => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });