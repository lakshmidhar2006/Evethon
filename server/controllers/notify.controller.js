// controllers/notify.controller.js
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    // Stub: actual email logic will come later (Nodemailer, SES, etc.)
    console.log("📧 Email queued:", { to, subject, text });

    res.json({ message: "Email enqueued (stub)", to, subject });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
