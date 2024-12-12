import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// General function to save data to a JSON file
function saveDataToFile(data, filename) {
  try {
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Ensure the directory exists
    }
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf8");
    console.log(`Data saved to ${filename}`);
  } catch (error) {
    console.error("Error saving data to file:", error);
  }
}

// Function to ensure a directory exists
function ensureDirectoryExists(addressPath) {
  try {
    if (!fs.existsSync(addressPath)) {
      fs.mkdirSync(addressPath, { recursive: true }); // Create directory if it doesn't exist
      console.log(`Directory created: ${addressPath}`);
      return { message: `Directory created: ${addressPath}` };
    } else {
      console.log(`Directory already exists: ${addressPath}`);
      return { message: `Directory already exists: ${addressPath}` };
    }
  } catch (error) {
    console.error(`Error ensuring directory exists for ${addressPath}:`, error);
    throw error;
  }
}

// General function to fetch data from a JSON file
function fetchDataFromFile(filename) {
  try {
    if (!fs.existsSync(filename)) {
      throw new Error(`File not found: ${filename}`);
    }
    const data = fs.readFileSync(filename, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data from file:", error);
    throw error;
  }
}

// API endpoint to save data
app.post("/save-data", (req, res) => {
  const { data, filename } = req.body;

  if (!data || !filename) {
    return res.status(400).json({ error: "Data and filename are required." });
  }

  try {
    saveDataToFile(data, filename);
    res.status(200).json({ message: `Data saved to ${filename}` });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "An error occurred while saving data." });
  }
});

// API endpoint to fetch data
app.get("/fetch-data", (req, res) => {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ error: "Filename is required." });
  }

  try {
    const data = fetchDataFromFile(filename);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

// API endpoint to check/create a folder
app.post("/check-create-folder", (req, res) => {
  const { folderPath } = req.body;

  if (!folderPath) {
    return res.status(400).json({ error: "Folder path is required." });
  }

  try {
    const absolutePath = path.resolve(folderPath); // Resolve the folder path
    const result = ensureDirectoryExists(absolutePath);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while checking/creating the folder.", details: error.message });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the JSON Data API! Available endpoints: POST /save-data, GET /fetch-data, POST /check-create-folder");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
