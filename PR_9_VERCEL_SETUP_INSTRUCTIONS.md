# PR #9: Vercel GitHub Secrets Setup Instructions

**PR**: [#9](https://github.com/fbellame/sprint-dashboard/pull/9)  
**Issue**: GitHub Actions workflow failing due to missing Vercel secrets  
**Status**: 🔴 **Action Required**  
**Created**: 2024-01-15

---

## Problem Summary

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is failing with:

```
Error: Input required and not supplied: vercel-token
```

The workflow requires three secrets that are not yet configured in GitHub.

---

## Required Secrets

The workflow needs these three secrets:

1. **VERCEL_TOKEN** - Vercel authentication token (needs to be created)
2. **VERCEL_ORG_ID** - Organization/Team ID (✅ Configured: `team_bD6PJ6Hd5Rrob4PQ8TnaqUGd`)
3. **VERCEL_PROJECT_ID** - Project ID (✅ Configured: `prj_ARcVNPeqXGG1pjbvGiYM4JmlP8MW`)

---

## Step-by-Step Setup Instructions

### Step 1: Create Vercel Token

1. **Go to Vercel Account Settings**
   - Visit: https://vercel.com/account/tokens
   - Or: Dashboard → Settings → Tokens

2. **Create New Token**
   - Click **"Create Token"** button
   - **Name**: `GitHub Actions - Sprint Dashboard`
   - **Expiration**: Choose based on your preference:
     - Recommended: **1 year** or **No expiration**
   - Click **"Create"**

3. **Copy Token Immediately**
   - ⚠️ **Important**: Copy the token now - you won't be able to see it again!
   - Save it temporarily (you'll paste it in Step 2)

### Step 2: Add Secrets to GitHub

1. **Navigate to Repository Secrets**
   - Go to: https://github.com/fbellame/sprint-dashboard/settings/secrets/actions
   - Or: Repository → Settings → Secrets and variables → Actions

2. **Add VERCEL_TOKEN**
   - Click **"New repository secret"**
   - **Name**: `VERCEL_TOKEN` (exact, case-sensitive)
   - **Value**: Paste the token from Step 1
   - Click **"Add secret"**

3. **Add VERCEL_ORG_ID** (✅ Already configured as repository variable)
   - If not already set, click **"New repository secret"**
   - **Name**: `VERCEL_ORG_ID` (exact, case-sensitive)
   - **Value**: `team_bD6PJ6Hd5Rrob4PQ8TnaqUGd`
   - Click **"Add secret"**

4. **Add VERCEL_PROJECT_ID** (✅ Already configured as repository variable)
   - If not already set, click **"New repository secret"**
   - **Name**: `VERCEL_PROJECT_ID` (exact, case-sensitive)
   - **Value**: `prj_ARcVNPeqXGG1pjbvGiYM4JmlP8MW`
   - Click **"Add secret"`

**Note**: VERCEL_ORG_ID and VERCEL_PROJECT_ID are already configured as repository variables. You only need to add VERCEL_TOKEN as a secret.

### Step 3: Verify Secrets

After adding all three, you should see:

```
✅ VERCEL_TOKEN
✅ VERCEL_ORG_ID  
✅ VERCEL_PROJECT_ID
```

### Step 4: Re-run the Workflow

1. **Go to PR #9**
   - Visit: https://github.com/fbellame/sprint-dashboard/pull/9

2. **Re-run Failed Workflow**
   - Click on **"Checks"** tab
   - Find the failed workflow (usually "Deploy")
   - Click **"Re-run jobs"** or **"Re-run all jobs"**

3. **Verify Success**
   - Workflow should now complete successfully
   - Preview deployment should appear in PR comments

---

## Quick Copy-Paste Values

For convenience, here are the values to add:

### Secret 1: VERCEL_TOKEN
```
[Create from Vercel Dashboard - see Step 1 above]
```

### Secret 2: VERCEL_ORG_ID (✅ Already configured)
```
team_bD6PJ6Hd5Rrob4PQ8TnaqUGd
```

### Secret 3: VERCEL_PROJECT_ID (✅ Already configured)
```
prj_ARcVNPeqXGG1pjbvGiYM4JmlP8MW
```

---

## Verification Checklist

After setup, verify:

- [ ] All three secrets added to GitHub
- [ ] Secret names are exact (case-sensitive)
- [ ] VERCEL_TOKEN is valid (created from dashboard)
- [ ] Workflow re-run successfully
- [ ] Preview deployment appears in PR
- [ ] No errors in workflow logs

---

## Troubleshooting

### "Invalid token" Error

**Solution**:
- Verify token was copied correctly (no extra spaces)
- Check token hasn't expired
- Create a new token if needed

### "Project not found" Error

**Solution**:
- Verify `VERCEL_PROJECT_ID` is exactly: `prj_ARcVNPeqXGG1pjbvGiYM4JmlP8MW`
- Ensure project exists in Vercel dashboard
- Check you have access to the project

### "Organization not found" Error

**Solution**:
- Verify `VERCEL_ORG_ID` is exactly: `team_bD6PJ6Hd5Rrob4PQ8TnaqUGd`
- Check you're a member of the organization
- Verify organization name in Vercel dashboard

### Workflow Still Failing

**Solution**:
1. Check workflow logs for specific error message
2. Verify all three secrets are present (not just two)
3. Ensure secret names match exactly (case-sensitive):
   - `VERCEL_TOKEN` (not `vercel_token` or `Vercel_Token`)
   - `VERCEL_ORG_ID` (not `VERCEL_ORG` or `ORG_ID`)
   - `VERCEL_PROJECT_ID` (not `PROJECT_ID` or `VERCEL_PROJECT`)
4. Delete and re-add secrets if needed
5. Re-run workflow after fixing

---

## Alternative: Skip Automatic Deployment (Not Recommended)

If you prefer to deploy manually:

1. Comment out deployment steps in `.github/workflows/deploy.yml`
2. Deploy manually:
   ```bash
   vercel --prod
   ```

**Note**: This loses preview deployments and automatic CI/CD benefits.

---

## Security Reminders

⚠️ **Important Security Notes**:

- ✅ Secrets are encrypted in GitHub
- ✅ Never commit tokens to code
- ✅ Rotate tokens periodically (recommended: annually)
- ✅ Use separate tokens for different purposes
- ✅ Revoke tokens if compromised

---

## Next Steps After Setup

1. ✅ **Re-run PR #9 workflow** - Should now succeed
2. ✅ **Verify preview deployment** - Should appear in PR
3. ✅ **Test production deployment** - Will deploy on merge to main
4. ✅ **Update Story 0.6 status** - Mark as complete once verified

---

## Support

If you encounter issues:

1. Check workflow logs for specific error
2. Verify all secrets are set correctly
3. Test Vercel CLI locally: `vercel --prod`
4. Contact Team Lead if problems persist

---

**Status**: 🔴 Action Required  
**Priority**: High (blocks PR #9)  
**Estimated Time**: 5-10 minutes  
**Last Updated**: 2024-01-15

