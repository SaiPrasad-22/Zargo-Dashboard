require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const Alert = require("../models/Alert");
const Employee = require("../models/Employee");

(async () => {
  try {
    await connectDB();
    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Vehicle.deleteMany({}),
      Booking.deleteMany({}),
      Alert.deleteMany({}),
      Employee.deleteMany({}),
    ]);

    console.log("Seeding users...");
    await User.create([
      { name: "Zargo Admin", email: "admin@zargo.in", password: "Zargo@123", role: "admin", hub: "HQ" },
      { name: "Zargo Staff", email: "staff@zargo.in", password: "Staff@123", role: "staff", hub: "HQ" },
    ]);

    console.log("Seeding vehicles...");
    const vehicles = await Vehicle.create([
      { vehicleId: "ZRG-001", model: "Ather 450X", numberPlate: "DL01EV1001", battery: 92, status: "available", hub: "Delhi-Hub-1", health: "good" },
      { vehicleId: "ZRG-002", model: "Ola S1 Pro", numberPlate: "DL02EV1002", battery: 78, status: "rented", hub: "Delhi-Hub-1", health: "good" },
      { vehicleId: "ZRG-003", model: "TVS iQube", numberPlate: "DL03EV1003", battery: 45, status: "service", hub: "Delhi-Hub-2", health: "fair" },
      { vehicleId: "ZRG-004", model: "Bajaj Chetak", numberPlate: "DL04EV1004", battery: 88, status: "idle", hub: "Delhi-Hub-2", health: "good" },
    ]);

    console.log("Seeding bookings...");
    await Booking.create([
      {
        bookingId: "BKG-1001", riderName: "Rahul Verma", phone: "+919999000011",
        vehicle: vehicles[1]._id,
        startDate: new Date(), endDate: new Date(Date.now() + 7 * 86400000),
        kmUsed: 120, kmLimit: 500, status: "active", amount: 3500,
      },
      {
        bookingId: "BKG-1002", riderName: "Anita Singh", phone: "+919999000022",
        vehicle: vehicles[0]._id,
        startDate: new Date(Date.now() - 30 * 86400000),
        endDate: new Date(Date.now() - 23 * 86400000),
        kmUsed: 480, kmLimit: 500, status: "completed", amount: 4200,
      },
    ]);

    console.log("Seeding alerts...");
    await Alert.create([
      { title: "Low battery", type: "rider", message: "Vehicle ZRG-003 battery below 50%", severity: "warning", status: "unread" },
      { title: "Service due", type: "management", message: "ZRG-003 service window opens tomorrow", severity: "info", status: "unread" },
    ]);

    console.log("Seeding employees...");
    await Employee.create([
      { name: "Priya Sharma", email: "priya@zargo.in", role: "Manager", phone: "+919811112222", status: "Active", onboardings: 24 },
      { name: "Arjun Mehta", email: "arjun@zargo.in", role: "Staff", phone: "+919811113333", status: "Active", onboardings: 12 },
    ]);

    console.log("\nSeed complete.");
    console.log("Admin: admin@zargo.in / Zargo@123");
    console.log("Staff: staff@zargo.in / Staff@123");
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error("Seed failed:", e);
    process.exit(1);
  }
})();