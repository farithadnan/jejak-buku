# Branch Strategy for Jejak Buku

## 📋 Overview

This project uses a **three-branch strategy** to separate concerns between development, production, and deployment.

## 🌿 Branch Structure

### 1. `development` Branch
**Purpose:** Active development and feature work

**Contents:**
- ✅ Full backend (Express + SQLite + Drizzle ORM)
- ✅ Full frontend (Angular)
- ✅ Docker Compose setup
- ✅ Development tools and configs

**Deployment:** 
- Local development only (Docker Compose)
- Not deployed to any cloud service

**Workflow:**
```bash
# Daily development work
git checkout development
# ... make changes ...
git add .
git commit -m "feat: Add new feature"
git push origin development
```

---

### 2. `master` (or `main`) Branch
**Purpose:** Production-ready code

**Contents:**
- ✅ Full backend
- ✅ Full frontend
- ✅ All production configs

**Deployment:**
- Should be deployed to a full-stack hosting service
- Examples: Railway (backend) + Vercel (frontend), or single platform like Heroku

**Workflow:**
```bash
# When development is stable and tested
git checkout master
git merge development
git push origin master
```

---

### 3. `demo` Branch
**Purpose:** Frontend-only demo deployment to Vercel

**Contents:**
- ✅ Frontend only (or full code, but backend ignored by Vercel)
- ✅ Vercel configuration (vercel.json, .vercelignore)
- ✅ Frontend environment pointing to demo backend URL

**Deployment:**
- **Vercel** (frontend only)
- Public demo at `https://jejak-buku.vercel.app`

**Workflow:**
```bash
# Create demo branch (first time only)
git checkout development
git checkout -b demo
git push -u origin demo

# Update demo with latest frontend changes
git checkout demo
git merge development
# Optionally: Remove backend files for cleaner demo branch
# git rm -r backend docker-compose.yml
git push origin demo  # This triggers Vercel deployment
```

---

## 🚀 Deployment Matrix

| Branch       | Backend Deployment | Frontend Deployment | Purpose            |
|--------------|-------------------|---------------------|-------------------|
| `development`| None              | None                | Local dev only    |
| `master`     | Railway/Render    | Vercel/Netlify      | Production        |
| `demo`       | N/A (uses demo API)| **Vercel**         | Public demo       |

---

## ⚙️ Vercel Configuration

### Current Setup
The `vercel.json` is configured to **ONLY deploy from `demo` branch**:

```json
{
  "git": {
    "deploymentEnabled": {
      "demo": true,
      "development": false,
      "master": false
    }
  }
}
```

### Vercel Dashboard Settings

1. **Go to:** Vercel Dashboard → Project → Settings → Git
2. **Production Branch:** Set to `demo`
3. **Ignored Build Step:** Add this command:
   ```bash
   if [ "$VERCEL_GIT_COMMIT_REF" != "demo" ]; then exit 0; fi
   ```

This ensures:
- ✅ Pushing to `demo` → Triggers Vercel deployment
- ✅ Pushing to `development` → No Vercel deployment
- ✅ Pushing to `master` → No Vercel deployment

---

## 📝 Common Workflows

### Adding a New Feature

```bash
# 1. Develop in development branch
git checkout development
# ... code your feature ...
git commit -m "feat: Add book export feature"
git push origin development

# 2. Test locally with Docker
docker-compose up --build

# 3. When ready, update demo
git checkout demo
git merge development
git push origin demo  # Deploys to Vercel

# 4. When stable, merge to production
git checkout master
git merge development
git push origin master
```

### Hotfix for Demo Site

```bash
# Fix directly in demo branch
git checkout demo
# ... make urgent fix ...
git commit -m "fix: Correct demo API URL"
git push origin demo  # Immediately deploys to Vercel

# Later, backport to development
git checkout development
git cherry-pick <commit-hash>
git push origin development
```

---

## 🔍 Troubleshooting

### Problem: Vercel is deploying from wrong branches

**Solution 1:** Update `vercel.json`
```json
{
  "git": {
    "deploymentEnabled": {
      "demo": true,
      "development": false,
      "master": false
    }
  }
}
```

**Solution 2:** Vercel Dashboard
- Settings → Git → Ignored Build Step
- Add: `if [ "$VERCEL_GIT_COMMIT_REF" != "demo" ]; then exit 0; fi`

**Solution 3:** GitHub Integration
- Vercel Dashboard → Project → Settings → Git
- Change "Production Branch" to `demo`

### Problem: Demo branch doesn't exist

```bash
# Create it from development
git checkout development
git checkout -b demo
git push -u origin demo
```

### Problem: Backend files in demo branch

**Option 1:** Keep them (recommended)
- `.vercelignore` already excludes backend files
- No need to remove them

**Option 2:** Remove them (cleaner)
```bash
git checkout demo
git rm -r backend
git rm docker-compose.yml
git commit -m "chore: Remove backend from demo branch"
git push origin demo
```

---

## 📊 Summary

| ✅ DO                                      | ❌ DON'T                                  |
|--------------------------------------------|-------------------------------------------|
| Develop in `development` branch           | Don't develop directly in `demo`         |
| Deploy demo from `demo` branch            | Don't deploy from `development`          |
| Merge `development` → `demo` for updates  | Don't merge `demo` → `development`       |
| Keep `master` stable and production-ready | Don't push untested code to `master`     |
| Use Docker Compose for local development  | Don't deploy Docker setup to Vercel      |

---

## 🎯 Quick Reference

```bash
# Daily development
git checkout development
git pull origin development
# ... code ...
git push origin development

# Update public demo
git checkout demo
git merge development
git push origin demo  # → Vercel deploys

# Release to production
git checkout master
git merge development
git push origin master
```

---

**Questions?** Check `VERCEL_DEPLOYMENT.md` for detailed Vercel setup instructions.
