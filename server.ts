import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

// Create Express app
const app = express();

// Define a route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Define a sample GET route
/**
 * @swagger
 * /api/sample:
 *   get:
 *     summary: Get a sample resource
 *     responses:
 *       200:
 *         description: Success message
 */
app.get("/api/sample", (req: Request, res: Response) => {
  res.send("Sample resource");
});

// Define a sample POST route
/**
 * @swagger
 * /api/sample:
 *   post:
 *     summary: Create a new sample resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: John Doe
 *     responses:
 *       200:
 *         description: Success message
 */
app.post("/api/sample", (req: Request, res: Response) => {
  const { name } = req.body;
  res.send(`Created a new sample resource with name: ${name}`);
});

// Swagger specification object
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Express API with Swagger",
    version: "1.0.0",
    description: "A sample API using Express and Swagger",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  paths: {
    "/api/sample": {
      get: {
        summary: "Get a sample resource",
        responses: {
          200: {
            description: "Success message",
          },
        },
      },
      post: {
        summary: "Create a new sample resource",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                },
                example: {
                  name: "John Doe",
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success message",
          },
        },
      },
    },
  },
};

// Serve Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
