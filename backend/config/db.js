const mongoose = require("mongoose");

const dns = require("dns");
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set");


  // Use public DNS servers for SRV records in case the local resolver rejects DNS queries.
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

module.exports = connectDB;