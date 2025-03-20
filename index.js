import express from "express";
import compression from "compression";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Initialize Express app
const app = express();

// Middleware optimization
app.use(compression()); // Add compression for faster response times
app.use(cors());
app.use(express.json({ limit: "1mb" })); // JSON parsing

// Static file serving with optimized caching
app.use(
  express.static("public", {
    maxAge: "1y",
    etag: false,
    immutable: true,
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  })
);

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).send("OK");
});

// 📌 Root Route
app.get("/", (req, res) => {
  res.send("Welcome to Articles API");
});

// 📌 Get All Articles (Using Supabase Instead of PostgreSQL)
app.get("/articles", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Supabase Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// 📌 Get Single Article by Slug (Using Supabase)
app.get("/articles/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single(); // Fetch only one article

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Article not found" });

    res.json(data);
  } catch (err) {
    console.error("Supabase Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// 📌 Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Export app using ES module syntax
export default app;
