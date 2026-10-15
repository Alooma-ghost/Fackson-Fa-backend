"use strict";
/**
 * Email Service using Resend REST API (https://resend.com/docs)
 * Sends branded transactional emails for payment receipts and academy trial invitations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
exports.EmailService = {
    /**
     * Send verified payment confirmation and trial invitation to student / parent
     */
    async sendPaymentReceipt(params) {
        const apiKey = process.env.RESEND_API_KEY;
        const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
        // Check if key is available or placeholder
        if (!apiKey || apiKey.includes('YOUR_RESEND_API_KEY')) {
            console.warn('⚠️  [Resend] RESEND_API_KEY is not configured in .env. Email receipt logged to console.');
            console.log(`📧 [Simulated Email to ${params.to}]: Payment verified for ${params.playerName} (₦${params.amount.toLocaleString()} ${params.currency}, Ref: ${params.tx_ref})`);
            return { success: false, error: 'RESEND_API_KEY not configured' };
        }
        const academyName = params.academyPreference === 'angels'
            ? 'Fackson Angels (Women Academy)'
            : 'Fackson Next Pro (Men Academy)';
        const categoryLabel = {
            u10: 'Under 10 (U-10)',
            u13: 'Under 13 (U-13)',
            u17: 'Under 17 (U-17)',
            free_age: 'Free Age (Senior Team)'
        }[params.category] || params.category;
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt & Trial Confirmation - Fackson Football Academy</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #040d0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #040d0a; padding: 30px 15px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" style="max-width: 600px; background-color: #0a1f18; border-radius: 12px; overflow: hidden; border: 1px solid #17382a; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                
                <!-- HEADER -->
                <tr>
                  <td style="background: linear-gradient(135deg, #063d27 0%, #0d281e 100%); padding: 30px 25px; text-align: center; border-bottom: 2px solid #ffd000;">
                    <h1 style="margin: 0 0 8px; color: #ffd000; font-size: 24px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                      FACKSON FOOTBALL ACADEMY
                    </h1>
                    <p style="margin: 0; color: #a7f3d0; font-size: 14px; font-weight: 500;">
                      Next Pro (Men) &bull; Angels (Women)
                    </p>
                  </td>
                </tr>

                <!-- BADGE & TITLE -->
                <tr>
                  <td style="padding: 30px 30px 15px; text-align: center;">
                    <div style="display: inline-block; background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 50px; padding: 6px 18px; margin-bottom: 15px;">
                      <span style="color: #10b981; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        ✓ Payment Verified &amp; Registration Confirmed
                      </span>
                    </div>
                    <h2 style="margin: 0 0 10px; color: #ffffff; font-size: 22px;">Official Trial Invitation &amp; Receipt</h2>
                    <p style="margin: 0; color: #94a3b8; font-size: 15px; line-height: 1.5;">
                      Dear <strong style="color: #ffffff;">${params.customerName}</strong>, we have received your registration fee for athlete <strong style="color: #ffd000;">${params.playerName}</strong>.
                    </p>
                  </td>
                </tr>

                <!-- RECEIPT CARD -->
                <tr>
                  <td style="padding: 10px 30px 25px;">
                    <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #061510; border-radius: 8px; border: 1px solid #1b382b;">
                      <tr>
                        <td style="color: #94a3b8; font-size: 13px; border-bottom: 1px solid #17382a;">Athlete Name:</td>
                        <td align="right" style="color: #ffffff; font-weight: 600; font-size: 14px; border-bottom: 1px solid #17382a;">${params.playerName}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 13px; border-bottom: 1px solid #17382a;">Academy Division:</td>
                        <td align="right" style="color: #ffd000; font-weight: 600; font-size: 14px; border-bottom: 1px solid #17382a;">${academyName}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 13px; border-bottom: 1px solid #17382a;">Age Category:</td>
                        <td align="right" style="color: #ffffff; font-size: 14px; border-bottom: 1px solid #17382a;">${categoryLabel}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 13px; border-bottom: 1px solid #17382a;">Payment Reference (tx_ref):</td>
                        <td align="right" style="color: #38bdf8; font-family: monospace; font-size: 13px; border-bottom: 1px solid #17382a;">${params.tx_ref}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 13px; border-bottom: 1px solid #17382a;">Flutterwave Trans ID:</td>
                        <td align="right" style="color: #94a3b8; font-family: monospace; font-size: 13px; border-bottom: 1px solid #17382a;">${params.transaction_id}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-size: 14px; font-weight: 600;">Amount Paid:</td>
                        <td align="right" style="color: #10b981; font-weight: 700; font-size: 18px;">₦${params.amount.toLocaleString()} ${params.currency}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- INSTRUCTIONS & NEXT STEPS -->
                <tr>
                  <td style="padding: 0 30px 25px;">
                    <div style="background-color: rgba(255, 208, 0, 0.08); border-left: 4px solid #ffd000; padding: 15px; border-radius: 4px;">
                      <h3 style="margin: 0 0 8px; color: #ffd000; font-size: 15px; font-weight: 700;">Trial Day Checklist:</h3>
                      <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                        <li><strong>Venue:</strong> Fackson Academy Stadium &amp; Elite Training Complex</li>
                        <li><strong>What to Bring:</strong> Football boots (FG/AG), shin guards, black shorts, and water bottle.</li>
                        <li><strong>Documents:</strong> Copy of birth certificate or student ID card.</li>
                        <li><strong>Arrival Time:</strong> 30 minutes prior to session warm-up.</li>
                      </ul>
                    </div>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="background-color: #05110d; padding: 25px 30px; text-align: center; border-top: 1px solid #17382a;">
                    <p style="margin: 0 0 6px; color: #94a3b8; font-size: 13px;">
                      Have questions or need to reschedule? Contact coaching staff:
                    </p>
                    <p style="margin: 0 0 15px; color: #ffd000; font-size: 13px; font-weight: 600;">
                      Phone/WhatsApp: +234 812 345 6789 &bull; Email: trials@facksonfa.com
                    </p>
                    <p style="margin: 0; color: #64748b; font-size: 11px;">
                      &copy; ${new Date().getFullYear()} Fackson Football Academy. All Rights Reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: `Fackson Football Academy <${fromEmail}>`,
                    to: [params.to],
                    subject: `Payment Confirmed: Academy Trial Registration - ${params.playerName}`,
                    html: htmlContent
                })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('❌ [Resend] Failed to send email receipt:', data);
                return { success: false, error: data.message || 'Resend API error' };
            }
            console.log(`✅ [Resend] Payment receipt email sent to ${params.to} (ID: ${data.id})`);
            return { success: true, data };
        }
        catch (err) {
            console.error('❌ [Resend] Network error sending email:', err.message);
            return { success: false, error: err.message };
        }
    },
    /**
     * Send notification to Academy Administration
     */
    async sendAdminPaymentNotification(params) {
        const apiKey = process.env.RESEND_API_KEY;
        const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
        if (!apiKey || apiKey.includes('YOUR_RESEND_API_KEY') || !adminEmail) {
            return { success: false };
        }
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: `Fackson FA Alerts <${fromEmail}>`,
                    to: [adminEmail],
                    subject: `🔔 New Paid Trial Registration: ${params.playerName} (₦${params.amount.toLocaleString()})`,
                    html: `
            <div style="font-family: sans-serif; padding: 20px; background: #0a1f18; color: #fff;">
              <h2 style="color: #ffd000;">New Trial Registration Paid</h2>
              <p>A new applicant has successfully paid the academy registration fee.</p>
              <ul>
                <li><strong>Athlete:</strong> ${params.playerName}</li>
                <li><strong>Division:</strong> ${params.academyPreference}</li>
                <li><strong>Category:</strong> ${params.category}</li>
                <li><strong>Parent/Contact:</strong> ${params.customerName} (${params.customerPhone}, ${params.customerEmail})</li>
                <li><strong>Amount:</strong> ₦${params.amount.toLocaleString()}</li>
                <li><strong>Reference:</strong> ${params.tx_ref}</li>
              </ul>
              <p><a href="http://localhost:5173" style="color: #10b981;">Open Admin Dashboard</a></p>
            </div>
          `
                })
            });
            const data = await response.json();
            return { success: response.ok, data };
        }
        catch (err) {
            return { success: false };
        }
    }
};
