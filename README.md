# E2E Testing - AR Invoice Workflow

Automated end-to-end testing suite for AR Invoice (Fund Request and Credit Note) workflows using Playwright TypeScript.

## Features

- Complete Fund Request workflow automation
- Credit Note creation and workflow
- Invoice number validation (8-digit format)
- Unique invoice verification for each process
- Email reporting with HTML templates
- Screenshot capture at key workflow steps
- HP ALM test case generation

## Prerequisites

- Node.js (v16 or higher)
- npm
- Chrome/Chromium browser

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/e2e_testing_arinvoice.git
cd e2e_testing_arinvoice
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install chromium
```

4. Configure environment variables:
Create a `.env` file with:
```env
SN_USERNAME=your_username
SN_PASSWORD=your_password
EMAIL_HOST=smtp.office365.com
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_password
EMAIL_TO=recipient@domain.com
```

## Running Tests

### Run with headed browser (visible)
```bash
npx playwright test tests/fund-request-workflow.spec.ts --headed --project=chromium --timeout=600000
```

### Run headless
```bash
npx playwright test tests/fund-request-workflow.spec.ts --project=chromium
```

### View test report
```bash
npx playwright show-report
```

## Test Coverage

### Fund Request Workflow Test
1. Login to SNACS QA application
2. Create Fund Request with invoice lines
3. Execute Approve workflow
4. Capture invoice number (8-digit format validation)
5. Execute Transfer workflow
6. Create Credit Note from Fund Request
7. Approve and Transfer Credit Note
8. Validate unique invoice numbers for each process
9. Verify invoices in Transferred tab
10. Send email report with results

## Key Features

### Invoice Number Validation
- Validates 8-digit format: `[A-Z]{3}\d{8}` (e.g., ASH25100285)
- Captures from "Invoice Number" field after Approve workflow
- Verifies uniqueness between Fund Request and Credit Note

### Email Reporting
Automated email reports include:
- Test execution status
- Invoice numbers captured
- Format validation results
- Invoice uniqueness verification
- 7 screenshots at key workflow steps
- Execution duration

### Screenshot Capture
1. After Login
2. Fund Request Form
3. Fund Request Saved
4. Fund Request Workflow Complete
5. Credit Note Saved
6. Credit Note Workflow Complete
7. Transferred Tab Final

## Project Structure

```
e2e_testing_arinvoice/
├── tests/                          # Test files
│   └── fund-request-workflow.spec.ts
├── utils/                          # Utility functions
│   └── email-reporter.ts
├── framework/                      # Test framework
├── test-data/                      # Test data files
├── test-output/                    # Test execution outputs
├── screenshots/                    # Test screenshots
├── reports/                        # Test reports
├── docs/                          # Documentation
├── package.json
├── playwright.config.ts
└── README.md
```

## Configuration

### Playwright Config
- Browser: Chromium
- Headless: configurable
- Screenshot: on failure
- Video: on first retry
- Trace: on first retry

### Environment Variables
Required:
- `SN_USERNAME` - SNACS QA username
- `SN_PASSWORD` - SNACS QA password
- `EMAIL_HOST` - SMTP server
- `EMAIL_USER` - Email sender
- `EMAIL_PASS` - Email password
- `EMAIL_TO` - Email recipients (comma-separated)

## License

MIT License

## Authors

- QA Automation Team

## Support

For issues or questions, please create an issue in the GitHub repository.
