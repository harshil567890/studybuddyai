exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Payment Successful - StudyBuddy AI</title>
  </head>
  <body style="background-color: #0b0f19; font-family: sans-serif; color: #e2e8f0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #111827; padding: 24px; border-radius: 8px;">
      <h2 style="color: #10b981;">Payment Received</h2>
      <p>Thank you ${name}, we received your payment of ₹${amount / 100}.</p>
      <p>Order ID: <b>${orderId}</b></p>
      <p>Payment ID: <b>${paymentId}</b></p>
      <p>Your enrolled course is now available in your StudyBuddy AI dashboard.</p>
    </div>
  </body>
  </html>`;
};
