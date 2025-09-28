/**
 * Factory function that creates a login verifier backed by a MySQL database.
 *
 * The resulting service exposes a single `login` method that resolves to an
 * object describing the authentication result. It lazily loads the
 * `mysql2/promise` module so the dependency is only required in Node
 * environments where it is available. This design keeps the rest of the
 * application usable in browser-only builds.
 *
 * @param {import("mysql2").ConnectionOptions|Record<string, any>} connectionConfig
 *   Configuration object that is passed to `mysql2/promise#createConnection` when
 *   a connection needs to be created. This object is ignored when a
 *   `connectionProvider` is supplied.
 * @param {Object} [options]
 * @param {string} [options.tableName="users"]
 *   Table that contains the credential information.
 * @param {string} [options.usernameField="username"]
 *   Column that stores the username / email / identifier.
 * @param {string} [options.passwordField="password"]
 *   Column that stores the password hash/value.
 * @param {string[]} [options.selectFields]
 *   Additional columns to include in the query result. If omitted, the service
 *   selects the record `id` and the configured `usernameField`.
 * @param {(providedPassword: string, storedPassword: any, userRecord: any) =>
 *   boolean|Promise<boolean>} [options.passwordComparator]
 *   Custom comparison function that can handle hashing strategies such as
 *   bcrypt or argon. Must resolve to a boolean value.
 * @param {() => any|Promise<any>} [options.connectionProvider]
 *   Optional callback that can provide a pre-configured connection or pool.
 *   The callback may return either the raw connection/pool instance or an
 *   object of shape `{ connection, shouldClose, release }` to control cleanup.
 */
export const createMySQLAuthService = (
  connectionConfig,
  {
    tableName = "users",
    usernameField = "username",
    passwordField = "password",
    selectFields,
    passwordComparator,
    connectionProvider,
  } = {}
) => {
  if (!connectionConfig || typeof connectionConfig !== "object") {
    throw new Error(
      "A MySQL connection configuration object must be provided to createMySQLAuthService."
    );
  }

  let normalizedSelectFields = selectFields;
  if (!normalizedSelectFields) {
    normalizedSelectFields = ["id", usernameField];
  }

  if (!Array.isArray(normalizedSelectFields)) {
    throw new Error("selectFields must be an array when provided.");
  }

  const defaultComparator = (providedPassword, storedPassword) => {
    let comparableStored = storedPassword;
    if (
      comparableStored !== null &&
      comparableStored !== undefined &&
      typeof comparableStored === "object" &&
      typeof comparableStored.toString === "function"
    ) {
      comparableStored = comparableStored.toString();
    } else {
      comparableStored = String(comparableStored ?? "");
    }

    return Promise.resolve(providedPassword === comparableStored);
  };

  const comparator = passwordComparator
    ? (providedPassword, storedPassword, userRecord) =>
        Promise.resolve(
          passwordComparator(providedPassword, storedPassword, userRecord)
        )
    : defaultComparator;

  let mysqlModulePromise;

  const getMysqlModule = () => {
    mysqlModulePromise = mysqlModulePromise || import("mysql2/promise");
    return mysqlModulePromise;
  };

  const getConnection = async () => {
    if (typeof connectionProvider === "function") {
      const providedConnection = await connectionProvider();
      if (!providedConnection) {
        throw new Error(
          "The connectionProvider did not return a valid MySQL connection."
        );
      }
      if (
        typeof providedConnection === "object" &&
        "connection" in providedConnection
      ) {
        return {
          connection: providedConnection.connection,
          shouldClose: Boolean(providedConnection.shouldClose),
          release: providedConnection.release,
        };
      }

      return { connection: providedConnection, shouldClose: false };
    }

    const mysql = await getMysqlModule();
    const createdConnection = await mysql.createConnection(connectionConfig);
    return { connection: createdConnection, shouldClose: true };
  };

  const sanitizeUser = (userRecord, fieldsToKeep) => {
    const result = {};
    fieldsToKeep.forEach((field) => {
      if (field !== passwordField && field in userRecord) {
        result[field] = userRecord[field];
      }
    });
    return result;
  };

  const login = async (username, password) => {
    const normalizedUsername = String(username).trim();
    const normalizedPassword = String(password);

    if (!normalizedUsername || !normalizedPassword) {
      throw new Error("Both username and password are required for login.");
    }

    let connection;
    let shouldCloseConnection = false;
    let releaseConnection;
    try {
      const connectionDetails = await getConnection();
      connection = connectionDetails.connection;
      shouldCloseConnection = connectionDetails.shouldClose;
      releaseConnection = connectionDetails.release;

      const fieldsToSelect = Array.from(
        new Set([...(normalizedSelectFields || []), usernameField, passwordField])
      );

      const [rows] = await connection.execute(
        `SELECT ${fieldsToSelect
          .map((field) => `\`${field}\``)
          .join(", ")} FROM \`${tableName}\` WHERE \`${usernameField}\` = ? LIMIT 1`,
        [normalizedUsername]
      );

      if (!rows.length) {
        return { success: false, reason: "USER_NOT_FOUND" };
      }

      const userRecord = rows[0];
      const isPasswordValid = await comparator(
        normalizedPassword,
        userRecord[passwordField],
        userRecord
      );

      if (typeof isPasswordValid !== "boolean") {
        throw new Error(
          "The passwordComparator must resolve to a boolean value."
        );
      }

      if (!isPasswordValid) {
        return { success: false, reason: "INVALID_PASSWORD" };
      }

      return {
        success: true,
        user: sanitizeUser(userRecord, fieldsToSelect),
      };
    } catch (error) {
      return {
        success: false,
        reason: "ERROR",
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      if (connection && shouldCloseConnection && typeof connection.end === "function") {
        try {
          await connection.end();
        } catch (closeError) {
          // Ignore connection closing errors to avoid masking the original error.
        }
      }

      if (typeof releaseConnection === "function") {
        try {
          await releaseConnection();
        } catch (releaseError) {
          // Ignore release errors as they are non-critical cleanup issues.
        }
      }
    }
  };

  return { login };
};

