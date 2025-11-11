import { Registration } from "../models/registration.model.js";
import { stringify } from "csv-stringify";

export const exportRegistrations = async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) return res.status(400).json({ message: "eventId required" });

  const rows = await Registration.find({ eventId }).lean();
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="registrations-${eventId}.csv"`);

  const data = rows.map(r => ({
    id: r._id,
    userId: r.userId,
    eventId: r.eventId,
    status: r.status,
    paymentStatus: r.payment?.status || "none",
    createdAt: r.createdAt
  }));

  stringify(data, { header: true }).pipe(res);
};
