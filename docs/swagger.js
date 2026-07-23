import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "URL Shortener API",
      version: "1.0.0",
        description: "A simple URL shortener API built with Node.js, Express, and PostgreSQL. This API allows users to create shortened URLs, track clicks, and manage their links.",
        },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;