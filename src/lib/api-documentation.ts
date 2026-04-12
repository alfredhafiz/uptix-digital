/**
 * Swagger/OpenAPI Documentation Generator
 * Auto-generates API documentation from route definitions
 */

export const API_DOCUMENTATION = {
  openapi: "3.0.0",
  info: {
    title: "Uptix Digital Agency API",
    description:
      "Complete API documentation for Uptix Digital - Web & App Development Agency",
    version: "1.0.0",
    contact: {
      name: "Uptix Digital Support",
      email: "support@uptixdigital.com",
    },
    license: {
      name: "MIT",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      description: "API Server",
    },
  ],
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                  },
                  confirmPassword: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                  },
                },
                required: ["name", "email", "password", "confirmPassword"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    userId: { type: "string" },
                    email: { type: "string" },
                  },
                },
              },
            },
          },
          400: { description: "Validation error or user already exists" },
          429: { description: "Too many requests" },
        },
      },
    },
    "/api/auth/forgot-password": {
      post: {
        tags: ["Authentication"],
        summary: "Request password reset",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                },
                required: ["email"],
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset email sent (if account exists)" },
          400: { description: "Invalid email" },
        },
      },
    },
    "/api/auth/reset-password": {
      post: {
        tags: ["Authentication"],
        summary: "Reset password with token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                  },
                  confirmPassword: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                  },
                },
                required: ["token", "email", "password", "confirmPassword"],
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset successfully" },
          400: { description: "Invalid or expired token" },
        },
      },
    },
    "/api/contact": {
      post: {
        tags: ["Contact"],
        summary: "Submit contact form",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  service: { type: "string" },
                  budget: { type: "string" },
                  message: { type: "string", minLength: 10 },
                },
                required: ["name", "email", "message"],
              },
            },
          },
        },
        responses: {
          200: { description: "Message received successfully" },
          400: { description: "Validation error" },
          429: { description: "Too many requests" },
        },
      },
    },
    "/api/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create new order",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  serviceType: {
                    type: "string",
                    enum: [
                      "WEB_DEVELOPMENT",
                      "APP_DEVELOPMENT",
                      "API_DEVELOPMENT",
                    ],
                  },
                  title: { type: "string" },
                  description: { type: "string" },
                  budget: { type: "number" },
                  timeline: { type: "string" },
                },
                required: ["serviceType", "title", "description"],
              },
            },
          },
        },
        responses: {
          201: { description: "Order created successfully" },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
        },
      },
      get: {
        tags: ["Orders"],
        summary: "Get user orders",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Orders retrieved successfully" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/search": {
      get: {
        tags: ["Search"],
        summary: "Full-text search",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string", minLength: 2 },
            description: "Search query",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10, maximum: 50 },
            description: "Number of results",
          },
          {
            name: "type",
            in: "query",
            schema: {
              type: "string",
              enum: ["blog", "project", "service", "all"],
              default: "all",
            },
            description: "Result type filter",
          },
        ],
        responses: {
          200: {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    query: { type: "string" },
                    count: { type: "integer" },
                    results: { type: "array" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          name: { type: "string" },
          role: { type: "string", enum: ["ADMIN", "CLIENT"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          serviceType: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          status: {
            type: "string",
            enum: ["PENDING", "IN_PROGRESS", "REVIEW", "DONE", "CANCELLED"],
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Blog: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          content: { type: "string" },
          published: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  tags: [
    { name: "Authentication", description: "User authentication endpoints" },
    { name: "Contact", description: "Contact form" },
    { name: "Orders", description: "Order management" },
    { name: "Search", description: "Full-text search" },
  ],
};
