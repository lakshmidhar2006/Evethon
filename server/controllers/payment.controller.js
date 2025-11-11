import { Registration } from "../models/registration.model.js";

export const checkout = async (req, res) => {
  // Pretend to create a checkout session
  const { registrationId, amount, currency = "INR" } = req.body;
  const reg = await Registration.findById(registrationId);
  if (!reg) return res.status(404).json({ message: "Registration not found" });
  reg.payment = { status: "pending", provider: "mock", chargeId: `pi_${Date.now()}`, amount, currency };
  await reg.save();
  res.json({ paymentIntentId: reg.payment.chargeId, checkoutUrl: `https://mockpay.local/checkout/${reg.payment.chargeId}` });
};

export const webhook = async (req, res) => {
  // Provider calls this with { chargeId, status }
  const { chargeId, status } = req.body; // status: "paid" | "failed"
  const reg = await Registration.findOne({ "payment.chargeId": chargeId });
  if (!reg) return res.status(404).json({ message: "Reg for charge not found" });
  reg.payment.status = status === "paid" ? "paid" : "failed";
  await reg.save();
  res.json({ ok: true });
};

export const paymentStatus = async (req, res) => {
  const reg = await Registration.findById(req.params.registrationId);
  if (!reg) return res.status(404).json({ message: "Registration not found" });
  if (String(reg.userId) !== String(req.user.id) && req.user.role !== "admin")
    return res.status(403).json({ message: "Not allowed" });
  res.json({ payment: reg.payment });
};
