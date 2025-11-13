# Quick Setup Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `e2e_testing_arinvoice`
3. Description: "E2E Testing Suite for AR Invoice Workflows"
4. Visibility: Choose Public or Private
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Push Local Repository to GitHub

After creating the repository on GitHub, run these commands:

```bash
cd D:\e2e_testing_arinvoice
git remote add origin https://github.com/YOUR_USERNAME/e2e_testing_arinvoice.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Configure GitHub Secrets (for CI/CD)

Go to your repository on GitHub:
1. Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:
   - `SN_USERNAME` = your SNACS username
   - `SN_PASSWORD` = your SNACS password
   - `EMAIL_HOST` = smtp.office365.com
   - `EMAIL_USER` = your email
   - `EMAIL_PASS` = your email password
   - `EMAIL_TO` = recipient emails (comma-separated)

## Step 4: Verify Setup

1. Check that all files are visible on GitHub
2. Verify GitHub Actions workflow is present (`.github/workflows/playwright.yml`)
3. Tests will run automatically on push/PR to main branch

## Repository Contents

✅ README.md - Complete documentation
✅ .gitignore - Excludes unnecessary files
✅ .env.example - Environment template
✅ LICENSE - MIT License
✅ .github/workflows/playwright.yml - CI/CD automation
✅ tests/fund-request-workflow.spec.ts - Main test file
✅ utils/email-reporter.ts - Email reporting utility
✅ package.json - Dependencies
✅ playwright.config.ts - Test configuration

## Next Steps

1. Clone the repository on another machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/e2e_testing_arinvoice.git
   cd e2e_testing_arinvoice
   npm install
   npx playwright install chromium
   ```

2. Create `.env` file from `.env.example` and add your credentials

3. Run tests:
   ```bash
   npx playwright test tests/fund-request-workflow.spec.ts --headed --project=chromium --timeout=600000
   ```

## Support

For issues, create an issue on the GitHub repository.
