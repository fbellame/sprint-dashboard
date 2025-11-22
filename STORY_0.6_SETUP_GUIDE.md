# Story 0.6: Vercel Deployment - Setup Guide

**Story ID**: 0.6  
**Status**: 🟡 **In Progress** - Configuration Complete, Manual Steps Required  
**Assignee**: dev2_front  
**Story Points**: 5

---

## ✅ Completed (Automated)

### Configuration Files Created

- ✅ `vercel.json` - Vercel configuration file
- ✅ `.github/workflows/deploy.yml` - GitHub Actions CI/CD workflow
- ✅ `docs/DEPLOYMENT.md` - Comprehensive deployment documentation
- ✅ `README.md` - Updated with deployment section

### Configuration Details

**vercel.json**:

- Framework: Next.js
- Region: US East (iad1)
- API route timeout: 30 seconds
- Build command: `npm run build`

**GitHub Actions Workflow**:

- Runs on push to `main` and pull requests
- Installs dependencies
- Runs linter and tests
- Deploys to Vercel (production for main, preview for PRs)

---

## 🔧 Manual Steps Required

The following steps must be completed manually in the Vercel and GitHub dashboards:

### Step 1: Create Vercel Project

1. **Sign in to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub account

2. **Import Repository**
   - Click "Add New" → "Project"
   - Select `fbellame/sprint-dashboard` repository
   - Click "Import"

3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: `.` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Note Project Details**
   - **Project ID**: Found in Project Settings → General
   - **Organization ID**: Found in team/organization settings (format: `team_xxxxx` or `user_xxxxx`)

### Step 2: Configure Environment Variables in Vercel

1. **Navigate to Environment Variables**
   - Go to Project Settings → Environment Variables

2. **Add Required Variables**

   Add these for **Production**, **Preview**, and **Development**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

   **Get credentials from**: Story 0.2 completion or Supabase dashboard

3. **Verify**
   - Check all three environments have the variables
   - Ensure variable names match exactly

### Step 3: Get Vercel Token

1. **Create Vercel Token**
   - Go to Vercel → Settings → Tokens
   - Click "Create Token"
   - Name: "GitHub Actions"
   - Copy the token (only shown once!)

### Step 4: Configure GitHub Secrets

1. **Navigate to GitHub Secrets**
   - Go to repository → Settings → Secrets and variables → Actions

2. **Add Secrets**

   Click "New repository secret" for each:
   - **Name**: `VERCEL_TOKEN`
     - **Value**: Token from Step 3

   - **Name**: `VERCEL_ORG_ID`
     - **Value**: Organization ID from Step 1

   - **Name**: `VERCEL_PROJECT_ID`
     - **Value**: Project ID from Step 1

3. **Verify**
   - All three secrets should be listed
   - Names must match exactly (case-sensitive)

### Step 5: Test Deployment

1. **Create Test PR**
   - Make a small change (e.g., update README)
   - Create a pull request
   - Check GitHub Actions tab for workflow run
   - Verify preview deployment is created in Vercel

2. **Test Production Deployment**
   - Merge PR to `main`
   - Check GitHub Actions tab
   - Verify production deployment in Vercel
   - Visit deployment URL and test application

### Step 6: Verify Deployment

1. **Check Vercel Dashboard**
   - Go to Deployments tab
   - Verify deployment status is "Ready"
   - Check build logs for any errors

2. **Test Application**
   - Visit production URL
   - Test key functionality
   - Verify environment variables are working

---

## 📋 Checklist

### Vercel Setup

- [ ] Vercel account created
- [ ] Project created and linked to GitHub repository
- [ ] Project ID noted
- [ ] Organization ID noted
- [ ] Environment variables configured (Production, Preview, Development)
- [ ] Vercel token created

### GitHub Setup

- [ ] `VERCEL_TOKEN` secret added
- [ ] `VERCEL_ORG_ID` secret added
- [ ] `VERCEL_PROJECT_ID` secret added
- [ ] GitHub Actions workflow enabled

### Testing

- [ ] Preview deployment tested (via PR)
- [ ] Production deployment tested (via merge to main)
- [ ] Application accessible and functional
- [ ] Environment variables working correctly

### Documentation

- [ ] Deployment guide reviewed
- [ ] Team members informed of deployment process

---

## 🔍 Verification Commands

### Check Vercel Configuration

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Link project (if needed)
vercel link

# Test build locally
vercel build

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Check GitHub Actions

1. Go to repository → Actions tab
2. Check workflow runs
3. Verify deployments are triggered
4. Check for any errors in logs

---

## 🐛 Troubleshooting

### Build Fails on Vercel

- Check build logs in Vercel dashboard
- Verify `package.json` scripts
- Run `npm run build` locally to test
- Check for TypeScript errors: `npm run type-check`

### Environment Variables Not Working

- Verify variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Ensure variables are added to all environments
- Redeploy after adding variables

### GitHub Actions Not Triggering

- Check workflow file syntax
- Verify secrets are configured
- Ensure workflow is enabled in repository settings
- Check branch name is `main` (not `master`)

### Deployment Not Working

- Verify Vercel project is linked to GitHub
- Check Vercel token is valid
- Ensure organization and project IDs are correct
- Check Vercel dashboard for error messages

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Supabase Setup Guide](./docs/SUPABASE_SETUP.md)

---

## Next Steps

After completing manual steps:

1. ✅ Verify all deployments are working
2. ✅ Test preview and production deployments
3. ✅ Update Story 0.6 status to "Complete"
4. ✅ Request code review
5. ✅ Update sprint progress

---

**Status**: 🟡 Configuration Complete - Manual Steps Required  
**Last Updated**: 2024-01-15
