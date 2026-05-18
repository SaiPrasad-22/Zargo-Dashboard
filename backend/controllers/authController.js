const User = require("../models/User");
const { signToken } = require("../middleware/authMiddleware");

exports.login = async (req, res) => {
  try {
    const { identifier, email, password } = req.body || {};
    const id = (identifier || email || "").toString().trim();
    if (!id || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    const user = await User.findOne({ email: id.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(user);
    return res.json({ token, user: user.toSafeJSON() });
  } catch (e) {
    return res.status(500).json({ message: "Login failed" });
  }
};

exports.me = async (req, res) => res.json(req.user.toSafeJSON());

exports.logout = async (_req, res) => res.json({ ok: true });