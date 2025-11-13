// Email Reporter Utility
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Email configuration
// Set these environment variables or update the values below:
// EMAIL_HOST - SMTP server (e.g., 'smtp.gmail.com', 'smtp.office365.com')
// EMAIL_PORT - SMTP port (usually 587 for TLS, 465 for SSL)
// EMAIL_USER - Your email address
// EMAIL_PASS - Your email password or app-specific password
// EMAIL_TO - Recipient email address
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
};

export interface TestReport {
  testName: string;
  status: 'PASSED' | 'FAILED';
  duration: number;
  fundRequestInvoiceNumber?: string;
  creditNoteInvoiceNumber?: string;
  fundRequestValidated?: boolean;
  creditNoteValidated?: boolean;
  errorMessage?: string;
  timestamp: string;
  screenshots?: string[];
}

export async function sendTestReport(report: TestReport, recipientEmail: string): Promise<boolean> {
  try {
    console.log(`📧 Preparing to send test report to ${recipientEmail}...`);

    // Create email transporter
    const transporter = nodemailer.createTransport(emailConfig);

    // Verify connection
    await transporter.verify();
    console.log('✅ Email server connection verified');

    // Generate HTML report content
    const htmlContent = generateHtmlReport(report);

    // Email options
    const mailOptions = {
      from: `"Playwright Test Automation" <${emailConfig.auth.user}>`,
      to: recipientEmail,
      subject: `Test Report: ${report.testName} - ${report.status}`,
      html: htmlContent,
      attachments: generateAttachments(report)
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${recipientEmail}`);
    console.log(`   Message ID: ${info.messageId}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

function generateHtmlReport(report: TestReport): string {
  const statusColor = report.status === 'PASSED' ? '#28a745' : '#dc3545';
  const statusIcon = report.status === 'PASSED' ? '✅' : '❌';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: ${statusColor};
      color: white;
      padding: 20px;
      border-radius: 5px;
      text-align: center;
    }
    .content {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 5px;
      margin-top: 20px;
    }
    .section {
      margin-bottom: 20px;
    }
    .label {
      font-weight: bold;
      color: #555;
    }
    .value {
      color: #000;
      margin-left: 10px;
    }
    .success {
      color: #28a745;
      font-weight: bold;
    }
    .failed {
      color: #dc3545;
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #007bff;
      color: white;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #888;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${statusIcon} ${report.testName}</h1>
    <h2>Status: ${report.status}</h2>
  </div>

  <div class="content">
    <div class="section">
      <h3>📊 Test Summary</h3>
      <p><span class="label">Execution Time:</span><span class="value">${formatDuration(report.duration)}</span></p>
      <p><span class="label">Timestamp:</span><span class="value">${report.timestamp}</span></p>
      <p><span class="label">Status:</span><span class="value ${report.status === 'PASSED' ? 'success' : 'failed'}">${report.status}</span></p>
    </div>

    ${report.fundRequestInvoiceNumber || report.creditNoteInvoiceNumber ? `
    <div class="section" style="background-color: #e8f5e9; border-left: 4px solid #4CAF50; padding: 15px; border-radius: 5px;">
      <h3 style="color: #2e7d32;">🧾 Invoice Numbers Generated (8-Digit Format)</h3>
      ${report.fundRequestInvoiceNumber ? `
      <p style="font-size: 18px; margin: 10px 0;">
        <span class="label">Fund Request Invoice:</span>
        <span class="value" style="font-weight: bold; color: #2e7d32; font-size: 20px; font-family: 'Courier New', monospace;">${report.fundRequestInvoiceNumber}</span>
        ${report.fundRequestInvoiceNumber.match(/^[A-Z]{3}\d{8}$/) ? '<span style="color: #4CAF50; margin-left: 10px; font-weight: bold;">✓ Correct 8-Digit Format</span>' : '<span style="color: #FF9800; margin-left: 10px; font-weight: bold;">⚠ Not 8-Digit Format</span>'}
      </p>
      ` : ''}
      ${report.creditNoteInvoiceNumber ? `
      <p style="font-size: 18px; margin: 10px 0;">
        <span class="label">Credit Note Invoice:</span>
        <span class="value" style="font-weight: bold; color: #2e7d32; font-size: 20px; font-family: 'Courier New', monospace;">${report.creditNoteInvoiceNumber}</span>
        ${report.creditNoteInvoiceNumber.match(/^[A-Z]{3}\d{8}$/) ? '<span style="color: #4CAF50; margin-left: 10px; font-weight: bold;">✓ Correct 8-Digit Format</span>' : '<span style="color: #FF9800; margin-left: 10px; font-weight: bold;">⚠ Not 8-Digit Format</span>'}
      </p>
      ` : ''}
      ${report.fundRequestInvoiceNumber && report.creditNoteInvoiceNumber ? `
      <p style="font-size: 16px; margin: 15px 0; padding: 10px; background-color: ${report.fundRequestInvoiceNumber === report.creditNoteInvoiceNumber ? '#fff3cd' : '#d4edda'}; border-radius: 5px;">
        <span style="font-weight: bold;">Invoice Uniqueness Check:</span>
        ${report.fundRequestInvoiceNumber === report.creditNoteInvoiceNumber 
          ? '<span style="color: #856404; margin-left: 10px; font-weight: bold;">⚠️ WARNING: Both invoices are SAME! Each process should have different invoice numbers.</span>'
          : '<span style="color: #155724; margin-left: 10px; font-weight: bold;">✓ VERIFIED: Invoices are DIFFERENT (as expected)</span>'
        }
      </p>
      ` : ''}
      <p style="font-size: 12px; color: #666; margin-top: 15px;">
        ✅ Invoice numbers should follow format: 3 uppercase letters + 8 digits (e.g., ASH25100262)<br>
        ✅ Each process (Fund Request, Credit Note) should have a unique invoice number
      </p>
    </div>
    ` : ''}


    ${report.fundRequestInvoiceNumber || report.creditNoteInvoiceNumber ? `
    <div class="section">
      <h3>📋 Invoice Numbers Generated</h3>
      <table>
        <tr>
          <th>Invoice Type</th>
          <th>Invoice Number</th>
          <th>Database Validation</th>
        </tr>
        ${report.fundRequestInvoiceNumber ? `
        <tr>
          <td>Fund Request</td>
          <td>${report.fundRequestInvoiceNumber}</td>
          <td class="${report.fundRequestValidated ? 'success' : 'failed'}">
            ${report.fundRequestValidated ? '✅ Validated' : '❌ Not Found'}
          </td>
        </tr>
        ` : ''}
        ${report.creditNoteInvoiceNumber ? `
        <tr>
          <td>Credit Note</td>
          <td>${report.creditNoteInvoiceNumber}</td>
          <td class="${report.creditNoteValidated ? 'success' : 'failed'}">
            ${report.creditNoteValidated ? '✅ Validated' : '❌ Not Found'}
          </td>
        </tr>
        ` : ''}
      </table>
    </div>
    ` : ''}

    ${report.status === 'PASSED' ? `
    <div class="section">
      <h3>✅ Test Steps Completed</h3>
      <ul>
        <li>✅ Login to SNACS QA successful</li>
        <li>✅ Fund Request created and saved</li>
        <li>✅ Workflow executed (Approve → Transfer)</li>
        ${report.fundRequestValidated ? '<li>✅ Fund Request validated in SQL Server database</li>' : ''}
        <li>✅ Credit Note created from Fund Request</li>
        <li>✅ Credit Note workflow executed</li>
        ${report.creditNoteValidated ? '<li>✅ Credit Note validated in SQL Server database</li>' : ''}
        <li>✅ Navigation to Transferred tab verified</li>
      </ul>
    </div>
    ` : `
    <div class="section">
      <h3>❌ Test Failure Details</h3>
      <p style="color: #dc3545;">${report.errorMessage || 'Test failed - check logs for details'}</p>
    </div>
    `}

    <div class="section">
      <h3>🔧 Environment Details</h3>
      <p><span class="label">Application:</span><span class="value">SNACS QA (https://sndrydocktest.azurewebsites.net/snacsqa)</span></p>
      <p><span class="label">Database:</span><span class="value">QATESTDB26 @ 10.91.20.32</span></p>
      <p><span class="label">Browser:</span><span class="value">Chromium (Headed Mode)</span></p>
      <p><span class="label">Framework:</span><span class="value">Playwright Test</span></p>
    </div>

    ${report.screenshots && report.screenshots.length > 0 ? `
    <div class="section">
      <h3>📸 Screenshots Attached</h3>
      <p>This email includes ${report.screenshots.length} screenshot(s) showing the test execution flow:</p>
      <ul>
        <li>After Login</li>
        <li>Fund Request Form</li>
        <li>Fund Request Saved</li>
        <li>Fund Request Workflow Complete</li>
        <li>Credit Note Saved</li>
        <li>Credit Note Workflow Complete</li>
        <li>Transferred Tab Final View</li>
      </ul>
      <p style="font-size: 12px; color: #666;">Screenshots are attached to this email.</p>
    </div>
    ` : ''}
  </div>

  <div class="footer">
    <p>This is an automated email from Playwright Test Automation Framework</p>
    <p>Generated on ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
  `;
}

function generateAttachments(report: TestReport): any[] {
  const attachments: any[] = [];

  // Attach screenshots if available
  if (report.screenshots && report.screenshots.length > 0) {
    report.screenshots.forEach((screenshot, index) => {
      if (fs.existsSync(screenshot)) {
        attachments.push({
          filename: `screenshot-${index + 1}.png`,
          path: screenshot
        });
      }
    });
  }

  return attachments;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}
