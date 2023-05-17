import express, { Request, Response } from 'express';

// Create Express app
const app = express();

// Define a route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// Start the server
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

