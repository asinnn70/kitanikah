import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("wedding.db");
console.log("Database connected successfully");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS invitations (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invitation_id TEXT NOT NULL,
    name TEXT NOT NULL,
    attendance TEXT NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(invitation_id) REFERENCES invitations(id)
  );
`);

async function startServer() {
  console.log("Starting wedding invitation server...");
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    try {
      const count = db.prepare("SELECT COUNT(*) as count FROM invitations").get() as { count: number };
      res.json({ status: "ok", db_count: count.count });
    } catch (error) {
      res.status(500).json({ status: "error", error: String(error) });
    }
  });

  // API Routes
  app.get("/api/debug", (req, res) => {
    try {
      const invitations = db.prepare("SELECT id, created_at FROM invitations LIMIT 10").all();
      res.json({ invitations });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.post("/api/invitations", (req, res) => {
    try {
      const id = Math.random().toString(36).substring(2, 10);
      const data = JSON.stringify(req.body);
      const stmt = db.prepare("INSERT INTO invitations (id, data) VALUES (?, ?)");
      stmt.run(id, data);
      console.log(`Invitation created: ${id}`);
      res.json({ id });
    } catch (error) {
      console.error("Error creating invitation:", error);
      res.status(500).json({ error: "Failed to create invitation" });
    }
  });

  app.get("/api/invitations/:id", (req, res) => {
    try {
      const stmt = db.prepare("SELECT data FROM invitations WHERE id = ?");
      const row = stmt.get(req.params.id) as { data: string } | undefined;
      if (row) {
        res.json(JSON.parse(row.data));
      } else {
        res.status(404).json({ error: "Invitation not found" });
      }
    } catch (error) {
      console.error("Error fetching invitation:", error);
      res.status(500).json({ error: "Failed to fetch invitation" });
    }
  });

  app.post("/api/invitations/:id/rsvp", (req, res) => {
    const { name, attendance, message } = req.body;
    const stmt = db.prepare("INSERT INTO rsvps (invitation_id, name, attendance, message) VALUES (?, ?, ?, ?)");
    stmt.run(req.params.id, name, attendance, message);
    res.json({ success: true });
  });

  app.get("/api/invitations/:id/rsvps", (req, res) => {
    const stmt = db.prepare("SELECT * FROM rsvps WHERE invitation_id = ? ORDER BY created_at DESC");
    const rows = stmt.all(req.params.id);
    res.json(rows);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
