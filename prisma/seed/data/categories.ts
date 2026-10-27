export const categoryData = [
  {
    name: "Web Development",
    slug: "web-development",
    description: "Frontend and backend web technologies",
    icon: "globe",
  },
  {
    name: "Data Structures & Algorithms",
    slug: "dsa",
    description: "Core CS fundamentals for technical interviews",
    icon: "code",
    parentSlug: "web-development",
  },
  {
    name: "System Design",
    slug: "system-design",
    description: "Scalable architecture and distributed systems",
    icon: "layers",
  },
  {
    name: "Databases",
    slug: "databases",
    description: "SQL, NoSQL, and data modeling",
    icon: "database",
    parentSlug: "web-development",
  },
  {
    name: "DevOps & Cloud",
    slug: "devops",
    description: "CI/CD, containers, and cloud platforms",
    icon: "cloud",
  },
  {
    name: "Behavioral",
    slug: "behavioral",
    description: "Soft skills and interview communication",
    icon: "users",
  },
  {
    name: "Interview Prep",
    slug: "interview-prep",
    description: "Company-specific and general interview preparation",
    icon: "briefcase",
  },
];
