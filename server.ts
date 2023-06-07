import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as YAML from "yamljs";

// Create Express app
const app = express();

// Read sample resource from file
const sampleResource = JSON.parse(
  fs.readFileSync("./sample-resource.json", "utf8")
);

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// Use the morgan middleware for logging
app.use(morgan("combined", { stream: accessLogStream }));

// Define a route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.get("/api/sample", (req: Request, res: Response) => {
  res.send(sampleResource.message);
});

app.post("/api/sample", (req: Request, res: Response) => {
  const { name } = req.body;
  res.send(`Created a new sample resource with name: ${name}`);
});

// Serve Swagger API documentation
const swaggerFile = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerSpec = YAML.parse(
  swaggerFile.replace(
    "<SAMPLE_RESOURCE>",
    JSON.stringify(sampleResource.message)
  )
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route to display access log
app.get("/api/logs", (req: Request, res: Response) => {
  fs.readFile(path.join(__dirname, "access.log"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading log file");
    } else {
      res.send(data);
    }
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  console.error(err);
  // Handle the error and send a response
  res.status(500).send("Internal Server Error");
});

// Start the server
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;
