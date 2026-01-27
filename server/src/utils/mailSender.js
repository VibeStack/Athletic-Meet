import nodemailer from "nodemailer";

export const mailSender = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SprintSync 2026" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "SprintSync 2026 - Verify Your Email",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Email Verification</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
          <tr>
            <td align="center">

              <!-- Card -->
              <table width="100%" max-width="520px" cellpadding="0" cellspacing="0"
                style="background:#ffffff; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08); padding:32px;">

                <!-- Logo / Brand -->
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <h1 style="margin:0; color:#1e40af;">🏆 SprintSync 2026</h1>
                    <p style="margin:6px 0 0; color:#64748b; font-size:14px;">
                      Secure Email Verification
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td>
                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;" />
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="color:#111827; font-size:16px; line-height:1.6;">
                    <p>Hello 👋,</p>

                    <p>
                      To continue setting up your <strong>SprintSync 2026</strong> account,
                      please use the verification code below:
                    </p>
                  </td>
                </tr>

                <!-- OTP Box -->
                <tr>
                  <td align="center" style="padding:20px 0;">
                    <div
                      style="
                        display:inline-block;
                        padding:16px 32px;
                        background:#f1f5f9;
                        border-radius:10px;
                        font-size:28px;
                        font-weight:bold;
                        letter-spacing:6px;
                        color:#0f172a;
                      ">
                      ${otp}
                    </div>
                  </td>
                </tr>

                <!-- Info -->
                <tr>
                  <td style="color:#374151; font-size:14px; line-height:1.6;">
                    <p>
                      ⏳ This OTP is valid for <strong>5 minutes</strong>.
                    </p>
                    <p>
                      If you didn’t request this verification, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding-top:30px; font-size:13px; color:#6b7280;">
                    <p style="margin:0;">
                      Thanks,<br />
                      <strong>Team SprintSync 2026</strong>
                    </p>
                  </td>
                </tr>

              </table>

              <!-- Footer Note -->
              <p style="margin-top:20px; font-size:12px; color:#9ca3af;">
                © 2026 SprintSync. All rights reserved.
              </p>

            </td>
          </tr>
        </table>

      </body>
      </html>`,
  });
};
