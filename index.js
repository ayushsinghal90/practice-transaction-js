require("dotenv").config();
const express = require("express");
const { logReqRes } = require("./middlewares/log");

const healthRouter = require("./routes/health");
const userRouter = require("./routes/user");
const accountRouter = require("./routes/account");
const transactionRouter = require("./routes/transaction");

const app = express();
const PORT = process.env.DB_DATABSE;

app.use(express.json({ extended: false }));
app.use(logReqRes("log.txt"));

app.get("/", healthRouter);

app.use("/api/user", userRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);

app.listen(PORT, () => console.log(`App running at: http://locahost:${PORT}`));
