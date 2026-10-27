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

### **1. \`<!DOCTYPE html>\` â€“ Document Type Declaration**  
- Declares the document as an HTML5 document.  
- Ensures that the browser correctly interprets the HTML.  

### **2. \`<html>\` â€“ The Root Element**  
- The entire HTML document is wrapped inside this tag.  
- The \`lang="en"\` attribute specifies that the language of the document is English.  

### **3. \`<head>\` â€“ Metadata Section**  
- Contains information about the document, such as:  
- \`<meta charset="UTF-8">\` â€“ Specifies character encoding (UTF-8 supports all characters).  
- \`<meta name="viewport" content="width=device-width, initial-scale=1.0">\` â€“ Ensures responsiveness.  
- \`<title>\` â€“ Sets the title displayed on the browser tab.  

### **4. \`<body>\` â€“ Content Section**  
- Holds the visible content of the webpage, including:  
- \`<h1>\` â€“ A heading tag (largest level).  
- \`<p>\` â€“ A paragraph tag for text.  

---

## **Visual Representation of HTML Structure**  

\`\`\`
HTML Document
â”œâ”€â”€ <!DOCTYPE html>
â”œâ”€â”€ <html>
â”‚   â”œâ”€â”€ <head>
â”‚   â”‚   â”œâ”€â”€ <meta charset="UTF-8">
â”‚   â”‚   â”œâ”€â”€ <meta name="viewport">
â”‚   â”‚   â”œâ”€â”€ <title>
â”‚   â”œâ”€â”€ <body>
â”‚   â”‚   â”œâ”€â”€ <h1>
â”‚   â”‚   â”œâ”€â”€ <p>
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

Next, you can explore **HTML Attributes and Elements** to enhance your knowledge! ðŸš€
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
| \`<b>\` | Bold text (without importance) | \`<b>Bold Text</b>\` â†’ **Bold Text** |
| \`<strong>\` | Important bold text | \`<strong>Important</strong>\` â†’ **Important** |
| \`<i>\` | Italic text (without emphasis) | \`<i>Italic Text</i>\` â†’ *Italic Text* |
| \`<em>\` | Emphasized text | \`<em>Emphasis</em>\` â†’ *Emphasis* |
| \`<u>\` | Underlined text | \`<u>Underlined</u>\` â†’ _Underlined_ |
| \`<mark>\` | Highlighted text | \`<mark>Highlighted</mark>\` â†’ <mark>Highlighted</mark> |
| \`<small>\` | Smaller text | \`<small>Smaller</small>\` â†’ <small>Smaller</small> |
| \`<del>\` | Strikethrough (deleted) text | \`<del>Deleted</del>\` â†’ ~~Deleted~~ |
| \`<ins>\` | Inserted (underlined) text | \`<ins>Inserted</ins>\` â†’ <ins>Inserted</ins> |
| \`<sub>\` | Subscript text | \`H<sub>2</sub>O\` â†’ Hâ‚‚O |
| \`<sup>\` | Superscript text | \`E = mc<sup>2</sup>\` â†’ E = mcÂ² |

---

## **Example: Using Text Formatting in HTML**  

Hereâ€™s a simple example demonstrating different text formatting elements in action:  

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
<p>Einsteinâ€™s equation: E = mc<sup>2</sup></p>
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

### ðŸ”¥ Next, explore **CSS Styling** to further improve text appearance on your web pages!
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


export { usersData, roadmapData, tutorialsData };
