const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!config.email?.host) {
    console.warn('Email not configured – using console fallback');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
  return transporter;
}

async function sendEmail({ to, subject, body, html }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`Email placeholder: To ${to}, Subject "${subject}"`);
    return;
  }
  await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    text: body || html?.replace(/<[^>]*>/g, ''),
    html: html || body,
  });
}

module.exports = { sendEmail };
