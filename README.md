# FUT AutoBuyer

<p align="center"> 
  <h3 align="center">UT MagicBuyer</h3>

  <p align="center">
    Autobuyer from EA FC Ultimate Team Webapp!
    <br />  
    <br /> 
    <a href="https://github.com/AMINE1921/MagicBuyer-UT/issues">Report Bug</a>
    ·
    <a href="https://github.com/AMINE1921/MagicBuyer-UT/issues">Request Feature</a>
  
  # Must Read :no_entry_sign:
  
  These tool is developed to demonstrate how someone can develop script to break our web application by automating stuffs and only for learning purpose.
  
   EA might (soft) ban from using transfer market in web app for using this tool. Continuously soft ban might lead to permanent ban as well. Also use of tools like this to gain advantage over other players is not ethically right.  
   
   Use this tool at your own risk, any developers contributing to this repo won’t held responsibility if your account gets banned.
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Installation](#installation)
- [Usage](#Usage)
- [Prerequisites](#prerequisites)

<!-- installation -->

## Installation

- Add Tamper Monkey Extenstion to your Browser - [Link](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en-GB).
- Click on fut-auto-buyer.user.js from - [Latest Release](https://github.com/AMINE1921/MagicBuyer-UT/releases/).
- Then click on Install/Update.
- Installation And Demo - [Video Guide](https://www.youtube.com/watch?v=WATch4hxhtk).

Now in Ultimate Team Web App, new menu will be added as AutoBuyer.

<!-- Usage -->

## Usage

### AutoBuyer Settings

### Sell Price

- If specified the autobuyer will list the bought item for the specified price.
- The tool will list all the cards in transfer target, make sure to move your cards to the club before running the tool to avoid losing the card.
- Give Sell Price as -1 to move to transfer list without selling.

### Buy Price

- If specified the autobuyer will buy the card matching the search critieria for the price less than or equal to specified price.

### Bid Price

- If specified the autobuyer will bid on the card matching the search critieria for the price less than or equal to specified price.

### No. of cards to buy

- Number of cards the autobuyer should buy before auto stopping.
- Default Value (`10`).

### Bid Exact Price

- By default tool will bid for the lowest possible price and gradually increase the bid , if this flag is enabled bot will directly bid for the specified bid price.

### Find Sale Price

- If toggled will use FUTBIN price api to get the player price.

### Sell Price Percent

- When find sale price is toggled, this field is to specify the sale price from the percent of FUTBIN Price.
- Default Value (`100`).

### Bid items expiring in:

- If specified tool will only bid on items expiring in the given time range.
- Default Value (`1H`) (S for seconds, M for Minutes, H for hours).

### Relist Unsold Items:

- If enabled bot will periodically check and relist expired item for the previous specified price

### \* Note : This will relist all expired items , not only the item which bot list. So check the Transfer List before enabling this to avoid losing cards

### Wait Time

- The autobuyer will wait for the specified time before making the next search request.
- Default Value (`7 - 15`).

### Clear sold count

- The autobuyer will clear all the sold items from transfer list when the count exceeds the specified value.
- Default Value (`10`).

### Rating Threshold

- Will only list the card if the rating of the card is below this value.
- Default Value (`100`).

### Max purchases per search request

- Indicates the count of cards the tool should buy or bid from the results of each request.
- Default Value (`3`).

### Stop After

- If specified the tool will automatically stop after running the tool foe the specified interval.
- Default Value (`1H`) (S for seconds, M for Minutes, H for hours).

### Pause For

- The parameter has a dependency on Cycle Amount
- The tool will pause for the specified interval, if the the number of search request in the given cycle matches the specified cycle amount.
- Default Value (`0-0S`) (S for seconds, M for Minutes, H for hours).

### Pause Cycle

- Indicates the amount of search request to be made before pausing the tool.
- Default Value (`10`).

### Min Rating

- If specified tool will bid only on items which has rating greater or equal to this value.
- Default Value (`10`).

### Max Rating

- If specified tool will bid only on items which has rating lesser or equal to this value.
- Default Value (`100`).

### Delay To Add

- If add delay after buy is enabled, this field specifies the wait duration.
- Default Value (`1S`) (S for seconds, M for Minutes, H for hours).

### Add Delay After Buy

- If enabled tool will wait for the specified time after trying to buy/bid on cards.

### Max value of random min bid

- If use random min bid is enabled , this field specifies the maximum value till which min bid can be generated.
- Default Value (`300`).

### Max value of random min buy

- If use random min buy is enabled , this field specifies the maximum value till which min buy can be generated.
- Default Value (`300`).

### Use Random Min Bid

- If enabled tool will randomize min bid for each search to avoid cached result.

### Use Random Min Buy

- If enabled tool will randomize min buy for each search to avoid cached result.

### Skip GK

- If enabled tool will skip bidding/buying GK Cards.

### Close On Captcha Trigger

- If enabled tool will close the web app when Captcha gets triggered.

### Delay After Buy

- If enabled tool will add 1 second delay after each buy request.

### Error Codes to stop bot

- List of error code on which bot should stop, value should be in csv format.
- Ex - 421,461,512

### Sound Notification

- If enabled tool will gives sound notification for actions like buy card / captcha trigger etc...

## Mandatory Authentication Flow

MagicBuyer now requires a successful login before the autobuyer interface can
be used. When the view is opened a modal dialog requests the user's credentials
and blocks the UI until the authentication succeeds. Credentials are validated
against a dedicated REST endpoint backed by a MySQL database.

### Authentication server

The repository ships with a lightweight Express server located at
`server/index.js`. The server expects a `users` table (the default table name
is configurable) containing at least a username and password column. Passwords
stored with bcrypt hashes are supported out-of-the-box; plain text passwords
are also accepted, although not recommended.

1. Install the runtime dependencies if they are not present in your
   environment:

   ```bash
   npm install express cors mysql2 bcryptjs
   ```

2. Configure the connection details by exporting environment variables (or via
   a `.env` file loaded by your process manager):

   ```bash
   export MB_DB_HOST=localhost
   export MB_DB_PORT=3306
   export MB_DB_USER=magicbuyer
   export MB_DB_PASSWORD=supersecret
   export MB_DB_NAME=magicbuyer
   export MB_AUTH_ALLOWED_ORIGINS="https://www.ea.com"
   export MB_AUTH_PORT=3001
   ```

   Optional variables include `MB_AUTH_TABLE`, `MB_AUTH_USERNAME_FIELD`,
   `MB_AUTH_PASSWORD_FIELD`, and `MB_AUTH_SESSION_TTL` (in seconds). The server
   listens on `MB_AUTH_PORT` (defaults to `3001`).

3. Start the server with:

   ```bash
   npm run auth:server
   ```

   An example schema compatible with the defaults:

   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL
   );
   ```

### Client configuration

The userscript reads the authentication endpoint from the global variable
`window.MAGIC_BUYER_AUTH_URL`. If the variable is not defined the default value
`http://localhost:3001` is used. Set the global before MagicBuyer loads (for
example adding a small boot script in Tampermonkey):

```js
// ==UserScript==
// @run-at document-start
// ==/UserScript==
window.MAGIC_BUYER_AUTH_URL = "http://127.0.0.1:3001";
```

Successful logins are cached for one hour (configurable through the
`AUTH_SESSION_DURATION` constant) and the authenticated username is displayed
next to the MagicBuyer header.

## MySQL Login Verification Service

The project now ships with a small authentication helper located at
`app/services/auth/mysqlAuthService.js`. The helper creates a login verifier
that talks directly to a MySQL database using the [`mysql2`](https://www.npmjs.com/package/mysql2)
driver. To use it, install the dependency in your Node.js environment and create
the service with your database configuration:

```bash
npm install mysql2
# or
yarn add mysql2
```

```js
import bcrypt from "bcrypt";
import { createMySQLAuthService } from "./app/services/auth";

const authService = createMySQLAuthService(
  {
    host: "db-host",
    user: "db-user",
    password: "secret",
    database: "magicbuyer",
  },
  {
    tableName: "users",
    usernameField: "email",
    selectFields: ["id", "email", "role"],
    // Example: integrate bcrypt comparison logic if your passwords are hashed.
    passwordComparator: async (inputPassword, storedHash) =>
      bcrypt.compare(inputPassword, storedHash),
  }
);

const result = await authService.login("user@example.com", "sup3rs3cret");
if (result.success) {
  console.log("Logged in!", result.user);
} else {
  console.error("Login failed", result.reason, result.error);
}
```

When the credentials are valid, the returned object contains the non-sensitive
fields requested via `selectFields`. On failure, a descriptive `reason` is
provided (`USER_NOT_FOUND`, `INVALID_PASSWORD`, or `ERROR`).

## Prerequisites

- To use this tool, the user should have access to the transfer market.
- Hence play the required number of games to get access to the transfer market before trying this tool.