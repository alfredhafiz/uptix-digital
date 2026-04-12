import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Seed Admin User
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "uptixdigital@gmail.com" },
  });

  if (!existingAdmin) {
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash("uptix442X@#", 10);

    const adminUser = await prisma.user.create({
      data: {
        email: "uptixdigital@gmail.com",
        name: "Uptix Admin",
        password: hashedPassword,
        role: "ADMIN",
        image:
          "https://api.dicebear.com/7.x/avataaars/png?seed=uptix_admin&backgroundColor=b6e3f4",
        emailVerified: new Date(),
      },
    });
    console.log(`Created admin user: ${adminUser.email}`);
  } else {
    console.log("Admin user already exists, skipping...");
  }

  // Seed Services
  const servicesData = [
    {
      title: "Web Development",
      description:
        "Custom web applications built with cutting-edge technologies like Next.js, React, and Node.js. We create fast, scalable, and SEO-friendly websites that drive results.",
      features: [
        "Next.js & React Applications",
        "E-commerce Solutions",
        "Progressive Web Apps",
        "CMS Integration",
        "Performance Optimization",
      ],
      icon: "Code2",
      color: "blue",
      price: "Starting at $5,000",
      slug: "web-development",
      order: 0,
      published: true,
      featured: true,
    },
    {
      title: "Mobile App Development",
      description:
        "Native and cross-platform mobile applications for iOS and Android. We build intuitive, high-performance apps that users love.",
      features: [
        "React Native Development",
        "iOS & Android Apps",
        "Cross-platform Solutions",
        "App Store Optimization",
        "Maintenance & Support",
      ],
      icon: "Smartphone",
      color: "purple",
      price: "Starting at $10,000",
      slug: "mobile-app-development",
      order: 1,
      published: true,
      featured: true,
    },
    {
      title: "API Development",
      description:
        "Robust and scalable APIs designed for seamless integration. We build RESTful and GraphQL APIs that power your applications.",
      features: [
        "RESTful API Design",
        "GraphQL Implementation",
        "Third-party Integrations",
        "API Documentation",
        "Security Implementation",
      ],
      icon: "Database",
      color: "pink",
      price: "Starting at $3,000",
      slug: "api-development",
      order: 2,
      published: true,
      featured: false,
    },
    {
      title: "Python Applications",
      description:
        "Data-driven applications, automation scripts, and AI/ML solutions using Python. We leverage the power of Python for complex business problems.",
      features: [
        "Data Analysis & Visualization",
        "Machine Learning Models",
        "Automation Scripts",
        "Web Scraping Solutions",
        "AI Integration",
      ],
      icon: "Terminal",
      color: "cyan",
      price: "Starting at $4,000",
      slug: "python-applications",
      order: 3,
      published: true,
      featured: false,
    },
    {
      title: "Performance Optimization",
      description:
        "Speed up your applications with advanced optimization techniques. We analyze and improve your application's performance for better user experience.",
      features: [
        "Core Web Vitals Optimization",
        "Caching Strategies",
        "Database Optimization",
        "CDN Implementation",
        "Load Testing",
      ],
      icon: "Zap",
      color: "yellow",
      price: "Starting at $2,000",
      slug: "performance-optimization",
      order: 4,
      published: true,
      featured: false,
    },
    {
      title: "Full-Stack Solutions",
      description:
        "End-to-end development from database design to deployment. We handle every aspect of your project with modern cloud infrastructure.",
      features: [
        "Database Architecture",
        "Cloud Deployment",
        "DevOps Implementation",
        "CI/CD Pipelines",
        "Monitoring & Logging",
      ],
      icon: "Globe",
      color: "green",
      price: "Starting at $8,000",
      slug: "full-stack-solutions",
      order: 5,
      published: true,
      featured: true,
    },
  ];

  // Check if services already exist
  const existingServices = await prisma.service.count();

  if (existingServices === 0) {
    console.log("Seeding services...");
    for (const service of servicesData) {
      await prisma.service.create({
        data: service,
      });
    }
    console.log(`Created ${servicesData.length} services`);
  } else {
    console.log("Services already exist, skipping...");
  }

  // Seed Projects
  const projectsData = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-featured e-commerce platform with payment integration, inventory management, and real-time analytics.",
      price: 15000,
      previewUrl: "https://example.com/demo",
      repoUrl: "https://github.com/example/ecommerce",
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
      ],
      techStack: ["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL"],
      category: "E-Commerce",
      featured: true,
      published: true,
    },
    {
      title: "Social Media Dashboard",
      description:
        "Analytics dashboard for social media management with real-time metrics and reporting.",
      price: 12000,
      previewUrl: "https://example.com/demo",
      repoUrl: "https://github.com/example/dashboard",
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      ],
      techStack: ["React", "Node.js", "MongoDB", "Redis", "Chart.js"],
      category: "Dashboard",
      featured: true,
      published: true,
    },
    {
      title: "Task Management App",
      description:
        "Collaborative task management application with real-time updates and team features.",
      price: 8000,
      previewUrl: "https://example.com/demo",
      repoUrl: "https://github.com/example/tasks",
      images: [
        "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800",
      ],
      techStack: ["Vue.js", "Firebase", "Tailwind CSS"],
      category: "Productivity",
      featured: false,
      published: true,
    },
    {
      title: "Restaurant Booking System",
      description:
        "Online reservation system for restaurants with table management and customer notifications.",
      price: 6000,
      previewUrl: "https://example.com/demo",
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      ],
      techStack: ["Next.js", "Prisma", "PostgreSQL", "Twilio"],
      category: "Booking",
      featured: false,
      published: true,
    },
    {
      title: "Fitness Tracking App",
      description:
        "Mobile application for tracking workouts, nutrition, and fitness progress.",
      price: 18000,
      previewUrl: "https://example.com/demo",
      repoUrl: "https://github.com/example/fitness",
      images: [
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800",
      ],
      techStack: ["React Native", "Node.js", "MongoDB", "AWS"],
      category: "Mobile App",
      featured: true,
      published: true,
    },
    {
      title: "CRM System",
      description:
        "Customer relationship management system with pipeline tracking and automation.",
      price: 20000,
      previewUrl: "https://example.com/demo",
      images: [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      ],
      techStack: ["Angular", "Java", "Spring Boot", "MySQL"],
      category: "Enterprise",
      featured: false,
      published: true,
    },
  ];

  // Check if projects already exist
  const existingProjects = await prisma.project.count();

  if (existingProjects === 0) {
    console.log("Seeding projects...");
    for (const project of projectsData) {
      await prisma.project.create({
        data: project,
      });
    }
    console.log(`Created ${projectsData.length} projects`);
  } else {
    console.log("Projects already exist, skipping...");
  }

  // Seed default settings
  const defaultSettings = [
    { key: "siteName", value: "Uptix Digital", type: "string", isPublic: true },
    {
      key: "siteDescription",
      value: "Premium Web & App Development Agency",
      type: "string",
      isPublic: true,
    },
    { key: "fromEmail", value: "hello@uptixdigital.com", type: "string" },
    { key: "fromName", value: "Uptix Digital", type: "string" },
    { key: "enableAnalytics", value: "true", type: "boolean" },
    { key: "favicon", value: "/favicon.ico", type: "string", isPublic: true },
    { key: "logo", value: "", type: "string", isPublic: true },
  ];

  console.log("Seeding default settings...");
  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`Upserted ${defaultSettings.length} settings`);

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
