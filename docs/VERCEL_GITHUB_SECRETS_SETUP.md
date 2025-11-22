# Vercel GitHub Secrets Setup Guide

**Purpose**: Configure GitHub Actions secrets for automatic Vercel deployments  
**Required For**: PR #9 (Story 0.7) and Story 0.6 (Vercel Deployment)  
**Last Updated**: 2024-01-15

---

## Problem

The GitHub Actions workflow (`.github/workflows/deploy.yml`) requires three Vercel secrets to deploy:

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization/team ID
- `VERCEL_PROJECT_ID` - Vercel project ID

**Error**: `Input required and not supplied: vercel-token`

---

## Solution: Add Secrets to GitHub

### Step 1: Get Vercel Token

#### Option A: From Vercel Dashboard (Recommended)

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Name it: `GitHub Actions - Sprint Dashboard`
4. Set expiration (recommended: 1 year or no expiration)
5. Click **"Create"**
6. **Copy the token immediately** (you won't be able to see it again)

#### Option B: From Vercel CLI (If already logged in)

```bash
# Check if logged in
vercel whoami

# The token is stored in ~/.vercel/auth.json
# However, it's better to create a new token from the dashboard
```

### Step 2: Get Vercel Project ID

#### Option A: From Vercel Dashboard

1. Go to your project: [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project: `sprint-dashboard`
3. Go to **Settings** → **General**
4. Find **"Project ID"** in the project information section
5. Copy the Project ID

#### Option B: From Local Project

The project is already linked. Check `.vercel/project.json`:

```bash
cat .vercel/project.json
```

The `projectId` field contains the Project ID.

#### Option C: From Vercel CLI

```bash
cd /Users/faridbellameche/projects/sprint-dashboard
vercel project ls
# Find your project and note the ID
```

### Step 3: Get Vercel Organization ID

#### Option A: From Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your organization/team name (top left)
3. Go to **Settings** → **General**
4. Find **"Team ID"** or **"Organization ID"**
5. Copy the ID

#### Option B: From Vercel CLI

```bash
vercel teams ls
# Or check the organization from project settings
```

#### Option C: From Project Configuration

If the project is linked, check `.vercel/project.json` for `orgId`.

### Step 4: Add Secrets to GitHub

1. **Go to GitHub Repository**
   - Navigate to: https://github.com/fbellame/sprint-dashboard

2. **Go to Settings**
   - Click **Settings** tab in the repository

3. **Navigate to Secrets**
   - Click **Secrets and variables** → **Actions**

4. **Add Each Secret**

   **Secret 1: VERCEL_TOKEN**
   - Click **"New repository secret"**
   - Name: `VERCEL_TOKEN`
   - Value: Paste your Vercel token from Step 1
   - Click **"Add secret"**

   **Secret 2: VERCEL_ORG_ID**
   - Click **"New repository secret"**
   - Name: `VERCEL_ORG_ID`
   - Value: Paste your organization/team ID from Step 3
   - Click **"Add secret"**

   **Secret 3: VERCEL_PROJECT_ID**
   - Click **"New repository secret"**
   - Name: `VERCEL_PROJECT_ID`
   - Value: Paste your project ID from Step 2
   - Click **"Add secret"**

### Step 5: Verify Secrets

After adding all three secrets, you should see:

- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

---

## Quick Reference: Current Project Info

Based on the linked project:

- **Project Name**: `sprint-dashboard`
- **Organization**: `prog-immos-projects`
- **Project Linked**: ✅ Yes (`.vercel` directory exists)

**Found Values** (from GitHub Repository Variables):

- ✅ **VERCEL_PROJECT_ID**: `prj_ARcVNPeqXGG1pjbvGiYM4JmlP8MW` (configured in GitHub)
- ✅ **VERCEL_ORG_ID**: `team_bD6PJ6Hd5Rrob4PQ8TnaqUGd` (configured in GitHub)
- ⚠️ **VERCEL_TOKEN**: Needs to be created (see Step 1 below)

**Note**: The values in GitHub may differ from local `.vercel/project.json`. Use the GitHub values for CI/CD.

---

## Verification Steps

### 1. Check Secrets Are Added

Go to: https://github.com/fbellame/sprint-dashboard/settings/secrets/actions

You should see all three secrets listed.

### 2. Test the Workflow

After adding secrets:

1. **Re-run the failed workflow**:
   - Go to PR #9: https://github.com/fbellame/sprint-dashboard/pull/9
   - Go to **"Checks"** tab
   - Find the failed workflow
   - Click **"Re-run jobs"**

2. **Or push a new commit**:
   - The workflow will automatically run on the next push

### 3. Verify Deployment

Once the workflow succeeds:

- **Preview Deployment**: Should appear in PR #9 comments
- **Production Deployment**: Will deploy on merge to `main`

---

## Troubleshooting

### Issue: "Invalid token"

**Solution**:

- Verify the token is correct
- Check token hasn't expired
- Create a new token if needed

### Issue: "Project not found"

**Solution**:

- Verify `VERCEL_PROJECT_ID` is correct
- Ensure project exists in the specified organization
- Check you have access to the project

### Issue: "Organization not found"

**Solution**:

- Verify `VERCEL_ORG_ID` is correct
- Check you're a member of the organization
- Ensure the organization name matches

### Issue: Workflow still failing

**Solution**:

1. Check workflow logs for specific error
2. Verify all three secrets are set
3. Ensure secrets are named exactly:
   - `VERCEL_TOKEN` (not `VERCEL_TOKEN` with extra spaces)
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
4. Re-run the workflow after fixing

---

## Security Notes

⚠️ **Important**:

- Never commit tokens or IDs to the repository
- Tokens should only be in GitHub Secrets
- Rotate tokens periodically (recommended: annually)
- Use separate tokens for different purposes
- Revoke tokens if compromised

---

## Alternative: Manual Deployment

If you prefer not to set up automatic deployments:

1. Remove or comment out the deployment steps in `.github/workflows/deploy.yml`
2. Deploy manually using Vercel CLI:
   ```bash
   vercel --prod
   ```

However, **automatic deployments are recommended** for:

- Preview deployments on PRs
- Automatic production deployments
- Better CI/CD workflow

---

## Next Steps

After adding secrets:

1. ✅ **Re-run PR #9 workflow** to verify it works
2. ✅ **Verify preview deployment** appears in PR
3. ✅ **Test production deployment** on merge to main
4. ✅ **Update Story 0.6 status** once verified

---

## References

- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Status**: Ready for Setup  
**Last Updated**: 2024-01-15  
**Created By**: Team Lead
