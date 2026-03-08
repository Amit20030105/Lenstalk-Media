import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  
  // Session configuration for iframe compatibility
  app.use(session({
    secret: "lenstalk-media-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,      // Required for SameSite=None
      sameSite: 'none',  // Required for cross-origin iframe
      httpOnly: true,    // Security best practice
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Vanguard API is active" });
  });

  // Example session route
  app.get("/api/session", (req: any, res) => {
    const visits = req.session.visits || 0;
    req.session.visits = visits + 1;
    res.json({ visits: req.session.visits });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
