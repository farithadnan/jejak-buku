# Vercel Deployment Guide

## ✅ Configuration Files Created

1. **`vercel.json`** - Main Vercel configuration
   - Sets correct build command and output directory
   - Configures SPA routing (all routes → index.html)
   - Adds security headers
   - Caches static assets

2. **`.vercelignore`** - Files to exclude from deployment
   - Backend code (not needed for frontend)
   - node_modules, logs, etc.

3. **`frontend/public/_redirects`** - Backup routing config

## 🚀 Deployment Steps

### 1. Deploy Frontend to Vercel

Your Vercel deployment should now work! The 404 issue was caused by:
- Missing SPA routing configuration
- Vercel didn't know to redirect all routes to `index.html`

**What was fixed:**
```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }  // ← This fixes the 404!
  ]
}
```

### 2. Deploy Backend (Required!)

Your frontend is configured to use `environment.prod.ts` which needs a backend URL.

**Option A: Railway (Recommended)**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy backend
cd backend
railway login
railway init
railway up
```

**Option B: Render**
1. Go to https://render.com
2. Create new "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add `DATABASE_URL`, `PORT`, etc.

**Option C: Heroku**
```bash
cd backend
heroku create jejak-buku-api
git subtree push --prefix backend heroku main
```

### 3. Update Frontend Environment

After deploying backend, update:

**`frontend/src/environments/environment.prod.ts`**:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.railway.app/api'  // ← Update this!
};
```

Then commit and push to trigger Vercel redeployment.

## 🐛 Troubleshooting

### Still Getting 404?

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment
   - Check "Build Logs" and "Function Logs"

2. **Verify Output Directory:**
   ```bash
   # Build locally to check output location
   cd frontend
   npm run build
   ls -la dist/frontend/browser/  # Should contain index.html
   ```

3. **Check Vercel Configuration:**
   - Vercel Dashboard → Project Settings → General
   - **Framework Preset**: Other (or None)
   - **Build Command**: `cd frontend && npm ci --legacy-peer-deps && npm run build`
   - **Output Directory**: `frontend/dist/frontend/browser`

### Bundle Size Warning

Your build shows:
```
⚠️ bundle initial exceeded maximum budget. Budget 500.00 kB was not met by 76.98 kB
```

This is just a warning. To fix (optional):

**`frontend/angular.json`**:
```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "600kB",  // ← Increase this
      "maximumError": "1MB"
    }
  ]
}
```

### CORS Issues

If you get CORS errors after deployment, update your backend:

**`backend/src/index.ts`**:
```typescript
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://your-vercel-app.vercel.app'  // ← Add your Vercel URL
  ]
}));
```

## 📋 Pre-Deployment Checklist

- [x] `vercel.json` created with SPA routing
- [x] `.vercelignore` excludes backend code
- [x] `_redirects` file in `public/` folder
- [ ] Backend deployed (Railway/Render/Heroku)
- [ ] `environment.prod.ts` updated with backend URL
- [ ] CORS configured on backend
- [ ] Environment variables set on Vercel (if any)

## 🎯 Expected Result

After deploying:
- ✅ Homepage loads: `https://your-app.vercel.app/`
- ✅ Direct navigation works: `https://your-app.vercel.app/statistics`
- ✅ Refresh works: `https://your-app.vercel.app/books`
- ✅ No 404 errors on any route

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Railway Dashboard](https://railway.app/dashboard)
- [Render Dashboard](https://dashboard.render.com/)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

## 💡 Tips

1. **Environment Variables on Vercel:**
   - Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` if needed

2. **Custom Domain:**
   - Project Settings → Domains
   - Add your domain and update DNS

3. **Preview Deployments:**
   - Every PR gets a unique preview URL
   - Test before merging to production

## 🎉 Success!

Once deployed, your app will be available at:
```
https://jejak-buku.vercel.app
```

All routes will work correctly, including:
- `/` (Dashboard)
- `/books` (removed, now using tabs)
- `/statistics` (removed, now using tabs)
- Direct URL navigation
- Browser refresh on any route
