# Deployment Guide - Pokemon TCG Seeker

## 🌐 Making Your Website Public

You have several free options to deploy your application. Since you have both a frontend and backend, you'll need to deploy them separately.

---

## ⭐ RECOMMENDED: Option 1 - Vercel + Railway

### Why This Option?
- ✅ **100% Free** (with generous limits)
- ✅ **Automatic deployments** from GitHub
- ✅ **Fast** and reliable
- ✅ **Easy setup** (5-10 minutes)

### Step 1: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app/)**
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `ptcg-seeker` repository
5. Railway will auto-detect your Node.js app

**Configure Environment Variables:**
- Click on your service → **Variables** tab
- Add these variables:
  ```
  NODE_ENV=production
  PORT=3001
  JWT_SECRET=<generate-new-secure-secret>
  CLIENT_URL=<will-add-after-deploying-frontend>
  ```

**Generate a new JWT_SECRET:**
```bash
openssl rand -hex 64
```

6. Click **Deploy**
7. Once deployed, copy your Railway URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com/)**
2. Click **"Add New Project"**
3. Import your `ptcg-seeker` repository from GitHub
4. Vercel will auto-detect it as a Vite app

**Configure Environment Variables:**
- In the **Environment Variables** section, add:
  ```
  VITE_API_URL=<your-railway-backend-url>
  ```
  Example: `VITE_API_URL=https://your-app.railway.app`

5. Click **Deploy**
6. Your frontend will be live at `https://your-app.vercel.app`

### Step 3: Update Backend CORS

1. Go back to **Railway**
2. Update the `CLIENT_URL` variable to your Vercel URL:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Railway will automatically redeploy

### ✅ Done! Your site is live!
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

---

## 🎯 Option 2 - Render (All-in-One)

### Why This Option?
- ✅ **Everything in one place**
- ✅ **Free tier** available
- ✅ **Automatic SSL**
- ⚠️ Slower cold starts on free tier

### Steps:

1. **Go to [Render.com](https://render.com/)**
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file and deploy both services

**Set Environment Variables:**
- Backend service:
  - `JWT_SECRET`: Generate with `openssl rand -hex 64`
  - `CLIENT_URL`: Will be auto-set to your frontend URL

- Frontend service:
  - `VITE_API_URL`: Will auto-link to your backend

5. Click **Apply**

### ✅ Done! Both services will be deployed together!

---

## 🚀 Option 3 - GitHub Pages (Frontend Only - Limited)

**Note:** GitHub Pages only supports static sites, so you'd still need to deploy the backend elsewhere.

### For Frontend Only:

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Update package.json:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://Dariuszb94.github.io/ptcg-seeker"
}
```

3. **Deploy:**
```bash
npm run deploy
```

4. **Enable GitHub Pages:**
   - Go to your repo settings
   - Pages section
   - Select `gh-pages` branch

**Then deploy backend to Railway/Render separately**

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] `.env` is in `.gitignore` ✅ (already done)
- [ ] You have a secure JWT_SECRET for production
- [ ] Database directory is in `.gitignore` ✅ (already done)
- [ ] Update CORS settings for production URL
- [ ] Test locally with `npm run dev:all`

---

## 🗄️ Database Considerations

### Current Setup (SQLite):
- ✅ Works for small-medium apps
- ⚠️ Railway/Render may reset SQLite on redeploys
- Consider upgrading to PostgreSQL for production

### Upgrade to PostgreSQL (Recommended for Production):

**Railway offers free PostgreSQL:**
1. In Railway, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Copy connection string
3. Update your backend to use PostgreSQL instead of SQLite

Would you like me to help you set up PostgreSQL?

---

## 🔧 Quick Commands

### Push changes to GitHub (triggers auto-deploy):
```bash
git add .
git commit -m "Add deployment configuration"
git push
```

### Check deployment logs:
- **Vercel**: Dashboard → Your Project → Deployments
- **Railway**: Dashboard → Your Service → Logs
- **Render**: Dashboard → Your Service → Logs

---

## 📊 Free Tier Limits

### Vercel:
- ✅ Unlimited bandwidth
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS

### Railway:
- ✅ $5/month free credit
- ✅ 500 hours/month
- ⚠️ Requires credit card after trial

### Render:
- ✅ 750 hours/month free
- ⚠️ Apps sleep after 15 min inactivity
- ✅ No credit card required

---

## 🎉 Recommended Deployment Strategy

**For Best Results:**

1. **Deploy Backend** to Railway (fast, reliable)
2. **Deploy Frontend** to Vercel (instant, global CDN)
3. Both auto-deploy when you push to GitHub
4. Users access your site at: `https://your-app.vercel.app`

---

## 🆘 Need Help?

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check CORS configuration

**Want me to help you deploy right now?** Just let me know which option you prefer!
