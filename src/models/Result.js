const mongoose = require("mongoose");

const { Schema } = mongoose;

const DifferenceSchema = new Schema({
  nodeId: { type: String, require: true },
  differenceInformation: { type: Object, require: true },
  position: { type: Object, require: true },
});

const ResultSchema = new Schema({
  projectKey: { type: String, require: true },
  beforeVersionId: { type: String, require: true },
  afterVersionId: { type: String, require: true },
  frames: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  differences: [DifferenceSchema],
});

ResultSchema.pre(/^find/, function (next) {
  this.populate({
    path: "frames",
    populate: {
      path: "pages.frames",
    },
  });

  next();
});

module.exports = mongoose.model("Result", ResultSchema);
