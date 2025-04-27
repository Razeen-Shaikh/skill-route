import { RoadmapType } from "@/generated/prisma";

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

const quizzesData = [
    { title: "Basics of HTML Quiz" },
    { title: "HTML Document Structure Quiz" },
    { title: "Text Formatting Quiz" },
    { title: "Lists Quiz" },
    { title: "Links and Navigation Quiz" },
    { title: "Images and Media Quiz" },
    { title: "Tables Quiz" },
    { title: "Forms and Inputs Quiz" },
    { title: "Semantic HTML Quiz" },
    { title: "HTML Graphics Quiz" },
    { title: "Multimedia and APIs Quiz" },
    { title: "HTML5 Features Quiz" },
    { title: "Accessibility Quiz" },
    { title: "Miscellaneous Topics Quiz" },
    { title: "Best Practices Quiz" }
];

const quizQuestionData = [
    // 📌 1. Basics of HTML Quiz
    { questionText: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Hyperlink Text Markup Language", "High Tech Machine Learning", "Hyper Transfer Markup Language"], correctAnswer: "Hyper Text Markup Language" },
    { questionText: "Which tag is used to define a paragraph?", options: ["<p>", "<div>", "<span>", "<br>"], correctAnswer: "<p>" },
    { questionText: "What is the root element of an HTML document?", options: ["<html>", "<head>", "<body>", "<doctype>"], correctAnswer: "<html>" },
    { questionText: "Which attribute is used to define an inline CSS style?", options: ["class", "id", "style", "css"], correctAnswer: "style" },
    { questionText: "Which tag is used for line breaks?", options: ["<br>", "<lb>", "<break>", "<p>"], correctAnswer: "<br>" },

    // 📌 2. HTML Elements Quiz
    { questionText: "What is the correct HTML element for inserting a line break?", options: ["<br>", "<lb>", "<break>", "<p>"], correctAnswer: "<br>" },
    { questionText: "Which HTML element is used to create an unordered list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<ul>" },
    { questionText: "Which HTML element is used to create an ordered list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<ol>" },
    { questionText: "Which HTML element is used to create a definition list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<dl>" },
    { questionText: "Which HTML element is used to create a list item?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<li>" },

    // 📌 2. HTML Document Structure Quiz
    { questionText: "Which section contains metadata of an HTML document?", options: ["<head>", "<body>", "<meta>", "<title>"], correctAnswer: "<head>" },
    { questionText: "Where does the <title> tag appear?", options: ["In the body", "In the head", "At the bottom", "Inside <nav>"], correctAnswer: "In the head" },
    { questionText: "Which tag is used for the main content?", options: ["<article>", "<body>", "<section>", "<main>"], correctAnswer: "<body>" },
    { questionText: "What is the correct tag for a site’s navigation links?", options: ["<nav>", "<menu>", "<ul>", "<aside>"], correctAnswer: "<nav>" },
    { questionText: "Which tag defines metadata such as character set?", options: ["<meta>", "<charset>", "<encoding>", "<head>"], correctAnswer: "<meta>" },

    // 📌 3. Text Formatting Quiz
    { questionText: "Which tag makes text bold?", options: ["<i>", "<b>", "<strong>", "<em>"], correctAnswer: "<b>" },
    { questionText: "What tag is used for italic text?", options: ["<em>", "<i>", "<italic>", "<italics>"], correctAnswer: "<i>" },
    { questionText: "Which tag represents emphasized text?", options: ["<i>", "<b>", "<em>", "<strong>"], correctAnswer: "<em>" },
    { questionText: "Which tag is used for underlined text?", options: ["<u>", "<ul>", "<underline>", "<text>"], correctAnswer: "<u>" },
    { questionText: "What is the purpose of the <blockquote> tag?", options: ["Bold text", "Block-level quote", "Italic text", "Emphasized text"], correctAnswer: "Block-level quote" },

    // 📌 4. Lists Quiz
    { questionText: "Which tag is used for an ordered list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], correctAnswer: "<ol>" },
    { questionText: "Which tag represents a list item?", options: ["<list>", "<item>", "<li>", "<dt>"], correctAnswer: "<li>" },
    { questionText: "Which list type is numbered?", options: ["Ordered List", "Unordered List", "Definition List", "None"], correctAnswer: "Ordered List" },
    { questionText: "Which tag is used for definition lists?", options: ["<dl>", "<ul>", "<dt>", "<li>"], correctAnswer: "<dl>" },
    { questionText: "What tag represents a term in a definition list?", options: ["<dd>", "<dl>", "<dt>", "<li>"], correctAnswer: "<dt>" },

    // 📌 5. Links and Navigation Quiz
    { questionText: "Which tag is used for hyperlinks?", options: ["<link>", "<a>", "<href>", "<nav>"], correctAnswer: "<a>" },
    { questionText: "Which attribute defines the hyperlink destination?", options: ["src", "href", "target", "link"], correctAnswer: "href" },
    { questionText: "What does target='_blank' do?", options: ["Opens in a new tab", "Changes color", "Adds underline", "Deletes link"], correctAnswer: "Opens in a new tab" },
    { questionText: "Which tag represents navigation?", options: ["<nav>", "<menu>", "<header>", "<aside>"], correctAnswer: "<nav>" },
    { questionText: "What does the 'rel' attribute specify?", options: ["Link relationship", "Link styling", "JavaScript function", "Color scheme"], correctAnswer: "Link relationship" },

    // 📌 6. Images and Media Quiz
    { questionText: "Which tag is used to embed an image?", options: ["<pic>", "<img>", "<image>", "<media>"], correctAnswer: "<img>" },
    { questionText: "Which attribute defines an image source?", options: ["src", "href", "alt", "source"], correctAnswer: "src" },
    { questionText: "Which tag is used for embedding videos?", options: ["<video>", "<embed>", "<movie>", "<vid>"], correctAnswer: "<video>" },
    { questionText: "Which attribute provides alternative text for an image?", options: ["title", "alt", "desc", "name"], correctAnswer: "alt" },
    { questionText: "Which tag is used for embedding audio?", options: ["<music>", "<audio>", "<sound>", "<mp3>"], correctAnswer: "<audio>" },

    // 📌 7. Tables
    { questionText: "Which tag is used to create a table in HTML?", options: ["<table>", "<tbl>", "<td>", "<tr>"], correctAnswer: "<table>" },
    { questionText: "Which tag defines a table row?", options: ["<th>", "<tr>", "<td>", "<row>"], correctAnswer: "<tr>" },
    { questionText: "What does the <th> tag represent?", options: ["Table header", "Table cell", "Table row", "Table body"], correctAnswer: "Table header" },
    { questionText: "Which attribute is used to merge columns?", options: ["colspan", "rowspan", "merge", "span"], correctAnswer: "colspan" },
    { questionText: "What does the <caption> tag do in a table?", options: ["Adds a title to the table", "Creates a new column", "Merges rows", "Defines a table cell"], correctAnswer: "Adds a title to the table" },

    // 📌 8. Forms and Inputs
    { questionText: "Which tag is used to create a form?", options: ["<form>", "<input>", "<button>", "<fieldset>"], correctAnswer: "<form>" },
    { questionText: "Which attribute specifies the type of an input field?", options: ["type", "name", "input", "field"], correctAnswer: "type" },
    { questionText: "What is the default method for submitting a form?", options: ["POST", "GET", "PUT", "DELETE"], correctAnswer: "GET" },
    { questionText: "Which input type is used for a password field?", options: ["text", "password", "secure", "hidden"], correctAnswer: "password" },
    { questionText: "Which tag is used to create a submit button?", options: ["<button>", "<submit>", "<input type='submit'>", "<form-submit>"], correctAnswer: "<input type='submit'>" },

    // 📌 9. Semantic HTML
    { questionText: "Which tag is used for the main content of a page?", options: ["<section>", "<main>", "<article>", "<div>"], correctAnswer: "<main>" },
    { questionText: "Which tag defines a self-contained section?", options: ["<section>", "<article>", "<aside>", "<nav>"], correctAnswer: "<article>" },
    { questionText: "What does the <aside> element represent?", options: ["A sidebar or additional content", "A navigation bar", "A paragraph", "A footer"], correctAnswer: "A sidebar or additional content" },
    { questionText: "Which tag is used for defining a footer?", options: ["<foot>", "<footer>", "<bottom>", "<end>"], correctAnswer: "<footer>" },
    { questionText: "What is the benefit of semantic HTML?", options: ["Improves SEO and accessibility", "Changes color", "Makes the page faster", "Reduces page size"], correctAnswer: "Improves SEO and accessibility" },

    // 📌 10. HTML Graphics
    { questionText: "Which tag is used to draw graphics in HTML?", options: ["<canvas>", "<svg>", "<graphic>", "<draw>"], correctAnswer: "<canvas>" },
    { questionText: "What does SVG stand for?", options: ["Scalable Vector Graphics", "Simple Visual Graphics", "Smart View Graphics", "Systematic Vector Graphics"], correctAnswer: "Scalable Vector Graphics" },
    { questionText: "Which tag is used for vector graphics?", options: ["<canvas>", "<svg>", "<vector>", "<draw>"], correctAnswer: "<svg>" },
    { questionText: "Which API allows drawing on the canvas?", options: ["Canvas API", "SVG API", "WebGL", "2D Graphics API"], correctAnswer: "Canvas API" },
    { questionText: "What is WebGL used for?", options: ["Rendering 3D graphics", "Playing music", "Styling HTML", "Creating forms"], correctAnswer: "Rendering 3D graphics" },

    // 📌 11. Multimedia and APIs
    { questionText: "Which tag is used for embedding a video?", options: ["<video>", "<media>", "<play>", "<vid>"], correctAnswer: "<video>" },
    { questionText: "Which API is used to track user location?", options: ["Geolocation API", "GPS API", "Navigator API", "Location Tracker API"], correctAnswer: "Geolocation API" },
    { questionText: "What does the drag-and-drop API enable?", options: ["Moving elements with the mouse", "File uploads", "Playing audio", "Resizing text"], correctAnswer: "Moving elements with the mouse" },
    { questionText: "Which tag is used for embedding external content like YouTube videos?", options: ["<iframe>", "<embed>", "<object>", "<source>"], correctAnswer: "<iframe>" },
    { questionText: "Which API is used to store data in the browser?", options: ["LocalStorage", "SessionStorage", "Cookies", "All of the above"], correctAnswer: "All of the above" },

    // 📌 12. HTML5
    { questionText: "Which HTML5 feature allows offline storage?", options: ["Local Storage", "Cookies", "Cache API", "Session Storage"], correctAnswer: "Local Storage" },
    { questionText: "Which tag is used for progress bars?", options: ["<progress>", "<bar>", "<meter>", "<load>"], correctAnswer: "<progress>" },
    { questionText: "Which new input type was introduced in HTML5?", options: ["date", "email", "range", "All of the above"], correctAnswer: "All of the above" },
    { questionText: "What is WebSockets used for?", options: ["Real-time communication", "File uploads", "Image rendering", "Video playback"], correctAnswer: "Real-time communication" },
    { questionText: "What does the <datalist> element provide?", options: ["Auto-suggest options", "Form validation", "File uploads", "Data storage"], correctAnswer: "Auto-suggest options" },

    // 📌 13. ARIA
    { questionText: "What does ARIA stand for?", options: ["Accessible Rich Internet Applications", "Automated Rich Interface Attributes", "Adaptive Responsive Interface API", "Accessible Runtime Integration API"], correctAnswer: "Accessible Rich Internet Applications" },
    { questionText: "What is the purpose of alt text?", options: ["Describe images for screen readers", "Change image color", "Increase page speed", "Resize images"], correctAnswer: "Describe images for screen readers" },
    { questionText: "Which attribute defines keyboard navigation order?", options: ["tabindex", "accesskey", "role", "index"], correctAnswer: "tabindex" },
    { questionText: "Which ARIA role is used for a button?", options: ["button", "alert", "form", "navigation"], correctAnswer: "button" },
    { questionText: "Which color contrast ratio is recommended for accessibility?", options: ["4.5:1", "3:1", "6:1", "2:1"], correctAnswer: "4.5:1" },

    // 📌 14. Accessibility
    { questionText: "What is a best practice for writing HTML?", options: ["Use semantic tags", "Use inline styles", "Avoid closing tags", "Use uppercase tags"], correctAnswer: "Use semantic tags" },
    { questionText: "Which approach improves website accessibility?", options: ["Using alt text", "Hiding all images", "Using only divs", "Avoiding headings"], correctAnswer: "Using alt text" },
    { questionText: "Which technique improves SEO?", options: ["Semantic HTML", "Large images", "Excessive JavaScript", "Using only tables"], correctAnswer: "Semantic HTML" },
    { questionText: "Why should you avoid inline CSS?", options: ["Reduces maintainability", "Makes CSS easier", "Improves speed", "No impact"], correctAnswer: "Reduces maintainability" },
    { questionText: "Which unit is recommended for responsive design?", options: ["em", "px", "cm", "mm"], correctAnswer: "em" },

    // 📌 15. Best Practices
    { questionText: "What is the recommended file size for images?", options: ["100KB", "200KB", "500KB", "1MB"], correctAnswer: "1MB" },
    { questionText: "Which color contrast ratio is recommended for accessibility?", options: ["4.5:1", "3:1", "6:1", "2:1"], correctAnswer: "4.5:1" },
    { questionText: "What is the recommended file size for images?", options: ["100KB", "200KB", "500KB", "1MB"], correctAnswer: "1MB" },
    { questionText: "What is the recommended file size for images?", options: ["100KB", "200KB", "500KB", "1MB"], correctAnswer: "1MB" },
    { questionText: "What is the recommended file size for images?", options: ["100KB", "200KB", "500KB", "1MB"], correctAnswer: "1MB" },
];

const roadmapData = [
    { title: 'MERN Stack', description: 'A comprehensive roadmap for web development.', createdAt: new Date(), updatedAt: new Date(), type: RoadmapType.FRONTEND, category: 'Web Development' },
    { title: 'Data Science Roadmap', description: 'A roadmap for aspiring data scientists.', createdAt: new Date(), updatedAt: new Date() },
    { title: 'Machine Learning Roadmap', description: 'A roadmap for machine learning enthusiasts.', createdAt: new Date(), updatedAt: new Date() },
    { title: 'Mobile Development Roadmap', description: 'A roadmap for mobile app developers.', createdAt: new Date(), updatedAt: new Date() },
];

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


export { usersData, quizzesData, quizQuestionData, roadmapData, tutorialsData };