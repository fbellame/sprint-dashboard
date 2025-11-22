# Quick Setup: Vercel GitHub Secrets

**Priority**: 🔴 **HIGH** - Blocks PR #9  
**Time Required**: 5 minutes  
**Last Updated**: 2024-01-15

---

## Quick Steps

### 1. Get Vercel Token (2 minutes)

1. Go to: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name: `GitHub Actions - Sprint Dashboard`
4. Click **"Create"**
5. **Copy token immediately** (you won't see it again!)

### 2. Add Secrets to GitHub (3 minutes)

Go to: https://github.com/fbellame/sprint-dashboard/settings/secrets/actions

Add these three secrets:

**Secret 1: VERCEL_TOKEN**

- Name: `VERCEL_TOKEN`
- Value: [Paste token from Step 1]

**Secret 2: VERCEL_ORG_ID**

- Name: `VERCEL_ORG_ID`
- Value: `team_JQA0H42e2w989PGtnkin3Boi`

**Secret 3: VERCEL_PROJECT_ID**

- Name: `VERCEL_PROJECT_ID`
- Value: `prj_ExTFWgs8imGtKhq3TZZXaYgkWIXd`

### 3. Re-run Workflow

1. Go to PR #9: https://github.com/fbellame/sprint-dashboard/pull/9
2. Click **"Checks"** tab
3. Click **"Re-run jobs"**

---

## Values to Copy

### VERCEL_TOKEN

```
[Create from https://vercel.com/account/tokens]
```

### VERCEL_ORG_ID

```
team_JQA0H42e2w989PGtnkin3Boi
```

### VERCEL_PROJECT_ID

```
prj_ExTFWgs8imGtKhq3TZZXaYgkWIXd
```

---

## Verification

After adding secrets, verify:

- ✅ All 3 secrets appear in GitHub Settings
- ✅ Workflow re-runs successfully
- ✅ Preview deployment appears in PR

---

**For detailed instructions**, see [PR_9_VERCEL_SETUP_INSTRUCTIONS.md](./PR_9_VERCEL_SETUP_INSTRUCTIONS.md)
