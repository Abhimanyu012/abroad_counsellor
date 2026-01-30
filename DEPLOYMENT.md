# Deployment Guide

This project is a monorepo with separate `client/` and `server/` directories. Here is how to deploy them effectively.

---

## ☁️ Backend Deployment (Render)

The error `MODULE_NOT_FOUND` usually happens when Render is looking in the wrong folder. You have two options:

### Option A: Using "Base Directory" (Recommended)
1. **Base Directory**: Set to `server`.
2. **Build Command**: `npm install && npx prisma generate`
3. **Start Command**: `npx prisma db push && node index.js`
4. **Environment Variables**: Add `DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`, `GEMINI_API_KEY`, etc.
   > [!IMPORTANT]
   > Do **NOT** use `node server/index.js` if you set the Base Directory to `server`. Use exactly `node index.js`.

### Option B: From the Repo Root (No Base Directory)
1. **Base Directory**: Leave empty.
2. **Build Command**: `cd server && npm install && npx prisma generate`
3. **Start Command**: `cd server && npx prisma db push && node index.js`

---

## 🚀 Backend Deployment (Railway)

1. **Root Directory**: Set to `server`.
2. Railway should automatically detect the `package.json` and run `npm install`, then `npm start`.
3. The `postinstall` script in `server/package.json` will automatically run `prisma generate`.

---

## 🎨 Frontend Deployment (Netlify)

1. **Base Directory**: `client`
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist` (Note: If Base Directory is `client`, this is just `dist`. If Base Directory is empty, use `client/dist`).
4. **Environment Variables**:
   - `VITE_API_URL`: Your full Backend URL + `/api` (e.g., `https://your-api.onrender.com/api`).

---

## 🛠 Support & Troubleshooting

- **Database Connection**: Ensure your `DATABASE_URL` is a valid PostgreSQL string.
- **CORS**: Set `CLIENT_URL` on the backend to match your Netlify URL (e.g., `https://your-site.netlify.app`).
- **Prisma Client**: If you see "Prisma Client not found", ensure `npx prisma generate` is part of your build command.
