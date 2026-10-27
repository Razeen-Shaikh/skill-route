import { RoadmapType } from "@/generated/prisma";

export type SeedRoadmapStep = {
    key: string;
    title: string;
    description: string;
    parentKey?: string;
    order: number;
};

export type SeedRoadmap = {
    title: string;
    description: string;
    category: string;
    type: RoadmapType;
    steps: SeedRoadmapStep[];
};

export const stackRoadmaps: SeedRoadmap[] = [
    {
        title: "MERN Stack",
        description: "Build full-stack JavaScript apps with MongoDB, Express, React, and Node.js.",
        category: "Full Stack",
        type: RoadmapType.MERN,
        steps: [
            { key: "html", title: "HTML", description: "Structure pages with semantic HTML.", order: 1 },
            { key: "css", title: "CSS", description: "Style layouts, flexbox, and grid.", parentKey: "html", order: 1 },
            { key: "tailwind", title: "Tailwind CSS", description: "Build interfaces with utility classes.", parentKey: "css", order: 1 },
            { key: "js", title: "JavaScript", description: "Learn the language that runs the stack.", parentKey: "html", order: 2 },
            { key: "react", title: "React", description: "Build component-based user interfaces.", parentKey: "js", order: 1 },
            { key: "node", title: "Node.js", description: "Run JavaScript on the server.", parentKey: "js", order: 2 },
            { key: "express", title: "Express", description: "Create REST APIs with Express.", parentKey: "node", order: 1 },
            { key: "mongo", title: "MongoDB", description: "Store application data in MongoDB.", parentKey: "express", order: 1 },
        ],
    },
    {
        title: "MEAN Stack",
        description: "Build full-stack apps with MongoDB, Express, Angular, and Node.js.",
        category: "Full Stack",
        type: RoadmapType.MEAN,
        steps: [
            { key: "html", title: "HTML", description: "Structure pages with semantic HTML.", order: 1 },
            { key: "css", title: "CSS", description: "Style layouts, flexbox, and grid.", parentKey: "html", order: 1 },
            { key: "js", title: "JavaScript", description: "Learn the language shared across the stack.", parentKey: "html", order: 2 },
            { key: "ts", title: "TypeScript", description: "Add types before building Angular apps.", parentKey: "js", order: 1 },
            { key: "angular", title: "Angular", description: "Build the client with Angular.", parentKey: "ts", order: 1 },
            { key: "node", title: "Node.js", description: "Run JavaScript on the server.", parentKey: "js", order: 2 },
            { key: "express", title: "Express", description: "Create REST APIs with Express.", parentKey: "node", order: 1 },
            { key: "mongo", title: "MongoDB", description: "Store application data in MongoDB.", parentKey: "express", order: 1 },
        ],
    },
    {
        title: "Frontend",
        description: "Learn the interface stack: HTML, CSS, JavaScript, and React.",
        category: "Web Development",
        type: RoadmapType.FRONTEND,
        steps: [
            { key: "html", title: "HTML", description: "Structure accessible web pages.", order: 1 },
            { key: "css", title: "CSS", description: "Lay out and style the page.", parentKey: "html", order: 1 },
            { key: "responsive", title: "Responsive Design", description: "Make layouts work on every screen size.", parentKey: "css", order: 1 },
            { key: "tailwind", title: "Tailwind CSS", description: "Ship UI with utility classes.", parentKey: "css", order: 2 },
            { key: "js", title: "JavaScript", description: "Add behavior in the browser.", parentKey: "html", order: 2 },
            { key: "react", title: "React", description: "Compose interfaces from components.", parentKey: "js", order: 1 },
            { key: "next", title: "Next.js", description: "Build production React apps.", parentKey: "react", order: 1 },
        ],
    },
    {
        title: "Backend",
        description: "Design APIs, databases, and authentication on the server.",
        category: "Web Development",
        type: RoadmapType.BACKEND,
        steps: [
            { key: "http", title: "HTTP & APIs", description: "Understand requests, responses, and REST.", order: 1 },
            { key: "node", title: "Node.js", description: "Run server-side JavaScript.", parentKey: "http", order: 1 },
            { key: "express", title: "Express", description: "Route requests and return JSON.", parentKey: "node", order: 1 },
            { key: "db", title: "Databases", description: "Model and query relational data.", parentKey: "express", order: 1 },
            { key: "auth", title: "Authentication", description: "Protect routes with sessions and tokens.", parentKey: "db", order: 1 },
            { key: "testing", title: "API Testing", description: "Test endpoints and error cases.", parentKey: "http", order: 2 },
        ],
    },
    {
        title: "Data Science",
        description: "Analyze data with Python, statistics, and visualization.",
        category: "Data",
        type: RoadmapType.DATA_SCIENCE,
        steps: [
            { key: "python", title: "Python", description: "Write the scripts used throughout the stack.", order: 1 },
            { key: "stats", title: "Statistics", description: "Summarize data and test hypotheses.", parentKey: "python", order: 1 },
            { key: "pandas", title: "Pandas & NumPy", description: "Clean and transform tabular data.", parentKey: "python", order: 2 },
            { key: "viz", title: "Data Visualization", description: "Chart findings so they can be explained.", parentKey: "pandas", order: 1 },
            { key: "sql", title: "SQL", description: "Query data where it already lives.", parentKey: "python", order: 3 },
        ],
    },
    {
        title: "Machine Learning",
        description: "Train, evaluate, and deploy machine learning models.",
        category: "Data",
        type: RoadmapType.MACHINE_LEARNING,
        steps: [
            { key: "python", title: "Python", description: "Prepare data and run experiments.", order: 1 },
            { key: "math", title: "Math for ML", description: "Use linear algebra and probability.", parentKey: "python", order: 1 },
            { key: "supervised", title: "Supervised Learning", description: "Train models on labeled data.", parentKey: "math", order: 1 },
            { key: "unsupervised", title: "Unsupervised Learning", description: "Find structure without labels.", parentKey: "math", order: 2 },
            { key: "deep", title: "Deep Learning", description: "Build neural networks for harder tasks.", parentKey: "supervised", order: 1 },
            { key: "deploy", title: "Model Deployment", description: "Serve a trained model to users.", parentKey: "deep", order: 1 },
        ],
    },
    {
        title: "Mobile",
        description: "Ship mobile apps with React Native and Flutter.",
        category: "Mobile Development",
        type: RoadmapType.MOBILE,
        steps: [
            { key: "ui", title: "UI Fundamentals", description: "Design screens, navigation, and touch targets.", order: 1 },
            { key: "rn", title: "React Native", description: "Build iOS and Android apps with React.", parentKey: "ui", order: 1 },
            { key: "nav", title: "Navigation", description: "Move between screens and stacks.", parentKey: "rn", order: 1 },
            { key: "device", title: "Device APIs", description: "Use the camera, storage, and notifications.", parentKey: "rn", order: 2 },
            { key: "flutter", title: "Flutter", description: "Build native interfaces with Dart.", parentKey: "ui", order: 2 },
            { key: "state", title: "State Management", description: "Keep UI state predictable as the app grows.", parentKey: "flutter", order: 1 },
        ],
    },
    {
        title: "DevOps",
        description: "Ship and operate software with Git, containers, and the cloud.",
        category: "Infrastructure",
        type: RoadmapType.DEVOPS,
        steps: [
            { key: "linux", title: "Linux", description: "Work in the shell on a server.", order: 1 },
            { key: "git", title: "Git", description: "Version code and review changes.", parentKey: "linux", order: 1 },
            { key: "docker", title: "Docker", description: "Package an app and its dependencies.", parentKey: "git", order: 1 },
            { key: "cicd", title: "CI/CD", description: "Test and deploy on every change.", parentKey: "docker", order: 1 },
            { key: "k8s", title: "Kubernetes", description: "Run containers across a cluster.", parentKey: "cicd", order: 1 },
            { key: "cloud", title: "Cloud", description: "Host the stack on a cloud provider.", parentKey: "k8s", order: 1 },
        ],
    },
];
