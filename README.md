# FreelanceFlow

## Run locally

Requirements: Node.js 18.18 or later and a MongoDB server (local or MongoDB Atlas).

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Create your environment file and set `MONGODB_URI` if your MongoDB server is not local:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Start the server:

   ```powershell
   npm start
   ```

4. Open <http://127.0.0.1:3000>.

The Express server serves the app and its `/api/workspace` endpoints. MongoDB stores the workspace document, including clients, projects, invoices, and time logs. Existing browser-saved data is imported the first time the app connects to an empty database.

`GET /api/health` reports server and database connectivity. `GET /api/workspace` loads workspace data; `PUT /api/workspace` saves it.

## Important

The current demo has no real user authentication and uses one shared workspace. The server binds to `127.0.0.1` by default. Do not expose it to a network or use it for sensitive production data until authentication and per-user authorization are added.
