# Deployment Guide

This document outlines the deployment process for the Sprint Dashboard application on Vercel.

## Overview

The Sprint Dashboard is deployed on **Vercel**, which provides:

- Automatic deployments from GitHub
- Preview deployments for pull requests
- Production deployments on merge to `main`
- Edge network for global performance
- Serverless functions for API routes

## Prerequisites

### Required Accounts

- **Vercel Account**: Sign up at https://vercel.com
- **GitHub Account**: Repository access
- **Supabase Account**: Database credentials (from Story 0.2)

### Required Secrets

The following secrets must be configured in GitHub:

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

## Initial Setup

### Step 1: Create Vercel Project

1. **Sign in to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub (recommended)

2. **Import GitHub Repository**
   - Click "Add New" → "Project"
   - Select the `sprint-dashboard` repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `.` (project root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Note Project Details**
   - Project ID: Found in project settings
   - Organization ID: Found in team/organization settings

### Step 2: Configure Environment Variables

1. **Navigate to Project Settings**
   - Go to Project Settings → Environment Variables

2. **Add Environment Variables**

   Add the following variables for **Production**, **Preview**, and **Development**:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

   **Important**:
   - `NEXT_PUBLIC_*` variables are exposed to the browser
   - `SUPABASE_SERVICE_ROLE_KEY` is server-side only (never exposed)
   - Add to all environments (Production, Preview, Development)

3. **Verify Variables**
   - Check that all variables are set correctly
   - Ensure no typos in variable names

### Step 3: Configure GitHub Secrets

1. **Get Vercel Credentials**
   - **VERCEL_TOKEN**:
     - Go to Vercel → Settings → Tokens
     - Create a new token
     - Copy the token (only shown once)

   - **VERCEL_ORG_ID**:
     - Found in Vercel dashboard URL or team settings
     - Format: `team_xxxxx` or `user_xxxxx`

   - **VERCEL_PROJECT_ID**:
     - Found in Project Settings → General
     - Or in project URL: `vercel.com/[org]/[project-id]`

2. **Add Secrets to GitHub**
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add each secret:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

### Step 4: Deploy

1. **First Deployment**
   - Push to `main` branch
   - Vercel will automatically deploy
   - Or deploy manually from Vercel dashboard

2. **Verify Deployment**
   - Check deployment status in Vercel dashboard
   - Visit the deployment URL
   - Test the application

## Deployment Process

### Automatic Deployments

#### Production Deployments

- **Trigger**: Push to `main` branch
- **Process**:
  1. GitHub Actions workflow runs
  2. Runs linter and tests
  3. Builds the application
  4. Deploys to Vercel production
- **URL**: `https://sprint-dashboard.vercel.app` (or custom domain)

#### Preview Deployments

- **Trigger**: Create or update a pull request
- **Process**:
  1. GitHub Actions workflow runs
  2. Runs linter and tests
  3. Builds the application
  4. Deploys to Vercel preview
- **URL**: Unique preview URL for each PR (e.g., `https://sprint-dashboard-git-feature-branch.vercel.app`)

### Manual Deployments

You can also deploy manually from Vercel dashboard:

1. Go to Vercel dashboard
2. Select the project
3. Click "Deployments" tab
4. Click "Redeploy" on any deployment
5. Or use Vercel CLI: `vercel --prod`

## CI/CD Pipeline

The deployment pipeline (`.github/workflows/deploy.yml`) includes:

1. **Checkout code**
2. **Setup Node.js** (version 20)
3. **Install dependencies** (`npm ci`)
4. **Run linter** (non-blocking)
5. **Run tests** (`npm test`)
6. **Deploy to Vercel**
   - Preview for PRs
   - Production for `main` branch

## Vercel Configuration

The `vercel.json` file configures:

- **Framework**: Next.js
- **Region**: US East (`iad1`)
- **API Routes**: 30-second timeout
- **Build Command**: `npm run build`
- **Dev Command**: `npm run dev`

## Environment Variables

### Required Variables

| Variable                        | Description                             | Environment |
| ------------------------------- | --------------------------------------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                    | All         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                  | All         |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (server-only) | All         |

### Adding New Variables

1. Go to Vercel → Project Settings → Environment Variables
2. Add variable for appropriate environments
3. Redeploy to apply changes

## Monitoring Deployments

### Vercel Dashboard

- View deployment history
- Check build logs
- Monitor deployment status
- View deployment URLs

### GitHub Actions

- View workflow runs in Actions tab
- Check build and test results
- View deployment logs

## Troubleshooting

### Build Failures

**Problem**: Build fails on Vercel

**Solutions**:

- Check build logs in Vercel dashboard
- Verify `package.json` scripts are correct
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors: `npm run type-check`
- Verify environment variables are set

### Environment Variable Issues

**Problem**: Application can't access environment variables

**Solutions**:

- Verify variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Ensure variables are added to correct environments
- Redeploy after adding variables

### Deployment Not Triggering

**Problem**: Push to `main` doesn't trigger deployment

**Solutions**:

- Check GitHub Actions workflow is enabled
- Verify secrets are configured correctly
- Check workflow file syntax
- Ensure branch name is `main` (not `master`)

### Preview Deployments Not Working

**Problem**: PRs don't create preview deployments

**Solutions**:

- Verify GitHub Actions workflow is enabled
- Check workflow triggers include `pull_request`
- Ensure Vercel project is linked to GitHub
- Check Vercel project settings for preview deployments

## Rollback Procedures

### Rollback to Previous Deployment

1. **Via Vercel Dashboard**:
   - Go to Deployments tab
   - Find the deployment to rollback to
   - Click "..." → "Promote to Production"

2. **Via Vercel CLI**:

   ```bash
   vercel rollback [deployment-url]
   ```

3. **Via Git**:
   - Revert the commit
   - Push to `main`
   - New deployment will be created

### Emergency Rollback

If production is broken:

1. Go to Vercel dashboard immediately
2. Find last working deployment
3. Promote to production
4. Investigate the issue
5. Fix and redeploy

## Custom Domain

To add a custom domain:

1. Go to Vercel → Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Wait for DNS propagation
5. SSL certificate is automatically provisioned

## Performance Optimization

Vercel automatically provides:

- **Edge Network**: Global CDN for static assets
- **Serverless Functions**: Auto-scaling API routes
- **Image Optimization**: Next.js Image component optimization
- **Automatic HTTPS**: SSL certificates for all domains

## Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Use service role key only server-side**: Never expose in client code
3. **Enable branch protection**: Require PR reviews
4. **Monitor deployments**: Check for unexpected changes
5. **Use preview deployments**: Test changes before production

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

---

**Last Updated**: 2024-01-15  
**Story**: 0.6 - Vercel Deployment Setup
