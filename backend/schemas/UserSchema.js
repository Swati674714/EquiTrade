const { Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    pan: { type: String, default: "" },
    kycStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    walletBalance: { type: Number, default: 0, min: 0 },
    reservedBalance: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

UserSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    pan: this.pan,
    kycStatus: this.kycStatus,
    role: this.role,
    walletBalance: this.walletBalance,
    reservedBalance: this.reservedBalance,
    createdAt: this.createdAt,
  };
};

module.exports = { UserSchema };
