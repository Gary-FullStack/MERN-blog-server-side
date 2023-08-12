const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./config.env" });

const sendAcctVerifyEmail = async (to, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const message = {
      to,
      subject: "Password Reset",
      html: `<h1>Verify your account here.</h1>
            <p>Click <a href="http://localhost:3000/reset-password/${resetToken}">here</a> to verify that you are you.</p>`,
    };

    const info = await transporter.sendMail(message);
    console.log("Message sent", info.messageId);
  } catch (error) {
    console.log(error);
    throw new Error("Error email did not send");
  }
};

module.exports = sendAcctVerifyEmail;
