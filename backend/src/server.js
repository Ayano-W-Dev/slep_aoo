import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";

const app = express();
app.use(express.json());
app.use(clerkMiddleware());

// Inngest v3: must use options object
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

const PORT = ENV.PORT || 5001;

app.get("/", (req, res) => {
  res.send("hello world");
});

console.log("mongo_uri:", ENV.MONGO_URL);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server Started on port ${PORT} (${ENV.NODE_ENV})`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();