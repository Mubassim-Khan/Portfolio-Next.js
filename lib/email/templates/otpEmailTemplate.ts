export default function otpEmailTemplate(otp: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Your One-Time Password</h2>
      <p>Use the following OTP to complete your login:</p>
      <div style="font-size: 24px; font-weight: bold; background: #f0f0f0; padding: 10px; border-radius: 6px; width: fit-content;">
        ${otp}
      </div>
      <p>This OTP will expire in <b>2 hours</b>. Please use it before it becomes invalid.</p>
      <p>If you didn’t request this code, you can check activity or take security actions.</p>
      <p>Head over to <a href="https://mubassim.vercel.app/dashboard" style="color: #1a73e8; text-decoration: none;">Portfolio Dashboard</a> for more information.</p>
      <p>— Portfolio Dashboard </p>
    </div>
  `;
}
