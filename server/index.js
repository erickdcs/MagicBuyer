const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const {
  MB_DB_HOST = "localhost",
  MB_DB_PORT = "3306",
  MB_DB_USER = "root",
  MB_DB_PASSWORD = "",
  MB_DB_NAME = "magicbuyer",
  MB_AUTH_ALLOWED_ORIGINS = "",
  MB_AUTH_PORT = "3001",
  MB_AUTH_SESSION_TTL = "3600",
  MB_AUTH_TABLE = "users",
  MB_AUTH_USERNAME_FIELD = "username",
  MB_AUTH_PASSWORD_FIELD = "password",
} = process.env;

const numericPort = Number(MB_DB_PORT) || 3306;
const sessionTTL = Math.max(Number(MB_AUTH_SESSION_TTL) || 0, 60);
const allowedOrigins = MB_AUTH_ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!allowedOrigins.length || !origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);

const pool = mysql.createPool({
  host: MB_DB_HOST,
  user: MB_DB_USER,
  password: MB_DB_PASSWORD,
  database: MB_DB_NAME,
  port: numericPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const sessions = new Map();

const createSession = (userId) => {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + sessionTTL * 1000;
  sessions.set(token, { userId, expiresAt });
  return { token, expiresIn: sessionTTL };
};

const cleanupSessions = () => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(token);
    }
  }
};

setInterval(cleanupSessions, 60 * 1000).unref();

const normalizeUserRecord = (record) => {
  if (!record || typeof record !== "object") {
    return {};
  }
  const cloned = { ...record };
  delete cloned[MB_AUTH_PASSWORD_FIELD];
  return cloned;
};

const comparePassword = async (provided, stored) => {
  if (!stored && stored !== 0) {
    return false;
  }

  const storedValue =
    typeof stored === "string" ? stored : String(stored ?? "");

  if (storedValue.startsWith("$2a$") || storedValue.startsWith("$2b$")) {
    return bcrypt.compare(provided, storedValue);
  }

  return provided === storedValue;
};

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Debes proporcionar usuario y contraseña." });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT * FROM \`${MB_AUTH_TABLE}\` WHERE \`${MB_AUTH_USERNAME_FIELD}\` = ? LIMIT 1`,
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const userRecord = rows[0];
    const storedPassword = userRecord[MB_AUTH_PASSWORD_FIELD];
    const isValid = await comparePassword(password, storedPassword);

    if (!isValid) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const session = createSession(userRecord.id || userRecord[MB_AUTH_USERNAME_FIELD]);

    return res.json({
      token: session.token,
      expiresIn: session.expiresIn,
      user: normalizeUserRecord(userRecord),
    });
  } catch (error) {
    console.error("[MagicBuyer Auth] Login error", error);
    return res
      .status(500)
      .json({ message: "No se pudo iniciar sesión. Intenta nuevamente." });
  }
});

app.get("/api/session", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/Bearer\s+/i, "");

  if (!token) {
    return res.status(400).json({ message: "Token requerido." });
  }

  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ message: "Sesión inválida o expirada." });
  }

  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ message: "Sesión inválida o expirada." });
  }

  return res.json({
    token,
    expiresIn: Math.floor((session.expiresAt - Date.now()) / 1000),
  });
});

const port = Number(MB_AUTH_PORT) || 3001;

app.listen(port, () => {
  console.log(`MagicBuyer auth server listening on port ${port}`);
});
