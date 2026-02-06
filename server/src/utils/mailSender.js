import nodemailer from "nodemailer";

// ✅ Create transporter ONCE (important for performance & stability)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Gmail SSL
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// ✅ Verify transporter at startup
transporter.verify((err) => {
  if (err) {
    console.error("❌ Email Server Error:", err.message);
  } else {
    console.log("✅ Email Server Ready");
  }
});

export const mailSender = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Athletix 2026" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Athletix 2026 - Verify Your Email",
      html: `
        <!doctype html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Email Verification - Athletix 2026</title>
          </head>

          <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <!-- Main Card -->
                  <table width="100%" style="max-width: 480px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Gradient Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%); padding: 32px 24px; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 8px;">🏆</div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Athletix 2026</h1>
                        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">65th Athletic Championship</p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 32px 28px;">
                        <!-- Greeting -->
                        <p style="margin: 0 0 20px; color: #f1f5f9; font-size: 18px; font-weight: 600;">
                          Hello, Champion! 👋
                        </p>
                        
                        <p style="margin: 0 0 24px; color: #94a3b8; font-size: 15px; line-height: 1.6;">
                          You're one step away from joining <strong style="color: #38bdf8;">Athletix 2026</strong>. 
                          Use the verification code below to complete your registration:
                        </p>

                        <!-- OTP Box -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 24px 0;">
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  ${otp
                                    .split("")
                                    .map(
                                      (digit) => `
                                    <td style="padding: 0 4px;">
                                      <div style="
                                        width: 48px;
                                        height: 56px;
                                        background: linear-gradient(135deg, #1e3a5f 0%, #0c4a6e 100%);
                                        border: 2px solid #0ea5e9;
                                        border-radius: 12px;
                                        font-size: 28px;
                                        font-weight: 700;
                                        color: #38bdf8;
                                        line-height: 52px;
                                        text-align: center;
                                        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
                                      ">${digit}</div>
                                    </td>
                                  `
                                    )
                                    .join("")}
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <!-- Timer Badge -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding-bottom: 24px;">
                              <div style="
                                display: inline-block;
                                background: rgba(234, 179, 8, 0.15);
                                border: 1px solid rgba(234, 179, 8, 0.3);
                                border-radius: 20px;
                                padding: 8px 16px;
                                font-size: 13px;
                                color: #fbbf24;
                              ">
                                ⏱️ Valid for <strong>5 minutes</strong>
                              </div>
                            </td>
                          </tr>
                        </table>

                        <!-- Divider -->
                        <hr style="border: none; border-top: 1px solid #334155; margin: 0 0 20px;" />

                        <!-- Security Note -->
                        <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6; text-align: center">
                          🔒 If you didn't request this code, please ignore this email. Your account is safe.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background: #0c1222; padding: 20px 28px; border-top: 1px solid #1e293b;">
                        <table width="100%">
                          <tr>
                            <td style="color: #64748b; font-size: 12px;">
                              <strong style="color: #94a3b8;">Team Athletix</strong><br />
                              GNDEC Athletic Committee
                            </td>
                            <td align="right" style="color: #475569; font-size: 11px;">
                              © 2026 Athletix
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                  </table>

                  <!-- Bottom Text -->
                  <p style="margin: 24px 0 0; font-size: 11px; color: #475569; text-align: center;">
                    This is an automated message. Please do not reply.
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log("✅ OTP Mail Sent:", email, info.messageId);
    return info;
  } catch (err) {
    console.error("❌ OTP Mail Failed:", email, err.message);
    throw new Error("EMAIL_SEND_FAILED");
  }
};
