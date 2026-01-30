# Deployment Guide

This project is prepared for a split deployment:
- **Frontend**: Netlify
- **Backend**: Railway (with PostgreSQL)

---

## 🚀 Backend Deployment (Railway)

1.  **Create a New Project** on [Railway](https://railway.app/).
2.  **Connect your GitHub Repository**.
3.  **Set the Base Directory** to `server`.
4.  **Add a Database**: Add a PostgreSQL service to your project. Railway will automatically inject the `DATABASE_URL` environment variable.
5.  **Set Environment Variables**:
    -   `NODE_ENV`: `production`
    -   `JWT_SECRET`: A long random secure string.
    -   `GROQ_API_KEY`: Your Groq API key.
    -   `GEMINI_API_KEY`: Your Gemini API key.
    -   `CLIENT_URL`: Your final Netlify URL (e.g., `https://your-app.netlify.app`).

Railway will automatically run `npm install` (which triggers `prisma generate` via the `postinstall` script) and then `npm start`.

---

## 🎨 Frontend Deployment (Netlify)

1.  **Create a New Site** on [Netlify](https://www.netlify.com/).
2.  **Connect your GitHub Repository**.
3.  **Configure Build Settings**:
    -   **Base Directory**: `client`
    -   **Build Command**: `npm run build`
    -   **Publish Directory**: `client/dist` (Vite builds into `dist` relative to the base directory).
4.  **Set Environment Variables**:
    -   `VITE_API_URL`: Your Railway backend URL followed by `/api` (e.g., `https://aicounsellor-production.up.railway.app/api`).

---

## ☁️ Backend Deployment (Render)

1.  **Create a New Web Service** on [Render](https://render.com/).
2.  **Connect your GitHub Repository**.
3.  **Configure Build & Start Settings**:
    -   **Base Directory**: `server`
    -   **Build Command**: `npm install && npx prisma generate`
    -   **Start Command**: `npx prisma db push && node index.js` (or `npm start`)
4.  **Set Environment Variables**: Same as Railway (DATABASE_URL, JWT_SECRET, GROQ_API_KEY, etc.).

---

## 🛠 Troubleshooting

-   **CORS Issues**: Ensure the `CLIENT_URL` in Railway precisely matches your Netlify URL (no trailing slash usually, or exactly what the browser sends).
-   **Routing (404 on Refresh)**: The `client/public/_redirects` file handles this. Ensure it is being included in your build (it should be automatically copied to `dist`).
-   **Database Migrations**: If this is a fresh database, you may need to run `npx prisma db push` once from your local machine (pointing to the production DB) or add it to your start script. For Railway, the simplest way is to run `npx prisma db push` from a terminal connected to your Railway instance.
