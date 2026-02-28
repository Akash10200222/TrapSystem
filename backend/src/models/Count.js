import mongoose from "mongoose";

const countSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Count = mongoose.model("Count", countSchema);