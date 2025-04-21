
export const steps = [
    {
        id: 1,
        title: "HTML",
        description: "Learn the basics of web structure",
        progress: 0,
        completed: false,
        position: { x: 500, y: 50 },
        connections: [2, 3],
        prerequisites: []
    },
    {
        id: 2,
        title: "CSS",
        description: "Learn CSS for styling",
        progress: 0,
        completed: false,
        position: { x: 300, y: 200 },
        connections: [4],
        prerequisites: [1]
    },
    {
        id: 3,
        title: "JavaScript",
        description: "Learn JavaScript fundamentals",
        progress: 0,
        completed: false,
        position: { x: 700, y: 200 },
        connections: [5],
        prerequisites: [1]
    },
    {
        id: 4,
        title: "Tailwind CSS",
        description: "Master Tailwind",
        progress: 0,
        completed: false,
        position: { x: 250, y: 350 },
        connections: [6],
        prerequisites: [2]
    },
    {
        id: 5,
        title: "TypeScript",
        description: "Strongly-typed JavaScript",
        progress: 0,
        completed: false,
        position: { x: 750, y: 350 },
        connections: [6],
        prerequisites: [3]
    },
    {
        id: 6,
        title: "React.js",
        description: "Learn the React library",
        progress: 0,
        completed: false,
        position: { x: 500, y: 500 },
        connections: [7, 8, 9],
        prerequisites: [4, 5]
    },
    {
        id: 7,
        title: "Next.js",
        description: "Full-stack React framework",
        progress: 0,
        completed: false,
        position: { x: 250, y: 650 },
        connections: [10],
        prerequisites: [6]
    },
    {
        id: 8,
        title: "Node.js",
        description: "Learn backend with Node.js",
        progress: 0,
        completed: false,
        position: { x: 500, y: 650 },
        connections: [10],
        prerequisites: [6]
    },
    {
        id: 9,
        title: "GraphQL",
        description: "Advanced API queries",
        progress: 0,
        completed: false,
        position: { x: 750, y: 650 },
        connections: [10],
        prerequisites: [6]
    },
    {
        id: 10,
        title: "Full-Stack Development",
        description: "Build & deploy applications",
        progress: 0,
        completed: false,
        position: { x: 500, y: 800 },
        connections: [],
        prerequisites: [7, 8, 9]
    }
];

export const frontendRoadmap = [
    {
        title: "HTML",
        description: "Foundation of Web Development",
        topics: [
            "Tags, Elements, Attributes",
            "Forms & Inputs",
            "Semantic HTML5 Features",
            "SEO & Accessibility"
        ],
        next: "CSS"
    },
    {
        title: "CSS",
        description: "Styling the Web",
        topics: [
            "Selectors & Specificity",
            "Box Model",
            "Positioning & Layout",
            "Animations & Transitions",
            "Responsive Design"
        ],
        next: "JavaScript"
    },
    {
        title: "JavaScript",
        description: "Programming the Web",
        topics: [
            "Core Concepts",
            "DOM Manipulation",
            "ES6+ Features",
            "Asynchronous JavaScript",
            "Event Handling & Local Storage"
        ],
        next: "TypeScript"
    },
    {
        title: "TypeScript",
        description: "Strongly-Typed JavaScript",
        topics: [
            "Types & Interfaces",
            "Generics & Utility Types",
            "Type Safety in Functions & Components",
            "Working with APIs & Type Definitions"
        ],
        next: "Tailwind CSS"
    },
    {
        title: "Tailwind CSS",
        description: "Utility-First Styling",
        topics: [
            "Basic Usage & Utility Classes",
            "Flexbox & Grid with Tailwind",
            "Custom Configurations & Dark Mode",
            "Optimization with PurgeCSS"
        ],
        next: "React.js"
    },
    {
        title: "React.js",
        description: "Component-Based UI Development",
        topics: [
            "JSX & Components",
            "Props & State",
            "React Hooks",
            "Routing with React Router",
            "Performance Optimization"
        ],
        next: "Next.js"
    },
    {
        title: "Next.js",
        description: "Full-Stack React Framework",
        topics: [
            "Pages & Routing",
            "Server-Side Rendering (SSR) & Static Site Generation (SSG)",
            "Authentication with NextAuth.js",
            "API Routes & Middleware",
            "Production Deployment"
        ],
        next: "Node.js"
    },
    {
        title: "Node.js",
        description: "Backend Development with JavaScript",
        topics: [
            "Core Modules & Basics",
            "Express.js Framework",
            "Database Integration (PostgreSQL, MongoDB, Prisma)",
            "Authentication (JWT, OAuth)",
            "Building REST APIs & WebSockets"
        ],
        next: "GraphQL"
    },
    {
        title: "GraphQL",
        description: "Advanced API Queries & Mutations",
        topics: [
            "GraphQL vs REST",
            "Query & Mutation Basics",
            "Apollo Client & Server Setup",
            "Real-Time Data with Subscriptions"
        ],
        next: "Full-Stack Development"
    },
    {
        title: "Full-Stack Development & Deployment",
        description: "Combining Frontend & Backend with Security Best Practices",
        topics: [
            "CI/CD Pipelines & DevOps Basics",
            "Security Best Practices",
            "Production Deployment (Vercel, AWS, DigitalOcean)",
            "Scaling Strategies (Caching, Load Balancing)"
        ],
        next: "Mastery"
    }
];

export const roadmap = [
    {
        id: 'html',
        label: 'HTML',
        children: ['css', 'js', 'responsive'],
    },
    {
        id: 'css',
        label: 'CSS',
        children: ['flexbox', 'grid', 'sass'],
    },
    {
        id: 'js',
        label: 'JavaScript',
        children: ['es6', 'dom', 'async'],
    },
    {
        id: 'react',
        label: 'React',
        children: ['redux', 'hooks', 'context-api'],
    },
    {
        id: 'node',
        label: 'Node.js',
        children: ['express', 'mongodb'],
    },
    {
        id: 'typescript',
        label: 'TypeScript',
        children: [],
    },
    // More tech concepts...
];
