import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;
const app = express();

// PostgreSQL Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  timeout: 10000,
  ssl: { rejectUnauthorized: false },
});

// Middleware
app.use(express.json());
app.use(cors());

// 📌 Route: Get All Articles
app.get("/", (req, res) => {
  res.send("Welcome to Articles API");
});

app.get("/articles", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM articles ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Server Error");
  }
});

// 📌 Route: Get Single Article by Slug
app.get("/articles/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query("SELECT * FROM articles WHERE slug = $1", [
      slug,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Start Server
// app.listen(PORT, () => {
//   console.log(` Server running on http://localhost:${PORT}`);
// });
export default app;
