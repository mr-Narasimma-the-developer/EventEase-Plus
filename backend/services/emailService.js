const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Send event confirmation email
const sendEventConfirmation = async (userEmail, userName, event) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'EventEase+ <noreply@eventease.com>',
      to: userEmail,
      subject: `✓ Attendance Confirmed: ${event.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .event-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .detail-row { display: flex; margin: 10px 0; }
            .detail-label { font-weight: bold; width: 120px; color: #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 You're All Set!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>Your attendance for the following event has been confirmed:</p>
              
              <div class="event-card">
                <h2 style="color: #667eea; margin-top: 0;">${event.title}</h2>
                <div class="detail-row">
                  <span class="detail-label">📅 Date:</span>
                  <span>${new Date(event.eventDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">📍 Venue:</span>
                  <span>${event.venue}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">🌍 Location:</span>
                  <span>${event.location}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">🎯 Category:</span>
                  <span style="text-transform: capitalize;">${event.category}</span>
                </div>
              </div>

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Save this email for your records</li>
                <li>Add the event to your calendar</li>
                <li>Arrive 15 minutes early for check-in</li>
                <li>Bring a valid ID for entry</li>
              </ul>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/events/${event._id}" class="button">
                  View Event Details
                </a>
              </div>

              <div class="footer">
                <p>This is an automated email from EventEase+. Please do not reply.</p>
                <p>© 2026 EventEase+ | Your Event Management Platform</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send vendor verification email
const sendVendorVerification = async (userEmail, userName, badgeType) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'EventEase+ <noreply@eventease.com>',
      to: userEmail,
      subject: '✓ Vendor Verification Approved',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .badge { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .badge-icon { font-size: 60px; margin: 20px 0; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>Great news! Your vendor profile has been verified by our admin team.</p>
              
              <div class="badge">
                <div class="badge-icon">✓</div>
                <h2 style="color: #10b981; margin: 10px 0;">Verified Vendor</h2>
                <p style="color: #666;">Badge Type: <strong>${badgeType || 'Standard'}</strong></p>
              </div>

              <p><strong>What This Means:</strong></p>
              <ul>
                <li>✓ Verified badge on your profile</li>
                <li>📈 Increased trust score</li>
                <li>🎯 Higher visibility in search results</li>
                <li>⭐ Recommended by AI to organizers</li>
              </ul>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/vendor/portfolio" class="button">
                  View Your Profile
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send event reminder (24 hours before)
const sendEventReminder = async (userEmail, userName, event) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'EventEase+ <noreply@eventease.com>',
      to: userEmail,
      subject: `⏰ Reminder: ${event.title} is Tomorrow!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reminder-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Event Tomorrow!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              
              <div class="reminder-box">
                <h3 style="margin-top: 0; color: #d97706;">Don't forget!</h3>
                <p>Your confirmed event is happening tomorrow:</p>
                <h2 style="color: #f59e0b;">${event.title}</h2>
                <p>📅 ${new Date(event.eventDate).toLocaleDateString()}<br/>
                📍 ${event.venue}, ${event.location}</p>
              </div>

              <p><strong>Preparation Checklist:</strong></p>
              <ul>
                <li>✓ Check the weather forecast</li>
                <li>✓ Plan your commute</li>
                <li>✓ Bring valid ID</li>
                <li>✓ Arrive 15 minutes early</li>
              </ul>

              <p>See you tomorrow!</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending reminder:', error);
    return false;
  }
};

module.exports = {
  sendEventConfirmation,
  sendVendorVerification,
  sendEventReminder
};