require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

const Workspace = mongoose.model("Workspace", workspaceSchema);
const workspaceData = JSON.parse(fs.readFileSync(path.join(__dirname, "demo-workspace.json"), "utf8"));
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/freelanceflow";

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    const existing = await Workspace.exists({ key: "default" });
    if (existing) {
      console.log("The default workspace already exists; demo data was not imported or overwritten.");
      return;
    }

    await Workspace.create({ key: "default", data: workspaceData });
    console.log("Sanitized demo workspace added to MongoDB.");
  } catch (error) {
    console.error("Could not seed the demo workspace.", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
