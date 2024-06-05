const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.log(err));
  } catch (err) {
    console.error(err);
  }
}

module.exports = main;
