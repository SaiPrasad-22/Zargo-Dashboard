const mongoose = require("mongoose");
<<<<<<< HEAD
=======
const dns = require("dns");
>>>>>>> 6cd35a0 (Initial commit)

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set");
<<<<<<< HEAD
=======

  // Use public DNS servers for SRV records in case the local resolver rejects DNS queries.
  dns.setServers(["8.8.8.8", "8.8.4.4"]);

>>>>>>> 6cd35a0 (Initial commit)
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

module.exports = connectDB;