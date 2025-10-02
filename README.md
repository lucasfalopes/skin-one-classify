# Welcome

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## API setup

Create a `.env` file at the repo root with:

```
VITE_API_BASE_URL=http://localhost:8000
```

Run your Django API on port 8000 and enable CORS for `http://localhost:8080`. See `DJANGO_API_ROUTES.md` for the expected endpoints and payloads.