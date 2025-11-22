# Vercel Project Information

**Project**: Sprint Dashboard  
**Last Updated**: 2024-01-15  
**Status**: ✅ Configured in GitHub

---

## GitHub Repository Variables

The following Vercel variables are configured in GitHub Actions:

| Variable | Value | Status | Last Updated |
|----------|-------|--------|--------------|
| **VERCEL_ORG_ID** | `team_bD6PJ6Hd5Rrob4PQ8TnaqUGd` | ✅ Configured | 25 minutes ago |
| **VERCEL_PROJECT_ID** | `prj_ARcVNPeqXGG1pjbvGiYM4JmlP8MW` | ✅ Configured | 18 minutes ago |
| **VERCEL_TOKEN** | - | ⚠️ Needs to be added | - |

---

## Local Project Configuration

The local `.vercel/project.json` file contains:

```json
{
  "projectId": "prj_ExTFWgs8imGtKhq3TZZXaYgkWIXd",
  "orgId": "team_JQA0H42e2w989PGtnkin3Boi"
}
```

**Note**: The local project configuration differs from GitHub. The GitHub values take precedence for CI/CD deployments.

---

## Vercel Account

- **Account**: `progimmo2025`
- **Organization**: Configured in GitHub as `team_bD6PJ6Hd5Rrob4PQ8TnaqUGd`

---

## Next Steps

1. ✅ **VERCEL_ORG_ID** - Already configured
2. ✅ **VERCEL_PROJECT_ID** - Already configured
3. ⚠️ **VERCEL_TOKEN** - Needs to be created and added to GitHub Secrets

### To Add VERCEL_TOKEN:

1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
2. Create a new token named: `GitHub Actions - Sprint Dashboard`
3. Copy the token
4. Add it to GitHub: Repository → Settings → Secrets and variables → Actions → New repository secret
5. Name: `VERCEL_TOKEN`
6. Value: Paste the token
7. Click "Add secret"

---

## Verification

After adding VERCEL_TOKEN:

- [ ] All three secrets configured in GitHub
- [ ] Re-run PR #9 workflow
- [ ] Verify deployment succeeds
- [ ] Preview deployment appears in PR

---

**Status**: 🟡 Partially Configured (2/3 secrets)  
**Priority**: High (blocks PR #9 deployment)

