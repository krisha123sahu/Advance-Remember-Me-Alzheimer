const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    relation: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      trim: true,
    },

    importantInfo: {
      type: String,
      trim: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Person = mongoose.model("Person", personSchema);

module.exports = Person;