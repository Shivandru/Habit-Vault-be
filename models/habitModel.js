const mongoose = require("mongoose");

const habitSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    targetDays: {
      type: String,
      enum: ["Every Day", "Custom"],
      required: true,
    },
    customDays: {
      type: [String],
      default: [],
    },
    startDate: { type: Date, required: true },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
    },
    history: [
      {
        date: { type: Date },
        status: { type: String, enum: ["completed", "missed"] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Habit = mongoose.model("habits", habitSchema);
module.exports = Habit;
