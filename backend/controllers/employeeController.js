const Employee = require("../models/Employee");

const User = require("../models/User");
exports.list = async (_req, res, next) => {
  try { res.json(await Employee.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {

  try {
    const { name, email, role = "Staff", phone, status = "Active", onboardings = 0, hub = "HQ" } = req.body;
    const normalizedEmail = (email || "").toLowerCase().trim();
    if (!normalizedEmail || !name) {
      return res.status(400).json({ message: "Employee name and email are required" });
    }
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "A login already exists for this email" });
    }

    const password = "Welcome123";
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: role === "Admin" ? "admin" : "staff",
      hub,
    });

    const employee = await Employee.create({
      name,
      email: normalizedEmail,
      role,
      phone,
      status,
      onboardings,
      hub,
      joinDate: req.body.join_date || req.body.joinDate || new Date(),
    });

    res.status(201).json({ employee, credentials: { email: user.email, password } });
  } catch (e) {
    next(e);
  }};
exports.update = async (req, res, next) => {
  try {
    const item = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Employee not found" });
    res.json(item);
  } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try {
    const item = await Employee.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Employee not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
};