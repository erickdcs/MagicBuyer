const cors = require("cors");
const express = require("express");
const path = require("path");
const { pathToFileURL } = require("url");

const DEFAULT_PORT = 3030;
const DEFAULT_TTL_MS = 60 * 60 * 1000;

const parseCsv = (value) =>
  (value || "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

const sanitizeConnectionConfig = () => {
  const config = {
    host: process.env.MAGICBUYER_DB_HOST,
    user: process.env.MAGICBUYER_DB_USER,
    password: process.env.MAGICBUYER_DB_PASSWORD,
    database: process.env.MAGICBUYER_DB_NAME,
  };

  if (process.env.MAGICBUYER_DB_PORT) {
    config.port = Number(process.env.MAGICBUYER_DB_PORT);
  }

  Object.keys(config).forEach((key) => {
    if (config[key] === undefined || config[key] === "") {
      delete config[key];
    }
  });

  return config;
};

const resolveSelectFields = () => {
  const fields = parseCsv(process.env.MAGICBUYER_DB_SELECT_FIELDS);
  return fields.length ? fields : undefined;
};

const resolveCorsOrigins = () => {
  const origins = parseCsv(process.env.MAGICBUYER_AUTH_ORIGINS);
  return origins.length ? origins : null;
};

const resolveTtlMs = () => {
  const explicitTtl = Number(process.env.MAGICBUYER_AUTH_SESSION_TTL_MS);
  if (Number.isFinite(explicitTtl) && explicitTtl > 0) {
    return explicitTtl;
  }
  const ttlSeconds = Number(process.env.MAGICBUYER_AUTH_SESSION_TTL);
  if (Number.isFinite(ttlSeconds) && ttlSeconds > 0) {
    return ttlSeconds * 1000;
  }
  return DEFAULT_TTL_MS;
};

async function bootstrap() {
  const mysqlAuthModulePath = pathToFileURL(
    path.resolve(__dirname, "../app/services/auth/mysqlAuthService.js")
  ).href;
  const { createMySQLAuthService } = await import(mysqlAuthModulePath);

  const connectionConfig = sanitizeConnectionConfig();
  const selectFields = resolveSelectFields();

  const authService = createMySQLAuthService(connectionConfig, {
    tableName: process.env.MAGICBUYER_DB_TABLE || "users",
    usernameField:
      process.env.MAGICBUYER_DB_USERNAME_FIELD || process.env.MAGICBUYER_DB_EMAIL_FIELD || "username",
    passwordField: process.env.MAGICBUYER_DB_PASSWORD_FIELD || "password",
    selectFields,
  });

  const app = express();

  const allowedOrigins = resolveCorsOrigins();
  if (allowedOrigins) {
    app.use(cors({ origin: allowedOrigins, credentials: true }));
  } else {
    app.use(cors());
  }

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
      res.status(400).json({
        success: false,
        reason: "BAD_REQUEST",
        message: "Debes enviar usuario y contraseña.",
      });
      return;
    }

    const result = await authService.login(username, password);

    if (!result.success) {
      const statusCode = result.reason === "USER_NOT_FOUND" ? 404 : 401;
      res.status(statusCode).json({
        success: false,
        reason: result.reason,
        message:
          result.reason === "USER_NOT_FOUND"
            ? "El usuario no existe."
            : result.reason === "INVALID_PASSWORD"
            ? "La contraseña no es válida."
            : "No se pudo validar las credenciales.",
        error: result.error,
      });
      return;
    }

    const ttlMs = resolveTtlMs();
    res.json({
      success: true,
      user: result.user,
      ttl: Math.round(ttlMs / 1000),
      ttlMs,
    });
  });

  const port = Number(process.env.MAGICBUYER_AUTH_PORT) || DEFAULT_PORT;

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`MagicBuyer auth server escuchando en el puerto ${port}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("No se pudo iniciar el servidor de autenticación", error);
  process.exit(1);
});
