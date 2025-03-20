const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  name: { type: String, required: true },
  email: { type: String, sparse: true, unique: true },
  phoneNumber: { type: String },
  address: { type: String },
  facebookId: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true }, // Thêm trường googleId
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
