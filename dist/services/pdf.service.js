"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificatePdf = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = require("../utils/logger");
const getCertificateHtml = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      width: 297mm;
      height: 210mm;
      background: #0f172a;
      font-family: 'DM Sans', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .cert {
      width: 283mm;
      height: 196mm;
      border: 1px solid rgba(249,115,22,0.3);
      border-radius: 10mm;
      position: relative;
      padding: 14mm 16mm;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    }

    /* Corner ornaments */
    .cert::before, .cert::after {
      content: '';
      position: absolute;
      width: 20mm;
      height: 20mm;
      border: 2px solid #F97316;
      opacity: 0.4;
    }
    .cert::before { top: 6mm; left: 6mm; border-right: none; border-bottom: none; border-radius: 4mm 0 0 0; }
    .cert::after  { bottom: 6mm; right: 6mm; border-left: none; border-top: none; border-radius: 0 0 4mm 0; }

    /* Inner border */
    .inner-border {
      position: absolute;
      inset: 4mm;
      border: 1px solid rgba(249,115,22,0.15);
      border-radius: 8mm;
      pointer-events: none;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 6mm;
    }

    .seal {
      width: 14mm;
      height: 14mm;
      background: #F97316;
      border-radius: 3mm;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: 20px;
      color: white;
    }

    .foundation-name {
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: 16px;
      color: #F97316;
      letter-spacing: 1px;
    }

    .cert-title {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 900;
      color: white;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 4mm;
    }

    .divider {
      width: 100%;
      height: 1px;
      background: linear-gradient(to right, transparent, #F97316, transparent);
      margin: 3mm 0;
    }

    .presented-to {
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 2mm;
    }

    .graduate-name {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 900;
      color: #F97316;
      text-align: center;
      margin-bottom: 3mm;
      letter-spacing: 1px;
    }

    .completed-text {
      text-align: center;
      color: #94a3b8;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 1mm;
    }

    .program-title {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 700;
      color: white;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 1mm;
    }

    .program-sub {
      text-align: center;
      color: #64748b;
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .meta-row {
      display: flex;
      justify-content: center;
      gap: 20mm;
      margin-top: 3mm;
      margin-bottom: 4mm;
    }

    .meta-item {
      text-align: center;
    }

    .meta-label {
      font-size: 8px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1mm;
    }

    .meta-value {
      font-size: 10px;
      color: #cbd5e1;
      font-weight: 500;
    }

    .footer-row {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-top: auto;
    }

    .signature-block {
      text-align: center;
      min-width: 45mm;
    }

    .signature-line {
      width: 45mm;
      height: 1px;
      background: rgba(249,115,22,0.4);
      margin-bottom: 2mm;
    }

    .sig-name {
      font-size: 10px;
      color: white;
      font-weight: 600;
    }

    .sig-title {
      font-size: 8px;
      color: #64748b;
      margin-top: 0.5mm;
    }

    .qr-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2mm;
    }

    .qr-block img {
      width: 20mm;
      height: 20mm;
      background: white;
      padding: 1mm;
      border-radius: 2mm;
    }

    .qr-label {
      font-size: 7px;
      color: #64748b;
      text-align: center;
      letter-spacing: 0.5px;
    }

    .cert-id-block {
      text-align: center;
      min-width: 45mm;
    }

    .cert-id-label {
      font-size: 8px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1mm;
    }

    .cert-id-value {
      font-family: monospace;
      font-size: 10px;
      color: #F97316;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .issue-date {
      font-size: 8px;
      color: #64748b;
      margin-top: 1mm;
    }
  </style>
</head>
<body>
  <div class="cert">
    <div class="inner-border"></div>

    <div class="header">
      <div class="seal">A</div>
      <div class="foundation-name">ADELE EMPOWERMENT FOUNDATION</div>
    </div>

    <div class="cert-title">Certificate of Completion</div>
    <div class="divider"></div>

    <div class="presented-to">This is to certify that</div>
    <div class="graduate-name">${data.graduateName}</div>
    <div class="completed-text">has successfully completed the</div>
    <div class="program-title">${data.programTitle}</div>
    <div class="program-sub">Training Program &nbsp;·&nbsp; ${data.centerName}</div>

    <div class="meta-row">
      <div class="meta-item">
        <div class="meta-label">Cohort</div>
        <div class="meta-value">${data.cohortName}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Training Period</div>
        <div class="meta-value">${data.trainingStart} – ${data.trainingEnd}</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="footer-row">
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="sig-name">Dr. Adwoa Sarpong</div>
        <div class="sig-title">Executive Director</div>
      </div>

      <div class="qr-block">
        <img src="${data.qrDataUrl}" alt="QR Code" />
        <div class="qr-label">Scan to verify authenticity</div>
      </div>

      <div class="cert-id-block">
        <div class="cert-id-label">Certificate ID</div>
        <div class="cert-id-value">${data.certId}</div>
        <div class="issue-date">Issued ${data.issueDate}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
const generateCertificatePdf = async (data) => {
    let browser;
    try {
        browser = await puppeteer_1.default.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });
        const page = await browser.newPage();
        await page.setContent(getCertificateHtml(data), {
            waitUntil: "domcontentloaded",
        });
        const pdfBuffer = await page.pdf({
            width: "297mm",
            height: "210mm",
            printBackground: true,
            margin: { top: "0", right: "0", bottom: "0", left: "0" },
        });
        logger_1.logger.info(`Certificate PDF generated for ${data.certId}`);
        return Buffer.from(pdfBuffer);
    }
    finally {
        if (browser)
            await browser.close();
    }
};
exports.generateCertificatePdf = generateCertificatePdf;
//# sourceMappingURL=pdf.service.js.map