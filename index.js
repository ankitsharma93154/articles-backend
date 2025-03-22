import express from "express";
import compression from "compression";
import cors from "cors";
import path from "path";
import fs from "fs";
import { supabase } from "./db.js";
import { generateArticleHTML } from "./generateArticles.js";

const app = express();

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public")); // Serve static files (articles, styles.css)

// 📌 Health check route
app.get("/health", (_, res) => res.status(200).send("OK"));

app.get("/", (_, res) => res.status(200).send("Welcome to articles API"));

// 📌 Fetch all articles
app.get("/articles", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, description, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Supabase Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// 📌 Serve single article
app.get("/articles/:slug", async (req, res) => {
  const { slug } = req.params;
  const filePath = path.join("public", "articles", `${slug}.html`);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath, { root: "." });
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data)
    return res.status(404).json({ message: "Article not found" });

  generateArticleHTML(data);
  res.sendFile(filePath, { root: "." });
});

module.exports = app;
