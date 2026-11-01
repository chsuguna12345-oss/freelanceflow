require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "127.0.0.1";
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/freelanceflow";
const workspaceKey = "default";
const dataCollections = ["clients", "projects", "invoices", "logs"];

const workspaceSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

const Workspace = mongoose.model("Workspace", workspaceSchema);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.get("/api/workspace", async (req, res, next) => {
  try {
    const workspace = await Workspace.findOne({ key: workspaceKey }).lean();
    res.json({ data: workspace ? workspace.data : null });
  } catch (error) {
    next(error);
  }
});

app.put("/api/workspace", async (req, res, next) => {
  try {
    const data = req.body && req.body.data;
    if (!data || typeof data !== "object" || Array.isArray(data) ||
        !dataCollections.every((key) => Array.isArray(data[key]))) {
      return res.status(400).json({
        error: `Workspace data must contain arrays for: ${dataCollections.join(", ")}.`,
      });
    }

    const workspace = await Workspace.findOneAndUpdate(
      { key: workspaceKey },
      { $set: { data } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).lean();

    res.json({ data: workspace.data });
  } catch (error) {
    next(error);
  }
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found." });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"));
});

app.use((req, res) => {
  res.status(404).send("Not found.");
});

app.use((error, req, res, next) => {
  console.error("Request failed:", error);
  if (res.headersSent) return next(error);
  const status = error instanceof SyntaxError && error.status === 400 ? 400 : 500;
  res.status(status).json({ error: status === 400 ? "Invalid JSON request body." : "The server could not complete the request." });
});

async function start() {
  try {
    await mongoose.connect(mongoUri);
    app.listen(port, host, () => {
      console.log(`FreelanceFlow is running at http://${host}:${port}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB. Check MONGODB_URI and ensure the database is running.", error);
    process.exitCode = 1;
  }
}

start();
