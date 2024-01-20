// Load environment variables from the .env file
require("dotenv").config();

// Import required modules and middleware
const express = require("express");
const { logReqRes } = require("./middlewares/log");

// Import routers for different routes
const healthRouter = require("./routes/health");
const userRouter = require("./routes/user");
const accountRouter = require("./routes/account");
const transactionRouter = require("./routes/transaction");

// Create an Express application
const app = express();

// Set the port from the environment variable
const PORT = process.env.PORT;

// Use JSON middleware to parse incoming requests
app.use(express.json({ extended: false }));

// Use custom logging middleware to log request and response details to a file
app.use(logReqRes("log.txt"));

// Set up routes
app.use("/health", healthRouter);

app.use("/api/user", userRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`App running at: http://localhost:${PORT}`));
