import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "softsols.pk",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "rederm@softsols.pk",
    pass: "???Aakay@12345",
  },
});

export async function sendRegistrationEmail(to: string, name: string) {
  try {
    await transporter.sendMail({
      from: '"Rederm Helix" <rederm@softsols.pk>',
      to,
      subject: "Registration Received - Rederm Connect",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Rederm Connect, Dr. ${name}</h2>
          <p>We have successfully received your registration application for the Pakistan Association of Dermatologists professional network.</p>
          <p>Your application is currently pending admin review. You will receive another email once your account is approved and active.</p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>Rederm Helix Team</strong></p>
        </div>
      `,
    });
    console.log("Registration email sent to", to);
  } catch (error) {
    console.error("Error sending registration email:", error);
  }
}

export async function sendApprovalEmail(to: string, name: string) {
  try {
    await transporter.sendMail({
      from: '"Rederm Helix" <rederm@softsols.pk>',
      to,
      subject: "Account Approved - Rederm Connect",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Congratulations Dr. ${name}!</h2>
          <p>Your Rederm Connect account has been approved by the admin.</p>
          <p>You can now log in to your professional dashboard to access the AI Copilot, clinical guidelines, and connect with your peers.</p>
          <br/>
          <a href="https://rederm-connect.vercel.app/auth/login" style="display:inline-block; padding: 10px 20px; background-color: #a6192e; color: #ffffff; text-decoration: none; border-radius: 5px;">Log In Now</a>
          <br/><br/>
          <p>Best Regards,</p>
          <p><strong>Rederm Helix Team</strong></p>
        </div>
      `,
    });
    console.log("Approval email sent to", to);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
}
