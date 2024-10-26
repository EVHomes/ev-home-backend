export const otpForgotPasswordTemplate = (otp, name) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Forgot Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .header {
        text-align: center;
        padding: 20px;
        border-bottom: 2px solid #007bff;
      }

      .header h1 {
        margin: 0;
        color: #007bff;
      }

      .otp {
        font-size: 32px;
        font-weight: bold;
        color: #333;
        margin: 20px 0;
        text-align: center;
      }

      .footer {
        text-align: center;
        padding: 10px;
        border-top: 1px solid #eaeaea;
        margin-top: 20px;
      }

      .footer p {
        color: #777;
        font-size: 14px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>Forgot Password OTP</h1>
      </div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>To reset your password, please use the following One-Time Password (OTP):</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for the next 10 minutes.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 EV Home Construction Pvt Ltd. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
};

export const forgotPasswordTemplete = (name, otp, resetLink = undefined) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #ff9800; /* Orange theme */
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .content p {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        padding: 10px 20px;
        border-radius: 4px;
        background-color: #f1f1f1;
        display: inline-block;
        margin: 20px 0;
      }
      .button {
        background-color: #ff9800; /* Orange theme */
        color: #ffffff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 4px;
        font-size: 16px;
        display: inline-block;
      }
      .footer {
        padding: 20px;
        background-color: #f1f1f1;
        text-align: center;
        font-size: 12px;
        color: #666;
      }
      .footer a {
        color: #ff9800; /* Orange theme */
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>
          We received a request to reset your password. Please use the following code to
          proceed:
        </p>
        <div class="otp">${otp}</div>
        <p>Alternatively, you can reset your password by clicking the button below:</p>
        <a href="${resetLink}" class="button">Reset Password</a>
        <p>If you did not request this, please ignore this email or contact support.</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 EV Homes Construction PVT LTD. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
};
