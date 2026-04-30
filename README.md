# Kicker MERN

Kicker is a Kickstarter-style crowdfunding app for sneaker-related projects. This repo has been migrated from Rails/PostgreSQL/Webpack to a JavaScript-only MERN stack:

- Frontend: React JSX, Redux, Vite, Tailwind CSS
- Backend: Express.js
- Database: MongoDB with Mongoose

## Setup

```bash
cd frontend
npm install
cd ../server
npm install
cd ..
```

Create a local env file:

```bash
copy .env.example .env
```

Start MongoDB. If Docker is available:

```bash
docker compose up -d mongodb
```

Seed the database:

```bash
cd server
npm run seed
```

Run the app:

```bash
cd server
npm run dev

# in a second terminal
cd frontend
npm run dev
```

The React app runs at `http://localhost:5173` and proxies API requests to the Express server at `http://localhost:5000`.

## Scripts

- Frontend scripts (`frontend/package.json`):
- `npm run dev` starts Vite.
- `npm run build` builds the React frontend to `../dist` for production serving.
- `npm run preview` previews the production frontend build.
- Server scripts (`server/package.json`):
- `npm run dev` starts Express.
- `npm run start` starts Express.
- `npm run seed` resets and seeds MongoDB sample data.

## Demo User

Use the seeded demo account:

- Email: `demouser@demo.com`
- Password: `demo123`

Admin demo account (same credentials as above):

- Email: `demouser@demo.com`
- Password: `demo123`
